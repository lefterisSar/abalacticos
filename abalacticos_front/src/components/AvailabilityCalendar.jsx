import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const AvailabilityCalendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No auth token found');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/availability', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const handleSelectSlot = ({ start, end }) => {
        const title = window.prompt('New Event name');
        if (title) {
            const newEvent = { start, end, title };
            setEvents([...events, newEvent]);
            // Save to backend
            saveEventToBackend(newEvent);
        }
    };

    const saveEventToBackend = async (event) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No auth token found');
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/availability', event, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error saving event:', error);
        }
    };

    const handleSelectEvent = (event) => {
        const confirmDelete = window.confirm(`Do you want to delete the event '${event.title}'?`);
        if (confirmDelete) {
            deleteEventFromBackend(event);
        }
    };

    const deleteEventFromBackend = async (event) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No auth token found');
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/availability/${event.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEvents(events.filter(e => e.id !== event.id));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
            />
        </div>
    );
};

export default AvailabilityCalendar;
