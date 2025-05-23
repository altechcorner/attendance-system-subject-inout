const express = require('express');
const router = express.Router();
const db = require('../db');
const sendEmail = require('../sendEmail');

router.post('/mark', async (req, res) => {
  const { id_number } = req.body;
  const now = new Date();
  const today = now.toISOString().slice(0, 10); // YYYY-MM-DD

  db.query('SELECT * FROM students WHERE id_number = ?', [id_number], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('Student not found');

    const student = results[0];

    // Get the latest attendance for today
    db.query(
      'SELECT * FROM attendance WHERE student_id = ? AND date = ? ORDER BY id DESC LIMIT 1',
      [student.id, today],
      async (err, attendanceRows) => {
        if (err) return res.status(500).send(err);

        if (attendanceRows.length === 0 || attendanceRows[0].time_out !== null) {
          // TIME IN (new record)
          db.query(
            'INSERT INTO attendance (student_id, date, time_in) VALUES (?, ?, ?)',
            [student.id, today, now],
            async (err) => {
              if (err) return res.status(500).send(err);

              const subject = `Time In Notification for ${student.name}`;
              const message = `Hello ${student.name},\n\nYou have timed IN at ${now.toLocaleString()}.\n\nIf this wasn't you, contact admin.`;
              const htmlMessage = `<p>Hello ${student.name},</p><p>You have <b>timed IN</b> at <b>${now.toLocaleString()}</b>.</p>`;
              try {
                await sendEmail(student.email, subject, message, htmlMessage);
                res.send('Time IN recorded and email sent.');
              } catch (e) {
                res.status(500).send('Time IN recorded but failed to send email.');
              }
            }
          );
        } else if (attendanceRows[0].time_out === null) {
          // TIME OUT (update last record)
          db.query(
            'UPDATE attendance SET time_out = ? WHERE id = ?',
            [now, attendanceRows[0].id],
            async (err) => {
              if (err) return res.status(500).send(err);

              const subject = `Time Out Notification for ${student.name}`;
              const message = `Hello ${student.name},\n\nYou have timed OUT at ${now.toLocaleString()}.\n\nIf this wasn't you, contact admin.`;
              const htmlMessage = `<p>Hello ${student.name},</p><p>You have <b>timed OUT</b> at <b>${now.toLocaleString()}</b>.</p>`;
              try {
                await sendEmail(student.email, subject, message, htmlMessage);
                res.send('Time OUT recorded and email sent.');
              } catch (e) {
                res.status(500).send('Time OUT recorded but failed to send email.');
              }
            }
          );
        }
      }
    );
  });
});

module.exports = router;
