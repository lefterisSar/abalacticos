import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Header.css';

const Header = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem('authToken');
    let role = localStorage.getItem('userRole');
    if(role===null){
        role="null";
    }
    let userName = localStorage.getItem('userName');
    if(userName===null){
        userName="null";
    }

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    return (
        <header className="header">
            <img src="/abalacticosLogo.jpg" alt="Abalacticos Logo" className="logo"/>
            <li>Role: {role}</li>
            <li>UserName: {userName}</li>
            <nav>
                <ul>
                    {token && (
                        <>
                            <li><Link to="/players">Players</Link></li>
                            {role === 'ADMIN' && (
                                <>
                                    <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
                                </>
                            )}
                        </>
                    )}
                    {!token && (
                        <li><Link to="/login">Login</Link></li>
                    )}
                </ul>
                {token && (
                    <button onClick={handleLogout}>Logout</button>
                )}
            </nav>
        </header>
    );
};

export default Header;
