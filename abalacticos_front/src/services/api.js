import axios from 'axios';

const API_URL = 'http://localhost:8080/api/players/add'; // Replace with your actual API URL

const addPlayer = async (playerData) => {
    try {
        const response = await axios.post(`${API_URL}/players`, playerData);
        return response.data;
    } catch (error) {
        console.error('Error adding player:', error);
        throw error;
    }
};

export { addPlayer };