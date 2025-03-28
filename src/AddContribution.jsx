import React, { useState } from 'react';
import './AddContribution.css'; // Import the CSS file
import axios from 'axios'; // Import axios

function AddContribution() {
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    resolution: '',
    file: null,
    image: null, // Add state for image
  });

  // Sample topics for dropdown menu
  const topics = ["Printer", "Network", "Emails", "Hardware", "Maximum Login"];

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

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0], // Add image file to state
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
    if (formData.image) {
      data.append('image', formData.image); // Append image to form data
    }

    console.log('Form Data Submitted:', data); // Log the form data

    try {
      const response = await axios.post('http://localhost:8081/articles', data, {
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
          image: null, // Reset image state
        });
      }
    } catch (error) {
      console.error('Error:', error);
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
          <select
            id="topic"
            name="topic"
            className="form-select"
            value={formData.topic}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select a topic
            </option>
            {topics.map((topic, index) => (
              <option key={index} value={topic}>
                {topic}
              </option>
            ))}
          </select>
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
          {/* Image Upload inside Description */}
          <label className="form-label" htmlFor="image">
            Upload Supporting Image (Optional)
          </label>
          <input
            type="file"
            id="image"
            name="image"
            className="form-input"
            onChange={handleImageChange}
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
