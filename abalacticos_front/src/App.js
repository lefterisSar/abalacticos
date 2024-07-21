import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PlayersGrid from './components/PlayersGrid';
import Login from './components/Login';
import PlayerForm from './components/AddPlayerForm';

const App = () => (
    <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/players" element={<PlayersGrid />} />
            <Route path="/add-player" element={<PlayerForm />} />
            <Route path="/" element={<Navigate to="/players" />} />
        </Routes>
    </Router>
);

export default App;
