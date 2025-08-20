const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// MySQL connection
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

//  GET data
app.get("/api/getdata", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//  POST data (Create, Edit, Delete) with validation
app.post("/api/postdata", (req, res) => {
  let { action, id, name, mobile, dob } = req.body;

  // Validation
  if (action === "create" || action === "edit") {
    if (!/^[A-Za-z]+$/.test(name))
      return res.status(400).json({ error: "Name letters only" });
    if (!/^[6-9][0-9]{9}$/.test(mobile))
      return res.status(400).json({ error: "Invalid mobile" });

    let dateObj = new Date(dob);
    if (isNaN(dateObj.getTime()))
      return res.status(400).json({ error: "Invalid date" });

    dob = dateObj.toISOString().split("T")[0];
  }

  if ((action === "edit" || action === "delete") && !id) {
    return res.status(400).json({ error: "ID required" });
  }

  // Database Operations
  if (action === "create") {
    db.query(
      "INSERT INTO users (name, mobile, dob) VALUES (?, ?, ?)",
      [name, mobile, dob],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User added", insertId: result.insertId });
      }
    );
  } else if (action === "edit") {
    db.query(
      "UPDATE users SET name=?, mobile=?, dob=? WHERE id=?",
      [name, mobile, dob, id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User updated" });
      }
    );
  } else if (action === "delete") {
    db.query("DELETE FROM users WHERE id=?", [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User deleted" });
    });
  } else {
    res.status(400).json({ error: "Invalid action" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
