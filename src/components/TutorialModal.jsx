import React from 'react';
import './TutorialModal.css';

const TutorialModal = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="tutorial-modal-overlay" onClick={onClose}>
      <div className="tutorial-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="tutorial-header">
          <h2>Welcome to Filmdle! 🎬</h2>
          <p>Let's get you started!</p>
        </div>
        
        <div className="tutorial-body">
          <div className="tutorial-section">
            <h3>🎯 How to Play</h3>
            <ul>
              <li>Guess the daily movie by entering your guess in the search bar</li>
              <li>Get hints about the movie's genre, year, actors, and other details</li>
              <li>Use the comparison feature to see how close you are ⬆️⬇️</li>
              <li>Try to guess the movie in as few attempts as possible!</li>
            </ul>
          </div>

          <div className="tutorial-section">
            <h3>📊 Features</h3>
            <ul>
              <li><strong>Today's Game:</strong> Play the daily movie challenge</li>
              <li><strong>Archive:</strong> View your past games and results</li>
              <li><strong>Stats:</strong> Track your performance and streaks</li>
              <li><strong>Sign In:</strong> Save your progress across devices</li>
            </ul>
          </div>

          <div className="tutorial-section">
            <h3>💡 Tips</h3>
            <ul>
              <li>Pay attention to the hints - they'll help narrow down your search</li>
              <li>Don't give up too quickly - sometimes the answer is closer than you think!</li>
            </ul>
          </div>
        </div>

        <div className="tutorial-footer">
          <button className="tutorial-close-btn" onClick={onClose}>
            Let's Play! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
