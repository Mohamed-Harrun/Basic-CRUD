import React, { useState } from "react";
import axios from "axios";
import "./App.css";

export default function CreateForm() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");

  const validateForm = () => {
    // Name: only letters A-Z or a-z
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(name)) {
      alert("Name must contain only letters (A-Z or a-z) without spaces.");
      return false;
    }

    // Mobile: starts with 6-9 and total 10 digits
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      alert("Mobile number must be 10 digits and start with 6, 7, 8, or 9.");
      return false;
    }

    // DOB: must be selected
    if (!dob) {
      alert("Please select your Date of Birth.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:4000/api/postdata", {
        action: "create",
        name,
        mobile,
        dob
      });
      alert("User created!");
      setName("");
      setMobile("");
      setDob("");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create User</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        placeholder="Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        required
      />
      <input
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
