import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './YourPropertiesPage.css';
const apiUrl = process.env.REACT_APP_API_URL;

const YourPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/my-properties`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setProperties(data);
      } catch (err) {
        console.error('Failed to fetch user properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, []);

  const handleModify = (property) => {
    
    navigate(`/edit-property/${property._id}`, { state: { property } });
  };

  return (
    <div className="your-properties-container">
      <button className="back-btn" onClick={() => navigate('/dashboard')}>
    ← Back to Dashboard
     </button>
      <h2>Your Uploaded Properties</h2>

      {loading ? (
        <p>Loading your properties...</p>
      ) : properties.length === 0 ? (
        <p>You haven’t uploaded any properties yet.</p>
      ) : (
        <div className="properties-list">
          {properties.map((property) => (
            <div key={property._id} className="property-card">
              <img
                src={`${apiUrl}${property.images[0]}`}
                alt={property.title}
                className="property-image"
              />
              <div className="property-details">
                <h3>{property.title}</h3>
                <p><strong>Location:</strong> {property.location}</p>
                <p><strong>Price:</strong> {property.price}</p>
                <p><strong>Status:</strong> <span className={`status ${property.status.toLowerCase()}`}>{property.status}</span></p>
                <button className="modify-btn" onClick={() => handleModify(property)}>
                  Modify
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourPropertiesPage;
