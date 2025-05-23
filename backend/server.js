const express = require('express');
const app = express();
const cors = require('cors');

const studentRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');
require('./emailCron');

app.use(cors());
app.use(express.json());
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
