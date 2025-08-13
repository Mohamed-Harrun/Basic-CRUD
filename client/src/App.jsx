import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateForm from "./CreateForm";
import DataTable from "./DataTable";

export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Create User</Link> | <Link to="/getdata">User List</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CreateForm />} />
        <Route path="/getdata" element={<DataTable />} />
      </Routes>
    </Router>
  );
}
