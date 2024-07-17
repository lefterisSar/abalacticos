import React from 'react';
import { Grid, List, ListItem, ListItemText } from '@mui/material';

const positions = ['GK', 'DR', 'DC', 'DL', 'MR', 'MC', 'ML', 'FC'];

const TeamSelection = ({ teamA, teamB }) => {
    const renderPlayerWithPosition = (player, position) => (
        <ListItem key={player.id}>
            <ListItemText primary={`${player.name} ${player.surname}`} secondary={position} />
        </ListItem>
    );

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <h3>Team A</h3>
                <List>
                    {teamA.map((player, index) => renderPlayerWithPosition(player, positions[index]))}
                </List>
            </Grid>
            <Grid item xs={6}>
                <h3>Team B</h3>
                <List>
                    {teamB.map((player, index) => renderPlayerWithPosition(player, positions[index]))}
                </List>
            </Grid>
        </Grid>
    );
};

export default TeamSelection;
