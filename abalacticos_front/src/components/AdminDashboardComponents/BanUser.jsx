import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BanUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [banStartDate, setBanStartDate] = useState('');
  const [banEndDate, setBanEndDate] = useState('');
  const [banReason, setBanReason] = useState(''); // New state for the ban reason
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // Fetch all users to display in the dropdown
    axios
      .get('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching users!', error);
      });
  }, [token]);

  const handleBanUser = (e) => {
    e.preventDefault();

    const banRequest = {
      banStartDate: banStartDate || null, // Allow null for immediate ban
      banEndDate: banEndDate || null,     // Allow null for indefinite ban
      banReason: banReason || 'No reason provided', // Include reason or default to 'No reason provided'
    };

    axios
      .put(`/api/users/${selectedUser}/ban`, banRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessage('User banned successfully!');
      })
      .catch((error) => {
        console.error('There was an error banning the user!', error);
        setMessage('Error banning user.');
      });
  };

  const handleUnbanUser = (e) => {
    e.preventDefault();

    axios
      .put(`/api/users/${selectedUser}/goodBoi`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessage('User unbanned successfully!');
      })
      .catch((error) => {
        console.error('There was an error unbanning the user!', error);
        setMessage('Error unbanning user.');
      });
  };

  return (
    <div>
      <h2>Ban User</h2>
      <form onSubmit={handleBanUser}>
        <div>
          <label htmlFor="userSelect">Select User:</label>
          <select
            id="userSelect"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
          >
            <option value="">--Select User--</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="banStartDate">Ban Start Date (Optional):</label>
          <input
            type="datetime-local"
            id="banStartDate"
            value={banStartDate}
            onChange={(e) => setBanStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="banEndDate">Ban End Date (Optional):</label>
          <input
            type="datetime-local"
            id="banEndDate"
            value={banEndDate}
            onChange={(e) => setBanEndDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="banReason">Reason for Ban (Optional):</label>
          <textarea
            id="banReason"
            placeholder="Enter the reason for the ban"
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
          />
        </div>
        <button type="submit">Ban User</button>
      </form>
      <button onClick={handleUnbanUser}>GoodBoi!</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BanUser;
