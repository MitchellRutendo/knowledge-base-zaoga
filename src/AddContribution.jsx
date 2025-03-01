import React, { useState } from 'react';
import './AddContribution.css'; // Import the CSS file
import axios from 'axios'; // Import axios

function AddContribution() {
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    resolution: '',
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append('topic', formData.topic);
    data.append('description', formData.description);
    data.append('resolution', formData.resolution);
    if (formData.file) {
      data.append('file', formData.file);
    }
  
    console.log('Form Data Submitted:', data); // Log the form data
  
    try {
      const response = await axios.post('http://localhost:3001/articles', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        alert('Contribution Submitted Successfully!');
        setFormData({
          topic: '',
          description: '',
          resolution: '',
          file: null,
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error); // Log the error
      alert('Failed to submit contribution. Please try again.');
    }
  };
  

  return (
    <div className="contribution-page-container">
      <h1 className="contribution-page-title">Add Your Contribution</h1>

      <form className="contribution-form" onSubmit={handleSubmit}>
        {/* Topic of Contribution */}
        <div className="form-group">
          <label className="form-label" htmlFor="topic">
            Topic of Contribution
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            className="form-input"
            placeholder="Enter the topic..."
            value={formData.topic}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            placeholder="Provide a detailed description..."
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            required
          />
        </div>

        {/* Resolution */}
        <div className="form-group">
          <label className="form-label" htmlFor="resolution">
            Resolution
          </label>
          <textarea
            id="resolution"
            name="resolution"
            className="form-textarea"
            placeholder="Explain the resolution..."
            value={formData.resolution}
            onChange={handleInputChange}
            rows="4"
            required
          />
        </div>

        {/* File Upload */}
        <div className="form-group">
          <label className="form-label" htmlFor="file">
            Upload Supporting File (Optional)
          </label>
          <input
            type="file"
            id="file"
            name="file"
            className="form-input"
            onChange={handleFileChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Submit Contribution
        </button>
      </form>
    </div>
  );
}

export default AddContribution;
