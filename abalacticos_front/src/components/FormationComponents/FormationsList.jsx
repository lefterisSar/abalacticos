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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

function FormationsList() {
  const [formations, setFormations] = useState([]);
  const navigate = useNavigate();

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
  }, []);

  const fetchFormations = async () => {
    const token = getToken();
    if (!token) return;
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

  const handleViewDetails = (id) => {
    navigate(`/formations/${id}`);
  };

  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) return;
    if (window.confirm('Are you sure you want to delete this formation?')) {
      try {
        await axios.delete(`/api/formations/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Formation deleted successfully!');
        setFormations((prevFormations) =>
          prevFormations.filter((formation) => formation.id !== id)
        );
      } catch (error) {
        console.error('Error deleting formation:', error);
        alert('Failed to delete formation.');
      }
    }
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
          <ListItem
            key={formation.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              marginBottom: '10px',
              padding: '16px',
              cursor: 'pointer',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  <strong>Day:</strong> {dayjs(formation.dateTime).format('dddd')}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Date:</strong> {dayjs(formation.dateTime).format('YYYY-MM-DD')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  <strong>Created By:</strong> {formation.createdBy || 'Unknown'}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Created At:</strong> {dayjs(formation.createdAt).format('YYYY-MM-DD')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  <strong>Players:</strong> {formation.playerIds.length}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  <strong>Total Players:</strong> {formation.playerIds.length}/{formation.numberOfPlayers}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} style={{ textAlign: 'right' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewDetails(formation.id)}
                  style={{ marginRight: '10px' }}
                >
                  View Details
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(formation.id)}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default FormationsList;





