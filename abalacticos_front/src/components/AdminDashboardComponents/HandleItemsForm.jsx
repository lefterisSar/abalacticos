import React, { useState } from 'react';
import axios from 'axios';

const HandleItemsForm = () => {
    const [view, setView] = useState(''); // Track which view is active
    const [items, setItems] = useState([]); // Store items for viewing/updating
    const [itemName, setItemName] = useState('');
    const [itemType, setItemType] = useState('');
    const [iconUrl, setIconUrl] = useState('');
    const [currentHolderId, setCurrentHolderId] = useState(''); // Optional: if you want to assign an item to a user during creation
    const [itemIdToUpdate, setItemIdToUpdate] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // Function to get the authorization token
    const getAuthToken = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No auth token found');
            return null;
        }
        return `Bearer ${token}`;
    };

    // Fetch all items for viewing
    const fetchItems = async () => {
        const token = localStorage.getItem('authToken'); // Adjust this based on where you store your token
        try {


            console.log('Fetching items...');

            console.log('Token:', token);
            if (!token) {
                        console.error('No token found, exiting function.');
                        return;
                    }
            const response = await axios.get('/api/inventory/all', {
                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
            });
            console.log('Response:', response);  // Log the response
            setItems(response.data);
        } catch (err) {

        if (err.response && err.response.status === 401) {
                    // Token is expired or invalid, redirect to login or handle it
                    console.error('Token expired or invalid. Please log in again.');
                } else {
                setError('Error fetching items.');
            }
        }
    };

    // Handle form submission for adding/updating
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken'); // Adjust this based on where you store your token
        if (!token) {
                setError('Authorization token missing. Please log in.');
                return;
            }
        const newItem = {
            itemName,
            itemType,
            iconUrl: iconUrl || null,
            currentHolderId: currentHolderId || null,
        };

        try {
            if (view === 'add') {
                const response = await axios.post('/api/inventory/add', newItem, {
                    headers: {
                                        'Authorization': `Bearer ${token}`,
                                    },
                });
                setMessage('Item added successfully!');
            } else if (view === 'update' && itemIdToUpdate) {
                await axios.put(`/api/inventory/update/${itemIdToUpdate}`, newItem, {
                    headers: {
                                        'Authorization': `Bearer ${token}`,
                                    },
                });
                setMessage('Item updated successfully!');
            }
            setError(null);
            clearForm();
            fetchItems(); // Reload the item list
        } catch (err) {
            setMessage(null);
            setError('Error processing the request.');
        }
    };

    // Handle item deletion
    const handleDelete = async (id) => {
        const token = localStorage.getItem('authToken'); // Adjust this based on where you store your token
        try {
            await axios.delete(`/api/inventory/delete/${id}`, {
                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
            });
            setMessage('Item deleted successfully!');
            fetchItems(); // Reload the items
        } catch (err) {
            setError('Error deleting the item.');
        }
    };

    // Clear form fields
    const clearForm = () => {
        setItemName('');
        setItemType('');
        setIconUrl('');
        setCurrentHolderId('');
        setItemIdToUpdate('');
    };

    // Handle which view to show (add, update, view, etc.)
    const handleViewChange = (newView) => {
        setView(newView);
        setMessage(null);
        setError(null);
        if (newView === 'view') {
            fetchItems(); // Fetch items when viewing
        }
        clearForm();
    };

    // Render the item form for adding or updating
    const renderItemForm = () => (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Item Name:</label>
                <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Item Type:</label>
                <input
                    type="text"
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Icon URL:</label>
                <input
                    type="text"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Current Holder ID (optional):</label>
                <input
                    type="text"
                    value={currentHolderId}
                    onChange={(e) => setCurrentHolderId(e.target.value)}
                />
            </div>
            <button type="submit">{view === 'add' ? 'Add Item' : 'Update Item'}</button>
        </form>
    );

    // Render the items in a table format for viewing/updating/deleting
    const renderItemsList = () => (
        <div>
            <h3>Inventory Items</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Icon URL</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.itemName}</td>
                            <td>{item.itemType}</td>
                            <td>{item.iconUrl}</td>
                            <td>
                                <button onClick={() => setItemIdToUpdate(item.id) && handleViewChange('update')}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div>
            <h2>Manage Inventory</h2>
            <div>
                {/* Buttons to change views */}
                <button onClick={() => handleViewChange('view')}>View Items</button>
                <button onClick={() => handleViewChange('add')}>Add New Item</button>
            </div>

            {/* Conditionally render based on the view */}
            {view === 'view' && renderItemsList()}
            {(view === 'add' || view === 'update') && renderItemForm()}

            {/* Display success or error messages */}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default HandleItemsForm;

