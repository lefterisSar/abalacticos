import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button, styled } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Calculator from '@mui/icons-material/QueryStats';
import { format, addDays, nextDay } from 'date-fns';

const CustomDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .MuiDataGrid-columnHeaderTitleContainer': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
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
        fontWeight: 'bold',
    },
}));

const teamPositions = ['GK', 'DL', 'DC', 'DR', 'ML', 'MC', 'MR', 'FC'];

const renderTeam = (team) => (
    <ul style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {teamPositions.map((position, index) => (
            <li key={index} style={{ listStyleType: 'none', padding: '5px 0' }}>
                {position}: {team[index] ? `${team[index].name} ${team[index].surname} (${team[index].status})` : 'N/A'}
            </li>
        ))}
    </ul>
);

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
    const location = useLocation(); // New addition to get query parameters
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
    const [nextMatchDate, setNextMatchDate] = useState(new Date());
    const userId = localStorage.getItem('userName');
    const [channelId, setChannelId] = useState('');

    const fetchChannelId = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/config/channelId?message=${encodeURIComponent(day)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const id = await response.text();
                setChannelId(id);
            } else {
                console.error('Failed to fetch channel ID');
            }
        } catch (error) {
            console.error('Error fetching channel ID:', error);
        }
    };

    fetchChannelId();

    const sendDiscordMessage = async (teamA, teamB) => {
        const formatTeam = (team, teamName) => {
            return `${teamName}:\n${team.map((player, index) => {
                const mention = player.discordID ? `<@${player.discordID}>` : `${player.name} ${player.surname}`;
                return `${teamPositions[index]}: ${mention}`;
            }).join('\n')}`;
        };

        const teamAMessage = formatTeam(teamA, 'Team A');
        const teamBMessage = formatTeam(teamB, 'Team B');

        // Format the match date
        const matchDate = format(nextMatchDate, 'MMMM do, yyyy'); // e.g., August 10th, 2024

        const fullMessage = `Teams for ${day} (${matchDate}) have been confirmed!\n\n${teamAMessage}\n\n${teamBMessage}`;


        const url = `http://localhost:8080/api/discord/${channelId}/send`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: fullMessage }),
        });

        if (!response.ok) {
            console.error('Failed to send message');
        }
    };

    const handleConfirmTeams = async () => {
        const formatTeamForBackend = (team) => {
            return team.map(player => ({
                [player.id]: "TBD"  // Default status when confirming teams
            }));
        };
        const match = {
            day,
            datePlayed: nextMatchDate.toISOString(),
            teamA: formatTeamForBackend(teamA),
            teamB: formatTeamForBackend(teamB),
        };

        try {
            const token = localStorage.getItem('authToken');

            // Call the confirmTeamsAndNotifyPlayers endpoint
            await axios.post('http://localhost:8080/api/matches/confirm', match, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // After confirmation, update the frontend state
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

            const updatedTeamA = incrementDayAppearances(teamA);
            const updatedTeamB = incrementDayAppearances(teamB);

            setTeamA(updatedTeamA);
            setTeamB(updatedTeamB);

            // Update players with the new appearances
            setPlayers(players.map(player => {
                const updatedPlayerA = updatedTeamA.find(p => p.id === player.id);
                const updatedPlayerB = updatedTeamB.find(p => p.id === player.id);
                if (updatedPlayerA) return updatedPlayerA;
                if (updatedPlayerB) return updatedPlayerB;
                return player;
            }));

            // Update lastGK date for players in GK position (assuming the first player is the GK)
            if (teamA.length > 0) {
                setPlayers(prevPlayers => prevPlayers.map(player => player.id === teamA[0].id ? { ...player, lastGK: new Date().toISOString().split('T')[0] } : player));
            }
            if (teamB.length > 0) {
                setPlayers(prevPlayers => prevPlayers.map(player => player.id === teamB[0].id ? { ...player, lastGK: new Date().toISOString().split('T')[0] } : player));
            }

            alert('Teams confirmed, players notified, and match saved successfully!');
            updateNextMatchDate();
            await sendDiscordMessage(updatedTeamA, updatedTeamB);
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

    const fetchMatch = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No auth token found');
            navigate('/login');
            return;
        }

        const params = new URLSearchParams(location.search); // Get query parameters
        const dateFromParams = params.get('date');
        const matchId = params.get('matchId'); // Get matchId from query params

        try {
            const response = await axios.get('http://localhost:8080/api/matches/byDayDateAndId', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: { day, datePlayed: dateFromParams || nextMatchDate.toISOString().split('T')[0], matchId }
            });

            if (response.status === 200 && response.data) {
                const match = response.data;
                setNextMatchDate(new Date(match.datePlayed)); // Fix the date based on the match

                // Fetch player details for Team A
                const teamAPlayerDetails = await Promise.all(Object.values(match.teamA).map(playerObj =>
                    axios.get(`http://localhost:8080/api/users/${Object.keys(playerObj)[0]}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then(res => ({
                        ...res.data,
                        status: playerObj[Object.keys(playerObj)[0]]  // Add the availability status
                    }))
                ));

                // Fetch player details for Team B
                const teamBPlayerDetails = await Promise.all(Object.values(match.teamB).map(playerObj =>
                    axios.get(`http://localhost:8080/api/users/${Object.keys(playerObj)[0]}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then(res => ({
                        ...res.data,
                        status: playerObj[Object.keys(playerObj)[0]]  // Add the availability status
                    }))
                ));

                setTeamA(teamAPlayerDetails);
                setTeamB(teamBPlayerDetails);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                const errorData = error.response.data;
                if (errorData && errorData.type === "NO_MATCH_FOUND") {
                    console.log("No match found, using next match date.");
                    setTeamA([]); // Explicitly set teams to empty if no match found
                    setTeamB([]);
                    setNextMatchDate(dateFromParams ? new Date(dateFromParams) : getNextMatchDate(day));
                } else {
                    console.error('Unexpected error fetching match:', error);
                    navigate('/error');
                }
            } else {
                console.error('Error fetching match:', error);
                navigate('/error');
            }
        }
    };


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
                    discordUserId: player.discordUserId // Ensure discordUserId is included
                }));

                setPlayers(playersWithId);
                await fetchMatch(); // Fetch the match after loading players
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

    useEffect(() => {
        fetchPlayers();
    }, [navigate, userId, day]);

    const getNextMatchDate = (dayOfWeek) => {
        const today = new Date();
        const currentDay = today.getDay(); // Sunday - Saturday: 0 - 6
        let matchDay;

        switch (dayOfWeek) {
            case "Tuesday":
                matchDay = 2;
                break;
            case "Wednesday":
                matchDay = 3;
                break;
            case "Friday":
                matchDay = 5;
                break;
            default:
                return today;
        }
        // If today is the match day, set the match date to today
        if (currentDay === matchDay) {
            return today;
        } else if (currentDay > matchDay) {
            // If the current day is past the match day, schedule for next week
            return addDays(nextDay(today, matchDay), 7);
        } else {
            // Otherwise, schedule for this week
            return nextDay(today, matchDay);
        }
    };

    const updateNextMatchDate = () => {
        setNextMatchDate(getNextMatchDate(day));
    };

    let filteredPlayers = players.filter(player => player.availability.includes(day));
    filteredPlayers = filteredPlayers.filter(player => !player.absentDates.includes(nextMatchDate.toISOString().split('T')[0]));

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
        { field: 'lastGK', headerName: 'Last GK Date', flex: 1, renderCell: (params) => <span style={{ whiteSpace: 'nowrap' }}>{params.value}</span> },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => {
                const player = params.row;
                if (!player || !player.id) {
                    return <span>Loading...</span>; // Or you can return a placeholder, e.g., <span>Loading...</span>
                }
                return (
                    <div>
                        {teamA && teamA.some(p => p && p.id === player.id) ? (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleRemoveFromTeam(teamA, setTeamA, player)}
                            >
                                Remove from Team A
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleAddToTeam(teamA, setTeamA, player)}
                                disabled={teamA && teamA.some(p => p && p.id === player.id)}
                            >
                                Add to Team A
                            </Button>
                        )}
                        {teamB && teamB.some(p => p && p.id === player.id) ? (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleRemoveFromTeam(teamB, setTeamB, player)}
                            >
                                Remove from Team B
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleAddToTeam(teamB, setTeamB, player)}
                                disabled={teamB && teamB.some(p => p && p.id === player.id)}
                            >
                                Add to Team B
                            </Button>
                        )}
                    </div>
                );
            }
        },
        { field: 'wins', headerName: 'Wins', flex: 1,renderCell: (params) => <span style={{ whiteSpace: 'nowrap' }}>{params.value}</span>},
        { field: 'losses', headerName: 'Losses', flex: 1, renderCell: (params) => <span style={{ whiteSpace: 'nowrap' }}>{params.value}</span>},
        { field: 'draws', headerName: 'Draws', flex: 1, renderCell: (params) => <span style={{ whiteSpace: 'nowrap' }}>{params.value}</span>},
    ];

    return (
        <div>
            <h2 style={{ display: 'flex', justifyContent: 'center' }}>{day} Team Selection for {format(nextMatchDate, 'MMMM do, yyyy')}</h2>
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
                            children: [{ field: 'wins' }, { field: 'losses' }, { field: 'draws' }],
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
