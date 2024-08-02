import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TuesdayTeamSelection = () => {
    const [players, setPlayers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    // Fetch players data
    useEffect(() => {
        const fetchPlayers = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No auth token found');
                navigate('/login'); // Redirect to login if not authenticated
                return;
            }
            const role = localStorage.getItem('userRole');
            role === "ADMIN" ? setIsAdmin(true) : setIsAdmin(false);
            try {
                const response = await axios.get('http://localhost:8080/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data && Array.isArray(response.data)) {
                    const playersWithId = response.data.map(player => ({
                        ...player,
                        id: player.id || `${player.name}-${player.surname}-${player.age}`, // Fallback if no id field is present
                        availability: player.availability || [] // Ensure availability is an array
                    }));
                    setPlayers(playersWithId);
                } else {
                    console.error('Unexpected response format:', response.data);
                }
            } catch (error) {
                console.error('There was an error fetching the players!', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login'); // Redirect to log in if unauthorized
                } else if (error.response && error.response.status === 403) {
                    navigate('/forbidden'); // Redirect to a forbidden page if access is denied
                }
            }
        };

        fetchPlayers();
    }, [navigate]);

    // Filter players based on availability
    const tuesdayPlayers = players.filter(player => player.availability.includes('Tuesday'));

    const columns = [
        { field: 'username', headerName: 'Username', width: 150 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'surname', headerName: 'Surname', width: 150 },
        { field: 'wins', headerName: 'Wins', width: 100 },
        { field: 'losses', headerName: 'Losses', width: 100 },
        { field: 'draws', headerName: 'Draws', width: 100 },
        { field: 'age', headerName: 'Age', width: 100 },
        { field: 'debutDate', headerName: 'Debut Date', width: 150 },
        { field: 'lastGK', headerName: 'Last GK Date', width: 150 },
    ];

    return (
        <div>
            <h2>Tuesday</h2>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={tuesdayPlayers} columns={columns} />
            </div>
        </div>
    );
};

export default TuesdayTeamSelection;
