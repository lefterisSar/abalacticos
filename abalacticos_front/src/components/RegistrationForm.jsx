import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        email: ''
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/users/register', userData);
            console.log('User registered:', response.data);
            // Reset form fields after successful submission
            setUserData({
                username: '',
                password: '',
                email: ''
            });
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" value={userData.username} onChange={handleChange} placeholder="Username" required />
            <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Password" required />
            <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" required />
            <button type="submit">Register</button>
        </form>
    );
};

export default RegistrationForm;
