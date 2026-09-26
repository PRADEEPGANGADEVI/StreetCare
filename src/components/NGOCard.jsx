import React from 'react';

const NGOCard = ({ ngo, onSendProposal }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
      <img src={ngo.imageUrl} alt={ngo.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-orange-800 mb-2">{ngo.name}</h2>
        <p className="text-sm text-gray-600 mb-2">{ngo.description}</p>
        <ul className="text-sm text-gray-700 mb-3 space-y-1">
          <li>Vacancies: <span className="font-medium">{ngo.vacancies}</span></li>
          <li>Storage: <span className="font-medium">{ngo.storage}</span></li>
          {ngo.certifications && (
            <li>Certifications: <span className="font-medium">{ngo.certifications.join(', ')}</span></li>
          )}
        </ul>
        <button
          onClick={onSendProposal}
          className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          Send Proposal
        </button>
      </div>
    </div>
  );
};

export default NGOCard;
