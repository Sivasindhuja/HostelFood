import { Router } from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post('/', verifyToken, async (req, res) => {
  const { day, time, rating, suggestion } = req.body;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be 1-5" });
  }

  try {
    //  1. Check last feedback
    const [rows] = await pool.query(
      'SELECT submitted_at FROM feedback WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 1',
      [userId]
    );

    if (rows.length > 0) {
      const lastDate = new Date(rows[0].submitted_at);
      const now = new Date();

      const diffDays = (now - lastDate) / (1000 * 60 * 60 * 24);

      if (diffDays < 7) {
        return res.status(400).json({
          error: `You can submit feedback after ${Math.ceil(7 - diffDays)} day(s)`
        });
      }
    }

    //  2. Get block
    const [userRows] = await pool.query(
      'SELECT block FROM users WHERE id = ?',
      [userId]
    );

    const block = userRows[0].block;

    //  3. Insert feedback
    const [result] = await pool.query(
      'INSERT INTO feedback (day, time, rating, suggestion, user_id, block) VALUES (?, ?, ?, ?, ?, ?)',
      [day, time, rating, suggestion, userId, block]
    );

    res.json({ id: result.insertId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET feedback (block filtered for matron)
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

      query = 'SELECT * FROM feedback WHERE block = ? ORDER BY submitted_at DESC';
      values = [block];

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