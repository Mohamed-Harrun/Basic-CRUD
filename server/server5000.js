const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require('cors')
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "testdb"
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

app.get("/api/getdata/db", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/api/postdata/data", (req, res) => {
  const { action, id, name, mobile, dob } = req.body;

  if (action === "create") {
    db.query("INSERT INTO users (name, mobile, dob) VALUES (?, ?, ?)", [name, mobile, dob], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User added", insertId: result.insertId });
    });
  } else if (action === "edit") {
    db.query("UPDATE users SET name=?, mobile=?, dob=? WHERE id=?", [name, mobile, dob, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User updated" });
    });
  } else if (action === "delete") {
    db.query("DELETE FROM users WHERE id=?", [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User deleted" });
    });
  } else {
    res.status(400).json({ error: "Invalid action" });
  }
});

app.listen(5000, () => console.log("Storage server running on 5000"));
