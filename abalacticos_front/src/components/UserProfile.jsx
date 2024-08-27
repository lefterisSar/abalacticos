import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To navigate to the login page if not authorized

const UserProfile = () => {
    const [userData, setUserData] = useState(null); // Store the whole user object instead of just username
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('authToken'); // Retrieve token from localStorage

            // If no token is found, redirect to login
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                console.log('Fetching from URL:', '/api/users/profile');

                // Make the request with the Authorization header
                const response = await axios.get('/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}` // Attach the token to the Authorization header
                    }
                });

                console.log(response.data);
                setUserData(response.data); // Store the full user data in state
            } catch (error) {
                // Handle the error (e.g., invalid token or server error)
                console.error("Error fetching the user profile", error);
                if (error.response && error.response.status === 401) {
                    // If the response is 401 (Unauthorized), redirect to the login page
                    navigate('/login');
                } else {
                    setError('Failed to load profile.');
                }
            } finally {
                setLoading(false); // Stop the loading spinner
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleCheckboxChange = async (field, value) => {
        if (!userData) return;

        const updatedUserData = { ...userData, [field]: value };

        try {
            const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
            await axios.put(`/api/users/${userData.id}`, updatedUserData, {
                headers: {
                    Authorization: `Bearer ${token}` // Attach the token to the Authorization header
                }
            });

            setUserData(updatedUserData); // Optimistically update the UI
        } catch (error) {
            console.error(`Error updating ${field}`, error);
            setError(`Failed to update ${field}`);
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Show loading message while waiting for the profile data
    }

    if (error) {
        return <p>{error}</p>; // Show error message if there was an issue
    }

    return (
        <div>
            <h1>User Profile</h1>
            {userData ? (
                <div>
                    <p>Username: {userData.username}</p>
                    <p>Wins: {userData.wins}</p>
                    <p>Losses: {userData.losses}</p>
                    <p>Draws: {userData.draws}</p>
                    <p>Overall Appearances: {userData.overallApps}</p>
                    <p>Debut Date: {userData.debutDate}</p>
                    <p>Last GK: {userData.lastGK}</p>
                    <p>Tuesday Appearances: {userData.tuesdayAppearances}</p>
                    <p>Wednesday Appearances: {userData.wednesdayAppearances}</p>
                    <p>Friday Appearances: {userData.fridayAppearances}</p>
                    <p>apousies: {userData.absentDates && userData.absentDates.join(', ')}</p>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={userData.absent}
                                onChange={(e) => handleCheckboxChange('absent', e.target.checked)}
                            />
                            Absent
                        </label>
                    </div>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={userData.injured}
                                onChange={(e) => handleCheckboxChange('injured', e.target.checked)}
                            />
                            Injured
                        </label>
                    </div>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={userData.available}
                                onChange={(e) => handleCheckboxChange('available', e.target.checked)}
                            />
                            Available
                        </label>
                    </div>
                </div>
            ) : (
                <p>No user data available</p>
            )}
        </div>
    );
};

export default UserProfile;
