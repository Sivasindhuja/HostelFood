import { Router } from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

// POST complaint (with user_id)
router.post('/', verifyToken, async (req, res) => {
  const { name, roomNumber, complaint } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      'INSERT INTO complaints (name, room_number, complaint, user_id) VALUES (?, ?, ?, ?)',
      [name, roomNumber, complaint, userId]
    );

    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET complaints (role-based)
router.get('/', verifyToken, async (req, res) => {
  try {
    let query;
    let values = [];

    if (req.user.role === "matron") {
      query = 'SELECT * FROM complaints ORDER BY created_at DESC';
    } else {
      query = 'SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC';
      values = [req.user.id];
    }

    const [rows] = await pool.query(query, values);
    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
