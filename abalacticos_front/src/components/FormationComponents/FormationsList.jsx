import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FormationsList() {
  const [formations, setFormations] = useState([]);
  const [expandedFormationId, setExpandedFormationId] = useState(null);
  const [editedFormation, setEditedFormation] = useState({});
  const navigate = useNavigate();

  // Common function to get the token
  const getToken = () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
          navigate('/login');
          return null;
      }
      return token;
  };

  // Fetch formations on component mount
  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    const token = getToken();
    try {
      const response = await axios.get('/api/formations/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormations(response.data);
    } catch (error) {
      console.error('Error fetching formations:', error);
      // Handle error (e.g., show a message to the user)
    }
  };

  const handleExpand = (id) => {
    setExpandedFormationId(expandedFormationId === id ? null : id);
    const formation = formations.find((f) => f.id === id);
    setEditedFormation({ ...formation }); // Copy the formation data for editing
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedFormation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async (id) => {
    const token = getToken();
    try {
      await axios.put(`/api/formations/update/${id}`, editedFormation, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Update the formations list after saving
      fetchFormations();
      setExpandedFormationId(null);
    } catch (error) {
      console.error('Error updating formation:', error);
      // Handle error
    }
  };

  const handleDelete = async (id) => {
    const token = getToken();
    if (window.confirm('Are you sure you want to delete this formation?')) {
      try {
        await axios.delete(`/api/formations/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Remove the formation from the list
        setFormations((prevFormations) =>
          prevFormations.filter((formation) => formation.id !== id)
        );
      } catch (error) {
        console.error('Error deleting formation:', error);
        // Handle error
      }
    }
  };

  return (
    <div>
      <h2>All Formations</h2>
      <ul>
        {formations.map((formation) => (
          <li key={formation.id}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span onClick={() => handleExpand(formation.id)} style={{ cursor: 'pointer', flex: 1 }}>
                {`Date: ${formation.date}, Players: ${formation.numberOfPlayers}`}
              </span>
              <button onClick={() => handleDelete(formation.id)}>Delete</button>
            </div>
            {expandedFormationId === formation.id && (
              <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                <h3>Edit Formation</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave(formation.id);
                  }}
                >
                  <div>
                    <label>
                      Date:
                      <input
                        type="date"
                        name="date"
                        value={editedFormation.date}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Number of Players:
                      <input
                        type="number"
                        name="numberOfPlayers"
                        value={editedFormation.numberOfPlayers}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  {/* Add other fields as needed */}
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setExpandedFormationId(null)}>
                    Cancel
                  </button>
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FormationsList;
