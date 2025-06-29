import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditPropertyPage.css';

const apiUrl = process.env.REACT_APP_API_URL;

const EditPropertyPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const propertyFromState = location.state?.property;

  const [formData, setFormData] = useState({
    title: '',
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

      setStatus(property.status || 'Under Review');
      setExistingImages(property.images || []);
      setExistingVideo(property.video || null);
      setExistingDocuments(property.documents || []);
    }
  }, [id, propertyFromState]);

  if (!propertyFromState) return <div>Loading property details...</div>;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      form.append(key, val);
    });

    if (status === 'Approved' || status === 'Rejected') {
      form.append('status', 'Under Review');
    } else {
      form.append('status', status);
    }

    newFiles.images.forEach((img) => form.append('images', img));
    if (newFiles.video) form.append('video', newFiles.video);
    newFiles.documents.forEach((doc) => form.append('documents', doc));

    form.append('existingImages', JSON.stringify(existingImages));
    form.append('existingVideo', existingVideo || '');
    form.append('existingDocuments', JSON.stringify(existingDocuments));

    try {
      const res = await fetch(`${apiUrl}/api/property/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: form,
      });

      const result = await res.json();
      if (res.ok) {
        toast.success('Property updated successfully. Status set to Under Review.', {
          autoClose: 4000,
          pauseOnHover: true,
        });
         setTimeout(() => navigate('/your-properties'), 4000);
      } else {
        toast.error(result.message || '❌ Failed to update property');
      }
    } catch (err) {
      console.error('Error updating property:', err);
      toast.error('❌ Something went wrong');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this property?');
    if (!confirmed) return;

    try {
      const res = await fetch(`${apiUrl}/api/property/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        toast.success('Property deleted successfully.', {
          autoClose: 4000,
        });
        setTimeout(() => navigate('/your-properties'), 4000);
      } else {
        const result = await res.json();
        toast.error(result.message || '❌ Failed to delete property');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('❌ Failed to delete property');
    }
  };

  return (
    <div className="edit-property-container">
      <button className="back-btn" onClick={() => navigate('/your-properties')}>
        ← Back to properties
      </button>

      <h2>Edit Property</h2>
      <form onSubmit={handleSubmit} className="edit-property-form" encType="multipart/form-data">
        {/* Text Inputs */}
        {['title', 'area', 'length', 'breadth', 'shape', 'soilColor', 'price', 'location', 'ownerName', 'ownerPhone', 'ownerAadhar'].map((field) => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
            <input type="text" name={field} value={formData[field]} onChange={handleInputChange} required={['title', 'price', 'location'].includes(field)} />
          </label>
        ))}
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleInputChange} />
        </label>
        <label>
          Loan Facility:
          <input type="checkbox" name="loanFacility" checked={formData.loanFacility} onChange={handleInputChange} />
        </label>

        {/* Media Sections */}
        <div className="media-section">
          <h4>Existing Images</h4>
          {existingImages.map((img, idx) => (
            <div key={idx}>
              <img src={`${apiUrl}${img}`} alt={`Image ${idx}`} width="100" />
              <button type="button" onClick={() => removeExistingMedia('images', idx)}>❌</button>
            </div>
          ))}
        </div>
        <label>Add New Images:<input type="file" name="images" accept="image/*" multiple onChange={handleFileChange} /></label>

        <div className="media-section">
          <h4>Existing Video</h4>
          {existingVideo && (
            <div>
              <video src={`${apiUrl}${existingVideo}`} controls width="200" />
              <button type="button" onClick={() => removeExistingMedia('video')}>❌</button>
            </div>
          )}
        </div>
        <label>Add Video:<input type="file" name="video" accept="video/*" onChange={handleFileChange} /></label>

        <div className="media-section">
          <h4>Existing Documents</h4>
          {existingDocuments.map((doc, idx) => (
            <div key={idx}>
              <a href={`${apiUrl}${doc}`} target="_blank" rel="noopener noreferrer">{`Document ${idx + 1}`}</a>
              <button type="button" onClick={() => removeExistingMedia('documents', idx)}>❌</button>
            </div>
          ))}
        </div>
        <label>Add Documents:<input type="file" name="documents" accept=".pdf" multiple onChange={handleFileChange} /></label>

        <button type="submit">Update Property</button>
        <button type="button" onClick={handleDelete} className="delete-btn">Delete Property</button>
      </form>

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default EditPropertyPage;
