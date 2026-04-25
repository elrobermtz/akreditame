const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173'];
app.use(cors({
  origin: allowedOrigins
}));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.post('/api/leads', async (req, res) => {
  const { full_name, company, email, phone, interest_type, vertical, message } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO leads (full_name, company, email, phone, interest_type, vertical, message) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [full_name, company, email, phone, interest_type, vertical, message]
    );
    
    // In a real scenario, you'd trigger Resend here
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ ... });

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
