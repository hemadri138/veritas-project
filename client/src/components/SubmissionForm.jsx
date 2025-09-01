import React, { useState } from 'react';

const SubmissionForm = ({ onSubmit, isLoggedIn }) => {
  const [formData, setFormData] = useState({
    source_url: '',
    claim_statement: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('Please log in to submit a claim');
      return;
    }
    onSubmit(formData);
    setFormData({ source_url: '', claim_statement: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit a New Claim</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="source_url" className="block text-sm font-medium text-gray-700 mb-2">
            Source URL *
          </label>
          <input
            type="url"
            id="source_url"
            name="source_url"
            value={formData.source_url}
            onChange={handleChange}
            placeholder="https://example.com/article"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="claim_statement" className="block text-sm font-medium text-gray-700 mb-2">
            Claim Statement *
          </label>
          <textarea
            id="claim_statement"
            name="claim_statement"
            value={formData.claim_statement}
            onChange={handleChange}
            placeholder="Enter the claim or statement you want to fact-check..."
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!isLoggedIn}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isLoggedIn
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoggedIn ? 'Submit Claim' : 'Please Log In to Submit'}
        </button>
      </form>
    </div>
  );
};

export default SubmissionForm;
