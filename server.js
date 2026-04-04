const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (the website itself)
app.use(express.static(path.join(__dirname)));

// ── Shared file-save helper ───────────────────────────────────────────────────
function saveToFile(filePath, newEntry) {
  let entries = [];
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      entries = JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }

  entries.push(newEntry);

  try {
    fs.writeFileSync(filePath, JSON.stringify(entries, null, 2), 'utf-8');
    console.log(`✅ Entry saved to ${path.basename(filePath)} (total: ${entries.length})`);
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
    return false;
  }
}

// ── Contact Form Submission Endpoint ─────────────────────────────────────────
app.post('/api/contact', (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields: First Name, Email, and Phone.'
    });
  }

  const submission = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    type: 'contact',
    firstName,
    lastName: lastName || '',
    email,
    phone,
    message: message || ''
  };

  console.log('📬 New contact submission:', submission);

  const saved = saveToFile(path.join(__dirname, 'submissions.json'), submission);

  if (!saved) {
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }

  res.json({
    success: true,
    message: 'Thank you! Your message has been received. We will contact you within 24 business hours.'
  });
});

// ── Partner Enquiry Endpoint ──────────────────────────────────────────────────
app.post('/api/partner', (req, res) => {
  const { name, email, phone, partnerType, message } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields: Name, Email, and Phone.'
    });
  }

  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    type: 'partnership',
    name,
    email,
    phone,
    partnerType: partnerType || 'not specified',
    message: message || ''
  };

  console.log('🤝 New partnership enquiry:', entry);

  const saved = saveToFile(path.join(__dirname, 'partners.json'), entry);

  if (!saved) {
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }

  res.json({
    success: true,
    message: 'Thank you for your interest! Our partnership team will reach out within 24 business hours.'
  });
});

// ── Catch-all: serve index.html for any unmatched route ──────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌐 3K Investment Partners server running on http://localhost:${PORT}`);
  console.log(`📂 Serving static files from: ${__dirname}`);
  console.log(`📬 Contact API:  POST http://localhost:${PORT}/api/contact`);
  console.log(`🤝 Partner API:  POST http://localhost:${PORT}/api/partner\n`);
});
