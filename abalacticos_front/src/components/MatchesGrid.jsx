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
        if (window.confirm("Are you sure you want to delete this match?")) {
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
        }
    };

    const handleUpdateMatchResult = async (id, result) => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.put(`http://localhost:8080/api/matches/${id}/win`, null, {
                params: { winner: result },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Update the match result in the frontend state
            setMatches(matches.map(match => match.id === id ? { ...match, result: result || 'Draw' } : match));
        } catch (error) {
            console.error('Error updating match result:', error);
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

                const playerIds = [...new Set(matches.flatMap(match => [
                    ...Object.keys(match.teamA.reduce((acc, obj) => ({ ...acc, ...obj }), {})),
                    ...Object.keys(match.teamB.reduce((acc, obj) => ({ ...acc, ...obj }), {}))
                ]))];

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

    const formatTeamDisplay = (team) => {
        return team.map(playerStatusMap => {
            const playerId = Object.keys(playerStatusMap)[0];
            const status = playerStatusMap[playerId];
            const player = players[playerId];
            if (player) {
                return `${player.name} ${player.surname} (${status})`;
            } else {
                return `Unknown Player (${status})`;
            }
        }).join(', ');
    };

    const columns = [
        { field: 'datePlayed', headerName: 'Date Played', flex: 1 },
        { field: 'day', headerName: 'Day', width: 150 },
        {
            field: 'teamA',
            headerName: 'Team A',
            flex: 1,
            valueGetter: (value,row) => formatTeamDisplay(row.teamA)
        },
        {
            field: 'teamB',
            headerName: 'Team B',
            flex: 1,
            valueGetter: (value,row) => formatTeamDisplay(row.teamB)
        },
        { field: 'result', headerName: 'Result', width: 80 },
        role === 'ADMIN' && {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateMatchResult(params.row.id, 'TeamA')}
                    >
                        Team A Wins
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateMatchResult(params.row.id, 'TeamB')}
                    >
                        Team B Wins
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateMatchResult(params.row.id, '')}
                    >
                        Draw
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteMatch(params.row.id)}
                    >
                        Delete
                    </Button>
                </div>
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
