import React, { createContext, useEffect, useState } from 'react';
import { mockRealtime } from '../api/mockRealtime';

// Context to hold proposals and realtime updates
export const ProposalContext = createContext({
  proposals: [],
  addProposal: () => {},
});

export const ProposalProvider = ({ children }) => {
  const [proposals, setProposals] = useState([]);

  // Initialize mock realtime listener once
  useEffect(() => {
    const unsubscribe = mockRealtime((update) => {
      setProposals((prev) =>
        prev.map((p) => (p.ngoId === update.ngoId ? { ...p, status: update.status } : p))
      );
    });
    return () => unsubscribe();
  }, []);

  const addProposal = (proposal) => {
    setProposals((prev) => [...prev, proposal]);
    // Emit to mock realtime (simulates NGO response)
    mockRealtime.sendProposal(proposal.ngoId);
  };

  return (
    <ProposalContext.Provider value={{ proposals, addProposal }}>
      {children}
    </ProposalContext.Provider>
  );
};
