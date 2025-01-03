import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './FormHeader.css';
import SharePopup from '../PopUp/SharePopup';
import API_ENDPOINTS from '../../config/api';

function FormHeader({ formName, onSave, onFormNameChange, authenticatedFetch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const formId = location.pathname.split('/').pop();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Function to save form to the backend
  const saveFormToBackend = async () => {
    try {
      const response = await authenticatedFetch(API_ENDPOINTS.apiFormsSave(formId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formName }),
      });
      const data = await response.json();
      console.log('Form saved successfully:', data);
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  const handleShare = async () => {
    try {
      const response = await authenticatedFetch(API_ENDPOINTS.apiFormsShare(formId), {
        method: 'POST',
      });
      const data = await response.json();
      setShareLink(data.shareableLink);
      setShowSharePopup(true);
    } catch (error) {
      console.error('Error generating share link:', error);
    }
  };

  const handleInviteByEmail = () => {
    if (!inviteEmail) {
      alert('Please enter an email address.');
      return;
    }
    alert(`Invite sent to ${inviteEmail}`); // Replace with backend integration
    setInviteEmail('');
  };

  const handleTabClick = (tab) => {
    switch (tab) {
      case 'Flow':
        navigate(`/flow/${formId}`);
        break;
      case 'Response':
        navigate(`/response/${formId}`);
        break;
      default:
        navigate('/workspace');
    }
  };

  const handleSave = () => {
    onSave();
    localStorage.setItem(`form_${formId}`, JSON.stringify({ formName }));
    alert('Form created successfully');
    saveFormToBackend(); // Call backend save function
    navigate(`/response/${formId}`); // Redirect to response page
  };

  return (
    <header className="form-header">
      <input
        type="text"
        placeholder="Enter Form Name"
        className="form-header__input"
        value={formName}
        onChange={(e) => onFormNameChange(e.target.value)}
      />
      <nav className="form-header__nav">
        <button
          className={`form-header__tab ${location.pathname.includes('/flow') ? 'active' : ''}`}
          onClick={() => handleTabClick('Flow')}
        >
          Flow
        </button>
        <button
          className={`form-header__tab ${location.pathname.includes('/response') ? 'active' : ''}`}
          onClick={() => handleTabClick('Response')}
        >
          Response
        </button>
      </nav>
      <div className="form-header__actions">
        <label className="form-header__theme-toggle">
          <span>Light</span>
          <input
            type="checkbox"
            className="theme-toggle-checkbox"
            checked={isDarkMode}
            onChange={toggleTheme}
          />
          <span>Dark</span>
        </label>
        <button
          className="form-header__action form-header__action--share"
          onClick={handleShare}
        >
          Share
        </button>
        <button
          className="form-header__action form-header__action--save"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="form-header__action form-header__action--close"
          onClick={() => navigate('/workspace')}
        >
          ✕
        </button>
      </div>
      {showSharePopup && (
        <div className="popup">
          <h3>Share Form</h3>
          <div>
            <label>
              Invite by Email:
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </label>
            <button onClick={handleInviteByEmail}>Send Invite</button>
          </div>
          <div>
            <label>
              Shareable Link:
              <input
                type="text"
                value={shareLink}
                readOnly
                onClick={(e) => e.target.select()}
              />
            </label>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                alert('Link copied to clipboard!');
              }}
            >
              Copy Link
            </button>
          </div>
          <button onClick={() => setShowSharePopup(false)}>Close</button>
        </div>
      )}
    </header>
  );
}

export default FormHeader;
