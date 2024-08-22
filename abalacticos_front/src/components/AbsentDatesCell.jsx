import React, { useState, useEffect } from 'react';
import MultiDatePicker from 'react-multi-date-picker';
import { Button, Box } from '@mui/material';
import dayjs from 'dayjs';

const AbsentDatesCell = ({ row, isAdmin, onAddAbsentDates }) => {
    // Initialize selectedDates with the dates coming from the backend
    const initialDates = row.absentDates.map(date => dayjs(date).toDate());
    const [selectedDates, setSelectedDates] = useState(initialDates);

    const handleAddAbsentDates = () => {
        if (selectedDates.length > 0) {
            const formattedDates = selectedDates.map(date => dayjs(date).format('YYYY-MM-DD'));
            console.log("Formatted Dates:", formattedDates);
            onAddAbsentDates(row, formattedDates);
        } else {
            // If the selectedDates is empty, we update the backend with an empty array
            onAddAbsentDates(row, []);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleAddAbsentDates();
        }
    };

    return (
        <div>
            {/* Admin or self date picker and add button */}
            {(isAdmin || row.username === localStorage.getItem('userName')) && (
                <>
                    <MultiDatePicker
                        value={selectedDates}
                        onChange={setSelectedDates}
                        multiple
                        format="YYYY-MM-DD"
                        placeholder="Select multiple dates"
                        onKeyDown={handleKeyDown}
                    />
                        <Button
                            onClick={handleAddAbsentDates}
                            variant="contained"
                            size="small"
                            color="primary"
                            sx={{ mt: 1 }}
                        >
                            Confirm Absent Dates
                    </Button>
                </>
            )}
        </div>
    );
};

export default AbsentDatesCell;
