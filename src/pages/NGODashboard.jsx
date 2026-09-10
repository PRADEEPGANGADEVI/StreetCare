import React, { useState } from 'react';
import { Building2, CheckCircle2, Clock, MapPin, AlertCircle, Phone, ArrowRight, UserCheck, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { INITIAL_REPORTS } from '../data/mockData';

export default function NGODashboard() {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpdateStatus = (id, newStatus) => {
    setReports((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    toast.success(`Case status updated to: ${newStatus}`);
  };

  const activeCount = reports.filter((r) => r.status !== 'Rehabilitated & Safe').length;
  const resolvedCount = reports.filter((r) => r.status === 'Rehabilitated & Safe').length;

  const filteredReports = reports.filter((report) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'active'
        ? report.status !== 'Rehabilitated & Safe'
        : report.status === 'Rehabilitated & Safe';

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      report.id.toLowerCase().includes(q) ||
      report.personType.toLowerCase().includes(q) ||
      report.location.address.toLowerCase().includes(q) ||
      report.condition.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Live Field Operation Unit
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            SPYM Rehabilitation Hub (Delhi NCR)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Darpan ID: <strong>DL/2010/0034123</strong> • Empanelled under MoSJE SMILE Beggary Scheme
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-orange-50 px-4 py-3 rounded-2xl border border-orange-100 text-center min-w-[100px]">
            <span className="block text-2xl font-black text-orange-600">{activeCount}</span>
            <span className="text-[11px] font-semibold text-gray-600">Pending Alerts</span>
          </div>
          <div className="bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100 text-center min-w-[100px]">
            <span className="block text-2xl font-black text-emerald-600">12,480</span>
            <span className="text-[11px] font-semibold text-gray-600">Total Rescued</span>
          </div>
        </div>
      </div>

      {/* Case Management Feed & Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">Incoming Field Rescue Dispatches</h2>
            <p className="text-xs text-gray-500">Auto-routed by GPS Proximity &amp; urgency rating</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-gray-100/80 rounded-2xl overflow-x-auto self-start sm:self-auto" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({reports.length})
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'active'}
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'active'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              Pending ({activeCount})
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'resolved'}
              onClick={() => setActiveTab('resolved')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'resolved'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              Resolved ({resolvedCount})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases by ID, person type, location, or condition..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:outline-none focus:border-orange-500 bg-white"
            aria-label="Search cases"
          />
        </div>

        {/* Cases Grid */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2" role="feed" aria-label="Field rescue cases">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-gray-100">
                    <img
                      src={report.photo}
                      alt={report.personType}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full font-bold">
                      {report.id}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        report.urgency === 'Critical' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
                      }`}>
                        {report.urgency}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{report.personType} (Age ~{report.estimatedAge})</h3>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{report.condition}</p>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-xl">
                      <div className="flex items-center gap-1.5 font-medium text-gray-800">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" aria-hidden="true" />
                        <span className="truncate">{report.location.address}</span>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Reported by: {report.reportedBy} ({report.reportedAt})
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-gray-500">Current Status:</span>
                      <span className={`font-bold px-2.5 py-1 rounded-full ${
                        report.status === 'Rehabilitated & Safe'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-orange-50 text-orange-700'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-5 pt-0 space-y-2">
                  {report.status !== 'Rehabilitated & Safe' ? (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(report.id, 'Rescue Van Dispatched')}
                        className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" /> Dispatch Rescue Team
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(report.id, 'Rehabilitated & Safe')}
                        className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Mark as Rescued &amp; In Shelter
                      </button>
                    </>
                  ) : (
                    <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" /> Case Successfully Resolved
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-3 text-orange-500">
              <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">No Cases Match Your Filter</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
              Try switching tabs or clearing your search term to see all cases.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

