import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadProperty.css';


const UploadProperty = () => {
  const [formData, setFormData] = useState({
    
    title: '',
    area: '',
    length: '',
    breadth: '',
    shape: '',
    soilColor: '',
    location: '',
    loanFacility: false,
    description: '',
    ownerName: '',
    ownerPhone: '',
    ownerAadhar: '',
    status: 'Under Review',
    price:'',
  });
  const navigate=useNavigate();

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    setImages([...e.target.files]);
  };

  const handleVideoUpload = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleDocumentUpload = (e) => {
    setDocuments([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    alert('Property uploaded and is under review.');
  };

  useEffect(() => {
    const uploadProperty = async () => {
      if (!submitted) return;

      const propertyData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        propertyData.append(key, value);
      });

      images.forEach((img, i) => {
        propertyData.append(`images`, img);
      });

      if (video) {
        propertyData.append('video', video);
      }

      documents.forEach((doc, i) => {
        propertyData.append('documents', doc);
      });

      try {
        const response = await fetch('http://localhost:4000/api/properties', {
          method: 'POST',
          body: propertyData,
          credentials:'include',
        });

        if (response.ok) {
          console.log('Property successfully uploaded!');
        } else {
          console.error('Failed to upload property.');
        }
      } catch (err) {
        console.error('Error uploading property:', err);
      } finally {
        setSubmitted(false);
      }
    };

    uploadProperty();
  }, [submitted, formData, images, video, documents]);

  return (
    <div className="upload-property-container">
      <button className="back-button" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      <h2>Upload Your Property</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Property Title" onChange={handleChange} required />
        <input name="area" placeholder="Area (sq ft)" onChange={handleChange} required />
        <input name="length" placeholder="Length (ft)" onChange={handleChange} required />
        <input name="breadth" placeholder="Breadth (ft)" onChange={handleChange} required />
        <input name="shape" placeholder="Shape" onChange={handleChange} required />
        <input name="soilColor" placeholder="Soil Color" onChange={handleChange} required />
        <input name="location" placeholder="Location" onChange={handleChange} required />

        <label>
          <input type="checkbox" name="loanFacility" onChange={handleChange} /> Loan Facility Available
        </label>

        <textarea name="description" placeholder="Property Description" onChange={handleChange} required />
        <input name="ownerName" placeholder="Owner Name" onChange={handleChange} required />
        <input name="ownerPhone" placeholder="Owner Phone No" onChange={handleChange} required />
        <input name="ownerAadhar" placeholder="Owner Aadhar No" onChange={handleChange} required />
         <input name="price" placeholder="price" onChange={handleChange} required />
        <label>Upload Images (multiple):</label>
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

        <label>Upload Property Video:</label>
        <input type="file" accept="video/*" onChange={handleVideoUpload} />

        <label>Upload Legal Documents (PDFs):</label>
        <input type="file" multiple accept="application/pdf" onChange={handleDocumentUpload} />

        <button type="submit">Submit Property</button>
      </form>
    </div>
  );
};

export default UploadProperty;
