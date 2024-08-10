import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const PlayersGrid = () => {
    const [rows, setRows] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation(); // Using the hook

    const calculateAge = (birthday) => {
        if (!birthday) return 0;
        const today = dayjs();
        const birthDate = dayjs(birthday);
        const age = today.diff(birthDate, 'year');
        return isNaN(age) ? 0 : age;
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user? This action will be irrevirsible.")) {
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

        // Recalculate age if the birthday was changed
        if (newRow.birthday !== oldRow.birthday) {
            updatedRow.age = calculateAge(newRow.birthday);
        }

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
                    const playersWithIdAndAge = response.data.map(player => ({
                        ...player,
                        id: player.id || `${player.name}-${player.surname}-${player.birthday}`, // Fallback if no id field is present
                        age: calculateAge(player.birthday), // Calculate age based on birthday
                        availability: player.availability || [] // Ensure availability is an array
                    }));
                    setRows(playersWithIdAndAge);
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

    const renderDatePicker = (params) => {
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    value={dayjs(params.value)}
                    onChange={(newValue) => {
                        const updatedRow = { ...params.row, [params.field]: newValue ? newValue.format('YYYY-MM-DD') : null };
                        params.api.updateRows([updatedRow]);
                        handleProcessRowUpdate(updatedRow, params.row);
                    }}
                    renderInput={(inputProps) => (
                        <TextField
                            {...inputProps}
                            sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }} // Adjusting font size
                        />
                    )}
                />
            </LocalizationProvider>
        );
    };

    const columns = [
        { field: 'username', headerName: t('username'), width: 150, editable: isAdmin },
        { field: 'name', headerName: t('name'), width: 150, editable: isAdmin },
        { field: 'surname', headerName: t('surname'), width: 150, editable: isAdmin },
        { field: 'overallApps', headerName: t('apps'), width: 150, editable: isAdmin },
        { field: 'wins', headerName: t('wins'), width: 100, editable: isAdmin },
        { field: 'losses', headerName: t('losses'), width: 100, editable: isAdmin },
        { field: 'draws', headerName: t('draws'), width: 100, editable: isAdmin },
        { field: 'age', headerName: t('age'), width: 100, editable: false },
        { field: 'debutDate', headerName: t('debutDate'), width: 150, editable: isAdmin, renderCell: renderDatePicker },
        { field: 'lastGK', headerName: t('lastGK'), width: 150, editable: isAdmin, renderCell: renderDatePicker },
        {
            field: 'availability',
            headerName: t('availability'),
            width: 300,
            renderCell: renderAvailabilityCheckboxes,
        },
        isAdmin && { field: 'communicationDetailsphoneNumber', headerName: t('phoneNumber'), width: 150, editable: isAdmin },
        isAdmin && { field: 'communicationDetailsaddress', headerName: t('address'), width: 200, editable: isAdmin },
        isAdmin && { field: 'communicationDetailsemail', headerName: t('email'), width: 200, editable: isAdmin },
        isAdmin && { field: 'birthday', headerName: t('birthday'), width: 150, editable: isAdmin, renderCell: renderDatePicker },
        isAdmin && { field: 'discordID', headerName: t('discordID'), width: 150, editable: isAdmin, type: 'string' },
        isAdmin && {
            field: 'actions',
            headerName: t('actions'),
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.id)}
                >
                    {t('delete')}
                </Button>
            ),
        }
    ].filter(Boolean);

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
