import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.sub.toUpperCase() !== 'ADMIN') {
            return <Navigate to="/forbidden" />;
        }
    } catch (error) {
        console.error('Token decoding failed:', error);
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
