import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import dayjs from 'dayjs';

const AbsentDatesCell = ({ row, isAdmin, onAddAbsentDate }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleAddAbsentDate = () => {
        if (selectedDate) {
            console.log("Selected Date Before Adding:", selectedDate);
            onAddAbsentDate(row, selectedDate); // Call parent function to update backend
            setSelectedDate(null); // Reset date picker after adding
        } else {
            console.error('No date selected');
        }
    };

    return (
        <div>
            {/* Display existing absent dates */}
            {row.absentDates.map((date, index) => (
                <div key={index}>{dayjs(date).format('YYYY-MM-DD')}</div>
            ))}

            {/* Admin-only date picker and add button */}
            {isAdmin && (
                <>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Select Absent Date"
                            value={selectedDate}
                            onChange={(newDate) => {
                                console.log("DatePicker Updated to:", newDate);
                                setSelectedDate(newDate);
                            }}
                            renderInput={(params) => <TextField {...params} />}
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
