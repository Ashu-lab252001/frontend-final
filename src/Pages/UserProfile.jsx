import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import API_ENDPOINTS from '../config/api';
import { useAuth } from '../context/AuthContext'; 
import '../styles/UserProfile.css';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

export default function UserProfile() {
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isLoggedIn) {
        setRedirect(true);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(API_ENDPOINTS.apiUserInfoGet, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUserInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setRedirect(true);
      }
    };

    fetchUserInfo();
  }, [isLoggedIn]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        API_ENDPOINTS.apiUserInfoUpdate,
        { name: userInfo.name, email: userInfo.email, oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  if (loading) return <div className="UserProfile__loading">Loading...</div>;

  return (
    <div className="UserProfile__page">
      <div className="UserProfile__container">
        <h2 className="UserProfile__header">Settings</h2>
        <div className="UserProfile__form">
          <div className="UserProfile__formGroup">
            <FaUser />
            <input
              type="text"
              placeholder="Name"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            />
          </div>
          <div className="UserProfile__formGroup">
            <FaEnvelope />
            <input
              type="email"
              placeholder="Update Email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            />
          </div>
          <div className="UserProfile__formGroup">
            <FaLock />
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="UserProfile__formGroup">
            <FaLock />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button className="UserProfile__updateBtn" onClick={handleUpdate}>
            Update
          </button>
        </div>

        <button className="UserProfile__backToWorkspaceBtn" onClick={() => navigate('/workspace')}>
          Back to Workspace
        </button>
        <button className="UserProfile__logoutBtn" onClick={logout}>Log out</button>
      </div>
    </div>
  );
}