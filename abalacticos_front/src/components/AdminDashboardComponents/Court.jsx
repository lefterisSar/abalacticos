import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Court = () => {
    const [bannedUsers, setBannedUsers] = useState([]); // Currently banned users
    const [banHistory, setBanHistory] = useState([]); // Ban history (completed bans)

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        // Fetch the currently banned users
        axios.get('/api/users/ban-history/current', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setBannedUsers(response.data))
            .catch(error => console.error(error));

        // Fetch the ban history
        axios.get('/api/users/ban-history/completed', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setBanHistory(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Court - Ban History</h1>

            <h2>Currently Banned Users</h2>
            {bannedUsers.length > 0 ? (
                <ul>
                    {bannedUsers.map(user => (
                        <li key={user.username}>
                            {user.username} (Banned on: {user.banStartDate}, until: {user.banEndDate || 'Indefinite'})
                            - Reason: {user.banReason || 'No reason provided'}.
                            This user has been banned {user.banCount || 1} times.
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No users are currently banned.</p>
            )}

            <h2>Ban History</h2>
            {banHistory.length > 0 ? (
                <ul>
                    {banHistory.map(history => (
                        <li key={history.username}>
                            {history.username} - Banned from {history.banStartDate} to {history.banEndDate || 'Indefinite'}
                            for {history.banReason || 'No reason provided'}.
                            Duration: {history.duration} days. This user has been banned {history.banCount || 1} times.
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No ban history available.</p>
            )}
        </div>
    );
};

export default Court;


