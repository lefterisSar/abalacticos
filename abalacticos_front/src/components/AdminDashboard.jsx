// AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <button onClick={() => navigate('/add-player')}>Add Player</button>
            <button onClick={() => navigate('/team-selection')}>Team Selection</button>
            <button onClick={() => navigate('/players')}>View Players</button>
        </div>
    );
};

export default AdminDashboard;
