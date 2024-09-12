import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To navigate to the login page if not authorized
import UpdateCredentialsForm from './UserProfileComponents/UpdateCredentialsForm';

const UserProfile = () => {
    const [userData, setUserData] = useState(null); // Store the whole user object instead of just username
    const [clubs, setClubs] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableShirts, setAvailableShirts] = useState([]); // Store available shirt colors
    const [userItems, setUserItems] = useState([]); // store the user's items
    const [showUpdateCredentials, setShowUpdateCredentials] = useState(false); // State to toggle the form visibility
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

                setUserData(response.data); // Store the full user data in state
                setUserItems(response.data.ownedItems || []);
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

        const fetchClubs = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
                if (!token) {
                                navigate('/login');
                                return;
                            }

                const response = await axios.get('/api/clubs', {
                            headers: {
                                Authorization: `Bearer ${token}` // Attach the token to the Authorization header
                            }
                        });
                        setClubs(response.data || []); // Ensure that we handle any case where data might not be an array
                    } catch (error) {
                        console.error('Error fetching clubs', error);
                    }
                };

        const fetchAvailableShirts = async () => {
                    try {
                        const token = localStorage.getItem('authToken');
                        const response = await axios.get('/api/team-shirts/all', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setAvailableShirts(response.data);
                    } catch (error) {
                        console.error('Error fetching shirts', error);
                    }
                };


        fetchUserProfile();
        fetchClubs();
        fetchAvailableShirts();
    }, [navigate]);

    useEffect(() => {
        const fetchUserItems = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            if (userData && userData.id) {
                try {

                    const response = await axios.get(`/api/inventory/user/${userData.id}/items`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUserItems(response.data); // Store the fetched items in the state
                } catch (error) {
                    console.error('Error fetching user items', error);
                }
            }
        };

        fetchUserItems();
    }, [userData, navigate]); // Run this effect when userData is available

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

    const handleRatingChange = (position, value) => {
        setUserData(prevUserData => ({
            ...prevUserData,
            positionRatings: {
                ...prevUserData.positionRatings,
                [position]: value
            }
        }));
    };

    const handleSaveRatings = async () => {
        if (!userData) return;

        try {
            const token = localStorage.getItem('authToken');
            const updatedUserData = { ...userData };

            await axios.put(`/api/users/${userData.id}`, updatedUserData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUserData(updatedUserData);
        } catch (error) {
            console.error("Error updating position ratings", error);
            setError("Failed to update position ratings.");
        }
    };

    const handleFavClubChange = async (event) => {
        const selectedClubId = event.target.value;
        const selectedClub = clubs.find(club => club.id === selectedClubId);

        const updatedUserData = {
            ...userData,
            favClub: selectedClub,
        };

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                            navigate('/login');
                            return;
                        }

            await axios.put(`/api/users/${userData.id}`, updatedUserData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUserData(updatedUserData);
        } catch (error) {
            console.error('Error updating favorite club', error);
            setError('Failed to update favorite club.');
        }
    };

    const handleAvailability = async (day) => {
            if (!userData) return;

            let updatedAvailability;
            if (userData.availability.includes(day)) {
                updatedAvailability = userData.availability.filter(d => d !== day);
            } else {
                updatedAvailability = [...userData.availability, day];
            }

            const updatedUserData = { ...userData, availability: updatedAvailability };

            try {
                const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
                await axios.put(`/api/users/${userData.id}`, updatedUserData, {
                    headers: {
                        Authorization: `Bearer ${token}` // Attach the token to the Authorization header
                    }
                });

                setUserData(updatedUserData); // Optimistically update the UI

            } catch (error) {
                console.error(`Error updating availability`, error);
                setError(`Failed to update availability`);
            }
        };

     const handleShirtChange = async (shirtColor) => {
            if (!userData) return;

            let updatedOwnedShirts;
            if (userData.ownedShirts.includes(shirtColor)) {
                updatedOwnedShirts = userData.ownedShirts.filter(color => color !== shirtColor);
            } else {
                updatedOwnedShirts = [...userData.ownedShirts, shirtColor];
            }

            const updatedUserData = { ...userData, ownedShirts: updatedOwnedShirts };

            try {
                const token = localStorage.getItem('authToken');
                await axios.put(`/api/users/${userData.id}`, updatedUserData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserData(updatedUserData);
            } catch (error) {
                console.error('Error updating shirts', error);
                setError('Failed to update shirts.');
            }
        };


    if (loading) {
        return <p>Loading...</p>; // Show loading message while waiting for the profile data
    }

    if (error) {
        return <p>{error}</p>; // Show error message if there was an issue
    }

    const daysOfWeek = ["Tuesday", "Wednesday", "Friday"];

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
                    <p>Absences: {userData.absentDates && userData.absentDates.join(', ')}</p>

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

                    <h2>Favorite Club</h2>
                    {clubs.length > 0 ? (
                        <select
                            value={userData.favClub?.id || ''}
                            onChange={handleFavClubChange}
                        >
                            <option value="" disabled>Select your favorite club</option>
                            {clubs.map(club => (
                                <option key={club.id} value={club.id}>
                                    {club.clubName}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p>No clubs available</p>
                    )}

                    <h2>Items Handled by User</h2>
                    {Array.isArray(userItems) && userItems.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {userItems.map(item => (
                          <div
                            key={item._id}
                            style={{
                              border: '1px solid #ccc',
                              borderRadius: '5px',
                              padding: '10px',
                              width: '150px',
                              textAlign: 'center',
                              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                          >
                            {/* Display the item icon */}
                            {item.iconUrl && (
                              <img
                                src={item.iconUrl}
                                alt={`${item.itemName} icon`}
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  objectFit: 'cover',
                                  marginBottom: '10px',
                                }}
                              />
                            )}

                            {/* Item name and type */}
                            <h4 style={{ margin: '5px 0', fontSize: '14px' }}>{item.itemName}</h4>
                            <p style={{ margin: '5px 0', fontSize: '12px', color: '#555' }}>{item.itemType}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No items assigned to this user.</p>
                    )}




                    <h2>Availability</h2>
                    <div>
                        {daysOfWeek.map(day => (
                            <div key={day}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={userData.availability.includes(day)}
                                        onChange={() => handleAvailability(day)}
                                    />
                                    {day}
                                </label>
                            </div>
                        ))}
                    </div>

                    <h2>Mplouzakia</h2>
                    <div>
                        {availableShirts.map(shirt => (
                            <label key={shirt.color}>
                                <input
                                    type="checkbox"
                                    checked={userData.ownedShirts.includes(shirt.color)}
                                    onChange={() => handleShirtChange(shirt.color)}
                                />
                                {shirt.color.charAt(0).toUpperCase() + shirt.color.slice(1)}
                            </label>
                        ))}
                    </div>



                    <h2>Position Ratings</h2>
                    <div>
                        {Object.keys(userData.positionRatings).map(position => (
                            <div key={position}>
                                <label>{position.charAt(0).toUpperCase() + position.slice(1)}:</label>
                                <input
                                    type="number"
                                    value={userData.positionRatings[position]}
                                    min="0"
                                    max="10"
                                    onChange={(e) => handleRatingChange(position, parseInt(e.target.value))}
                                />
                            </div>
                        ))}
                        <button onClick={handleSaveRatings}>Save Ratings</button>
                    </div>



                    <h2>Allagi credentials</h2>
                    <button onClick={() => setShowUpdateCredentials(!showUpdateCredentials)}>
                        {showUpdateCredentials ? 'Hide Update Credentials' : 'Update Username/Password'}
                    </button>
                    {showUpdateCredentials && <UpdateCredentialsForm />}



                </div>
            ) : (
                <p>No user data available</p>
            )}
        </div>
    );
};

export default UserProfile;
