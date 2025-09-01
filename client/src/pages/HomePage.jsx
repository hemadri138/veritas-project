import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import SubmissionForm from '../components/SubmissionForm';
import ClaimCard from '../components/ClaimCard';
import { api } from '../services/api';

const HomePage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    
    // Fetch claims
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await api.get('/claims');
      setClaims(response.data.claims || []);
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (loginData) => {
    try {
      const response = await api.post('/users/login', loginData);
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  const handleRegister = async (registerData) => {
    try {
      const response = await api.post('/users/register', registerData);
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const handleSubmitClaim = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/claims', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh claims list
      fetchClaims();
      alert('Claim submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit claim');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onLoginClick={() => setIsAuthModalOpen(true)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Veritas
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fact-check claims and statements with the power of community verification. 
            Submit claims, vote on their accuracy, and contribute evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submission Form */}
          <div className="lg:col-span-1">
            <SubmissionForm 
              onSubmit={handleSubmitClaim}
              isLoggedIn={isLoggedIn}
            />
          </div>

          {/* Claims List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Claims</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading claims...</p>
                </div>
              ) : claims.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No claims submitted yet. Be the first to submit a claim!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {claims.map((claim) => (
                    <ClaimCard key={claim.claim_id} claim={claim} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default HomePage;
