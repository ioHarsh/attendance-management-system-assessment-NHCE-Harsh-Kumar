// server.js
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: true
}));

// In-memory user and attendance storage
const users = [
  { id: 1, username: "user1", password: "pass1" },
  { id: 2, username: "user2", password: "pass2" }
];

const attendanceRecords = {}; // { userId: [{ clockIn, clockOut }] }

// Login route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.userId = user.id;
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Clock In
app.post("/api/attendance/clockin", (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Not logged in" });

  const now = new Date().toLocaleString();
  attendanceRecords[userId] = attendanceRecords[userId] || [];
  attendanceRecords[userId].push({ clockIn: now, clockOut: null });

  res.json({ message: `User ${userId} clocked in at ${now}` });
});

// Clock Out
app.post("/api/attendance/clockout", (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Not logged in" });

  const userRecords = attendanceRecords[userId];
  if (!userRecords || userRecords.length === 0) {
    return res.status(400).json({ message: "No clock-in found" });
  }

  const lastRecord = userRecords[userRecords.length - 1];
  if (lastRecord.clockOut) {
    return res.status(400).json({ message: "Already clocked out" });
  }

  lastRecord.clockOut = new Date().toLocaleString();
  res.json({ message: `User ${userId} clocked out at ${lastRecord.clockOut}` });
});

// Attendance History
app.get("/api/attendance/history", (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Not logged in" });

  const history = attendanceRecords[userId] || [];
  res.json(history);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
