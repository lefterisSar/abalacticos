import React, { useState } from 'react';
import axios from 'axios';

const PlayerForm = ({ onPlayerAdded }) => {
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
        phoneNumber: '',
        address: '',
        email: ''
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/players/add', playerData);
            console.log('Player added:', response.data);
            // Reset form fields after successful submission
            setPlayerData({
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
                phoneNumber: '',
                address: '',
                email: ''
            });
            // Call the function passed as prop to notify the parent component
            // onPlayerAdded();
        } catch (error) {
            console.error('Error adding player:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPlayerData({
            ...playerData,
            [name]: value
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={playerData.name} onChange={handleChange} placeholder="Name" required />
            <input type="text" name="surname" value={playerData.surname} onChange={handleChange} placeholder="Surname" required />
            <input type="number" name="age" value={playerData.age} onChange={handleChange} placeholder="Age" required />
            <input type="date" name="debutDate" value={playerData.debutDate} onChange={handleChange} placeholder="Debut Date" required />
            <input type="date" name="lastGK" value={playerData.lastGK} onChange={handleChange} placeholder="Last Game Date" required />
            <input type="number" name="wins" value={playerData.wins} onChange={handleChange} placeholder="Wins" required />
            <input type="number" name="loses" value={playerData.loses} onChange={handleChange} placeholder="Loses" required />
            <input type="number" name="draws" value={playerData.draws} onChange={handleChange} placeholder="Draws" required />
            <input type="text" name="invitationFriend" value={playerData.invitationFriend} onChange={handleChange} placeholder="Invitation Friend" required />
            <input type="text" name="favClub" value={playerData.favClub} onChange={handleChange} placeholder="Favorite Club" required />
            <input type="text" name="sn" value={playerData.sn} onChange={handleChange} placeholder="Social Network" required />
            <input type="date" name="birthday" value={playerData.birthday} onChange={handleChange} placeholder="Birthday" required />
            <input type="text" name="phoneNumber" value={playerData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
            <input type="text" name="address" value={playerData.address} onChange={handleChange} placeholder="Address" required />
            <input type="email" name="email" value={playerData.email} onChange={handleChange} placeholder="Email" required />
            <button type="submit">Add Player</button>
        </form>
    );
};

export default PlayerForm;