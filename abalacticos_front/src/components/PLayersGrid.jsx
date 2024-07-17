import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'surname', headerName: 'Surname', width: 150 },
    { field: 'age', headerName: 'Age', width: 100 },
    { field: 'debutDate', headerName: 'Debut Date', width: 150 },
    { field: 'lastGK', headerName: 'Last Date as GK', width: 150 },
    { field: 'wins', headerName: 'Wins', width: 100 },
    { field: 'loses', headerName: 'Loses', width: 100 },
    { field: 'draws', headerName: 'Draws', width: 100 },
];

const PlayersGrid = () => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = () => {
        axios.get('http://localhost:8080/api/players')
            .then(response => {
                // Assuming the response data is an array of players
                const players = response.data.map((player, index) => ({
                    id: player.id,  // Make sure `id` is unique for each player
                    name: player.name,
                    surname: player.surname,
                    age: player.age,
                    debutDate: player.debutDate,
                    lastGK: player.lastGK,
                    wins: player.wins,
                    loses: player.loses,
                    draws: player.draws,
                }));
                setRows(players);
            })
            .catch(error => {
                console.error('There was an error fetching the players!', error);
            });
    };

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>
    );
};

export default PlayersGrid;
