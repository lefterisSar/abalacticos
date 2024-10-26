import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
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
    const [playerSlots, setPlayerSlots] = useState([]); // Array of { player, isAutoFilled }
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
            setPlayerSlots([]);
            setQueueList([]);
        }
    }, [dateTime]);

    // Update player slots when numberOfPlayers changes
    useEffect(() => {
        const totalPlayers = parseInt(numberOfPlayers) || 0;
        setPlayerSlots((prevSlots) => {
            const newSlots = [...prevSlots];
            // Add empty slots if needed
            while (newSlots.length < totalPlayers) {
                newSlots.push(null);
            }
            // Remove extra slots if needed
            while (newSlots.length > totalPlayers) {
                newSlots.pop();
            }
            return newSlots;
        });

        // Adjust queue list if necessary
        if (queueList.length > 0 && playerSlots.filter(slot => slot && slot.player).length < totalPlayers) {
            // Move players from queue to slots if slots are available
            const updatedSlots = [...playerSlots];
            let slotIndex = 0;
            for (let i = 0; i < updatedSlots.length; i++) {
                if (!updatedSlots[i] || !updatedSlots[i].player) {
                    if (slotIndex < queueList.length) {
                        updatedSlots[i] = { player: queueList[slotIndex], isAutoFilled: false };
                        slotIndex++;
                    }
                }
            }
            setPlayerSlots(updatedSlots);
            setQueueList(queueList.slice(slotIndex));
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
            const formattedDate = dayjs(selectedDateTime).format('YYYY-MM-DD');
            const response = await axios.get('http://localhost:8080/api/users/available', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params: {
                    date: formattedDate,
                },
            });

            const players = response.data; // Assuming this is an array of AbalacticosUserDTO
            setAvailablePlayers(players);
            setPlayerSlots([]); // Reset player slots on new dateTime
            setQueueList([]);
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

    // Function to add a player to the next available slot
    const addPlayerToSlot = (player) => {
        const totalPlayers = parseInt(numberOfPlayers) || 0;

        if (playerSlots.filter(slot => slot && slot.player).length >= totalPlayers) {
            // Add to queue if slots are full
            addPlayerToQueue(player);
            return;
        }

        // Check if player is already selected
        if (playerSlots.some((slot) => slot && slot.player && slot.player.id === player.id)) {
            setError('Player already selected.');
            return;
        }

        // Find the first empty slot
        const slotIndex = playerSlots.findIndex((slot) => !slot || !slot.player);
        if (slotIndex !== -1) {
            const updatedSlots = [...playerSlots];
            updatedSlots[slotIndex] = { player: player, isAutoFilled: false };
            setPlayerSlots(updatedSlots);
            setMessage('');
            setError('');
        } else {
            // No empty slots, add to queue
            addPlayerToQueue(player);
        }
    };

    // Function to add a player to the queue
    const addPlayerToQueue = (player) => {
        // Check if player is already in the queue or slots
        if (
            queueList.some((p) => p.id === player.id) ||
            playerSlots.some((slot) => slot && slot.player && slot.player.id === player.id)
        ) {
            setError('Player already selected or in queue.');
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

    // Function to handle changes in player slots (manual entry)
    const handlePlayerSlotChange = (event, index) => {
        const value = event.target.value;
        const updatedSlots = [...playerSlots];
        updatedSlots[index] = { player: value, isAutoFilled: false };
        setPlayerSlots(updatedSlots);
    };

    // Function to remove a player from a slot
    const removePlayerFromSlot = (index) => {
        const updatedSlots = [...playerSlots];
        updatedSlots[index] = null;
        setPlayerSlots(updatedSlots);
        setMessage('');
        setError('');
    };

    // Function to handle Auto-Fill
    const handleAutoFill = async () => {
        const token = getToken();
        if (!token) {
            return; // Early exit if token is not present
        }

        try {
            setLoading(true);
            const formattedDate = dayjs(dateTime).format('YYYY-MM-DD');
            const response = await axios.get('http://localhost:8080/api/users/available', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params: {
                    date: formattedDate,
                },
            });

            const players = response.data;

            // Filter out already selected players
            const availableToAutoFill = players.filter(
                (player) =>
                    !playerSlots.some((slot) => slot && slot.player && slot.player.id === player.id) &&
                    !queueList.some((p) => p.id === player.id)
            );

            // Calculate remaining slots
            const remainingSlots = playerSlots.filter((slot) => !slot || !slot.player).length;

            if (availableToAutoFill.length < remainingSlots) {
                setMessage(`Only ${availableToAutoFill.length} players available to auto-fill. ${remainingSlots - availableToAutoFill.length} slots remain.`);
            }

            // Shuffle and select players
            const shuffled = availableToAutoFill.sort(() => 0.5 - Math.random());
            const playersToAdd = shuffled.slice(0, remainingSlots);

            // Fill the empty slots
            const updatedSlots = [...playerSlots];
            let slotIndex = 0;
            for (let i = 0; i < updatedSlots.length; i++) {
                if (!updatedSlots[i] || !updatedSlots[i].player) {
                    if (slotIndex < playersToAdd.length) {
                        updatedSlots[i] = { player: playersToAdd[slotIndex], isAutoFilled: true };
                        slotIndex++;
                    }
                }
            }

            setPlayerSlots(updatedSlots);

            // If there are still remaining players, add them to the queue
            const remainingPlayers = shuffled.slice(playersToAdd.length);
            if (remainingPlayers.length > 0) {
                setQueueList((prev) => [...prev, ...remainingPlayers]);
            }

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
        if (isNaN(totalPlayers)) {
            setError('Number of players must be a number.');
            setMessage('');
            return;
        }

        // Define manualFillPlayers and autoFillPlayers
        const manualFillPlayers = playerSlots.filter(slot => slot && slot.player && !slot.isAutoFilled);
        const autoFillPlayers = playerSlots.filter(slot => slot && slot.player && slot.isAutoFilled);

        const manualFillPlayersCount = manualFillPlayers.length;
        const autoFillPlayersCount = autoFillPlayers.length;
        const missingSlots = totalPlayers - (manualFillPlayersCount + autoFillPlayersCount);

        if (missingSlots > 0) {
            setMessage(`You have ${missingSlots} free slot(s) remaining.`);
            // Do not prevent submission
        }

        setLoading(true);
        setError('');
        setMessage('');

        const token = getToken();
        if (!token) {
            return; // Early exit if token is not present
        }

        // Collect IDs
        // Collect IDs, including players with missing 'id' properties for manualPlayerIds
        const manualPlayerIds = manualFillPlayers
            .map(slot => slot.player && slot.player.id ? slot.player.id : null)
            .filter(id => id !== null);

        const unregisteredPlayerNames = manualFillPlayers
            .filter(slot => typeof slot.player === 'string')
            .map(slot => slot.player);

        const autoFillPlayerIds = autoFillPlayers
            .filter(slot => typeof slot.player === 'object' && slot.player.id)
            .map(slot => slot.player.id);

        const queuePlayerIds = queueList.map((p) => p.id);

        const formationData = {
            dateTime: dayjs(dateTime).format('YYYY-MM-DDTHH:mm'),
            numberOfPlayers: totalPlayers,
            manualPlayerIds: manualPlayerIds,
            autoFillPlayerIds: autoFillPlayerIds,
            unregisteredPlayerNames: unregisteredPlayerNames,
            queuePlayerIds: queuePlayerIds,
            manualFillPlayersCount: manualFillPlayersCount,
            autoFillPlayersCount: autoFillPlayersCount,
            missingSlots: missingSlots,
            // You can include other necessary fields here
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
    const handleFilterPlayerSelect = (player) => {
        addPlayerToSlot(player);
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
            const formattedDate = dayjs(dateTime).format('YYYY-MM-DD');

            switch (filterType) {
                case 'all':
                    endpoint = `http://localhost:8080/api/users/search?query=${query}`;
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
                                            <Button variant="outlined" size="small" onClick={() => addPlayerToSlot(player)}>
                                                Add
                                            </Button>
                                        </div>
                                    ))
                            ) : (
                                <Typography variant="body2">No available players found.</Typography>
                            )}
                        </div>
                    </Grid>

                    {/* Box 3: Player Slots */}
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
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleAutoFill}
                            disabled={playerSlots.filter(slot => slot && slot.player).length >= parseInt(numberOfPlayers)}
                            style={{ marginBottom: '1rem' }}
                        >
                            Auto-Fill Remaining Slots
                        </Button>
                        {playerSlots.map((slot, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                <Autocomplete
                                    options={availablePlayers}
                                    getOptionLabel={(option) => {
                                        if (typeof option === 'string') {
                                            return option;
                                        }
                                        return option && option.name && option.surname ? `${option.name} ${option.surname}` : '';
                                    }}
                                    value={slot && slot.player ? slot.player : ''}
                                    onChange={(event, newValue) => {
                                        const updatedSlots = [...playerSlots];
                                        updatedSlots[index] = { player: newValue, isAutoFilled: slot ? slot.isAutoFilled : false };
                                        setPlayerSlots(updatedSlots);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={`Player ${index + 1}`}
                                            fullWidth
                                            onChange={(event) => handlePlayerSlotChange(event, index)}
                                            style={{ minWidth: '300px' }} // Adjust the size here
                                        />
                                    )}
                                    freeSolo
                                    style={{ flexGrow: 1 }}
                                />
                                {slot && slot.player && (
                                    <IconButton edge="end" aria-label="remove" onClick={() => removePlayerFromSlot(index)}>
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                )}
                            </div>
                        ))}
                    </Grid>

                    {/* Box 4: Queue List */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Queue List</Typography>
                        <Autocomplete
                            options={availablePlayers}
                            getOptionLabel={(option) => {
                                if (typeof option === 'string') {
                                    return option; // Unregistered player's name
                                }
                                return option && option.name && option.surname ? `${option.name} ${option.surname}` : '';
                            }}
                            onChange={(event, value) => value && addPlayerToQueue(value)}
                            renderInput={(params) => <TextField {...params} label="Add to Queue" variant="outlined" />}
                            disabled={!dateTime}
                        />
                        <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '1rem' }}>
                            {queueList.map((player, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <Typography variant="body1">
                                        {`${player.name} ${player.surname} (${player.username})`}
                                    </Typography>
                                    <IconButton edge="end" aria-label="remove" onClick={() => removePlayerFromQueue(player.id)}>
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                    </Grid>

                    {/* Box 5: Filter Choices */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Filter Choices</Typography>
                        {/* Repeat Accordion for each filterType */}
                        {['all', 'injured', 'absent', 'banned'].map((filterType) => (
                            <Accordion key={filterType} expanded={expandedFilters[filterType]} onChange={handleAccordionChange(filterType)}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>{`${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Players`}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TextField
                                        label={`Search ${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Players`}
                                        value={searchFilters[filterType]}
                                        onChange={(e) => {
                                            handleFilterPlayerSearch(filterType, e.target.value);
                                            handleFilterSearch(filterType, e.target.value);
                                        }}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {filterData[filterType].length > 0 ? (
                                            filterData[filterType]
                                                .filter((player) =>
                                                    `${player.name} ${player.surname}`.toLowerCase().includes(searchFilters[filterType].toLowerCase())
                                                )
                                                .map((player) => (
                                                    <div key={player.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body1">
                                                            {`${player.name} ${player.surname} (${player.username})`}
                                                        </Typography>
                                                        <IconButton edge="end" aria-label="add" onClick={() => handleFilterPlayerSelect(player)}>
                                                            <AddCircleOutlineIcon />
                                                        </IconButton>
                                                    </div>
                                                ))
                                        ) : (
                                            <Typography variant="body2">No {filterType} players found.</Typography>
                                        )}
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        ))}
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
};

export default CreateFormationForm;

