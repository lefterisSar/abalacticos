import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Checkbox,
    FormControlLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Autocomplete,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const CreateFormationForm = () => {
    const [dateTime, setDateTime] = useState(null);
    const [numberOfPlayers, setNumberOfPlayers] = useState('');
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]); // Array of player objects
    const [queueList, setQueueList] = useState([]); // Array of player objects
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [filterData, setFilterData] = useState({
        all: [],
        injured: [],
        absent: [],
        banned: [],
    });
    const [expandedFilters, setExpandedFilters] = useState({
        all: false,
        injured: false,
        absent: false,
        banned: false,
    });
    const [searchFilters, setSearchFilters] = useState({
        all: '',
        injured: '',
        absent: '',
        banned: '',
    });

    const navigate = useNavigate();

    // Function to get the token
    const getToken = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return null;
        }
        return token;
    };

    // Fetch available players when dateTime changes
    useEffect(() => {
        if (dateTime) {
            fetchAvailablePlayers(dateTime);
        } else {
            setAvailablePlayers([]);
            setSelectedPlayers([]);
            setQueueList([]);
        }
    }, [dateTime]);

    // Update player slots when numberOfPlayers changes
    useEffect(() => {
        const totalPlayers = parseInt(numberOfPlayers) || 0;
        // If selectedPlayers exceed the new number, trim the list
        if (selectedPlayers.length > totalPlayers) {
            setSelectedPlayers(selectedPlayers.slice(0, totalPlayers));
        }
    }, [numberOfPlayers]);

    // Function to fetch available players based on selected dateTime
    const fetchAvailablePlayers = async (selectedDateTime) => {
        const token = getToken();
        if (!token) {
            return; // Early exit if token is not present
        }

        try {
            setLoading(true);
            const formattedDateTime = dayjs(selectedDateTime).format('YYYY-MM-DDTHH:mm');
            const response = await axios.get('http://localhost:8080/api/formations/available-players', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params: {
                    dateTime: formattedDateTime,
                },
            });

            const players = response.data; // Assuming this is an array of AbalacticosUserDTO
            setAvailablePlayers(players);
            setSelectedPlayers([]); // Reset selected players on new dateTime
            setQueueList([]); // Reset queue list on new dateTime
            setMessage('');
            setError('');
        } catch (err) {
            console.error('Error fetching available players:', err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            } else {
                setError('Error fetching available players.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch players based on filter choices
    const fetchFilteredPlayers = async (filterType) => {
        const token = getToken();
        if (!token) {
            return; // Early exit if token is not present
        }

        try {
            setLoading(true);
            let endpoint = '';
            const formattedDate = dayjs(dateTime).format('YYYY-MM-DD');

            switch (filterType) {
                case 'all':
                    endpoint = 'http://localhost:8080/api/users/all';
                    break;
                case 'injured':
                    endpoint = `http://localhost:8080/api/users/injured?date=${formattedDate}`;
                    break;
                case 'absent':
                    endpoint = `http://localhost:8080/api/users/absent?date=${formattedDate}`;
                    break;
                case 'banned':
                    endpoint = `http://localhost:8080/api/users/banned?date=${formattedDate}`;
                    break;
                default:
                    return;
            }

            const response = await axios.get(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            setFilterData((prev) => ({
                ...prev,
                [filterType]: response.data,
            }));

            setMessage('');
            setError('');
        } catch (err) {
            console.error(`Error fetching ${filterType} players:`, err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            } else {
                setError(`Error fetching ${filterType} players.`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle accordion expansion to fetch data on expand
    const handleAccordionChange = (filterType) => (event, isExpanded) => {
        setExpandedFilters((prev) => ({
            ...prev,
            [filterType]: isExpanded,
        }));

        if (isExpanded && filterData[filterType].length === 0) {
            fetchFilteredPlayers(filterType);
        }
    };

    // Handle search within filters
    const handleFilterSearch = (filterType, value) => {
        setSearchFilters((prev) => ({
            ...prev,
            [filterType]: value,
        }));
    };

    // Function to add a player to selectedPlayers
    const addPlayerToSelected = (player) => {
        if (selectedPlayers.length >= parseInt(numberOfPlayers)) {
            setError('All player slots are filled.');
            return;
        }

        // Check if player is already selected
        if (selectedPlayers.some((p) => p.id === player.id)) {
            setError('Player already selected.');
            return;
        }

        setSelectedPlayers((prev) => [...prev, player]);
        setMessage('');
        setError('');
    };

    // Function to remove a player from selectedPlayers
    const removePlayerFromSelected = (playerId) => {
        setSelectedPlayers((prev) => prev.filter((player) => player.id !== playerId));
        setMessage('');
        setError('');
    };

    // Function to add a player to the queue
    const addPlayerToQueue = (player) => {
        // Check if player is already in the queue
        if (queueList.some((p) => p.id === player.id)) {
            setError('Player already in queue.');
            return;
        }

        setQueueList((prev) => [...prev, player]);
        setMessage('');
        setError('');
    };

    // Function to remove a player from the queue
    const removePlayerFromQueue = (playerId) => {
        setQueueList((prev) => prev.filter((player) => player.id !== playerId));
        setMessage('');
        setError('');
    };

    // Function to handle unregistered player names
    const handleUnregisteredPlayerNameChange = (e, index) => {
        const value = e.target.value;
        const updatedPlayers = [...selectedPlayers];
        updatedPlayers[index] = { ...updatedPlayers[index], name: value };
        setSelectedPlayers(updatedPlayers);
    };

    // Function to handle Auto-Fill
    const handleAutoFill = async () => {
        const token = getToken();
        if (!token) {
            return; // Early exit if token is not present
        }

        try {
            setLoading(true);
            const formattedDateTime = dayjs(dateTime).format('YYYY-MM-DDTHH:mm');
            const response = await axios.get('http://localhost:8080/api/formations/available-players', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params: {
                    dateTime: formattedDateTime,
                },
            });

            const players = response.data;

            // Filter out already selected players
            const availableToAutoFill = players.filter(
                (player) => !selectedPlayers.some((p) => p.id === player.id)
            );

            // Calculate remaining slots
            const remainingSlots = parseInt(numberOfPlayers) - selectedPlayers.length;

            if (availableToAutoFill.length < remainingSlots) {
                setMessage(`Only ${availableToAutoFill.length} players available to auto-fill. ${remainingSlots - availableToAutoFill.length} slots remain.`);
            }

            // Shuffle and select players
            const shuffled = availableToAutoFill.sort(() => 0.5 - Math.random());
            const playersToAdd = shuffled.slice(0, remainingSlots);

            setSelectedPlayers((prev) => [...prev, ...playersToAdd]);
            setMessage('Auto-filled remaining slots.');
            setError('');
        } catch (err) {
            console.error('Error during auto-fill:', err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            } else {
                setError('Error during auto-fill.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!dateTime || !numberOfPlayers) {
            setError('Please fill in all required fields.');
            setMessage('');
            return;
        }

        const totalPlayers = parseInt(numberOfPlayers);
        const filledSlots = selectedPlayers.length;

        if (filledSlots < totalPlayers) {
            setMessage(`You have ${totalPlayers - filledSlots} free slot(s) remaining.`);
        }

        setLoading(true);
        setError('');
        setMessage('');

        const token = getToken();
        if (!token) {
            return; // Early exit if token is not present
        }

        // Prepare data for submission
        const formationData = {
            dateTime: dayjs(dateTime).format('YYYY-MM-DDTHH:mm'),
            numberOfPlayers: totalPlayers,
            autoFillPlayersCount: selectedPlayers.length > 0 ? selectedPlayers.filter(p => p.isAutoFilled).length : 0,
            manualFillPlayersCount: selectedPlayers.length - (selectedPlayers.filter(p => p.isAutoFilled).length),
            manualPlayerIds: selectedPlayers.filter(p => !p.isAutoFilled && p.id).map(p => p.id),
            autoFillPlayerIds: selectedPlayers.filter(p => p.isAutoFilled && p.id).map(p => p.id),
            unregisteredPlayerNames: selectedPlayers.filter(p => !p.id && p.name).map(p => p.name),
        };

        try {
            const response = await axios.post('http://localhost:8080/api/formations/create', formationData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setMessage('Formation created successfully!');
            setError('');

            // Optionally, redirect to formations list or clear the form
            navigate('/formations');
        } catch (err) {
            console.error('Error creating formation:', err);
            if (err.response) {
                if (err.response.status === 401) {
                    navigate('/login');
                } else if (err.response.status === 400) {
                    // Display validation errors
                    const errorMessages = err.response.data;
                    const errorText = typeof errorMessages === 'string' ? errorMessages : Object.values(errorMessages).join(' ');
                    setError(errorText);
                } else {
                    setError(err.response.data.message || 'Error creating formation.');
                }
            } else {
                setError('Network error. Please try again later.');
            }
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle player selection from filter choices
    const handleFilterPlayerSelect = (filterType, player) => {
        addPlayerToSelected(player);
    };

    // Function to handle player search within filters
    const handleFilterPlayerSearch = async (filterType, query) => {
        const token = getToken();
        if (!token) {
            return;
        }

        try {
            setLoading(true);
            let endpoint = '';

            switch (filterType) {
                case 'all':
                    endpoint = `http://localhost:8080/api/users/search?query=${query}`;
                    break;
                case 'injured':
                    endpoint = `http://localhost:8080/api/users/injured?date=${dayjs(dateTime).format('YYYY-MM-DD')}`;
                    break;
                case 'absent':
                    endpoint = `http://localhost:8080/api/users/absent?date=${dayjs(dateTime).format('YYYY-MM-DD')}`;
                    break;
                case 'banned':
                    endpoint = `http://localhost:8080/api/users/banned?date=${dayjs(dateTime).format('YYYY-MM-DD')}`;
                    break;
                default:
                    return;
            }

            const response = await axios.get(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            let players = response.data;

            if (filterType === 'all' && query) {
                players = players.filter((player) =>
                    `${player.name} ${player.surname}`.toLowerCase().includes(query.toLowerCase())
                );
            }

            setFilterData((prev) => ({
                ...prev,
                [filterType]: players,
            }));

            setMessage('');
            setError('');
        } catch (err) {
            console.error(`Error searching ${filterType} players:`, err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            } else {
                setError(`Error searching ${filterType} players.`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} style={{ padding: '2rem', maxWidth: '1200px', margin: '2rem auto' }}>
            <Typography variant="h5" gutterBottom>
                Create Formation
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Box 1: Date and Time Picker */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Select Date and Time</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Formation Date and Time"
                                value={dateTime}
                                onChange={(newDateTime) => setDateTime(newDateTime)}
                                renderInput={(params) => <TextField {...params} fullWidth required />}
                                disablePast
                            />
                        </LocalizationProvider>
                    </Grid>

                    {/* Box 2: Available Players List */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Available Players</Typography>
                        <TextField
                            label="Search Available Players"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', padding: '0.5rem' }}>
                            {availablePlayers.length > 0 ? (
                                availablePlayers
                                    .filter((player) =>
                                        `${player.name} ${player.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((player) => (
                                        <div key={player.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <Typography variant="body1">
                                                {`${player.name} ${player.surname} (${player.username})`}
                                            </Typography>
                                            <Button variant="outlined" size="small" onClick={() => addPlayerToSelected(player)}>
                                                Add
                                            </Button>
                                        </div>
                                    ))
                            ) : (
                                <Typography variant="body2">No available players found.</Typography>
                            )}
                        </div>
                    </Grid>

                    {/* Box 3: Player Selection and Queue Management */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Player Selection</Typography>
                        <TextField
                            label="Number of Players"
                            type="number"
                            value={numberOfPlayers}
                            onChange={(e) => setNumberOfPlayers(e.target.value)}
                            fullWidth
                            required
                            inputProps={{ min: 1 }}
                            margin="normal"
                        />
                        <Button variant="contained" color="secondary" onClick={handleAutoFill} disabled={selectedPlayers.length >= parseInt(numberOfPlayers)}>
                            Auto-Fill Remaining Slots
                        </Button>
                        <List>
                            {selectedPlayers.map((player, index) => (
                                <ListItem key={index} secondaryAction={
                                    <IconButton edge="end" aria-label="remove" onClick={() => removePlayerFromSelected(player.id)}>
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                }>
                                    <ListItemText
                                        primary={player.id ? `${player.name} ${player.surname} (${player.username})` : `Unregistered: ${player.name}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Typography variant="h6" style={{ marginTop: '1rem' }}>Queue List</Typography>
                        <Autocomplete
                            options={availablePlayers}
                            getOptionLabel={(option) => `${option.name} ${option.surname} (${option.username})`}
                            onChange={(event, value) => value && addPlayerToQueue(value)}
                            renderInput={(params) => <TextField {...params} label="Add to Queue" variant="outlined" />}
                            disabled={!dateTime}
                        />
                        <List>
                            {queueList.map((player, index) => (
                                <ListItem key={index} secondaryAction={
                                    <IconButton edge="end" aria-label="remove" onClick={() => removePlayerFromQueue(player.id)}>
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                }>
                                    <ListItemText
                                        primary={`${player.name} ${player.surname} (${player.username})`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>

                    {/* Box 4: Filter Choices */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Filter Choices</Typography>
                        <Accordion expanded={expandedFilters.all} onChange={handleAccordionChange('all')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>All Players</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TextField
                                    label="Search All Players"
                                    value={searchFilters.all}
                                    onChange={(e) => {
                                        handleFilterPlayerSearch('all', e.target.value);
                                        handleFilterSearch('all', e.target.value);
                                    }}
                                    fullWidth
                                    margin="normal"
                                />
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {filterData.all.length > 0 ? (
                                        filterData.all
                                            .filter((player) =>
                                                `${player.name} ${player.surname}`.toLowerCase().includes(searchFilters.all.toLowerCase())
                                            )
                                            .map((player) => (
                                                <ListItem
                                                    key={player.id}
                                                    secondaryAction={
                                                        <IconButton edge="end" aria-label="add" onClick={() => handleFilterPlayerSelect('all', player)}>
                                                            <AddCircleOutlineIcon />
                                                        </IconButton>
                                                    }
                                                >
                                                    <ListItemText primary={`${player.name} ${player.surname} (${player.username})`} />
                                                </ListItem>
                                            ))
                                    ) : (
                                        <Typography variant="body2">No players found.</Typography>
                                    )}
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={expandedFilters.injured} onChange={handleAccordionChange('injured')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Injured Players</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TextField
                                    label="Search Injured Players"
                                    value={searchFilters.injured}
                                    onChange={(e) => {
                                        handleFilterPlayerSearch('injured', e.target.value);
                                        handleFilterSearch('injured', e.target.value);
                                    }}
                                    fullWidth
                                    margin="normal"
                                />
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {filterData.injured.length > 0 ? (
                                        filterData.injured
                                            .filter((player) =>
                                                `${player.name} ${player.surname}`.toLowerCase().includes(searchFilters.injured.toLowerCase())
                                            )
                                            .map((player) => (
                                                <ListItem
                                                    key={player.id}
                                                    secondaryAction={
                                                        <IconButton edge="end" aria-label="add" onClick={() => handleFilterPlayerSelect('injured', player)}>
                                                            <AddCircleOutlineIcon />
                                                        </IconButton>
                                                    }
                                                >
                                                    <ListItemText primary={`${player.name} ${player.surname} (${player.username})`} />
                                                </ListItem>
                                            ))
                                    ) : (
                                        <Typography variant="body2">No injured players found.</Typography>
                                    )}
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={expandedFilters.absent} onChange={handleAccordionChange('absent')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Absent Players</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TextField
                                    label="Search Absent Players"
                                    value={searchFilters.absent}
                                    onChange={(e) => {
                                        handleFilterPlayerSearch('absent', e.target.value);
                                        handleFilterSearch('absent', e.target.value);
                                    }}
                                    fullWidth
                                    margin="normal"
                                />
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {filterData.absent.length > 0 ? (
                                        filterData.absent
                                            .filter((player) =>
                                                `${player.name} ${player.surname}`.toLowerCase().includes(searchFilters.absent.toLowerCase())
                                            )
                                            .map((player) => (
                                                <ListItem
                                                    key={player.id}
                                                    secondaryAction={
                                                        <IconButton edge="end" aria-label="add" onClick={() => handleFilterPlayerSelect('absent', player)}>
                                                            <AddCircleOutlineIcon />
                                                        </IconButton>
                                                    }
                                                >
                                                    <ListItemText primary={`${player.name} ${player.surname} (${player.username})`} />
                                                </ListItem>
                                            ))
                                    ) : (
                                        <Typography variant="body2">No absent players found.</Typography>
                                    )}
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={expandedFilters.banned} onChange={handleAccordionChange('banned')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Banned Players</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TextField
                                    label="Search Banned Players"
                                    value={searchFilters.banned}
                                    onChange={(e) => {
                                        handleFilterPlayerSearch('banned', e.target.value);
                                        handleFilterSearch('banned', e.target.value);
                                    }}
                                    fullWidth
                                    margin="normal"
                                />
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {filterData.banned.length > 0 ? (
                                        filterData.banned
                                            .filter((player) =>
                                                `${player.name} ${player.surname}`.toLowerCase().includes(searchFilters.banned.toLowerCase())
                                            )
                                            .map((player) => (
                                                <ListItem
                                                    key={player.id}
                                                    secondaryAction={
                                                        <IconButton edge="end" aria-label="add" onClick={() => handleFilterPlayerSelect('banned', player)}>
                                                            <AddCircleOutlineIcon />
                                                        </IconButton>
                                                    }
                                                >
                                                    <ListItemText primary={`${player.name} ${player.surname} (${player.username})`} />
                                                </ListItem>
                                            ))
                                    ) : (
                                        <Typography variant="body2">No banned players found.</Typography>
                                    )}
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    {/* Messages */}
                    {error && (
                        <Grid item xs={12}>
                            <Typography color="error">{error}</Typography>
                        </Grid>
                    )}
                    {message && (
                        <Grid item xs={12}>
                            <Typography color="primary">{message}</Typography>
                        </Grid>
                    )}

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading || !dateTime || !numberOfPlayers}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={24} /> : 'Create Formation'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}

export default CreateFormationForm;
