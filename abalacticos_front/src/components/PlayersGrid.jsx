import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import axios from 'axios';

const PlayersGrid = ({ teamA, teamB, onAddToTeamA, onRemoveFromTeamA, onAddToTeamB, onRemoveFromTeamB }) => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/players')
            .then(response => {
                setRows(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the players!', error);
            });
    }, []);

    const isPlayerInTeamA = (id) => {
        return teamA.some(player => player.id === id);
    };

    const isPlayerInTeamB = (id) => {
        return teamB.some(player => player.id === id);
    };

    const isTeamFull = (team) => {
        return team.length >= 8;
    };

    const columns = [
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'surname', headerName: 'Surname', width: 150 },
        { field: 'age', headerName: 'Age', width: 100 },
        { field: 'debutDate', headerName: 'Debut Date', width: 150 },
        { field: 'lastGK', headerName: 'Last Game Date', width: 150 },
        { field: 'wins', headerName: 'Wins', width: 100 },
        { field: 'loses', headerName: 'Loses', width: 100 },
        { field: 'draws', headerName: 'Draws', width: 100 },
        {
            field: 'addToTeamA',
            headerName: 'Team A',
            width: 150,
            renderCell: (params) => {
                const inTeamA = isPlayerInTeamA(params.row.id);
                const inTeamB = isPlayerInTeamB(params.row.id);
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => inTeamA ? onRemoveFromTeamA(params.row) : onAddToTeamA(params.row)}
                        disabled={!inTeamA && (inTeamB || isTeamFull(teamA))}
                    >
                        {inTeamA ? 'Remove from Team A' : 'Add to Team A'}
                    </Button>
                );
            }
        },
        {
            field: 'addToTeamB',
            headerName: 'Team B',
            width: 150,
            renderCell: (params) => {
                const inTeamA = isPlayerInTeamA(params.row.id);
                const inTeamB = isPlayerInTeamB(params.row.id);
                return (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => inTeamB ? onRemoveFromTeamB(params.row) : onAddToTeamB(params.row)}
                        disabled={!inTeamB && (inTeamA || isTeamFull(teamB))}
                    >
                        {inTeamB ? 'Remove from Team B' : 'Add to Team B'}
                    </Button>
                );
            }
        }
    ];

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} />
        </div>
    );
};

export default PlayersGrid;
