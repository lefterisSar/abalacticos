import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PlayersGrid from './components/PlayersGrid';
import Login from './components/Login';
import AddPlayerForm from './components/AdminDashboardComponents/AddPlayerForm';
import RegistrationForm from './components/RegistrationForm';
import TeamSelection from './components/AdminDashboardComponents/TeamSelection';
import TuesdayTeamSelection from "./components/TeamSelectionComponents/TuesdayTeamSelection";
import WednesdayTeamSelection from "./components/TeamSelectionComponents/WednesdayTeamSelection";
import FridayTeamSelection from "./components/TeamSelectionComponents/FridayTeamSelection";
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import PageNotFound from './components/PageNotFound';
import AvailabilityCalendar from "./components/AvailabilityCalendar";

const App = () => (
    <Router>
        <Header />
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/players" element={<PrivateRoute><PlayersGrid /></PrivateRoute>} />
            <Route path="/add-player" element={<PrivateRoute role="ADMIN"><AddPlayerForm /></PrivateRoute>} />
            <Route path="/team-selection" element={<PrivateRoute role="ADMIN"><TeamSelection /></PrivateRoute>} />
            <Route path="/admin-dashboard" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />
            <Route path="/availability" element={<AvailabilityCalendar />} />
            <Route path="/team-selection" element={<PrivateRoute role="ADMIN"><TeamSelection /></PrivateRoute>} />>
            <Route path="/team-selection/tuesday" element={<PrivateRoute role="ADMIN"><TuesdayTeamSelection /></PrivateRoute>} />
            <Route path="/team-selection/wednesday" element={<PrivateRoute role="ADMIN"><WednesdayTeamSelection /></PrivateRoute>} />
            <Route path="/team-selection/friday" element={<PrivateRoute role="ADMIN"><FridayTeamSelection /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/players" />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    </Router>
);

export default App;
