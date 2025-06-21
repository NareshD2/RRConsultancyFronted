import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WishlistPage.css';
const apiUrl = process.env.REACT_APP_API_URL;

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/wishlist`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        setWishlist(data);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div className="wishlist-page">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      <h2>Your Wishlisted Properties</h2>
      {wishlist.length === 0 ? (
        <p>No properties in wishlist yet.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((property) => (
            <div
              key={property._id}
              className="property-card"
               onClick={() =>
                    navigate(`/property/${property._id}`, { state: { property } })
                }
            >
              <img
                src={`${apiUrl}${property.images[0]}`}
                alt={property.title}
              />
              <div className="property-info">
                <h3>{property.title}</h3>
                <p>{property.location}</p>
                <p>{property.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
