import { Router } from "express";
import pool from "../db.js";

const router = Router();

// POST complaint
router.post('/', async (req, res) => {
  const { name, roomNumber, complaint } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO complaints (name, room_number, complaint) VALUES (?, ?, ?)',
      [name, roomNumber, complaint]
    );

    res.json({ id: result.insertId, name, roomNumber, complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET complaints
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM complaints ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
