import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProposalContext } from '../context/ProposalContext';
import { getUserLocation } from '../utils/geolocation';
import { filterNGOsByDistance } from '../utils/distance';
import NGOCard from '../components/NGOCard';
import MapView from '../components/MapView';
import ProposalModal from '../components/ProposalModal';
import mockNGOData from '../data/mockData';

const NGOTracker = () => {
  const [userPos, setUserPos] = useState(null);
  const [nearbyNGOs, setNearbyNGOs] = useState([]);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { addProposal, proposals } = useContext(ProposalContext);
  const navigate = useNavigate();

  // Get user location on mount
  useEffect(() => {
    getUserLocation()
      .then(setUserPos)
      .catch(() => {
        // fallback to a default location (e.g., Delhi)
        setUserPos({ latitude: 28.6139, longitude: 77.209 });
      });
  }, []);

  // Filter NGOs once we have location & data
  useEffect(() => {
    if (!userPos) return;
    const filtered = filterNGOsByDistance(mockNGOData, userPos, 100000); // 100 km in meters
    setNearbyNGOs(filtered);
  }, [userPos]);

  const handleSendProposal = (ngo) => {
    setSelectedNGO(ngo);
    setShowModal(true);
    addProposal({ ngoId: ngo.id, status: 'pending' });
  };

  // Listen for proposal updates from mock realtime
  useEffect(() => {
    const accepted = proposals.find(p => p.ngoId === selectedNGO?.id && p.status === 'accepted');
    if (accepted) {
      setShowModal(false);
      // could navigate to a detail page or keep map view open
    }
  }, [proposals, selectedNGO]);

  return (
    <div className="p-4 max-w-7xl mx-auto relative min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-orange-700">Nearby NGOs (≤ 100 km)</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {nearbyNGOs.map((ngo) => (
          <NGOCard key={ngo.id} ngo={ngo} onSendProposal={() => handleSendProposal(ngo)} />
        ))}
      </div>

      {/* Map overlay */}
      {userPos && selectedNGO && (
        <MapView userPos={userPos} ngo={selectedNGO} show={!!selectedNGO} />
      )}

      {/* Proposal modal */}
      {showModal && selectedNGO && (
        <ProposalModal
          ngo={selectedNGO}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default NGOTracker;
