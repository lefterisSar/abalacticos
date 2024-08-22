import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleNavigate = (day) => {
        navigate(`/team-selection/${day}`);
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <button onClick={() => navigate('/add-player')}>Add Player</button>
            <button onClick={() => navigate('/players')}>View Players</button>
            <h2>Team Selection</h2>
            <button onClick={() => handleNavigate('Tuesday')}>Tuesday</button>
            <button onClick={() => handleNavigate('Wednesday')}>Wednesday</button>
            <button onClick={() => handleNavigate('Friday')}>Friday</button>
        </div>
    )
        ;
};

export default AdminDashboard;
