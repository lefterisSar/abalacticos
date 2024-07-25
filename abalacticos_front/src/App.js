// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PlayersGrid from './components/PlayersGrid';
import Login from './components/Login';
import PlayerForm from './components/AddPlayerForm';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import './style.css';

const App = () => (
    <Router>
        <Header />
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/players" element={<PlayersGrid />} />
            <Route path="/add-player" element={<PrivateRoute><PlayerForm /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/players" />} />
            <Route path="/forbidden" element={<div>Forbidden</div>} />
        </Routes>
    </Router>
);

export default App;
