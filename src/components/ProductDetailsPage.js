import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductDetailsPage.css';
import Navbar from './Navbar';

const ProductDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const property = location.state?.property;
  const [zoomedIndex, setZoomedIndex] = useState(null);


  const [currentIndex, setCurrentIndex] = useState(0);

  if (!property) return <p className="not-found">Property not found</p>;

  const images = property.images || [];

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
     
      <div className="details-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Go Back
        </button>

        <h1 className="property-title">{property.title}</h1>

        {/* Image Slider */}
        <div className="slider-wrapper">
          {images.length > 0 ? (
            <>
            <button className="slider-btn left" onClick={prevSlide}>❮</button>
            <div className="slider-container">
              
              <img
                src={`http://localhost:4000${images[currentIndex]}`}
                alt={`property-${currentIndex + 1}`}
                className="slider-image"
                 onClick={() => setZoomedIndex(currentIndex)}
              />
              
            </div>
            <button className="slider-btn right" onClick={nextSlide}>❯</button>
            </>
          ) : (
            <p>No images available</p>
          )}
        </div>

        {/* Video */}
        {property.video && (
          <div className="video-section">
            <h3>Property Walkthrough</h3>
            <video className="property-video" controls>
              <source src={`http://localhost:4000${property.video}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Property Details */}
        <div className="property-info-section">
          <h2>Property Details</h2>
          <div className="property-grid">
            <p><strong>Area:</strong> {property.area}</p>
            <p><strong>Length:</strong> {property.length}</p>
            <p><strong>Breadth:</strong> {property.breadth}</p>
            <p><strong>Shape:</strong> {property.shape}</p>
            <p><strong>Soil Color:</strong> {property.soilColor}</p>
            <p><strong>Location:</strong> {property.location}</p>
            <p><strong>Loan Facility:</strong> {property.loanFacility ? 'Available' : 'Not Available'}</p>
            <p><strong>Price:</strong> {property.price || 'Contact for price'}</p>
          </div>

          <h3>Description</h3>
          <p className="description">{property.description}</p>
        </div>
        
      </div>
     {zoomedIndex !== null && (
  <div className="zoom-modal" onClick={() => setZoomedIndex(null)}>
    <button
      className="slider-btn left"
      onClick={(e) => {
        e.stopPropagation();
        setZoomedIndex((zoomedIndex - 1 + images.length) % images.length);
      }}
    >
      ❮
    </button>

    <img
      src={`http://localhost:4000${images[zoomedIndex]}`}
      alt="Zoomed"
      className="zoomed-img"
      onClick={(e) => e.stopPropagation()}
    />

    <button
      className="slider-btn right"
      onClick={(e) => {
        e.stopPropagation();
        setZoomedIndex((zoomedIndex + 1) % images.length);
      }}
    >
      ❯
    </button>
  </div>
)}


    </>
  );
};

export default ProductDetailsPage;
