import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import {Button, ListItemIcon, ListItemText, Menu, MenuItem} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';

const MatchesGrid = () => {
    const [matches, setMatches] = useState([]);
    const [players, setPlayers] = useState({});
    const [loading, setLoading] = useState(true);
    const role = localStorage.getItem('userRole');
    const navigate = useNavigate();
    const [contextMenu, setContextMenu] = useState(null); // To store menu position and match details

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

    const handleContextMenu = (event, params) => {
        event.preventDefault();
        setContextMenu({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            match: params.row // Store match details
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
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

    const handleNavigateToTeamSelection = (day, datePlayed, matchId) => {
        navigate(`/team-selection/${day}?date=${datePlayed}&matchId=${matchId}`);
    };

    const handleConfirmTeams = async (matchId, day, datePlayed, isConfirmed, result ,teamB, teamA) => {
        try {
            const token = localStorage.getItem('authToken');
            const match = {
                id: matchId,
                result: result,
                teamB: teamB,
                teamA: teamA,
                datePlayed: datePlayed,
                day: day,
                confirmed: isConfirmed
            };
            const url = 'http://localhost:8080/api/matches/confirm';

            await axios.post(url, match, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Update the state directly
            setMatches(prevMatches =>
                prevMatches.map(m =>
                    m.id === matchId ? { ...m, confirmed: isConfirmed } : m
                )
            );

            alert(isConfirmed ? 'Confirmed match' : 'Match confirmation is deleted!');
        } catch (error) {
            console.error('Error confirming match:', error);
        }
    };

    // Function to handle navigation to the soccer field
    const handleTeamClick = (team, teamName) => {
        navigate('/soccer-field', { state: { team, teamName } });
    };

    const columns = [
        {
            field: 'id',
            headerName: 'Match ID',
            width: 150,
            renderCell: (params) => (
                <Button
                    onClick={() => handleNavigateToTeamSelection(params.row.day, params.row.datePlayed, params.row.id)}
                    onContextMenu={(event) => handleContextMenu(event, params)} // Capture right-click event
                >
                    {params.value}
                </Button>
            ),
        },
        { field: 'confirmed', headerName: 'Confirmed',width: 80},
        { field: 'datePlayed', headerName: 'Date Played', flex: 1 },
        { field: 'day', headerName: 'Day', width: 150 },
        {
            field: 'teamA',
            headerName: 'Team A',
            flex: 1,
            headerClassName: 'wrap-header', // Add the custom class for wrapping
            valueGetter: (value,row) => formatTeamDisplay(row.teamA),
            renderCell: (params) => (
                <Button onClick={() => handleTeamClick(params.row.teamA, 'Team A')}>
                    View Team A
                </Button>
            ),
        },
        {
            field: 'teamB',
            headerName: 'Team B',
            flex: 1,
            headerClassName: 'wrap-header', // Add the custom class for wrapping
            valueGetter: (value,row) => formatTeamDisplay(row.teamB),
            renderCell: (params) => (
                <Button onClick={() => handleTeamClick(params.row.teamB, 'Team B')}>
                    View Team B
                </Button>
            ),
        },
        { field: 'result', headerName: 'Result', width: 80 },
        role === 'ADMIN' && {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <div>
                    <Button variant="contained" color="primary"
                            onClick={() =>
                                handleConfirmTeams(params.row.id, params.row.day,params.row.datePlayed,
                                    !params.row.confirmed, params.row.result ,params.row.teamB, params.row.teamA)}>
                        {!params.row.confirmed? "Confirm Match": "Stop Confirmation"}
                    </Button>
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

            {role === 'ADMIN' && contextMenu && (
                <Menu
                    open={true}
                    onClose={handleCloseContextMenu}
                    anchorReference="anchorPosition"
                    anchorPosition={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
                >
                    <MenuItem
                        onClick={()=> {
                            handleConfirmTeams(contextMenu.match.id, contextMenu.match.day,
                                contextMenu.match.datePlayed,
                                !contextMenu.match.confirmed,
                                contextMenu.match.result ,
                                contextMenu.match.teamB,
                                contextMenu.match.teamA)
                        }}>
                        <ListItemIcon>
                            {!contextMenu.match.confirmed? <CheckIcon fontSize={"small"}></CheckIcon> :
                                <RemoveDoneIcon fontSize={"small"}></RemoveDoneIcon>}
                        </ListItemIcon>
                        <ListItemText>{!contextMenu.match.confirmed?"Confirm Match": "Stop Confirmation"}</ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                        handleNavigateToTeamSelection(contextMenu.match.day, contextMenu.match.datePlayed, contextMenu.match.id);
                        handleCloseContextMenu();
                    }}>
                        <ListItemIcon>
                            <EditIcon fontSize={"small"}></EditIcon>
                        </ListItemIcon>
                        <ListItemText>EditMatch</ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleUpdateMatchResult(contextMenu.match.id, 'TeamA');
                            handleCloseContextMenu();
                        }}
                    >
                        Mark Team A as Winner
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleUpdateMatchResult(contextMenu.match.id, 'TeamB');
                            handleCloseContextMenu();
                        }}
                    >
                        Mark Team B as Winner
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleDeleteMatch(contextMenu.match.id);
                            handleCloseContextMenu();
                        }}
                    >
                        <ListItemIcon>
                            <DeleteIcon fontSize={"small"}></DeleteIcon>
                        </ListItemIcon>
                        <ListItemText>Delete Match</ListItemText>
                    </MenuItem>
                </Menu>
            )}
        </div>
    );
};

export default MatchesGrid;
