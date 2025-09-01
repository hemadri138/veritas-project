import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

const ClaimDetailsPage = () => {
  const { id } = useParams();
  const [claim, setClaim] = useState(null);
  const [votes, setVotes] = useState({ true: 0, false: 0, misleading: 0 });
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    
    fetchClaimDetails();
  }, [id]);

  const fetchClaimDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/claims/${id}`);
      setClaim(response.data.claim);
      setVotes(response.data.votes);
      setEvidence(response.data.evidence);
    } catch (error) {
      console.error('Error fetching claim details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading claim details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <p className="text-gray-600">Claim not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Claims
        </button>

        {/* Claim Details */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {claim.claim_statement}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span>Submitted by {claim.submitted_by_username}</span>
                <span>•</span>
                <span>{formatDate(claim.created_at)}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(claim.status)}`}>
              {claim.status}
            </span>
          </div>

          {/* Source URL */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Source</h3>
            <a
              href={claim.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 break-all"
            >
              {claim.source_url}
            </a>
          </div>
        </div>

        {/* Community Votes */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Community Votes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{votes.true}</div>
              <div className="text-sm text-green-700">True</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{votes.false}</div>
              <div className="text-sm text-red-700">False</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{votes.misleading}</div>
              <div className="text-sm text-yellow-700">Misleading</div>
            </div>
          </div>

          {!isLoggedIn && (
            <p className="text-center text-gray-600 mt-4">
              <a href="/" className="text-blue-600 hover:text-blue-800">Log in</a> to vote on this claim.
            </p>
          )}
        </div>

        {/* Supporting Evidence */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Supporting Evidence</h2>
          
          {evidence.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No evidence has been submitted yet. Be the first to contribute evidence!
            </p>
          ) : (
            <div className="space-y-6">
              {evidence.map((item) => (
                <div key={item.evidence_id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Evidence by {item.submitted_by_username}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(item.submitted_at)}
                      </p>
                    </div>
                  </div>
                  
                  {item.evidence_link && (
                    <div className="mb-4">
                      <a
                        href={item.evidence_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-all"
                      >
                        {item.evidence_link}
                      </a>
                    </div>
                  )}
                  
                  {item.comment && (
                    <p className="text-gray-700">{item.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isLoggedIn && (
            <p className="text-center text-gray-600 mt-6">
              <a href="/" className="text-blue-600 hover:text-blue-800">Log in</a> to submit evidence.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailsPage;
