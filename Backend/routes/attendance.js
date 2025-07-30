const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/clock-in', (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  const date = new Date().toISOString().split('T')[0];
  const clockInTime = new Date().toISOString();

  db.run(
    `INSERT INTO attendance (userId, date, clockIn) VALUES (?, ?, ?)`,
    [userId, date, clockInTime],
    function (err) {
      if (err) return res.status(500).json({ error: 'Clock in failed' });
      res.json({ message: 'Clocked in successfully' });
    }
  );
});

router.post('/clock-out', (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  const date = new Date().toISOString().split('T')[0];
  const clockOutTime = new Date().toISOString();

  db.run(
    `UPDATE attendance SET clockOut = ? WHERE userId = ? AND date = ?`,
    [clockOutTime, userId, date],
    function (err) {
      if (err || this.changes === 0) return res.status(500).json({ error: 'Clock out failed' });
      res.json({ message: 'Clocked out successfully' });
    }
  );
});

router.get('/my-records', (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  db.all(
    `SELECT * FROM attendance WHERE userId = ? ORDER BY date DESC LIMIT 60`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch records' });
      res.json(rows);
    }
  );
});

router.get('/all-records', (req, res) => {
  if (req.session.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  db.all(
    `SELECT a.*, u.username FROM attendance a JOIN users u ON a.userId = u.id ORDER BY date DESC LIMIT 60`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch records' });
      res.json(rows);
    }
  );
});

router.post('/create-user', (req, res) => {
  if (req.session.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { username, password, role } = req.body;

  db.run(
    `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
    [username, password, role],
    function (err) {
      if (err) return res.status(500).json({ error: 'User creation failed' });
      res.json({ message: 'User created successfully', userId: this.lastID });
    }
  );
});

router.put('/update-user/:id', (req, res) => {
  if (req.session.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { username, password, role } = req.body;
  const userId = req.params.id;

  db.run(
    `UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?`,
    [username, password, role, userId],
    function (err) {
      if (err) return res.status(500).json({ error: 'Update failed' });
      res.json({ message: 'User updated' });
    }
  );
});

router.delete('/delete-user/:id', (req, res) => {
  if (req.session.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const userId = req.params.id;

  db.run(`DELETE FROM users WHERE id = ?`, [userId], function (err) {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ message: 'User deleted' });
  });
});

module.exports = router;
