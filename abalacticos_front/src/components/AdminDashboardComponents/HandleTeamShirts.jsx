import React, { useState, useEffect } from 'react';

const HandleTeamShirts = () => {
  const [shirtColor, setShirtColor] = useState("");
  const [availableShirts, setAvailableShirts] = useState([]);


  // Fetch available shirt colors from the backend
  useEffect(() => {
    fetchShirts();
  }, []);

  const fetchShirts = async () => {
      const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('/api/team-shirts/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Add the Bearer token to the request
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableShirts(data);
      } else {
        console.error("Error fetching shirts:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching shirts:", error);
    }
  };

  const handleAddShirt = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    try {
      // Send a POST request to add the new shirt color with the Bearer token
      const response = await fetch('/api/team-shirts/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  // Add the Bearer token to the request
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shirtColor),  // Send the color to backend
      });

      if (response.ok) {
        alert(`Shirt color ${shirtColor} added successfully!`);
        setShirtColor("");  // Reset the input field
        fetchShirts();  // Refresh the available shirts list
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error adding shirt color:", error);
    }
  };

  return (
    <div>
      <h3>Manage Team Shirt Colors</h3>

      <form onSubmit={handleAddShirt}>
        <label>
          New Shirt Color:
          <input
            type="text"
            value={shirtColor}
            onChange={(e) => setShirtColor(e.target.value)}
            required
          />
        </label>
        <button type="submit">Add Shirt Color</button>
      </form>

      <h4>Available Shirt Colors</h4>
      <ul>
        {availableShirts.map((shirt) => (
          <li key={shirt.color}>{shirt.color}</li>
        ))}
      </ul>
    </div>
  );
};

export default HandleTeamShirts;
