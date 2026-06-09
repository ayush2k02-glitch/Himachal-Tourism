import React, { useState, useEffect } from 'react';
import { loginUser, registerUser } from '../js/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode === 'login');
    }
  }, [initialMode, isOpen]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleReset = () => {
    setName('');
    setEmail('');
    setPassword('');
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(handleReset, 300);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Field check
    if (!email.trim() || !password) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }

    if (!isLogin && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!isLogin && password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Sign In
        const data = await loginUser({ email: email.trim(), password });
        setIsLoading(false);
        if (data.success) {
          setSuccessMsg('Login successful! Welcome back.');
          // Store user and token
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          localStorage.setItem('authToken', data.token);
          
          setTimeout(() => {
            onAuthSuccess(data.user);
            handleClose();
          }, 1000);
        } else {
          setErrorMsg(data.message || 'Login failed.');
        }
      } else {
        // Sign Up
        const data = await registerUser({ name: name.trim(), email: email.trim(), password });
        setIsLoading(false);
        if (data.success) {
          setSuccessMsg('Registration successful! Redirecting to login...');
          setTimeout(() => {
            setIsLogin(true);
            setSuccessMsg('');
            setPassword('');
          }, 1500);
        } else {
          setErrorMsg(data.message || 'Registration failed.');
        }
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Failed to connect to the authentication server.');
    }
  };

  return (
    <div 
      className={`modal-overlay ${isOpen ? 'active' : ''}`} 
      onClick={(e) => e.target.classList.contains('modal-overlay') && handleClose()}
    >
      <div className="modal-box glass-panel" style={{ maxWidth: '420px' }}>
        <button className="modal-close" onClick={handleClose} aria-label="Close Authentication Modal">
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-header" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.8rem' }} className="text-gradient">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h3>
          <p style={{ marginTop: '0.35rem' }}>
            {isLogin 
              ? 'Enter your credentials to manage stays and bookings.' 
              : 'Sign up to unlock premium tourism features and instant bookings.'}
          </p>
        </div>

        {errorMsg && (
          <div 
            style={{ 
              background: 'rgba(231, 111, 81, 0.15)', 
              border: '1px solid rgba(231, 111, 81, 0.3)', 
              borderRadius: '8px', 
              color: '#e76f51', 
              padding: '0.75rem 1rem', 
              marginBottom: '1rem', 
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            ❌ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div 
            style={{ 
              background: 'rgba(42, 157, 143, 0.15)', 
              border: '1px solid rgba(42, 157, 143, 0.3)', 
              borderRadius: '8px', 
              color: 'var(--color-emerald)', 
              padding: '0.75rem 1rem', 
              marginBottom: '1rem', 
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            ✅ {successMsg}
          </div>
        )}

        <form className="modal-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="auth-name">Full Name</label>
              <div className="form-input-wrapper">
                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <input
                  type="text"
                  id="auth-name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Email Address</label>
            <div className="form-input-wrapper">
              <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              <input
                type="email"
                id="auth-email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label htmlFor="auth-password">Password</label>
            <div className="form-input-wrapper">
              <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <input
                type="password"
                id="auth-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="planner-generate-btn" 
            style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '1rem', marginTop: '0.5rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            type="button"
            onClick={toggleAuthMode}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--color-accent)', 
              fontWeight: '600', 
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0
            }}
            disabled={isLoading}
          >
            {isLogin ? 'Register Here' : 'Login Here'}
          </button>
        </div>
      </div>
    </div>
  );
}
