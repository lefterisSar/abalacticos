import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import PlayerForm from "./components/AdminDashboardComponents/AddPlayerForm";
import PlayersGrid from "./components/PlayersGrid";
import TeamSelection from "./components/AdminDashboardComponents/TeamSelection";

//TODO TThis is kept on purpose but not used right now.

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Login from './Login'; // Import your Login component

const App = () => {
    const [teamA, setTeamA] = useState([]);
    const [teamB, setTeamB] = useState([]);

    const handleAddToTeamA = (player) => {
        // Remove from Team B if present
        setTeamB(prevTeamB => prevTeamB.filter(p => p.id !== player.id));
        // Add to Team A
        setTeamA(prevTeamA => [...prevTeamA, player]);
    };

    const handleRemoveFromTeamA = (player) => {
        setTeamA(prevTeamA => prevTeamA.filter(p => p.id !== player.id));
    };

    const handleAddToTeamB = (player) => {
        // Remove from Team A if present
        setTeamA(prevTeamA => prevTeamA.filter(p => p.id !== player.id));
        // Add to Team B
        setTeamB(prevTeamB => [...prevTeamB, player]);
    };

    const handleRemoveFromTeamB = (player) => {
        setTeamB(prevTeamB => prevTeamB.filter(p => p.id !== player.id));
    };

    return (
        <div>
            <PlayersGrid
                teamA={teamA}
                teamB={teamB}
                onAddToTeamA={handleAddToTeamA}
                onRemoveFromTeamA={handleRemoveFromTeamA}
                onAddToTeamB={handleAddToTeamB}
                onRemoveFromTeamB={handleRemoveFromTeamB}
            />
            <TeamSelection teamA={teamA} teamB={teamB} />
            <PlayerForm ></PlayerForm>
        </div>
    );
};

export default App;
