const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/register', (req, res) => {
  const { id_number, name, email } = req.body;
  const sql = 'INSERT INTO students (id_number, name, email) VALUES (?, ?, ?)';
  db.query(sql, [id_number, name, email], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Student registered');
  });
});

module.exports = router;
