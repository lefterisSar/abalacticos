// PlayersGrid.jsx
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlayersGrid = () => {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();

    const handleProcessRowUpdate = async (newRow, oldRow) => {
        const updatedRow = { ...oldRow, ...newRow };

        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`http://localhost:8080/api/users/${updatedRow.id}`, updatedRow, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return updatedRow;
        } catch (error) {
            console.error('Error updating player:', error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                navigate('/login'); // Redirect to login if unauthorized or forbidden
            }
            throw error; // Let DataGrid revert the changes
        }
    };

    useEffect(() => {
        const fetchPlayers = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No auth token found');
                navigate('/login'); // Redirect to login if not authenticated
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/users', {
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
                    navigate('/login'); // Redirect to log in if unauthorized
                } else if (error.response && error.response.status === 403) {
                    navigate('/forbidden'); // Redirect to a forbidden page if access is denied
                }
            }
        };

        fetchPlayers();
    }, [navigate]);

    const columns = [
        { field: 'name', headerName: 'Name', width: 150,editable: localStorage.getItem('userRole') === "ADMIN" },
        { field: 'surname', headerName: 'Surname', width: 150,editable: localStorage.getItem('userRole') === "ADMIN"  },
        { field: 'age', headerName: 'Age', width: 100, editable: localStorage.getItem('userRole') === "ADMIN"  },
        { field: 'debutDate', headerName: 'Debut Date', width: 150, editable: localStorage.getItem('userRole') === "ADMIN"  },
        { field: 'lastGK', headerName: 'Last GK Date', width: 150, editable: localStorage.getItem('userRole') === "ADMIN"  },
        { field: 'wins', headerName: 'Wins', width: 100, editable: localStorage.getItem('userRole') === "ADMIN"  },
        { field: 'loses', headerName: 'Loses', width: 100, editable: localStorage.getItem('userRole') === "ADMIN"  },
        { field: 'draws', headerName: 'Draws', width: 100, editable: localStorage.getItem('userRole') === "ADMIN"  },

    ];

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                processRowUpdate={handleProcessRowUpdate}
            />
        </div>
    );
};

export default PlayersGrid;
