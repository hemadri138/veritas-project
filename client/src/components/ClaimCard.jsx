import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClaimCard = ({ claim }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/claim/${claim.claim_id}`);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
      onClick={handleClick}
    >
      <div className="p-6">
        {/* Claim Statement */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-3">
          {claim.claim_statement}
        </h3>

        {/* Source URL */}
        <div className="mb-4">
          <a
            href={claim.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm truncate block"
            onClick={(e) => e.stopPropagation()}
          >
            {claim.source_url}
          </a>
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>By {claim.submitted_by_username}</span>
            <span>•</span>
            <span>{formatDate(claim.created_at)}</span>
          </div>
          
          {/* Status Badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(claim.status)}`}>
            {claim.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClaimCard;
