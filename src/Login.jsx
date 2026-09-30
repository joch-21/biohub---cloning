import React from 'react';
import './LoginPage.css';

import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock } from 'react-icons/fi';
import LogoImg from './assets/leaves.png';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {

    e.preventDefault(); 
    navigate('/dashboard');

  };

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="brand">
          <img src={LogoImg} alt="NiahBio Hub Logo" />
          <h1>NiahBio<br />Hub</h1>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <FiUser className="input-icon" />
            <input type="text" placeholder="Username" required />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input type="password" placeholder="Password" required />
          </div>

          <button type="submit" className="login-btn">Get Start</button>
        </form>
      </div>

      <div className="attribution">
        Made with <span>NiahBio Hub!</span> by Jack Ting
      </div>
    </div>
  );
}