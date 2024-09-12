import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HandleSavings = () => {
    const [adminSavings, setAdminSavings] = useState(0); // Admin's savings
    const [teamSavings, setTeamSavings] = useState(0); // Total team savings
    const [allSavings, setAllSavings] = useState([]); // All users with savings > 0
    const [newSavingsAmount, setNewSavingsAmount] = useState(''); // Admin's input for new savings
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [showTable, setShowTable] = useState(false); // Show or hide the table
    const [showHistory, setShowHistory] = useState(false);


    // Fetch savings data for the logged-in admin
    const fetchSavingsData = async () => {
        const token = localStorage.getItem('authToken'); // Get the auth token
        try {
            // Fetch the current user's profile to get their userId (currentHolderId) and userName
            const userProfileResponse = await axios.get('/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const userId = userProfileResponse.data.id;
            const userName = userProfileResponse.data.username;

            // Fetch admin's savings using userId
            const adminSavingsResponse = await axios.get(`/api/savings/adminSavings/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setAdminSavings(adminSavingsResponse.data || 0); // If null, default to 0

            // Fetch total team savings
            const teamSavingsResponse = await axios.get('/api/savings/teamSavings', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setTeamSavings(teamSavingsResponse.data);

            // Fetch all users with savings > 0
            const allSavingsResponse = await axios.get('/api/savings/adminSavings', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setAllSavings(allSavingsResponse.data); // List of all users with savings

            const historyResponse = await axios.get('/api/savings/savingsHistory', {
                            headers: { 'Authorization': `Bearer ${token}` },
                        });
                        setHistory(historyResponse.data);

        } catch (err) {
            setError('Error fetching savings data.');
        }
    };

    // Handle the update savings functionality
    const handleUpdateSavings = async () => {
        const token = localStorage.getItem('authToken'); // Get the auth token
        try {
            // Fetch the current user's profile to get userId and userName
            const userProfileResponse = await axios.get('/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const userId = userProfileResponse.data.id;
            const userName = userProfileResponse.data.username;

            // Calculate the new savings amount for the admin
            const updatedSavings = parseFloat(adminSavings) + parseFloat(newSavingsAmount); // Add new savings to existing ones

            // Update the savings for this admin (send both userId and userName)
            await axios.put(`/api/savings/update/${userId}`, {
                adminsSavings: parseFloat(newSavingsAmount),
                userName: userName, // Send the userName along with the savings
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            setMessage('Savings updated successfully!');
            setNewSavingsAmount(''); // Clear input
            fetchSavingsData(); // Refresh data
        } catch (err) {
            setError('Error updating savings.');
        }
    };

    const fetchSavingsHistory = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const historyResponse = await axios.get('/api/savings/savingsHistory', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setHistory(historyResponse.data);
        } catch (err) {
            setError('Error fetching history.');
        }
    };

    useEffect(() => {
        fetchSavingsData();
    }, []);

    return (
        <div>
            <h2>Manage Savings</h2>

            {/* Display the admin's current savings */}
            <div>
                <h3>Your Savings: {adminSavings}</h3>
                <label>Add to Your Savings:</label>
                <input
                    type="number"
                    value={newSavingsAmount}
                    onChange={(e) => setNewSavingsAmount(e.target.value)}
                />
                <button onClick={handleUpdateSavings}>Update Savings</button>
            </div>

            {/* Display the total team savings */}
            <h3>Total Team Savings: {teamSavings}</h3>

            {/* Button to toggle the visibility of the admin savings table */}
            <button onClick={() => setShowTable(!showTable)}>
                {showTable ? 'Hide Admin Savings' : 'Show Admin Savings'}
            </button>

            {/* Admin savings table, displayed when the button is clicked */}
            {showTable && (
                <div>
                    <h3>Admin Savings</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Admin Name</th>
                                <th>Savings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(allSavings) && allSavings.length > 0 ? (
                                allSavings.map((admin) => (
                                    <tr key={admin.currentHolderId}>
                                        <td>{admin.userName}</td>
                                        <td>{admin.adminSavings}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2">No savings data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <button onClick={() => setShowHistory(!showHistory)}>
                {showHistory ? 'Hide History' : 'Show Savings History'}
            </button>

            {showHistory && Array.isArray(history) && history.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.userName}</td>
                                <td>{entry.amount}</td>
                                <td>{new Date(entry.date).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No history available.</p>
            )}

            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default HandleSavings;
