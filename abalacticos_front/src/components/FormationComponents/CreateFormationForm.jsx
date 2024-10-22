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
} from '@mui/material';
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
    const [absentPlayers, setAbsentPlayers] = useState([]);
    const [playerSlots, setPlayerSlots] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
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
            setAbsentPlayers([]);
            setPlayerSlots([]);
        }
    }, [dateTime]);

    // Update player slots when numberOfPlayers changes
    useEffect(() => {
        const totalPlayers = parseInt(numberOfPlayers) || 0;
        const slots = Array(totalPlayers).fill(null);
        setPlayerSlots(slots);
    }, [numberOfPlayers]);

    const fetchAvailablePlayers = async (selectedDateTime) => {
        const token = getToken();
        if (!token) {
            return; // Early exit if token is not present
        }

        try {
            const response = await axios.get('http://localhost:8080/api/formations/available-players', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params: {
                    dateTime: dayjs(selectedDateTime).format('YYYY-MM-DDTHH:mm'),
                },
            });
            const players = response.data;
            // Assuming 'isAbsent' is a field in the player data
            const available = players.filter((player) => !player.isAbsent);
            const absent = players.filter((player) => player.isAbsent);
            setAvailablePlayers(available);
            setAbsentPlayers(absent);
        } catch (err) {
            console.error('Error fetching available players:', err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            } else {
                setError('Error fetching available players.');
            }
        }
    };

    const handlePlayerSlotChange = (e, index) => {
        const value = e.target.value;
        const updatedSlots = [...playerSlots];
        updatedSlots[index] = value ? { name: value } : null; // For unregistered players
        setPlayerSlots(updatedSlots);
    };

    const addPlayerToSlot = (player) => {
        // Find the first empty slot
        const index = playerSlots.findIndex((slot) => slot === null);
        if (index !== -1) {
            const updatedSlots = [...playerSlots];
            updatedSlots[index] = { ...player, isAutoFilled: false };
            setPlayerSlots(updatedSlots);
        } else {
            setError('All slots are filled.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!dateTime || !numberOfPlayers) {
            setError('Please fill in all required fields.');
            setMessage('');
            return;
        }

        const totalPlayers = parseInt(numberOfPlayers);
        const filledSlots = playerSlots.filter((slot) => slot !== null).length;

        if (filledSlots !== totalPlayers) {
            setMessage('Oi paiktes den einai ' + totalPlayers);
        }

        setLoading(true);
        setError('');
        setMessage('');

        const token = getToken();
        if (!token) {
            return; // Early exit if token is not present
        }

        // Extract player IDs and unregistered player names
        const manualPlayerIds = playerSlots
                .filter((slot) => slot && !slot.isAutoFilled && slot.id) // Manually selected registered players
                .map((player) => player.id);

        const autoFillPlayersIds = playerSlots
            .filter((slot) => slot && slot.isAutoFilled && slot.id) // Auto-filled registered players
            .map((player) => player.id);

        const unregisteredPlayerNames = playerSlots
            .filter((slot) => slot && !slot.id) // Unregistered players
            .map((player) => player.name);

        const formationData = {
            dateTime: dayjs(dateTime).format('YYYY-MM-DDTHH:mm'),
            numberOfPlayers: totalPlayers,
            autoFillPlayersCount: autoFillPlayersIds.length, // Since admin is selecting players
            manualFillPlayersCount: manualPlayerIds.length,
            manualPlayerIds: manualPlayerIds,
            autoFillPlayersIds: autoFillPlayersIds,
            unregisteredPlayerNames: unregisteredPlayerNames,
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
            // navigate('/formations');
            setDateTime(null);
            setNumberOfPlayers('');
            setPlayerSlots(Array(parseInt(numberOfPlayers)).fill(null));
            setSearchTerm('');
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

    const autoFillSlots = () => {
        const emptySlotIndices = playerSlots.reduce((indices, slot, idx) => {
            if (slot === null) indices.push(idx);
            return indices;
        }, []);

        const remainingPlayers = availablePlayers.filter(
            (player) => !playerSlots.some((slot) => slot && slot.id === player.id)
        );

        const slotsToFill = Math.min(emptySlotIndices.length, remainingPlayers.length);

        const updatedSlots = [...playerSlots];
        for (let i = 0; i < slotsToFill; i++) {
            const player = remainingPlayers[i];
            const index = emptySlotIndices[i];
            updatedSlots[index] = { ...player, isAutoFilled: true};
        }
        setPlayerSlots(updatedSlots);
    };

    const filteredAvailablePlayers = availablePlayers.filter((player) =>
        `${player.name} ${player.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Paper elevation={3} style={{ padding: '2rem', maxWidth: '800px', margin: '2rem auto' }}>
            <Typography variant="h5" gutterBottom>
                Create Formation
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Date and Time Picker */}
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Formation Date and Time"
                                value={dateTime}
                                onChange={(newDateTime) => setDateTime(newDateTime)}
                                renderInput={(params) => <TextField {...params} fullWidth required />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    {/* Number of Players */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Number of Players"
                            type="number"
                            value={numberOfPlayers}
                            onChange={(e) => setNumberOfPlayers(e.target.value)}
                            fullWidth
                            required
                            inputProps={{ min: 1 }}
                        />
                    </Grid>

                    {/* Available Players */}
                    {availablePlayers.length > 0 && (
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Available Players</Typography>
                            <TextField
                                label="Search Players"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                fullWidth
                            />
                            <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '0.5rem' }}>
                                {filteredAvailablePlayers.map((player) => (
                                    <div key={player.id}>
                                        <Button
                                            variant="outlined"
                                            style={{ marginTop: '0.5rem' }}
                                            onClick={() => addPlayerToSlot(player)}
                                            fullWidth
                                        >
                                            Add {`${player.name} ${player.surname} (${player.username})`}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Grid>
                    )}

                    {/* Absent Players */}
                    {absentPlayers.length > 0 && (
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Absent Players</Typography>
                            <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '0.5rem' }}>
                                {absentPlayers.map((player) => (
                                    <div key={player.id}>
                                        <Typography variant="body2">
                                            {`${player.name} ${player.surname} (${player.username})`}
                                        </Typography>
                                    </div>
                                ))}
                            </div>
                        </Grid>
                    )}

                    {/* Player Slots */}
                    {numberOfPlayers && (
                        <Grid item xs={12}>
                            <Typography variant="h6">Player Slots</Typography>
                            <Button variant="contained" color="primary" onClick={autoFillSlots} style={{ marginBottom: '1rem' }}>
                                Auto-Fill Remaining Slots
                            </Button>
                            {playerSlots.map((player, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <TextField
                                        label={`Player ${index + 1}`}
                                        value={player ? player.name || `${player.name} ${player.surname}` : ''}
                                        onChange={(e) => handlePlayerSlotChange(e, index)}
                                        fullWidth
                                    />
                                    {player && player.id ? (
                                        <Button variant="text" onClick={() => handlePlayerSlotChange({ target: { value: '' } }, index)}>
                                            Remove
                                        </Button>
                                    ) : null}
                                </div>
                            ))}
                        </Grid>
                    )}

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
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
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

