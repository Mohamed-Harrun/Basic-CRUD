import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

export default function DataTable() {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", mobile: "", dob: "" });

  const fetchData = async () => {
    const res = await axios.get("http://localhost:4000/api/getdata");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // keep only YYYY-MM-DD
  };

  const handleDelete = async (id) => {
    await axios.post("http://localhost:4000/api/postdata", { action: "delete", id });
    fetchData();
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setEditData({
      name: user.name,
      mobile: user.mobile,
      dob: formatDateForInput(user.dob) // format for date picker
    });
  };

  const handleUpdate = async () => {
    await axios.post("http://localhost:4000/api/postdata", {
      action: "edit",
      id: editId,
      ...editData
    });
    setEditId(null);
    fetchData();
  };

  return (
    <div>
      <h2>User List</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>DOB</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
            editId === user.id ? (
              <tr key={user.id}>
                <td>
                  <input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    value={editData.mobile}
                    onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={editData.dob}
                    onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
                  />
                </td>
                <td>
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.mobile}</td>
                <td>{formatDateForInput(user.dob)}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
