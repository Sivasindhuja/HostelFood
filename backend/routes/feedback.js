import express from "express";
// import router from "Router";
import pool from "../db.js";
import {Router} from "express"
const router =Router();

router.post('/', async (req, res) => {
  console.log('POST /feedback triggered');
console.log('Request body:', req.body);
  const { day, time, rating, suggestion } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO feedback (day, time, rating, suggestion) VALUES (?, ?, ?, ?)',
      [day, time, rating, suggestion]
    );
    res.json({ id: result.insertId, day, time, rating, suggestion });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error('Error in POST /feedback:', err);
  }
});

// GET all feedback
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM feedback ORDER BY submitted_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
