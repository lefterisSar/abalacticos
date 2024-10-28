import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

function FormationsList() {
  const [formations, setFormations] = useState([]);
  const [expandedFormationId, setExpandedFormationId] = useState(null);
  const [editedFormation, setEditedFormation] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [openAddPlayerDialog, setOpenAddPlayerDialog] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [teams, setTeams] = useState({ A: [], B: [] });
  const navigate = useNavigate();

  // New states for position assignment
  const [openPositionDialog, setOpenPositionDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);

  const positions = [
    'Goalkeeper',
    'Right Back',
    'Center Back',
    'Left Back',
    'Right Winger',
    'Midfielder',
    'Left Winger',
    'Forward',
    // Add other positions as needed
  ];

  // Common function to get the token
  const getToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return null;
    }
    return token;
  };

  useEffect(() => {
    fetchFormations();
    fetchAllPlayers();
  }, []);

  const fetchFormations = async () => {
    const token = getToken();
    try {
      const response = await axios.get('/api/formations/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormations(response.data);
    } catch (error) {
      console.error('Error fetching formations:', error);
    }
  };

  const fetchAllPlayers = async () => {
    const token = getToken();
    try {
      const response = await axios.get('/api/users/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleExpand = (formation) => {
    if (expandedFormationId === formation.id) {
      setExpandedFormationId(null);
      setEditedFormation(null);
      setAvailableSlots([]);
      setTeams({ A: [], B: [] });
    } else {
      setExpandedFormationId(formation.id);
      setEditedFormation({ ...formation });
      initializeFormationSlots(formation);
    }
  };

  const initializeFormationSlots = (formation) => {
    // Initialize the slots based on numberOfPlayers
    const totalSlots = formation.numberOfPlayers;
    const formationPlayers = [];

    // Combine registered and unregistered players
    const registeredPlayers = (formation.playerIds || []).map((playerId) =>
      allPlayers.find((player) => player.id === playerId)
    );

    const unregisteredPlayers = formation.unregisteredPlayerNames || [];

    // Add registered players to the list
    registeredPlayers.forEach((player) => {
      if (player) {
        formationPlayers.push({ type: 'registered', data: player });
      }
    });

    // Add unregistered players to the list
    unregisteredPlayers.forEach((name) => {
      formationPlayers.push({ type: 'unregistered', data: { name } });
    });

    // Add empty slots if needed
    const emptySlots = totalSlots - formationPlayers.length;
    for (let i = 0; i < emptySlots; i++) {
      formationPlayers.push({ type: 'empty', data: null });
    }

    setAvailableSlots(formationPlayers);

    // Initialize teams
    const teamsData = formation.teams || {};
    const initialTeams = { A: [], B: [] };

    // Determine team sizes
    const teamSizeA = Math.ceil(totalSlots / 2);
    const teamSizeB = totalSlots - teamSizeA;

    ['A', 'B'].forEach((teamKey) => {
      const teamPlayers = teamsData[teamKey] || [];
      const teamSize = teamKey === 'A' ? teamSizeA : teamSizeB;
      const teamArray = Array(teamSize).fill(null);

      teamPlayers.forEach((playerAssignment) => {
        // Find the corresponding slot index
        const { type, id, name, position } = playerAssignment;
        const slotIndex = formationPlayers.findIndex((slot) => {
          if (slot.type === type) {
            if (type === 'registered' && slot.data.id === id) {
              return true;
            }
            if (type === 'unregistered' && slot.data.name === name) {
              return true;
            }
          }
          return false;
        });
        if (slotIndex !== -1) {
          // Find the next null position in teamArray
          const indexInTeam = teamArray.findIndex((player) => player === null);
          if (indexInTeam !== -1) {
            teamArray[indexInTeam] = {
              ...formationPlayers[slotIndex],
              slotIndex,
              position: position || '',
            };
          }
        }
      });

      initialTeams[teamKey] = teamArray;
    });

    setTeams(initialTeams);
  };

  const handleSlotClick = (index) => {
    setSelectedSlotIndex(index);
    setOpenAddPlayerDialog(true);
  };

  const handleAddPlayerToSlot = (player) => {
    const updatedSlots = [...availableSlots];
    updatedSlots[selectedSlotIndex] = {
      type: 'registered',
      data: player,
    };
    setAvailableSlots(updatedSlots);
    setOpenAddPlayerDialog(false);
  };

  const handleAddUnregisteredPlayerToSlot = (name) => {
    const updatedSlots = [...availableSlots];
    updatedSlots[selectedSlotIndex] = {
      type: 'unregistered',
      data: { name },
    };
    setAvailableSlots(updatedSlots);
    setOpenAddPlayerDialog(false);
  };

  const handleAssignToTeam = (slotIndex, team) => {
    const playerSlot = availableSlots[slotIndex];
    if (!playerSlot || playerSlot.type === 'empty') return;

    const updatedTeams = { ...teams };
    const otherTeam = team === 'A' ? 'B' : 'A';

    // Remove from other team if present
    updatedTeams[otherTeam] = updatedTeams[otherTeam].map((player) => {
      if (player && player.slotIndex === slotIndex) {
        return null;
      }
      return player;
    });

    // Find an empty spot in the team
    const teamIndex = updatedTeams[team].findIndex((player) => player === null);
    if (teamIndex !== -1) {
      updatedTeams[team][teamIndex] = {
        ...playerSlot,
        slotIndex,
        position: playerSlot.position || '', // Initialize position as empty string
      };
    } else {
      alert(`Team ${team} is full`);
    }

    setTeams(updatedTeams);
  };

  const handleAssignPosition = (team, playerIndex) => {
    setSelectedTeam(team);
    setSelectedPlayerIndex(playerIndex);
    setOpenPositionDialog(true);
  };

  const handlePositionSelect = (position) => {
    const updatedTeams = { ...teams };
    const player = updatedTeams[selectedTeam][selectedPlayerIndex];
    if (player) {
      player.position = position;
      updatedTeams[selectedTeam][selectedPlayerIndex] = player;
      setTeams(updatedTeams);
    }
    setOpenPositionDialog(false);
  };

  const handleSave = async (id) => {
    const token = getToken();

    // Prepare playerIds and unregisteredPlayerNames
    const playerIds = availableSlots
      .filter((slot) => slot.type === 'registered' && slot.data)
      .map((slot) => slot.data.id);

    const unregisteredPlayerNames = availableSlots
      .filter((slot) => slot.type === 'unregistered' && slot.data)
      .map((slot) => slot.data.name);

    // Prepare teams with positions
    const teamAssignments = {
      A: teams.A.map((player) => {
        if (player) {
          const slot = availableSlots[player.slotIndex];
          const position = player.position || '';
          if (slot.type === 'registered') {
            return { type: 'registered', id: slot.data.id, position };
          } else if (slot.type === 'unregistered') {
            return { type: 'unregistered', name: slot.data.name, position };
          }
        }
        return null;
      }).filter((p) => p !== null),
      B: teams.B.map((player) => {
        if (player) {
          const slot = availableSlots[player.slotIndex];
          const position = player.position || '';
          if (slot.type === 'registered') {
            return { type: 'registered', id: slot.data.id, position };
          } else if (slot.type === 'unregistered') {
            return { type: 'unregistered', name: slot.data.name, position };
          }
        }
        return null;
      }).filter((p) => p !== null),
    };

    // Prepare the updated formation data
    const updatedFormation = {
      ...editedFormation,
      playerIds,
      unregisteredPlayerNames,
      teams: teamAssignments,
    };

    try {
      await axios.put(`/api/formations/update/${id}`, updatedFormation, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Update the formations list after saving
      fetchFormations();
      setExpandedFormationId(null);
      setEditedFormation(null);
      setAvailableSlots([]);
      setTeams({ A: [], B: [] });
    } catch (error) {
      console.error('Error updating formation:', error);
    }
  };

  const handleDelete = async (id) => {
    const token = getToken();
    if (window.confirm('Are you sure you want to delete this formation?')) {
      try {
        await axios.delete(`/api/formations/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Remove the formation from the list
        setFormations((prevFormations) =>
          prevFormations.filter((formation) => formation.id !== id)
        );
      } catch (error) {
        console.error('Error deleting formation:', error);
      }
    }
  };

  const renderPlayerSlot = (slot, index) => {
    let displayText = '';
    if (slot.type === 'registered') {
      const player = slot.data;
      displayText = `${player.name} ${player.surname} (${player.username})`;
    } else if (slot.type === 'unregistered') {
      displayText = slot.data.name;
    } else {
      displayText = 'Empty Slot';
    }

    return (
      <ListItem key={index}>
        <ListItemText primary={displayText} />
        <div>
          <Button
            variant="outlined"
            onClick={() => handleAssignToTeam(index, 'A')}
            style={{ marginRight: '5px' }}
          >
            Team A
          </Button>
          <Button variant="outlined" onClick={() => handleAssignToTeam(index, 'B')}>
            Team B
          </Button>
          <Button
            variant="text"
            color="primary"
            onClick={() => handleSlotClick(index)}
            style={{ marginLeft: '10px' }}
          >
            {slot.type === 'empty' ? 'Add Player' : 'Change Player'}
          </Button>
        </div>
      </ListItem>
    );
  };

  const renderTeamList = (team) => {
    return teams[team].map((playerSlot, index) => {
      if (!playerSlot) {
        return (
          <ListItem key={index}>
            <ListItemText primary="Empty Slot" />
          </ListItem>
        );
      }
      const slot = availableSlots[playerSlot.slotIndex];
      let displayText = '';
      if (slot.type === 'registered') {
        const player = slot.data;
        displayText = `${player.name} ${player.surname} (${player.username})`;
      } else if (slot.type === 'unregistered') {
        displayText = slot.data.name;
      }

      // Include position in display text
      if (playerSlot.position) {
        displayText += ` - ${playerSlot.position}`;
      }

      return (
        <ListItem key={index}>
          <ListItemText primary={displayText} />
          <Button
            variant="outlined"
            onClick={() => handleAssignPosition(team, index)}
            style={{ marginLeft: '10px' }}
          >
            {playerSlot.position ? 'Change Position' : 'Assign Position'}
          </Button>
        </ListItem>
      );
    });
  };

  return (
    <Paper
      elevation={3}
      style={{ padding: '2rem', maxWidth: '1200px', margin: '2rem auto' }}
    >
      <Typography variant="h5" gutterBottom>
        All Formations
      </Typography>
      <List>
        {formations.map((formation) => (
          <div key={formation.id}>
            <ListItem>
              <ListItemText
                primary={`Date: ${dayjs(formation.dateTime).format(
                  'YYYY-MM-DD'
                )}, Players: ${formation.numberOfPlayers}`}
                secondary={`Created by: ${
                  formation.createdBy || 'Unknown'
                }, Created at: ${dayjs(formation.createdAt).format('YYYY-MM-DD')}`}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDelete(formation.id)}
                style={{ marginRight: '10px' }}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleExpand(formation)}
              >
                {expandedFormationId === formation.id ? 'Collapse' : 'Expand'}
              </Button>
            </ListItem>
            {expandedFormationId === formation.id && (
              <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                <Typography variant="h6">Formation Players</Typography>
                <List>
                  {availableSlots.map((slot, index) => renderPlayerSlot(slot, index))}
                </List>

                {/* Teams */}
                <Typography variant="h6">Teams</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Team A</Typography>
                    <List>{renderTeamList('A')}</List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Team B</Typography>
                    <List>{renderTeamList('B')}</List>
                  </Grid>
                </Grid>

                {/* Save Button */}
                <div style={{ marginTop: '20px' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSave(formation.id)}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </List>

      {/* Add Player Dialog */}
      <Dialog
        open={openAddPlayerDialog}
        onClose={() => setOpenAddPlayerDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Player</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={allPlayers}
            getOptionLabel={(option) => {
              if (typeof option === 'string') {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return `${option.name} ${option.surname} (${option.username})`;
            }}
            filterOptions={(options, params) => {
              const filtered = options.filter((option) => {
                const fullName = `${option.name} ${option.surname}`.toLowerCase();
                const username = option.username.toLowerCase();
                return (
                  fullName.includes(params.inputValue.toLowerCase()) ||
                  username.includes(params.inputValue.toLowerCase())
                );
              });

              if (params.inputValue !== '') {
                filtered.push({
                  inputValue: params.inputValue,
                  name: params.inputValue,
                });
              }

              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            freeSolo
            renderOption={(props, option) => {
              if (option.inputValue) {
                return <li {...props}>Add "{option.inputValue}" as unregistered player</li>;
              }

              return (
                <li {...props}>
                  {`${option.name} ${option.surname} (${option.username})`}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField {...params} label="Search or Add Player" variant="outlined" />
            )}
            onChange={(event, value) => {
              if (typeof value === 'string') {
                handleAddUnregisteredPlayerToSlot(value);
                setOpenAddPlayerDialog(false);
              } else if (value && value.inputValue) {
                handleAddUnregisteredPlayerToSlot(value.inputValue);
                setOpenAddPlayerDialog(false);
              } else if (value) {
                handleAddPlayerToSlot(value);
                setOpenAddPlayerDialog(false);
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Position Assignment Dialog */}
      <Dialog
        open={openPositionDialog}
        onClose={() => setOpenPositionDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Assign Position</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={positions}
            getOptionLabel={(option) => option}
            onChange={(event, value) => {
              if (value) {
                handlePositionSelect(value);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select Position" variant="outlined" />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPositionDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default FormationsList;



