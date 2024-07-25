// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // State for error messages
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password
            });

            if (response.data && response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                navigate('/players'); // Redirect to players page after successful login
            } else {
                setError('Unexpected response format');
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Invalid username or password');
            } else {
                setError('An error occurred. Please try again later.');
                console.error('There was an error logging in!', error);
            }
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)}
                   placeholder="Username" required/>
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}
                   placeholder="Password" required/>
            <button type="submit">Login</button>
            <div>
                <h2>Login</h2>
                <div>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <button onClick={handleLogin}>Sign In</button>
                </div>
                {error && <div style={{color: 'red'}}>{error}</div>}
            </div>
        </form>
    );
};

export default Login;
