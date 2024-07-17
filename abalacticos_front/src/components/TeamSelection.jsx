import React from 'react';
import { Box, Grid, List, ListItem, ListItemText } from '@mui/material';

const TeamSelection = ({ teamA, teamB }) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <h3>Team A</h3>
                <List>
                    {teamA.map(player => (
                        <ListItem key={player.id}>
                            <ListItemText primary={`${player.name} ${player.surname}`} />
                        </ListItem>
                    ))}
                </List>
            </Grid>
            <Grid item xs={6}>
                <h3>Team B</h3>
                <List>
                    {teamB.map(player => (
                        <ListItem key={player.id}>
                            <ListItemText primary={`${player.name} ${player.surname}`} />
                        </ListItem>
                    ))}
                </List>
            </Grid>
        </Grid>
    );
};

export default TeamSelection;