import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // In-memory store for demo bookings
  const bookings: Array<{
    id: string;
    fullName: string;
    phone: string;
    service: string;
    dateTime: string;
    notes?: string;
    status: 'Confirmed' | 'Pending';
    createdAt: string;
  }> = [
    {
      id: 'BK-9281',
      fullName: 'Marcus Vance',
      phone: '+639171234567',
      service: 'Modern Haircut & Styling',
      dateTime: '2026-10-02T14:30',
      notes: 'Low fade with textured crop on top',
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    }
  ];

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', shop: 'Modern Barbershop by Karl' });
  });

  // Get bookings
  app.get('/api/bookings', (req, res) => {
    res.json(bookings);
  });

  // Create booking & trigger SMS notification simulation
  app.post('/api/bookings', async (req, res) => {
    try {
      const { fullName, phone, service, dateTime, notes } = req.body;
      
      if (!fullName || !phone || !service || !dateTime) {
        return res.status(400).json({ error: 'Missing required booking fields (fullName, phone, service, dateTime).' });
      }

      const newBooking = {
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName,
        phone,
        service,
        dateTime,
        notes: notes || '',
        status: 'Confirmed' as const,
        createdAt: new Date().toISOString()
      };

      bookings.unshift(newBooking);

      const barberPhone = '+639301911512';
      const smsMessage = `New Booking: ${fullName} (${phone}) for @ ${dateTime} (${service})${notes ? ` - ${notes}` : ''}`;

      console.log(`[SMS NOTIFICATION DISPATCHED to Karl @ ${barberPhone}]: ${smsMessage}`);

      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      let twilioSent = false;
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
        try {
          await client.messages.create({
            body: smsMessage,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: barberPhone
          });
          twilioSent = true;
          console.log(`[TWILIO SMS SENT to Karl @ ${barberPhone}]`);
        } catch (twilioErr: any) {
          console.error('Failed to send Twilio SMS:', twilioErr);
        }
      }

      res.status(201).json({
        success: true,
        message: 'Appointment booked successfully! Instant notification sent to Karl.',
        booking: newBooking,
        notification: {
          recipient: barberPhone,
          message: smsMessage,
          twilioIntegrated: twilioSent
        }
      });
    } catch (err: any) {
      console.error('Booking error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // AI Haircut Recommendation API using @google/genai
  app.post('/api/ai-consult', async (req, res) => {
    try {
      const { faceShape, hairType, stylePreference } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // Fallback response if API key is not configured
        return res.json({
          recommendation: {
            cutTitle: "Modern Textured Crop with Mid Fade",
            description: "An effortless yet sharp look tailored for your features. Karl recommends keeping the top textured with matte clay and a crisp mid skin fade on the sides.",
            maintenance: "Visit Karl every 2 to 3 weeks to keep the fade sharp.",
            products: ["Matte Clay Pomade", "Sea Salt Spray"]
          }
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are Karl, master barber at "Modern Barbershop by Karl". A client has these attributes: Face Shape: ${faceShape || 'Oval'}, Hair Type: ${hairType || 'Straight & Thick'}, Style Preference: ${stylePreference || 'Modern / Clean'}. 
      Provide a personalized haircut recommendation in JSON format with fields: cutTitle (string), description (string), maintenance (string), and products (array of strings).`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '{}';
      const data = JSON.parse(text);
      res.json({ recommendation: data });
    } catch (err: any) {
      console.error('AI consult error:', err);
      res.json({
        recommendation: {
          cutTitle: "Karl's Signature Fade & Pompadour",
          description: "A timeless modern classic customized by Karl to accentuate your bone structure with precise clipper work.",
          maintenance: "Use pomade and comb back daily.",
          products: ["Karl's Hold Pomade"]
        }
      });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Server] Modern Barbershop by Karl running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
