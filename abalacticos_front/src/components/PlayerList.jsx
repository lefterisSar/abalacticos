import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlayerList = () => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = () => {
        axios.get('http://localhost:8080/api/users')
            .then(response => {
                setPlayers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the players!', error);
            });
    };

    return (
        <div>
            <h1>Players List</h1>
            <ul>
                {players.map(player => (
                    <li key={player.id}>{player.name} {player.surname} - Age: {player.age}</li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerList;