import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddClubForm from './AdminDashboardComponents/ClubForm';
import HandleItemsForm from './AdminDashboardComponents/HandleItemsForm';
import HandleSavings from './AdminDashboardComponents/HandleSavings';
import HandleTeamShirts from './AdminDashboardComponents/HandleTeamShirts';
import BanUser from './AdminDashboardComponents/BanUser';
import Court from './AdminDashboardComponents/Court';

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
            <button onClick={() => navigate('/add-club')}>View Clubs</button>
            <button onClick={() => navigate('/inventory')}>Manage Inventory</button>
            <button onClick={() => navigate('/savings')}>Savings</button>
            <h2>Team Selection</h2>
            <button onClick={() => handleNavigate('Tuesday')}>Tuesday</button>
            <button onClick={() => handleNavigate('Wednesday')}>Wednesday</button>
            <button onClick={() => handleNavigate('Friday')}>Friday</button>
            <h2>Mplouzakia</h2>
            <button onClick={() => navigate('/team-shirts')}>TeamShirts</button>
            <h2>Court</h2>
            <button onClick={() => navigate('/BanUser')}>punish</button>
            <button onClick={() => navigate('/Court')}>αρχείο</button>

        </div>
    );
};

export default AdminDashboard;
