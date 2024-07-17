import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import PlayerForm from "./components/AddPlayerForm";
import PLayersGrid from "./components/PLayersGrid";

const PlayerList = forwardRef((props, ref) => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetchPlayers();
    }, [players]);

    const fetchPlayers = () => {
        axios.get('http://localhost:8080/api/players')
            .then(response => {
                setPlayers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the players!', error);
            });
    };

    useImperativeHandle(ref, () => ({
        fetchPlayers
    }));

    return (
        <div>
            <PlayerForm></PlayerForm>
            <h1>Players List</h1>
            <ul>
                {players.map(player => (
                    <li key={player.id}>{player.name} {player.surname} - Age: {player.age}</li>
                ))}
            </ul>
            <PLayersGrid></PLayersGrid>
        </div>
    );
});

export default PlayerList;