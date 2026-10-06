// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { Resend } from "resend";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
function getEmailConfig() {
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = Number(process.env.EMAIL_PORT || 587);
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";
  const emailTo = process.env.EMAIL_TO || "modernbarbershopbykarl@gmail.com";
  const missing = [];
  if (!emailTo) missing.push("EMAIL_TO");
  if (!resendApiKey && !emailHost) missing.push("RESEND_API_KEY or EMAIL_HOST");
  if (!resendApiKey && !emailUser) missing.push("EMAIL_USER");
  if (!resendApiKey && !emailPass) missing.push("EMAIL_PASS");
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
function getMessengerConfig() {
  const messengerId = process.env.FACEBOOK_MESSENGER_ID || process.env.MESSENGER_ID || "61592438219283";
  return {
    messengerId,
    messengerUrl: `https://m.me/${messengerId}`
  };
}
function listenOnAvailablePort(app, preferredPort) {
  const portsToTry = Array.from(/* @__PURE__ */ new Set([preferredPort, 3001, 3002, 3003, 4e3, 4001, 5e3, 8080, 9e3]));
  let portIndex = 0;
  const attemptListen = () => {
    const port = portsToTry[portIndex];
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`[Server] Modern Barbershop by Karl running on http://0.0.0.0:${port}`);
    });
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE" && portIndex < portsToTry.length - 1) {
        portIndex += 1;
        console.warn(`[Server] Port ${port} is in use. Retrying on ${portsToTry[portIndex]}...`);
        attemptListen();
        return;
      }
      console.error("[Server] Failed to start server:", error);
      process.exit(1);
    });
  };
  attemptListen();
}
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3e3);
  app.use(express.json());
  const bookings = [
    {
      id: "BK-9281",
      fullName: "Marcus Vance",
      phone: "+639171234567",
      service: "Modern Haircut & Styling",
      dateTime: "2026-10-02T14:30",
      notes: "Low fade with textured crop on top",
      status: "Confirmed",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  ];
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", shop: "Modern Barbershop by Karl" });
  });
  app.get("/api/bookings", (req, res) => {
    res.json(bookings);
  });
  app.get("/api/email-status", (req, res) => {
    const config = getEmailConfig();
    res.json({
      configured: config.configured,
      missing: config.missing,
      provider: config.resendApiKey ? "resend" : config.emailHost ? "smtp" : "missing",
      host: config.emailHost || "missing",
      user: config.emailUser || "missing",
      recipient: config.emailTo || "missing"
    });
  });
  app.post("/api/bookings", async (req, res) => {
    try {
      const { fullName, phone, service, dateTime, notes } = req.body;
      if (!fullName || !phone || !service || !dateTime) {
        return res.status(400).json({ error: "Missing required booking fields (fullName, phone, service, dateTime)." });
      }
      const newBooking = {
        id: `BK-${Math.floor(1e3 + Math.random() * 9e3)}`,
        fullName,
        phone,
        service,
        dateTime,
        notes: notes || "",
        status: "Confirmed",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      bookings.unshift(newBooking);
      const messengerConfig = getMessengerConfig();
      const messengerMessage = `Hi Karl! I want to book an appointment.

Name: ${fullName}
Phone: ${phone}
Service: ${service}
Date & Time: ${dateTime}
Notes: ${notes || "None"}

Please confirm this booking.`;
      const messengerUrl = `${messengerConfig.messengerUrl}?text=${encodeURIComponent(messengerMessage)}`;
      console.log(`[BOOKING PREPARED FOR MESSENGER]: ${messengerConfig.messengerId}`);
      const config = getEmailConfig();
      const emailRecipient = config.emailTo;
      const emailSubject = `New Barbershop Booking: ${fullName}`;
      const emailMessage = `New Booking

Client: ${fullName}
Phone: ${phone}
Service: ${service}
Date & Time: ${dateTime}
Notes: ${notes || "None"}

This booking was submitted through the website.`;
      let emailSent = false;
      if (config.configured) {
        if (config.resendApiKey) {
          const resend = new Resend(config.resendApiKey);
          const { error } = await resend.emails.send({
            from: config.emailFrom,
            to: [config.emailTo],
            subject: emailSubject,
            text: emailMessage,
            html: `<h3>New Barbershop Booking</h3><p><strong>Client:</strong> ${fullName}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Service:</strong> ${service}</p><p><strong>Date & Time:</strong> ${dateTime}</p><p><strong>Notes:</strong> ${notes || "None"}</p>`
          });
          if (error) {
            console.error("Resend send failed:", error);
          } else {
            emailSent = true;
            console.log(`[EMAIL SENT via Resend to ${emailRecipient}]`);
          }
        } else {
          const transporter = nodemailer.createTransport({
            host: config.emailHost,
            port: config.emailPort,
            secure: config.emailPort === 465,
            auth: {
              user: config.emailUser,
              pass: config.emailPass
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
            html: `<h3>New Barbershop Booking</h3><p><strong>Client:</strong> ${fullName}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Service:</strong> ${service}</p><p><strong>Date & Time:</strong> ${dateTime}</p><p><strong>Notes:</strong> ${notes || "None"}</p>`
          });
          emailSent = true;
          console.log(`[EMAIL SENT via SMTP to ${emailRecipient}]`);
        }
      } else {
        console.warn("Email configuration missing. Booking is still prepared for Messenger delivery.");
      }
      res.status(201).json({
        success: true,
        message: "Appointment booked successfully! The booking details are ready to send to the owner in Messenger.",
        booking: newBooking,
        notification: {
          channel: "messenger",
          recipient: messengerConfig.messengerId,
          messengerUrl,
          message: messengerMessage,
          emailSent,
          emailRecipient: emailRecipient || "not-configured"
        }
      });
    } catch (err) {
      console.error("Booking error:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  });
  app.post("/api/ai-consult", async (req, res) => {
    try {
      const { faceShape, hairType, stylePreference } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
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
      const prompt = `You are Karl, master barber at "Modern Barbershop by Karl". A client has these attributes: Face Shape: ${faceShape || "Oval"}, Hair Type: ${hairType || "Straight & Thick"}, Style Preference: ${stylePreference || "Modern / Clean"}. 
      Provide a personalized haircut recommendation in JSON format with fields: cutTitle (string), description (string), maintenance (string), and products (array of strings).`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const text = response.text || "{}";
      const data = JSON.parse(text);
      res.json({ recommendation: data });
    } catch (err) {
      console.error("AI consult error:", err);
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
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  listenOnAvailablePort(app, PORT);
}
startServer();
