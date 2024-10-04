
import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from "axios"; // Import the useLocation hook
import './soccerfield.css';


const SoccerField = () => {
    const location = useLocation(); // Access the location object
    const { teamA, teamB } = location.state || {};  // Destructure teamA and teamB, with fallback to empty objects if undefined

    const [playersA, setPlayersA] = useState([]);
    const [playersB, setPlayersB] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // Loading state

    useEffect(() => {
        if (!teamA || !teamB) {
            console.error('teamA or teamB is not defined');
            return;
        }

        const fetchPlayers = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No auth token found');
                navigate('/login'); // Redirect to log in if not authenticated
                return;
            }

            const playerIdsA = teamA.map(playerStatusMap => Object.keys(playerStatusMap)[0]);
            const playerIdsB = teamB.map(playerStatusMap => Object.keys(playerStatusMap)[0]);

            try {
                const playersResponseA = await axios.post('http://localhost:8080/api/users/fetchByIds', playerIdsA, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const playersResponseB = await axios.post('http://localhost:8080/api/users/fetchByIds', playerIdsB, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (playersResponseA.data && Array.isArray(playersResponseA.data)) {
                    setPlayersA(playersResponseA.data);
                } else {
                    console.error('Unexpected response format:', playersResponseA.data);
                }

                if (playersResponseB.data && Array.isArray(playersResponseB.data)) {
                    setPlayersB(playersResponseB.data);
                } else {
                    console.error('Unexpected response format:', playersResponseB.data);
                }

            } catch (error) {
                console.error('There was an error fetching the players!', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login'); // Redirect to log in if unauthorized
                } else if (error.response && error.response.status === 403) {
                    navigate('/forbidden'); // Redirect to a forbidden page if access is denied
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlayers();
    }, [teamA, teamB, navigate]);

    if (isLoading) {
        return <div>Loading player data...</div>;
    }

    return (
        <div className="soccer-field-container">
            <h2>TEAMS</h2>
            <div className="pitch">
                <div className="center-circle"></div>

                {/* Render players for home team */}
                <div className="home-team">
                    {playersA.slice(0, 11).map((player, index) => (
                        <div key={player.id} className={`player player${index + 1}`}>
                            {player.name} {player.surname}
                        </div>
                    ))}
                </div>

                {/* Render players for visitor team */}
                <div className="visitor-team">
                    {playersB.slice(0, 11).map((player, index) => (
                        <div key={player.id} className={`player player${index + 1}`}>
                            {player.name} {player.surname}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default SoccerField;
