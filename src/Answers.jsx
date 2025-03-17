import React from 'react';
import { useLocation } from 'react-router-dom';
import './Answers.css'; // Import the CSS file


function Answers() {
  const location = useLocation();
  const { answers } = location.state || { answers: [] };

  console.log('Answers:', answers);

  return (
    <div className="answers-page-container">
      <h1 className="answers-page-title">Answers</h1>
      {answers.length > 0 ? (
        answers.map((answer, index) => (
          <div key={index} className="answer-item">
            <h3>{answer.topic}</h3>
            <p>{answer.description}</p>
            <p>{answer.resolution}</p>
            {answer.image_path && (
              <div>
                <img
                 src={`http://localhost:3001/uploads/${answer.image_path}`}
                 alt="Supporting"
                 style={{ maxWidth: '100%', height: 'auto' }}
                 
               
                />
                  <p>{answer.file_path55}</p> 
          

          {/* Download link */}
          <a href={`http://localhost:3001/uploads/${answer.file_path}`} download>
            Download File
          </a>
                </div>
               
            )}
            </div>
        ))
      ) : (
        <p>No answers found.</p>
      )}
    </div>
  );
}

export default Answers;
