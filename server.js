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

// ── Contact Form Submission Endpoint ─────────────────────────────────────────
app.post('/api/contact', (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  // Basic validation
  if (!firstName || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields: First Name, Email, and Phone.'
    });
  }

  const submission = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    firstName,
    lastName: lastName || '',
    email,
    phone,
    message: message || ''
  };

  console.log('📬 New contact submission:', submission);

  // Save to submissions.json
  const submissionsFile = path.join(__dirname, 'submissions.json');
  let submissions = [];

  try {
    if (fs.existsSync(submissionsFile)) {
      const raw = fs.readFileSync(submissionsFile, 'utf-8');
      submissions = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading submissions file:', err.message);
  }

  submissions.push(submission);

  try {
    fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2), 'utf-8');
    console.log(`✅ Submission saved to submissions.json (total: ${submissions.length})`);
  } catch (err) {
    console.error('Error saving submission:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }

  res.json({
    success: true,
    message: 'Thank you! Your message has been received. We will contact you within 24 business hours.'
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
  console.log(`📬 Contact API: POST http://localhost:${PORT}/api/contact\n`);
});
