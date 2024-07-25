import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        const token = localStorage.getItem('authToken');

        if (token) {
            try {
                await axios.post('http://localhost:8080/api/auth/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error('Error during sign out:', error);
            }
        }

        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <header>
            <img src="/abalacticosLogo.jpg" alt="Abalacticos Logo" className="logo" />
            <button onClick={handleSignOut}>Sign Out</button>
        </header>
    );
};

export default Header;
