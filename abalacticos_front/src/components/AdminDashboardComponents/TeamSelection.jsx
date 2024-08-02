import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';

const TeamSelection = () => {
    const [players, setPlayers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [teamA, setTeamA] = useState([]);
    const [teamB, setTeamB] = useState([]);
    const navigate = useNavigate();
    const { day } = useParams();

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
    const filteredPlayers = players.filter(player => player.availability.includes(day));

    const handleAddToTeam = (team, setTeam, player) => {
        if (team.length >= 8) {
            alert(`Team ${team === teamA ? 'A' : 'B'} is full!`);
            return;
        }
        setTeam([...team, player]);
    };

    const handleRemoveFromTeam = (team, setTeam, player) => {
        setTeam(team.filter(p => p.id !== player.id));
    };

    const columns = [
        { field: 'username', headerName: 'Username', flex: 1 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'surname', headerName: 'Surname', flex: 1 },
        { field: 'wins', headerName: 'Wins', flex: 1 },
        { field: 'losses', headerName: 'Losses', flex: 1 },
        { field: 'draws', headerName: 'Draws', flex: 1 },
        { field: 'age', headerName: 'Age', flex: 1 },
        { field: 'debutDate', headerName: 'Debut Date', flex: 1 },
        { field: 'lastGK', headerName: 'Last GK Date', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => (
                <div>
                    {teamA.some(player => player.id === params.row.id) ? (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleRemoveFromTeam(teamA, setTeamA, params.row)}
                        >
                            Remove from Team A
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleAddToTeam(teamA, setTeamA, params.row)}
                            disabled={teamB.some(player => player.id === params.row.id)}
                        >
                            Add to Team A
                        </Button>
                    )}
                    {teamB.some(player => player.id === params.row.id) ? (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleRemoveFromTeam(teamB, setTeamB, params.row)}
                        >
                            Remove from Team B
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleAddToTeam(teamB, setTeamB, params.row)}
                            disabled={teamA.some(player => player.id === params.row.id)}
                        >
                            Add to Team B
                        </Button>
                    )}
                </div>
            ),
        }
    ];

    const teamPositions = ['GK', 'DL', 'DC', 'DR', 'ML', 'MC', 'MR', 'FC'];

    const renderTeam = (team) => (
        <ul style={{padding: '0 20px'}}>
            {teamPositions.map((position, index) => (
            <li key={index}>{position}: {team[index] ? `${team[index].name} ${team[index].surname}` : 'N/A'}</li>
        ))}
        </ul>
    );

    return (
        <div>
            <h2 style={{display:'flex', justifyContent: 'center'}}>{day} Team Selection</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div>
                    <h3>Team A</h3>
                    {renderTeam(teamA)}
                </div>
                <div>
                    <h3>Team B</h3>
                    {renderTeam(teamB)}
                </div>
            </div>
            <div style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
                <DataGrid
                    rows={filteredPlayers}
                    columns={columns}
                    autoHeight
                />
            </div>
            );
        </div>
    );
};

export default TeamSelection;
