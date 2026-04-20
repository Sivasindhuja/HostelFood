import { Router } from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

// POST complaint
router.post('/', verifyToken, async (req, res) => {
  const { complaint } = req.body;
  const userId = req.user.id;

  if (!complaint || complaint.trim() === "") {
    return res.status(400).json({ error: "Complaint required" });
  }

  try {
    const [userRows] = await pool.query(
      'SELECT block FROM users WHERE id = ?',
      [userId]
    );

    const block = userRows[0].block;

    const [result] = await pool.query(
      'INSERT INTO complaints (user_id, block, complaint) VALUES (?, ?, ?)',
      [userId, block, complaint]
    );

    res.json({ id: result.insertId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET complaints (with name + room)
router.get('/', verifyToken, async (req, res) => {
  try {
    let query;
    let values = [];

    if (req.user.role === "matron") {
      const [userRows] = await pool.query(
        'SELECT block FROM users WHERE id = ?',
        [req.user.id]
      );

      const block = userRows[0].block;

      query = `
        SELECT c.*, u.name, u.room_number 
        FROM complaints c
        JOIN users u ON c.user_id = u.id
        WHERE c.block = ?
        ORDER BY c.created_at DESC
      `;
      values = [block];

    } else {
      query = `
        SELECT c.*, u.name, u.room_number 
        FROM complaints c
        JOIN users u ON c.user_id = u.id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
      `;
      values = [req.user.id];
    }

    const [rows] = await pool.query(query, values);
    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE status (matron only)
router.put('/:id/status', verifyToken, async (req, res) => {
  const { status } = req.body;
  const complaintId = req.params.id;

  if (req.user.role !== "matron") {
    return res.status(403).json({ error: "Only matron can update status" });
  }

  try {
    await pool.query(
      'UPDATE complaints SET status = ? WHERE id = ?',
      [status, complaintId]
    );

    res.json({ message: "Status updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;