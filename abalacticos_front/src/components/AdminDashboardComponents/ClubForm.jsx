import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ClubForm() {
    const [clubName, setClubName] = useState('');
    const [iconUrl, setIconUrl] = useState('');
    const [clubs, setClubs] = useState([]);

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        const token = localStorage.getItem('authToken'); // Adjust this based on where you store your token
        try {
            const response = await axios.get('http://localhost:8080/api/clubs', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setClubs(response.data);
        } catch (error) {
            console.error('Error fetching clubs', error);
        }
    };

    const handleAddClub = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken'); // Adjust this based on where you store your token

        try {
            await axios.post('http://localhost:8080/api/clubs/add',
                {
                    clubName,
                    iconUrl: iconUrl || '.', // Use a default icon if none is provided
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            alert('Club added successfully');
            setClubName('');
            setIconUrl('');
            fetchClubs(); // Refresh the list of clubs after adding a new one
        } catch (error) {
            console.error('Error adding club', error);
            alert('Failed to add club');
        }
    };

    const handleDeleteClub = async (clubId) => {
        const token = localStorage.getItem('authToken'); // Adjust this based on where you store your token

        try {
            await axios.delete(`http://localhost:8080/api/clubs/${clubId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            alert('Club deleted successfully');
            fetchClubs(); // Refresh the list of clubs after deletion
        } catch (error) {
            console.error('Error deleting club', error);
            alert('Failed to delete club');
        }
    };

    return (
        <div>
            <h2>Add a New Club</h2>
            <form onSubmit={handleAddClub}>
                <div>
                    <label>Club Name:</label>
                    <input
                        type="text"
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Icon URL:</label>
                    <input
                        type="text"
                        value={iconUrl}
                        onChange={(e) => setIconUrl(e.target.value)}
                    />
                </div>
                <button type="submit">Add Club</button>
            </form>

            <h2>View and Delete Clubs</h2>
            <ul>
                {clubs.map((club) => (
                    <li key={club.id}>
                        <span>{club.clubName}</span> - <img src={club.iconUrl} width="50" />
                        <button onClick={() => handleDeleteClub(club.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ClubForm;
