// Technotreon AI – Backend Server (Google Gemini Free API)
// Node.js + Express

const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL   = 'gemini-2.5-flash';   // Free tier model
const GEMINI_URL     = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/chatbot.html");
});

// ── System prompt ─────────────────────────────────────────
const SYSTEM_INSTRUCTION = `You are Technotreon AI, the official virtual assistant of Technotreon Private Limited.

Your purpose is to assist website visitors by answering questions, providing information about Technotreon's services, collecting leads, scheduling consultations, and guiding users toward the appropriate Technotreon solutions.

COMPANY OVERVIEW:
Technotreon is an innovation company specializing in: Patent Development, Intellectual Property Protection, Product Innovation, Research & Development, Defence Technologies, Deep-Tech Innovation, Prototyping, Technology Commercialization, Startup Innovation Support, Technology Transfer, IP Development & Investment Programs, Government and Defence Innovation Programs, AI, IoT, Embedded Systems and Engineering Solutions.

Technotreon has a large patent portfolio and works with startups, industries, manufacturers, researchers, government organizations, universities, and defence sectors.

PERSONALITY: Be professional, helpful, technically knowledgeable, friendly, precise, and business-oriented. Always represent Technotreon positively. Never discuss politics, religion, or controversial topics. Never speculate. If information is unavailable, suggest contacting a Technotreon expert.

SERVICES:
- Patent Services: Patentability Analysis, Prior Art Search, Patent Drafting, Provisional & Complete Patent Filing, Patent Strategy, Commercialization, IP Portfolio Development, Patent Valuation, Patent Licensing.
- Product Development: Idea Validation, Concept Development, Hardware, Electronics, Embedded Systems, IoT, Software Development, Testing, Manufacturing Guidance, Commercialization.
- Defence Innovation: Indigenous technologies for Defence, Railways, Maritime, Industrial, Strategic sectors. Only share publicly available information.
- Startup Support: Innovation Consulting, Product Development, Patent Protection, Funding Readiness, Investor Connections, Commercialization.

CONTACT:
- Website: https://technotreon.in
- Contact Page: https://technotreon.in/contact-us
- Office Hours: Monday–Saturday, 10:00 AM – 7:00 PM IST
- Enterprise Office: Baner, Pune, Maharashtra
- Research Facility: Mansa, Punjab

LEAD CAPTURE: When users show strong interest in a service or ask for a consultation, tell them: "To connect you with the right Technotreon expert, please share your contact details using the form below."

RESPONSE RULES:
- Keep responses concise (under 150 words unless detail is needed).
- Use bullet points when listing services.
- Always suggest a helpful next step at the end.
- Never guarantee patents, funding, or commercialization success.
- Never share confidential or classified information.
- Never make legal claims or give legal advice.
- Use • for bullet points.`;

// ── Middleware ────────────────────────────────────────────
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Chat endpoint ─────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { history } = req.body;

  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ error: 'Invalid request: history array required' });
  }

  // Limit to last 20 turns to control costs
  const trimmedHistory = history.slice(-20);

  const payload = {
    system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents: trimmedHistory,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.9
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
    ]
  };

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Gemini API error' });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!reply) {
      return res.status(500).json({ error: 'Empty response from Gemini' });
    }

    res.json({ reply });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Lead capture endpoint ─────────────────────────────────
app.post('/api/lead', (req, res) => {
  const { name, email, phone, org, desc, timestamp } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Log lead to console (replace with DB / email / CRM integration)
  console.log('\n=== NEW LEAD ===');
  console.log(`Name:         ${name}`);
  console.log(`Email:        ${email}`);
  console.log(`Phone:        ${phone || 'Not provided'}`);
  console.log(`Organization: ${org  || 'Not provided'}`);
  console.log(`Project:      ${desc || 'Not specified'}`);
  console.log(`Timestamp:    ${timestamp}`);
  console.log('================\n');

  // TODO: Replace the console.log above with one of these integrations:
  //
  // ── Option A: Send email via Nodemailer ─────────────────
  // npm install nodemailer
  // const nodemailer = require('nodemailer');
  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  // });
  // await transporter.sendMail({
  //   from: process.env.EMAIL_USER,
  //   to: 'leads@technotreon.in',
  //   subject: `New Lead from Chatbot: ${name}`,
  //   text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nOrg: ${org}\nProject: ${desc}`
  // });
  //
  // ── Option B: Save to Google Sheets via sheet.best ──────
  // fetch('https://api.sheet.best/api/sheets/YOUR_SHEET_ID', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ name, email, phone, org, desc, timestamp })
  // });

  res.json({ success: true });
});

// ── Health check ──────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', model: GEMINI_MODEL }));

// ── Start server ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Technotreon AI server running → http://localhost:${PORT}`);
  console.log(`   Model: ${GEMINI_MODEL} (Gemini free tier)`);
  if (!GEMINI_API_KEY) console.warn('⚠️  WARNING: GEMINI_API_KEY not set in .env');
});
