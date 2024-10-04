// src/components/SoccerField.jsx
import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from "axios"; // Import the useLocation hook
import './soccerfield.css';


const SoccerField = () => {
    const location = useLocation(); // Access the location object
    const { team, teamName } = location.state; // Destructure the team data and teamName from the state
    const [players, setPlayers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchPlayers = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No auth token found');
                navigate('/login'); // Redirect to log in if not authenticated
                return;
            }

            const playerIds = team.map(playerStatusMap => Object.keys(playerStatusMap)[0]); // Extract player IDs from the team

            try {
                const playersResponse = await axios.post('http://localhost:8080/api/users/fetchByIds', playerIds, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (playersResponse.data && Array.isArray(playersResponse.data)) {
                    setPlayers(playersResponse.data); // Store the fetched player details
                } else {
                    console.error('Unexpected response format:', playersResponse.data);
                }
            } catch (error) {
                console.error('There was an error fetching the players!', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login'); // Redirect to log in if unauthorized
                } else if (error.response && error.response.status === 403) {
                    navigate('/forbidden'); // Redirect to a forbidden page if access is denied
                }
            } finally {
                setIsLoading(false); // Set loading to false after fetching
            }
        };

        fetchPlayers();
    }, [team, navigate]); // Re-run the effect if the team or navigate function changes

    if (isLoading) {
        return <div>Loading player data...</div>;
    }

    return (
        <div className="soccer-field-container">
            <h2>{teamName}</h2>
            <div className="soccer-field">
                {players.length > 0 ? (
                    players.map((player, index) => (
                        <div key={index} className="player-position">
                            {player.name} {player.surname} - {player.position || 'Unknown Position'}
                        </div>
                    ))
                ) : (
                    <div>No players found</div>
                )}
            </div>
            <section className="pitch">
                <div className="field left">
                    <div className="penalty-area">
                    </div>
                </div>
                <div className="field right">
                    <div className="penalty-area">
                    </div>
                </div>
                <div className="center-circle"></div>
                <div className="home-team">
                    <div className="player one"></div>
                    <div className="player two"></div>
                    <div className="player three"></div>
                    {/*<div className="player four"></div>*/}
                    <div className="player five"></div>
                    <div className="player six"></div>
                    <div className="player seven"></div>
                    <div className="player eight"></div>
                    {/*<div className="player nine"></div>*/}
                    {/*<div className="player ten"></div>*/}
                    <div className="player eleven"></div>
                </div>
                <div className="visitor-team">
                    <div className="player one"></div>
                    <div className="player two"></div>
                    <div className="player three"></div>
                    {/*<div className="player four"></div>*/}
                    <div className="player five"></div>
                    <div className="player six"></div>
                    <div className="player seven"></div>
                    <div className="player eight"></div>
                    {/*<div className="player nine"></div>*/}
                    {/*<div className="player ten"></div>*/}
                    <div className="player eleven"></div>
                </div>
            </section>
        </div>);
};

export default SoccerField;
