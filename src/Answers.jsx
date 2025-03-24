import React from 'react';
import { useLocation } from 'react-router-dom';
import './Answers.css';

function Answers() {
  const location = useLocation();
  const { answers } = location.state || { answers: [] };

  return (
    <div className="answers-page-container">
      <h1 className="answers-page-title">Answers</h1>
      {answers.length > 0 ? (
        answers.map((answer, index) => (
          <div key={index} className="answer-item">
            <h3 className="answer-topic">{answer.topic}</h3>
            <p className="answer-description">{answer.description}</p>
            <p className="answer-resolution">{answer.resolution}</p>
            
            {answer.file_path && (
              <div className="answer-file">
                <a href={`http://localhost:8081/${answer.file_path}`} download>
                  Download File
                </a>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="no-answers">No answers found.</p>
      )}
    </div>
  );
}

export default Answers;
