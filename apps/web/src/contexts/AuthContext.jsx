import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [otpId, setOtpId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.model) {
      setCurrentUser(pb.authStore.model);
    }
    setInitialLoading(false);
  }, []);

  const signup = async (email, password, name) => {
    const response = await apiServerClient.fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }
    
    const data = await response.json();
    return data;
  };

  const requestOTP = async (email) => {
    try {
      const tempPassword = crypto.randomUUID();
      await pb.collection('users').create({
        email: email,
        password: tempPassword,
        passwordConfirm: tempPassword,
      }, { $autoCancel: false });
    } catch (e) {
      // User already exists - continue
    }
    
    const result = await pb.collection('users').requestOTP(email, { $autoCancel: false });
    setOtpId(result.otpId);
    return result;
  };

  const verifyOTP = async (email, code) => {
    const response = await apiServerClient.fetch('/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otpId, code })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Verification failed');
    }
    
    const data = await response.json();
    setCurrentUser(data.user);
    return data;
  };

  const login = async (email, password) => {
    const response = await apiServerClient.fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const data = await response.json();
    setCurrentUser(data.user);
    return data;
  };

  const loginWithOAuth = (provider) => {
    pb.collection('users').authWithOAuth2({ provider })
      .then((authData) => {
        setCurrentUser(authData.record);
        navigate('/dashboard');
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };

  const logout = async () => {
    await apiServerClient.fetch('/auth/logout', { method: 'POST' });
    pb.authStore.clear();
    setCurrentUser(null);
    navigate('/');
  };

  const forgotPassword = async (email) => {
    const response = await apiServerClient.fetch('/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    
    return await response.json();
  };

  const resetPassword = async (token, newPassword, newPasswordConfirm) => {
    const response = await apiServerClient.fetch('/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword, newPasswordConfirm })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Reset failed');
    }
    
    return await response.json();
  };

  const updateProfile = async (updates) => {
    const response = await apiServerClient.fetch('/users/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Update failed');
    }
    
    const data = await response.json();
    setCurrentUser(data);
    return data;
  };

  const value = {
    currentUser,
    initialLoading,
    signup,
    requestOTP,
    verifyOTP,
    login,
    loginWithOAuth,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    otpId,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
