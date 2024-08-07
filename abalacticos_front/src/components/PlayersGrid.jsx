import React, { useState, useEffect } from 'react';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const PlayersGrid = () => {
    const [rows, setRows] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No auth token found');
                navigate('/login'); // Redirect to login if not authenticated
                return;
            }

            try {
                await axios.delete(`http://localhost:8080/api/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRows(rows.filter(row => row.id !== id));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleProcessRowUpdate = async (newRow, oldRow) => {
        const updatedRow = { ...oldRow, ...newRow };

        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`http://localhost:8080/api/users/${updatedRow.id}`, updatedRow, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return updatedRow;
        } catch (error) {
            console.error('Error updating player:', error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                navigate('/login'); // Redirect to login if unauthorized or forbidden
            }
            throw error; // Let DataGrid revert the changes
        }
    };

    useEffect(() => {
        const fetchPlayers = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No auth token found');
                navigate('/login'); // Redirect to log in if not authenticated
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
                    setRows(playersWithId);
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

    const handleAvailabilityChange = async (event, row) => {
        const { value, checked } = event.target;
        const updatedAvailability = checked
            ? [...row.availability, value]
            : row.availability.filter(day => day !== value);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No auth token found');
                navigate('/login'); // Redirect to login if not authenticated
                return;
            }

            await axios.put(
                `http://localhost:8080/api/users/updateAvailability`,
                { id: row.id, availability: updatedAvailability },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setRows((prevRows) =>
                prevRows.map((r) =>
                    r.id === row.id ? { ...r, availability: updatedAvailability } : r
                )
            );
        } catch (error) {
            console.error('Error updating availability:', error);
        }
    };

    const renderAvailabilityCheckboxes = (params) => {
        const days = ['Tuesday', 'Wednesday', 'Friday'];
        const availability = params.row.availability || []; // Ensure availability is an array
        return (
            <>
                {days.map(day => (
                    <label key={day}>
                        <input
                            type="checkbox"
                            value={day}
                            checked={availability.includes(day)}
                            disabled={params.row.username !== localStorage.getItem('userName')}
                            onChange={(event) => handleAvailabilityChange(event, params.row)}
                        />
                        {day}
                    </label>
                ))}
            </>
        );
    };

    const columns = [
        { field: 'username', headerName: 'Username', width: 150, editable: isAdmin },
        { field: 'name', headerName: 'Name', width: 150, editable: isAdmin },
        { field: 'surname', headerName: 'Surname', width: 150, editable: isAdmin },
        { field: 'overallApps', headerName:'Apps', width: 150, editable: isAdmin },
        { field: 'wins', headerName: 'Wins', width: 100, editable: isAdmin },
        { field: 'losses', headerName: 'Losses', width: 100, editable: isAdmin },
        { field: 'draws', headerName: 'Draws', width: 100, editable: isAdmin },
        { field: 'age', headerName: 'Age', width: 100, editable: isAdmin },
        { field: 'debutDate', headerName: 'Debut Date', width: 150, editable: isAdmin },
        { field: 'lastGK', headerName: 'Last GK Date', width: 150, editable: isAdmin },
        {
            field: 'availability',
            headerName: 'Availability',
            width: 300,
            renderCell: renderAvailabilityCheckboxes,
        },
        isAdmin && { field: 'communicationDetailsphoneNumber', headerName: 'Phone Number', width: 150, editable: isAdmin },
        isAdmin && { field: 'communicationDetailsaddress', headerName: 'Address', width: 200, editable: isAdmin },
        isAdmin && { field: 'communicationDetailsemail', headerName: 'Email', width: 200, editable: isAdmin },
        isAdmin && { field: 'birthday', headerName: 'Birthday', width: 150, editable: isAdmin },
        isAdmin && {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) =>
            {
                return( <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.id)}>
                    Delete
                </Button>)
            }}].filter(Boolean); // Filter out the false values for non-admins

    const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
        communicationDetailsaddress: false,
        communicationDetailsemail: false,
        communicationDetailsphoneNumber: false,
        birthday: false
    });


    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                processRowUpdate={handleProcessRowUpdate}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) =>
                    setColumnVisibilityModel(newModel)
                }
                slots={{
                    toolbar: GridToolbar,
                }}
            />
        </div>
    );
};

export default PlayersGrid;
