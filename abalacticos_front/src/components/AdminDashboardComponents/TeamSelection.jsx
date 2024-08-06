import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, styled } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Calculator from '@mui/icons-material/QueryStats';

const CustomDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .MuiDataGrid-columnHeaderTitleContainer': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold', // Make headers bold
    },
    '& .MuiDataGrid-columnHeaderTitleContainerContent': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

const HeaderWithIconRoot = styled('div')(({ theme }) => ({
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& span': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        marginRight: theme.spacing(0.5),
        fontWeight: 'bold', // Make header group text bold
    },
}));

function HeaderWithIcon(props) {
    const { icon, ...params } = props;

    return (
        <HeaderWithIconRoot>
            <span>{params.headerName ?? params.groupId}</span> {icon}
        </HeaderWithIconRoot>
    );
}

const TeamSelection = () => {
    const [players, setPlayers] = useState([]);
    const [teamA, setTeamA] = useState([]);
    const [teamB, setTeamB] = useState([]);
    const navigate = useNavigate();
    const { day } = useParams();
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
    const userId = localStorage.getItem('userName'); // Assuming userId is stored in localStorage

    const handleConfirmTeams = async () => {
        const match = {
            day,
            date: new Date().toISOString(),
            teamA: teamA.map(player => player.id),
            teamB: teamB.map(player => player.id),
        };

        try {
            const token = localStorage.getItem('authToken');
            await axios.post('http://localhost:8080/api/users/matches', match, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Increment day-specific appearances for teamA and teamB in frontend state
            const incrementDayAppearances = (team) => {
                return team.map(player => {
                    switch (day) {
                        case "Tuesday":
                            return { ...player, tuesdayAppearances: player.tuesdayAppearances + 1 };
                        case "Wednesday":
                            return { ...player, wednesdayAppearances: player.wednesdayAppearances + 1 };
                        case "Friday":
                            return { ...player, fridayAppearances: player.fridayAppearances + 1 };
                        default:
                            return player;
                    }
                });
            };

            setTeamA(incrementDayAppearances(teamA));
            setTeamB(incrementDayAppearances(teamB));

            setPlayers(players.map(player => {
                if (teamA.some(p => p.id === player.id) || teamB.some(p => p.id === player.id)) {
                    switch (day) {
                        case "Tuesday":
                            return { ...player, tuesdayAppearances: player.tuesdayAppearances + 1 };
                        case "Wednesday":
                            return { ...player, wednesdayAppearances: player.wednesdayAppearances + 1 };
                        case "Friday":
                            return { ...player, fridayAppearances: player.fridayAppearances + 1 };
                        default:
                            return player;
                    }
                }
                return player;
            }));

            alert('Teams confirmed and match recorded!');
        } catch (error) {
            console.error('Error confirming teams:', error);
        }
    };

    const handleColumnVisibilityChange = (newModel) => {
        setColumnVisibilityModel(newModel);
        saveColumnVisibility(userId, newModel);
    };

    const saveColumnVisibility = (userId, visibilityModel) => {
        localStorage.setItem(`columnVisibility_${userId}`, JSON.stringify(visibilityModel));
    };

    const loadColumnVisibility = (userId) => {
        const savedModel = localStorage.getItem(`columnVisibility_${userId}`);
        return savedModel ? JSON.parse(savedModel) : {};
    };

    // Fetch players data
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
                        id: player.id || `${player.name}-${player.surname}-${player.age}`, // Fallback if no id field is present
                        availability: player.availability || [], // Ensure availability is an array
                    }));

                    // Filter players based on availability and sort by day-specific apps in descending order
                    const filteredPlayers = playersWithId.filter(player => player.availability.includes(day));
                    const sortedPlayers = filteredPlayers.sort((a, b) => {
                        switch (day) {
                            case "Tuesday":
                                return (b.tuesdayAppearances || 0) - (a.tuesdayAppearances || 0);
                            case "Wednesday":
                                return (b.wednesdayAppearances || 0) - (a.wednesdayAppearances || 0);
                            case "Friday":
                                return (b.fridayAppearances || 0) - (a.fridayAppearances || 0);
                            default:
                                return 0;
                        }
                    });

                    // Prepopulate teams
                    const prepopulatedTeamA = sortedPlayers.slice(0, 8);
                    const prepopulatedTeamB = sortedPlayers.slice(8, 16);

                    setPlayers(playersWithId);
                    setTeamA(prepopulatedTeamA);
                    setTeamB(prepopulatedTeamB);

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
        // Load column visibility preferences
        const savedVisibilityModel = loadColumnVisibility(userId);
        setColumnVisibilityModel(savedVisibilityModel);
        fetchPlayers();
    }, [navigate, userId]);

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
        { field: 'username', headerName: 'Username', flex: 1, renderCell: (params) => <span style={{ whiteSpace: 'nowrap' }}>{params.value}</span> },
        { field: 'name', headerName: 'Name', flex: 1, renderCell: (params) => <span style={{ whiteSpace: 'nowrap' }}>{params.value}</span> },
        { field: 'surname', headerName: 'Surname', flex: 1, renderCell: (params) => <span style={{ whiteSpace: 'nowrap' }}>{params.value}</span> },
        { field: 'age', headerName: 'Age', flex: 1, renderCell: (params) => <span style={{ whiteSpace: 'nowrap' }}>{params.value}</span> },
        { field: 'wins', headerName: 'Wins', flex: 1,renderCell: (params) => <span style={{ whiteSpace: 'nowrap' }}>{params.value}</span>},
        { field: 'losses', headerName: 'Losses', flex: 1, renderCell: (params) => <span style={{ whiteSpace: 'nowrap' }}>{params.value}</span>},
        { field: 'draws', headerName: 'Draws', flex: 1, renderCell: (params) => <span style={{ whiteSpace: 'nowrap' }}>{params.value}</span>},
        {
            field: 'daySpecificApps',
            headerName: `${day} Apps`,
            minWidth: 50,
            flex: 1,
            headerClassName: 'bold-header',
            valueGetter: (value, row) => {
                if (!row) return 0;
                switch (day) {
                    case "Tuesday":
                        return row.tuesdayAppearances || 0;
                    case "Wednesday":
                        return row.wednesdayAppearances || 0;
                    case "Friday":
                        return row.fridayAppearances || 0;
                    default:
                        return 0;
                }
            },
            renderCell: (params) => (
                <strong>{params.value}</strong>
            ),
        },
        { field: 'debutDate', headerName: 'Debut Date', flex: 1, renderCell: (params) => <span style={{ whiteSpace: 'nowrap' }}>{params.value}</span> },
        { field: 'lastGK', headerName: 'Last GK Date', flex: 1, renderCell: (params) => <span style={{ whiteSpace: 'nowrap' }}>{params.value}</span> },
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
        <ul style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {teamPositions.map((position, index) => (
                <li key={index} style={{ listStyleType: 'none', padding: '5px 0' }}>
                    {position}: {team[index] ? `${team[index].name} ${team[index].surname}` : 'N/A'}
                </li>
            ))}
        </ul>
    );

    return (
        <div>
            <h2 style={{ display: 'flex', justifyContent: 'center' }}>{day} Team Selection</h2>
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
            {localStorage.getItem('userRole') === "ADMIN" && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button variant="contained" color="primary" onClick={handleConfirmTeams} disabled={teamA.length === 0 && teamB.length === 0}>
                        Confirm Teams
                    </Button>
                </div>
            )}
            <div style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
                <CustomDataGrid
                    rows={filteredPlayers}
                    columns={columns}
                    autoHeight
                    columnVisibilityModel={columnVisibilityModel}
                    onColumnVisibilityModelChange={handleColumnVisibilityChange}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'daySpecificApps', sort: 'desc' }],
                        },
                    }}
                    columnGroupingModel={[
                        {
                            groupId: 'Basic Info',
                            children: [{ field: 'name' }, { field: 'surname' }, { field: 'age' }],
                            description: 'Basic information about the player',
                            renderHeaderGroup: (params) => (
                                <HeaderWithIcon {...params} icon={<PersonIcon fontSize="small" />} />
                            ),
                        },
                        {
                            groupId: 'stats',
                            children: [{ field: 'wins' }, { field: 'losses' }, { field: 'draws' }, { field: 'daySpecificApps' }],
                            renderHeaderGroup: (params) => (
                                <HeaderWithIcon {...params} icon={<Calculator fontSize="small" />} />
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default TeamSelection;
