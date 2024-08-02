import React from 'react';
import { Link } from 'react-router-dom';

const TeamSelection = () => {
    return (
        <div>
            <h1>Team Selection</h1>
            <nav>
                <ul>
                    <li><Link to="/team-selection/tuesday">Tuesday</Link></li>
                    <li><Link to="/team-selection/wednesday">Wednesday</Link></li>
                    <li><Link to="/team-selection/friday">Friday</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default TeamSelection;
