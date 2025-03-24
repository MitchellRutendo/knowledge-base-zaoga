import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AskaQuestion.css';

function AskaQuestion() {
  const [question, setQuestion] = useState(''); // User's input question
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
  const [faqs, setFaqs] = useState([]); // Frequently asked questions
  const navigate = useNavigate(); // Navigation hook

  // Fetch FAQs when component mounts
  useEffect(() => {
    fetchFaqs();
  }, []);

  // Fetch Frequently Asked Questions (FAQs)
  const fetchFaqs = async () => {
    try {
      const response = await axios.get('http://localhost:8081/faqs');
      if (response.status === 200) {
        setFaqs(response.data); // Save FAQs to state
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  // Handle form submission or pressing Enter
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Normalize the question: trim spaces and ensure it’s lowercase
    const trimmedQuestion = question.trim().toLowerCase();
  
    // Ensure the question is valid
    if (!trimmedQuestion) {
      alert('Please enter a valid question.');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      // Send the full sentence to the backend
      const answerResponse = await axios.post('http://localhost:8081/search', { question: trimmedQuestion });
      if (answerResponse.status === 200) {
        // Navigate to the Answers page with the results
        navigate('/answers', { state: { answers: answerResponse.data } });
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  // Handle FAQ click to fetch answers for the selected FAQ
  const handleFaqClick = async (faq) => {
    try {
      const response = await axios.post('http://localhost:8081/search', { question: faq.toLowerCase() });
      if (response.status === 200) {
        navigate('/answers', { state: { answers: response.data } }); // Redirect with answers
      }
    } catch (error) {
      console.error('Error fetching answers for FAQ:', error);
      alert('Failed to fetch answers. Please try again.');
    }
  };

  // Handle key press to allow the Enter key for submission
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default Enter behavior in the textarea
      handleSubmit(e); // Trigger the submit function
    }
  };

  return (
    <div className="ask-page-container">
      <h1 className="ask-page-title">Ask a Question</h1>
      <form className="question-form" onSubmit={handleSubmit}>
        <textarea
          className="question-input"
          placeholder="Type your question here..."
          value={question}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress} // Trigger submit on Enter key
          rows="4"
          required
        />
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Question'}
        </button>
      </form>

      {/* Frequently Asked Questions Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <ul className="faq-list">
          {faqs.map((faq, index) => (
            <li
              key={index}
              className="faq-item"
              onClick={() => handleFaqClick(faq.question)} // Clickable FAQ
              style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} // Styling for clickable FAQs
            >
              {faq.question}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AskaQuestion;
