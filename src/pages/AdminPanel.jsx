import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, Building2, Search, Award, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { INITIAL_NGOS } from '../data/mockData';

export default function AdminPanel() {
  const [ngos, setNgos] = useState([
    ...INITIAL_NGOS,
    {
      id: 'ngo-pending-1',
      name: 'Samarpan Shelter & Seva Samiti',
      darpanId: 'UP/2023/0394821',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      phone: '+91 98390 11223',
      email: 'contact@samarpanvaranasi.org',
      focus: 'Ghat destitute and child beggars',
      tier: 'Bronze',
      status: 'Pending Review',
      shelterCapacity: 60,
      casesResolved: 320
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = (id, newTier = 'Silver') => {
    setNgos((prev) =>
      prev.map((ngo) =>
        ngo.id === id ? { ...ngo, status: 'Verified', tier: newTier } : ngo
      )
    );
    toast.success(`NGO verified and elevated to ${newTier} Tier!`);
  };

  const handleReject = (id) => {
    setNgos((prev) =>
      prev.map((ngo) => (ngo.id === id ? { ...ngo, status: 'Rejected' } : ngo))
    );
    toast.error('NGO accreditation declined');
  };

  const filtered = ngos.filter(
    (n) =>
      n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.darpanId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Administrative Accreditation Board
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            NGO Verification & Tier Approval Portal
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Scrutinize NITI Aayog NGO Darpan IDs, 12A/80G status, and grant rescue dispatch privileges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://ngodarpan.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
          >
            Check NGO Darpan Portal <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
          <span className="block text-2xl font-black text-gray-900">{ngos.length}</span>
          <span className="text-[11px] font-semibold text-gray-500">Registered NGOs</span>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center shadow-sm">
          <span className="block text-2xl font-black text-emerald-600">
            {ngos.filter((n) => n.status === 'Verified').length}
          </span>
          <span className="text-[11px] font-semibold text-emerald-800">Verified &amp; Active</span>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center shadow-sm">
          <span className="block text-2xl font-black text-amber-600">
            {ngos.filter((n) => n.status === 'Pending Review').length}
          </span>
          <span className="text-[11px] font-semibold text-amber-800">Pending Review</span>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center shadow-sm">
          <span className="block text-2xl font-black text-red-600">
            {ngos.filter((n) => n.status === 'Rejected').length}
          </span>
          <span className="text-[11px] font-semibold text-red-800">Declined</span>
        </div>
      </div>

      {/* Tier Explanation Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
          <div className="text-xs font-bold uppercase text-amber-800 flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-600" aria-hidden="true" /> Bronze Tier
          </div>
          <p className="text-[11px] text-amber-900 mt-1">
            Basic Registration verified on NGO Darpan portal. Can receive citizen alerts.
          </p>
        </div>
        <div className="bg-slate-100 border border-slate-300 rounded-2xl p-4">
          <div className="text-xs font-bold uppercase text-slate-800 flex items-center gap-1">
            <Award className="w-4 h-4 text-slate-500" aria-hidden="true" /> Silver Tier
          </div>
          <p className="text-[11px] text-slate-700 mt-1">
            12A Tax-exempt, audited accounts, verified shelter capacity. Priority alerts.
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-4">
          <div className="text-xs font-bold uppercase text-yellow-800 flex items-center gap-1">
            <Award className="w-4 h-4 text-yellow-600" aria-hidden="true" /> Gold Tier
          </div>
          <p className="text-[11px] text-yellow-900 mt-1">
            MoSJE SMILE Beggary Scheme partner with dedicated rescue vans &amp; shelters.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-3.5 text-gray-400" aria-hidden="true" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by NGO name, city, or Darpan ID (e.g. DL/2010...)"
          className="w-full pl-11 pr-10 py-3 rounded-2xl border border-gray-300 text-sm focus:outline-none focus:border-orange-500 bg-white"
          aria-label="Search NGOs by name, city, or Darpan ID"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 p-1 text-xs font-bold"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Table of NGOs */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" aria-label="NGO Verification Table">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">NGO Name &amp; City</th>
                <th className="py-3.5 px-4">Darpan ID</th>
                <th className="py-3.5 px-4">Tier</th>
                <th className="py-3.5 px-4">Verification Status</th>
                <th className="py-3.5 px-4 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((ngo) => (
                  <tr key={ngo.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-900 text-sm">{ngo.name}</div>
                      <div className="text-gray-500 text-[11px]">{ngo.city}, {ngo.state}</div>
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-gray-700">
                      {ngo.darpanId}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        ngo.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                        ngo.tier === 'Silver' ? 'bg-slate-200 text-slate-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ngo.tier}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        ngo.status === 'Verified' ? 'text-emerald-600' :
                        ngo.status === 'Rejected' ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {ngo.status === 'Verified' && <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />}
                        {ngo.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" aria-hidden="true" />}
                        {ngo.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {ngo.status !== 'Verified' ? (
                        <>
                          <button
                            onClick={() => handleApprove(ngo.id, 'Silver')}
                            aria-label={`Approve Silver tier for ${ngo.name}`}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all min-h-[36px]"
                          >
                            Approve (Silver)
                          </button>
                          <button
                            onClick={() => handleApprove(ngo.id, 'Gold')}
                            aria-label={`Elevate to Gold tier for ${ngo.name}`}
                            className="px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-bold transition-all min-h-[36px]"
                          >
                            Elevate (Gold)
                          </button>
                          <button
                            onClick={() => handleReject(ngo.id)}
                            aria-label={`Decline accreditation for ${ngo.name}`}
                            className="px-2.5 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-bold transition-all min-h-[36px]"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-[11px] font-medium">Approved &amp; Live</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 px-4 text-center">
                    <p className="text-sm font-bold text-gray-800 mb-1">No NGOs Match "{searchTerm}"</p>
                    <p className="text-xs text-gray-500 mb-4">Try searching with a different name, city, or Darpan ID.</p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors"
                    >
                      Clear Search
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
