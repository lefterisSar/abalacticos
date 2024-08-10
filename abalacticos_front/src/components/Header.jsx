import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../Header.css';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t, i18n } = useTranslation(); // Initialize translation hook
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem('authToken');
    let role = localStorage.getItem('userRole');
    if (role === null) {
        role = "null";
    }
    let userName = localStorage.getItem('userName');
    if (userName === null) {
        userName = "null";
    }

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <header className="header">
            <img src="/abalacticosLogo.jpg" alt="Abalacticos Logo" className="logo" />
            <li>{t('role')}: {role}</li>
            <li>{t('username')}: {userName}</li>
            <nav>
                <ul>
                    {token && (
                        <>
                            {location.pathname !== '/availability' && (
                                <li><Link to="/availability">{t('availability')}</Link></li>
                            )}
                            {location.pathname !== '/players' && (
                                <>
                                    <li><Link to="/players">{t('players')}</Link></li>
                                </>
                            )}
                            {role === 'ADMIN' && location.pathname !== '/admin-dashboard' && (
                                <>
                                    <li><Link to="/admin-dashboard">{t('adminDashboard')}</Link></li>
                                </>
                            )}
                            {location.pathname !== '/matches' && (
                                <li><Link to="/matches">{t('matches')}</Link></li>
                            )}
                        </>
                    )}
                    {!token && location.pathname !== '/login' && (
                        <li><Link to="/login">{t('login')}</Link></li>
                    )}
                </ul>
                {token && (
                    <button onClick={handleLogout}>{t('logout')}</button>
                )}
            </nav>
            <div className="language-switcher">
                <button onClick={() => changeLanguage('en')}>English</button>
                <button onClick={() => changeLanguage('es')}>Español</button>
            </div>
        </header>
    );
};

export default Header;
