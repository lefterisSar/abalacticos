import React, { useState } from 'react';
import axios from 'axios';

const PlayerForm = ({ onPlayerAdded }) => {
    const [error, setError] = useState('');
    const [playerData, setPlayerData] = useState({
        name: '',
        surname: '',
        age: '',
        debutDate: '',
        lastGK: '',
        wins: '',
        loses: '',
        draws: '',
        invitationFriend: '',
        favClub: '',
        sn: '',
        birthday: '',
        communicationDetails: {
            phoneNumber: '',
            address: '',
            email: ''
        },
        username: '',
        password: '',
        role: 'USER',
        availability: [],
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No auth token found');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/users/registerAdmin', playerData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Player added:', response.data);
            // Reset form fields after successful submission
            setPlayerData({
                name: '',
                surname: '',
                age: '',
                debutDate: '',
                lastGK: '',
                overallApps: '',
                wins: '',
                loses: '',
                draws: '',
                invitationFriend: '',
                favClub: '',
                sn: '',
                birthday: '',
                communicationDetails: {
                    phoneNumber: '',
                    address: '',
                    email: ''
                },
                username: '',
                password: '',
                role: 'USER',
                availability: [],
            });
            // Call the function passed as prop to notify the parent component
            // onPlayerAdded();
        } catch (error) {
            console.error('Error registering user:', error);
            setError(error.response.data);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        const [parent, child] = name.split('.');
        if (child) {
            setPlayerData({
                ...playerData,
                [parent]: {
                    ...playerData[parent],
                    [child]: value
                }
            });
        } else {
            setPlayerData({
                ...playerData,
                [name]: value
            });
        }
    };

    const handleAvailabilityChange = (event) => {
        const { value, checked } = event.target;
        setPlayerData(prevState => ({
            ...prevState,
            availability: checked
                ? [...prevState.availability, value]
                : prevState.availability.filter(day => day !== value)
        }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" value={playerData.username} onChange={handleChange}
                   placeholder="Username" required/>
            <input type="password" name="password" value={playerData.password} onChange={handleChange}
                   placeholder="Password" required/>
            <select name="role" value={playerData.role} onChange={handleChange} required>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
            </select>
            <input type="text" name="name" value={playerData.name} onChange={handleChange} placeholder="Name" required />
            <input type="text" name="surname" value={playerData.surname} onChange={handleChange} placeholder="Surname" required />
            <input type="date" name="debutDate" value={playerData.debutDate} onChange={handleChange} placeholder="Debut Date" required />
            <input type="date" name="lastGK" value={playerData.lastGK} onChange={handleChange} placeholder="Last Game Date" />
            <input type="number" name="wins" value={playerData.wins} onChange={handleChange} placeholder="Wins" />
            <input type="number" name="loses" value={playerData.loses} onChange={handleChange} placeholder="Loses" />
            <input type="number" name="draws" value={playerData.draws} onChange={handleChange} placeholder="Draws" />
            <input type="text" name="invitationFriend" value={playerData.invitationFriend} onChange={handleChange} placeholder="Invitation Friend" />
            <input type="text" name="favClub" value={playerData.favClub} onChange={handleChange} placeholder="Favorite Club" />
            <input type="text" name="sn" value={playerData.sn} onChange={handleChange} placeholder="Serial Number" />
            <input type="date" name="birthday" value={playerData.birthday} onChange={handleChange} placeholder="Birthday" />
            <input type="text" name="communicationDetails.phoneNumber" value={playerData.communicationDetails.phoneNumber}
               onChange={handleChange} placeholder="Phone Number" />
            <input type="text" name="communicationDetails.address" value={playerData.communicationDetails.address}
               onChange={handleChange} placeholder="Address" />
            <input type="email" name="communicationDetails.email" value={playerData.communicationDetails.email}
                onChange={handleChange} placeholder="Email"/>
            <div>
                <label>
                    <input type="checkbox" value="Tuesday" checked={playerData.availability.includes("Tuesday")}
                           onChange={handleAvailabilityChange}/>
                    Tuesday
                </label>
                <label>
                    <input type="checkbox" value="Wednesday" checked={playerData.availability.includes("Wednesday")}
                           onChange={handleAvailabilityChange}/>
                    Wednesday
                </label>
                <label>
                    <input type="checkbox" value="Friday" checked={playerData.availability.includes("Friday")}
                           onChange={handleAvailabilityChange}/>
                    Friday
                </label>
            </div>
            <button type="submit">Add Player</button>
            {error && <div style={{color: 'red'}}>{error}</div>}
        </form>
    );
};

export default PlayerForm;
