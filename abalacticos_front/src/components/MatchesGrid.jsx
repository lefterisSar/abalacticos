import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import {Button} from "@mui/material";

const MatchesGrid = () => {
    const [matches, setMatches] = useState([]);
    const [players, setPlayers] = useState({});
    const [loading, setLoading] = useState(true);
    const role = localStorage.getItem('userRole');

    const handleDeleteMatch = async (id) => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.delete(`http://localhost:8080/api/matches/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMatches(matches.filter(match => match.id !== id));
        } catch (error) {
            console.error('Error deleting match:', error);
        }
    };

    useEffect(() => {
        const fetchMatchesAndPlayers = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No auth token found');
                return;
            }

            try {
                const matchesResponse = await axios.get('http://localhost:8080/api/matches', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const matches = matchesResponse.data;
                setMatches(matches);

                // Get all unique player IDs from matches
                const playerIds = [...new Set(matches.flatMap(match => [...match.teamA, ...match.teamB]))];

                // Fetch player details by IDs
                const playersResponse = await axios.post('http://localhost:8080/api/users/fetchByIds', playerIds, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const playersMap = {};
                playersResponse.data.forEach(player => {
                    playersMap[player.id] = player;
                });

                setPlayers(playersMap);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching matches or players:', error);
            }
        };

        fetchMatchesAndPlayers();
    }, []);

    const columns = [
        { field: 'datePlayed', headerName: 'Date Played', flex: 1 },
        { field: 'day', headerName: 'Day', width: 150 },
        {
            field: 'teamA',
            headerName: 'Team A',
            flex: 1,
            valueGetter: (value, row) => row.teamA.map(id => players[id]?.name + ' ' + players[id]?.surname).join(', ')
        },
        {
            field: 'teamB',
            headerName: 'Team B',
            flex: 1,
            valueGetter: (value, row)=> row.teamB.map(id => players[id]?.name + ' ' + players[id]?.surname).join(', ')
        },
        role === 'ADMIN' && {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteMatch(params.row.id)}
                >
                    Delete
                </Button>
            ),
        }
    ].filter(Boolean);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <DataGrid
                rows={matches}
                columns={columns}
                getRowId={(row) => row.id}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'datePlayed', sort: 'desc' }],
                    },
                }}
            />
        </div>
    );
};

export default MatchesGrid;
