import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AskaQuestion.css'; // Import the CSS file

function AskaQuestion() {
  const [question, setQuestion] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (question.trim()) {
      try {
        const response = await axios.post('http://localhost:3001/search', { question });
        if (response.status === 200) {
          navigate('/answers', { state: { answers: response.data } });
        }
      } catch (error) {
        console.error('Error submitting question:', error);
        alert('Failed to retrieve answers. Please try again.');
      }
    }
  };

  return (
    <div className="ask-page-container">
      <h1 className="ask-page-title">Ask a Question</h1>

      {/* Question Form */}
      <form className="question-form" onSubmit={handleSubmit}>
        <textarea
          className="question-input"
          placeholder="Type your question here..."
          value={question}
          onChange={handleInputChange}
          rows="4"
          required
        />
        <button type="submit" className="submit-button">
          Submit Question
        </button>
      </form>
    </div>
  );
}

export default AskaQuestion;
