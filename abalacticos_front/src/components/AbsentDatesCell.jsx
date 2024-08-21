import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button, TextField } from '@mui/material';
import dayjs from 'dayjs';

const AbsentDatesCell = ({ row, isAdmin, onAddAbsentDate }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    // Get the current logged-in username
    const loggedInUsername = localStorage.getItem('userName');

    // Check if the current row corresponds to the logged-in user or if the user is an admin
    const canEdit = isAdmin || row.username === loggedInUsername;

    const handleAddAbsentDate = () => {
        if (selectedDate) {
            onAddAbsentDate(row, selectedDate); // Call parent function to update backend
            setSelectedDate(null); // Reset date picker after adding
        } else {
            console.error('No date selected');
        }
    };

    return (
        <div>
            {/* Display existing absent dates */}
            {row.absentDates && row.absentDates.map((date, index) => (
                <div key={index}>{dayjs(date).format('YYYY-MM-DD')}</div>
            ))}

            {/* Allow editing only if the user is admin or the row belongs to the logged-in user */}
            {canEdit && (
                <>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Select Absent Date"
                            value={selectedDate}
                            onChange={(newDate) => setSelectedDate(newDate)}
                            renderInput={(params) => <TextField {...params} size="small" />}
                        />
                    </LocalizationProvider>
                    <Button
                        onClick={handleAddAbsentDate}
                        variant="contained"
                        size="small"
                        color="primary"
                        sx={{ mt: 1 }}
                    >
                        Add Absent Date
                    </Button>
                </>
            )}
        </div>
    );
};

export default AbsentDatesCell;
