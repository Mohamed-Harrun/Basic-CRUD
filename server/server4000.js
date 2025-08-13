const express = require("express");
const axios = require("axios");
const app = express();
const cors = require('cors')
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.post("/api/postdata", async (req, res) => {
  let { action, id, name, mobile, dob } = req.body;

  if (action === "create" || action === "edit") {
    if (!/^[A-Za-z]+$/.test(name)) return res.status(400).json({ error: "Name letters only" });
    if (!/^[6-9][0-9]{9}$/.test(mobile)) return res.status(400).json({ error: "Invalid mobile" });
    let dateObj = new Date(dob);
    if (isNaN(dateObj.getTime())) return res.status(400).json({ error: "Invalid date" });
    dob = dateObj.toISOString().split("T")[0];
  }

  if ((action === "edit" || action === "delete") && !id) {
    return res.status(400).json({ error: "ID required" });
  }

  try {
    const response = await axios.post("http://localhost:5000/api/postdata/data", { action, id, name, mobile, dob });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/getdata", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/api/getdata/db");
    res.json(response.data); // send DB data directly to client
  } catch (error) {
    console.error("Error fetching from 5000:", error.message);
    res.status(500).send("Error getting data");
  }
});
app.listen(4000, () => console.log("Validation server running on 4000"));
