import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import './EditPropertyPage.css';

const Approve = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const propertyFromState = location.state?.product;

  const [formData, setFormData] = useState({
    title:'',
    area: '',
    length: '',
    breadth: '',
    shape: '',
    soilColor: '',
    price: '',
    location: '',
    description: '',
    loanFacility: false,
    ownerName: '',
    ownerPhone: '',
    ownerAadhar: '',
    
  });
  const [showTagModal, setShowTagModal] = useState(false);
const [pendingFormSubmit, setPendingFormSubmit] = useState(null);
const [tagInput, setTagInput] = useState('');


  const [status, setStatus] = useState('Under Review');
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideo, setExistingVideo] = useState(null);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [newFiles, setNewFiles] = useState({
    images: [],
    video: null,
    documents: [],
  });

  useEffect(() => {
    const property = propertyFromState;
    console.log(property);

    if (property) {
      setFormData({
        title: property.title || '',
        area: property.area || '',
        length: property.length || '',
        breadth: property.breadth || '',
        shape: property.shape || '',
        soilColor: property.soilColor || '',
        price: property.price || '',
        location: property.location || '',
        description: property.description || '',
        loanFacility: property.loanFacility || false,
        ownerName: property.ownerName || '',
        ownerPhone: property.ownerPhone || '',
        ownerAadhar: property.ownerAadhar || '',
      });

      setStatus('Approved');
      setExistingImages(property.images || []);
      setExistingVideo(property.video || null);
      setExistingDocuments(property.documents || []);
    } 
  }, [id, propertyFromState]);
  if (!propertyFromState) {
       return <div>Loading property details...</div>;}
console.log(formData);
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'video') {
      setNewFiles((prev) => ({ ...prev, video: files[0] }));
    } else {
      setNewFiles((prev) => ({
        ...prev,
        [name]: Array.from(files),
      }));
    }
  };

  const removeExistingMedia = (type, index) => {
    if (type === 'images') {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else if (type === 'documents') {
      setExistingDocuments((prev) => prev.filter((_, i) => i !== index));
    } else if (type === 'video') {
      setExistingVideo(null);
    }
  };
  const handleSubmit = (e) => {
  e.preventDefault();
  setPendingFormSubmit(true);  // Flag to trigger actual submit later
  setShowTagModal(true);       // Show modal
};


  const submitFormWithTag = async () => {
   

    const form = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      form.append(key, val);
    });

    // Change status to "Under Review" if originally approved
   
    form.append('status',status);
    form.append('tag', tagInput.trim());
    

    newFiles.images.forEach((img) => form.append('images', img));
    if (newFiles.video) form.append('video', newFiles.video);
    newFiles.documents.forEach((doc) => form.append('documents', doc));

    form.append('existingImages', JSON.stringify(existingImages));
    form.append('existingVideo', existingVideo || '');
    form.append('existingDocuments', JSON.stringify(existingDocuments));

    try {
      const res = await fetch(`http://localhost:4000/api/property/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: form,
      });

      const result = await res.json();
      if (res.ok) {
        alert('Property Approved successfully.');
        navigate('/review-properties');
      } else {
        alert(result.message || 'Failed to update property');
      }
    } catch (err) {
      console.error('Error updating property:', err);
      alert('Something went wrong');
    }
  };

 const handleDelete = async () => {
  if (!window.confirm('Are you sure you want to reject this property?')) return;

  const form = new FormData();
  Object.entries(formData).forEach(([key, val]) => {
    form.append(key, val);
  });

  form.append('status', 'Rejected');
  form.append('tag', ''); // You can prompt for a tag if needed

  newFiles.images.forEach((img) => form.append('images', img));
  if (newFiles.video) form.append('video', newFiles.video);
  newFiles.documents.forEach((doc) => form.append('documents', doc));

  form.append('existingImages', JSON.stringify(existingImages));
  form.append('existingVideo', existingVideo || '');
  form.append('existingDocuments', JSON.stringify(existingDocuments));

  try {
    const res = await fetch(`http://localhost:4000/api/property/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: form,
    });

    const result = await res.json();
    if (res.ok) {
      alert('Property rejected successfully.');
      navigate('/review-properties');
    } else {
      alert(result.message || 'Failed to reject property');
    }
  } catch (err) {
    console.error('Error rejecting property:', err);
    alert('Something went wrong while rejecting the property');
  }
};


  return (
    <div className="edit-property-container">
    <button className="back-btn" onClick={() => navigate('/review-properties')}>
    ← Back to properties
     </button>

      <h2>Approve property Listing</h2>
      <form onSubmit={handleSubmit} className="edit-property-form" encType="multipart/form-data">
        <label>Title:<input type="text" name="title" value={formData.title} onChange={handleInputChange} required /></label>
        <label>Area:<input type="text" name="area" value={formData.area} onChange={handleInputChange} /></label>
        <label>Length:<input type="text" name="length" value={formData.length} onChange={handleInputChange} /></label>
        <label>Breadth:<input type="text" name="breadth" value={formData.breadth} onChange={handleInputChange} /></label>
        <label>Shape:<input type="text" name="shape" value={formData.shape} onChange={handleInputChange} /></label>
        <label>Soil Color:<input type="text" name="soilColor" value={formData.soilColor} onChange={handleInputChange} /></label>
        <label>Price:<input type="text" name="price" value={formData.price} onChange={handleInputChange} required /></label>
        <label>Location:<input type="text" name="location" value={formData.location} onChange={handleInputChange} required /></label>
        <label>Description:<textarea name="description" value={formData.description} onChange={handleInputChange} /></label>
        <label>Loan Facility:<input type="checkbox" name="loanFacility" checked={formData.loanFacility} onChange={handleInputChange} /></label>
        <label>Owner Name:<input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} /></label>
        <label>Owner Phone:<input type="text" name="ownerPhone" value={formData.ownerPhone} onChange={handleInputChange} /></label>
        <label>Owner Aadhar:<input type="text" name="ownerAadhar" value={formData.ownerAadhar} onChange={handleInputChange} /></label>

        <div className="media-section">
          <h4>Existing Images</h4>
          {existingImages.map((img, idx) => (
            <div key={idx}>
              <img src={`http://localhost:4000${img}`} alt={`Image ${idx}`} width="100" />
              <button type="button" onClick={() => removeExistingMedia('images', idx)}>❌</button>
            </div>
          ))}
        </div>

        <label>Add New Images:<input type="file" name="images" accept="image/*" multiple onChange={handleFileChange} /></label>

        <div className="media-section">
          <h4>Existing Video</h4>
          {existingVideo && (
            <div>
              <video src={`http://localhost:4000${existingVideo}`} controls width="200" />
              <button type="button" onClick={() => removeExistingMedia('video')}>❌</button>
            </div>
          )}
        </div>

        <label>Add Video:<input type="file" name="video" accept="video/*" onChange={handleFileChange} /></label>

        <div className="media-section">
          <h4>Existing Documents</h4>
          {existingDocuments.map((doc, idx) => (
            <div key={idx}>
              <a href={`http://localhost:4000${doc}`} target="_blank" rel="noopener noreferrer">{`Document ${idx + 1}`}</a>
              <button type="button" onClick={() => removeExistingMedia('documents', idx)}>❌</button>
            </div>
          ))}
        </div>

        <label>Add Documents:<input type="file" name="documents" accept=".pdf" multiple onChange={handleFileChange} /></label>

        <button type="submit">Approve Property</button>
        <button type="button" onClick={handleDelete} className="delete-btn">Reject Property</button>
      </form>
      {showTagModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Optional: Add a Tag</h3>
      <input
        type="text"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        placeholder="Enter a tag (optional)"
      />
      <div className="modal-buttons">
        <button onClick={submitFormWithTag}>Submit</button>
        <button onClick={() => { setTagInput(''); submitFormWithTag(); }}>
          Skip
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Approve;
