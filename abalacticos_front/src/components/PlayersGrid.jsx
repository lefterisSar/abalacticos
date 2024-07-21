import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlayersGrid = () => {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlayers = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No auth token found');
                navigate('/login'); // Redirect to login if not authenticated
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/players', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data && Array.isArray(response.data)) {
                    const playersWithId = response.data.map(player => ({
                        ...player,
                        id: player.id || `${player.name}-${player.surname}-${player.age}` // Fallback if no id field is present
                    }));
                    setRows(playersWithId);
                } else {
                    console.error('Unexpected response format:', response.data);
                }
            } catch (error) {
                console.error('There was an error fetching the players!', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login'); // Redirect to login if unauthorized
                }
            }
        };

        fetchPlayers();
    }, [navigate]);

    const columns = [
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'surname', headerName: 'Surname', width: 150 },
        { field: 'age', headerName: 'Age', width: 100 },
        { field: 'debutDate', headerName: 'Debut Date', width: 150 },
        { field: 'lastGK', headerName: 'Last Game Date', width: 150 },
        { field: 'wins', headerName: 'Wins', width: 100 },
        { field: 'loses', headerName: 'Loses', width: 100 },
        { field: 'draws', headerName: 'Draws', width: 100 },

    ];

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} />
        </div>
    );
};

export default PlayersGrid;
