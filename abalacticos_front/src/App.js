import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PlayersGrid from './components/PlayersGrid';
import Login from './components/Login';
import AddPlayerForm from './components/AddPlayerForm';
import RegistrationForm from './components/RegistrationForm';
import TeamSelection from './components/TeamSelection';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import PageNotFound from './components/PageNotFound';

const App = () => (
    <Router>
        <Header />
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/players" element={<PrivateRoute><PlayersGrid /></PrivateRoute>} />
            <Route path="/add-player" element={<PrivateRoute role="ADMIN"><AddPlayerForm /></PrivateRoute>} />
            <Route path="/team-selection" element={<PrivateRoute role="ADMIN"><TeamSelection /></PrivateRoute>} />
            <Route path="/admin-dashboard" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/players" />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    </Router>
);

export default App;
