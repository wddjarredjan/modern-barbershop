import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getEmailConfig() {
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = Number(process.env.EMAIL_PORT || 587);
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  const emailTo = process.env.EMAIL_TO || 'modernbarbershopbykarl@gmail.com';

  const missing: string[] = [];
  if (!emailTo) missing.push('EMAIL_TO');
  if (!resendApiKey && !emailHost) missing.push('RESEND_API_KEY or EMAIL_HOST');
  if (!resendApiKey && !emailUser) missing.push('EMAIL_USER');
  if (!resendApiKey && !emailPass) missing.push('EMAIL_PASS');

  return {
    resendApiKey,
    emailHost,
    emailPort,
    emailUser,
    emailPass,
    emailFrom,
    emailTo,
    missing,
    configured: missing.length === 0
  };
}

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

  app.get('/api/email-status', (req, res) => {
    const config = getEmailConfig();
    res.json({
      configured: config.configured,
      missing: config.missing,
      provider: config.resendApiKey ? 'resend' : config.emailHost ? 'smtp' : 'missing',
      host: config.emailHost || 'missing',
      user: config.emailUser || 'missing',
      recipient: config.emailTo || 'missing'
    });
  });

  // Create booking & trigger live email notification
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

      const config = getEmailConfig();
      const emailRecipient = config.emailTo;
      const emailSubject = `New Barbershop Booking: ${fullName}`;
      const emailMessage = `New Booking\n\nClient: ${fullName}\nPhone: ${phone}\nService: ${service}\nDate & Time: ${dateTime}\nNotes: ${notes || 'None'}\n\nThis booking was submitted through the website.`;

      console.log(`[EMAIL NOTIFICATION DISPATCHED to ${emailRecipient}]: ${emailSubject}`);

      let emailSent = false;

      if (!config.configured) {
        console.error('Email configuration missing. Missing values:', config.missing.join(', '));
        return res.status(500).json({
          error: `Booking email is not configured. Missing: ${config.missing.join(', ')}`,
          missing: config.missing
        });
      }

      if (config.resendApiKey) {
        const resend = new Resend(config.resendApiKey);
        const { error } = await resend.emails.send({
          from: config.emailFrom,
          to: [config.emailTo],
          subject: emailSubject,
          text: emailMessage,
          html: `<h3>New Barbershop Booking</h3><p><strong>Client:</strong> ${fullName}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Service:</strong> ${service}</p><p><strong>Date & Time:</strong> ${dateTime}</p><p><strong>Notes:</strong> ${notes || 'None'}</p>`
        });

        if (error) {
          console.error('Resend send failed:', error);
          return res.status(500).json({ error: error.message || 'Failed to send booking email via Resend.' });
        }

        emailSent = true;
        console.log(`[EMAIL SENT via Resend to ${emailRecipient}]`);
      } else {
        const transporter = nodemailer.createTransport({
          host: config.emailHost,
          port: config.emailPort,
          secure: config.emailPort === 465,
          auth: {
            user: config.emailUser,
            pass: config.emailPass,
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        await transporter.sendMail({
          from: config.emailFrom,
          to: config.emailTo,
          subject: emailSubject,
          text: emailMessage,
          html: `<h3>New Barbershop Booking</h3><p><strong>Client:</strong> ${fullName}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Service:</strong> ${service}</p><p><strong>Date & Time:</strong> ${dateTime}</p><p><strong>Notes:</strong> ${notes || 'None'}</p>`
        });

        emailSent = true;
        console.log(`[EMAIL SENT via SMTP to ${emailRecipient}]`);
      }

      res.status(201).json({
        success: true,
        message: 'Appointment booked successfully! A live booking email has been sent to the receiver.',
        booking: newBooking,
        notification: {
          recipient: emailRecipient,
          subject: emailSubject,
          message: emailMessage,
          emailSent
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
