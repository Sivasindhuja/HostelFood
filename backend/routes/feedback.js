import { Router } from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

// POST feedback (with user_id)
router.post('/', verifyToken, async (req, res) => {
  const { day, time, rating, suggestion } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      'INSERT INTO feedback (day, time, rating, suggestion, user_id) VALUES (?, ?, ?, ?, ?)',
      [day, time, rating, suggestion, userId]
    );

    res.json({ id: result.insertId });
  } catch (err) {
    console.error('Error in POST /feedback:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET feedback (role-based)
router.get('/', verifyToken, async (req, res) => {
  try {
    let query;
    let values = [];

    if (req.user.role === "matron") {
      query = 'SELECT * FROM feedback ORDER BY submitted_at DESC';
    } else {
      query = 'SELECT * FROM feedback WHERE user_id = ? ORDER BY submitted_at DESC';
      values = [req.user.id];
    }

    const [rows] = await pool.query(query, values);
    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
