import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdateCredentialsForm = () => {
    const [newUsername, setNewUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true); // Loading state for profile
    const navigate = useNavigate();

    // Common function to get the token
    const getToken = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
        }
        return token;
    };

    // Fetch user profile (username) on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            //const token = getToken();
            //if (!token) return;

            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get('/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setNewUsername(response.data.username); // Set the existing username
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Failed to fetch user profile.');
            } finally {
                setLoadingProfile(false); // Profile loading complete
            }
        };

        fetchUserProfile();
    }, []);

    // Handle updating the username
    const handleUpdateUsername = async (e) => {
        e.preventDefault();
        //const token = getToken();
        //if (!token) return;

        setLoading(true);
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.put(
                '/api/users/update-username',
                { newUsername },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }
            );

            setMessage('Username updated successfully');
            setError('');
        } catch (err) {
            console.error('Error in update request:', err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            } else {
                setError(err.response ? err.response.data : 'Error updating username');
                setMessage('');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle updating the password
    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setError('New password and confirm password do not match.');
            return;
        }

        //const token = getToken();
        //if (!token) return;

        setLoading(true);
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.put(
                '/api/users/update-password',
                {
                    currentPassword,
                    newPassword,
                    confirmNewPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage('Password updated successfully');
            setError('');
        } catch (err) {
            console.error('Error in update password request:', err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            } else {
                setError(err.response ? err.response.data : 'Error updating password');
                setMessage('');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Update Credentials</h2>

            {loadingProfile ? (
                <p>Loading profile...</p> // Show loading message while fetching profile
            ) : (
                <>
                    {/* Update Username Form */}
                    <form onSubmit={handleUpdateUsername}>
                        <h3>Change Username</h3>
                        <div>
                            <label>New Username:</label>
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Username'}
                        </button>
                    </form>

                    {/* Update Password Form */}
                    <form onSubmit={handleUpdatePassword}>
                        <h3>Change Password</h3>
                        <div>
                            <label>Current Password:</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>New Password:</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Confirm New Password:</label>
                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </>
            )}

            {/* Display Success/Error Messages */}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default UpdateCredentialsForm;
