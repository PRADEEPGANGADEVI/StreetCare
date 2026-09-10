import React, { useState } from 'react';
import { MapPin, Navigation, Phone, ShieldCheck, Filter, AlertTriangle, Building2, CheckCircle2 } from 'lucide-react';
import { INITIAL_NGOS, INITIAL_REPORTS } from '../data/mockData';

export default function MapPage() {
  const [selectedCity, setSelectedCity] = useState('All');
  const [filterType, setFilterType] = useState('all'); // 'all', 'reports', 'ngos'
  const [selectedItem, setSelectedItem] = useState(INITIAL_REPORTS[0]);

  const filteredReports = INITIAL_REPORTS.filter((r) => {
    if (selectedCity !== 'All' && r.location.city !== selectedCity) return false;
    return filterType === 'all' || filterType === 'reports';
  });

  const filteredNGOs = INITIAL_NGOS.filter((n) => {
    if (selectedCity !== 'All' && !n.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
    return filterType === 'all' || filterType === 'ngos';
  });

  const hasResults = filteredReports.length > 0 || filteredNGOs.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-7 h-7 text-orange-600" /> Live Rescue & NGO Map
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Real-time citizen alerts and verified government-empanelled rehabilitation centers across India.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-gray-300 text-sm font-medium bg-white focus:outline-none focus:border-orange-500"
          >
            <option value="All">All Cities</option>
            <option value="New Delhi">New Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="Bengaluru">Bengaluru</option>
          </select>

          <div className="bg-gray-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'all' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('reports')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'reports' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600'}`}
            >
              Reports ({INITIAL_REPORTS.length})
            </button>
            <button
              onClick={() => setFilterType('ngos')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filterType === 'ngos' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600'}`}
            >
              NGOs ({INITIAL_NGOS.length})
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout: Interactive Map Canvas + Details sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Map Representation */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-6 h-[550px] relative overflow-hidden flex flex-col justify-between shadow-xl border border-slate-800">
          {/* Mock Map background grid */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>

          {/* Map Top Bar */}
          <div className="relative z-10 flex items-center justify-between bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700 text-xs text-slate-300">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
              Live Geolocation Radar
            </span>
            <span aria-live="polite" aria-atomic="true">
              {hasResults
                ? `Showing ${filteredReports.length} Active Incidents • ${filteredNGOs.length} Ready Units`
                : `No results for ${selectedCity}`}
            </span>
          </div>

          {/* Simulated Location Nodes on Map */}
          <div className="relative z-10 my-auto flex flex-wrap gap-4 items-center justify-center p-4" role="list" aria-label="Map incidents and NGOs">
            {!hasResults && (
              <div className="flex flex-col items-center gap-3 text-slate-400 text-center py-8">
                <Filter className="w-10 h-10 opacity-40" />
                <p className="text-sm font-semibold">No incidents or NGOs found</p>
                <p className="text-xs opacity-75">Try selecting "All Cities" or a different filter</p>
                <button
                  onClick={() => { setSelectedCity('All'); setFilterType('all'); }}
                  className="mt-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {filteredReports.map((r) => (
              <button
                key={r.id}
                role="listitem"
                aria-pressed={selectedItem?.id === r.id}
                aria-label={`${r.personType} rescue case in ${r.location.city} — ${r.urgency} urgency`}
                onClick={() => setSelectedItem(r)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedItem(r)}
                className={`p-3 rounded-2xl transition-all transform hover:scale-110 flex items-center gap-2 text-left shadow-lg focus-visible:ring-2 focus-visible:ring-orange-400 ${
                  selectedItem?.id === r.id
                    ? 'bg-orange-500 text-white ring-4 ring-orange-400/40'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-orange-500'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <div>
                  <div className="text-xs font-bold">{r.personType}</div>
                  <div className="text-[10px] opacity-75">{r.location.city}</div>
                </div>
              </button>
            ))}

            {filteredNGOs.map((n) => (
              <button
                key={n.id}
                role="listitem"
                aria-pressed={selectedItem?.id === n.id}
                aria-label={`${n.name} NGO in ${n.city} — ${n.tier} tier`}
                onClick={() => setSelectedItem(n)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedItem(n)}
                className={`p-3 rounded-2xl transition-all transform hover:scale-110 flex items-center gap-2 text-left shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  selectedItem?.id === n.id
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-400/40'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-500'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <div>
                  <div className="text-xs font-bold">{n.name}</div>
                  <div className="text-[10px] opacity-75">{n.city} • {n.tier}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom Info bar */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Powered by OpenStreetMap & District Social Welfare GeoData</span>
            <a
              href={`https://maps.google.com/?q=${selectedItem?.lat || 28.6139},${selectedItem?.lng || 77.2090}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-orange-400 hover:underline"
            >
              Open in Google Maps <Navigation className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Details Panel Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">
            {selectedItem?.name ? 'NGO Rescue Center' : 'Rescue Case Details'}
          </h3>

          {selectedItem?.photo && (
            <div className="rounded-2xl overflow-hidden h-40 bg-gray-100">
              <img src={selectedItem.photo} alt="Report item" className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <span className="text-[10px] uppercase font-black text-orange-600 tracking-wider">
              {selectedItem?.urgency ? `${selectedItem.urgency} Priority Alert` : `${selectedItem?.tier || 'Verified'} Tier Center`}
            </span>
            <h4 className="text-xl font-black text-gray-900 mt-1">
              {selectedItem?.name || selectedItem?.personType}
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              {selectedItem?.focus || selectedItem?.condition}
            </p>
          </div>

          <div className="space-y-2 text-xs text-gray-700 bg-gray-50 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span>{selectedItem?.location?.address || `${selectedItem?.city}, ${selectedItem?.state}`}</span>
            </div>
            {selectedItem?.darpanId && (
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>NGO Darpan ID: <strong>{selectedItem.darpanId}</strong></span>
              </div>
            )}
            {selectedItem?.assignedNGO && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Assigned Unit: <strong>{selectedItem.assignedNGO}</strong></span>
              </div>
            )}
            {selectedItem?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <span>Helpline: <strong>{selectedItem.phone}</strong></span>
              </div>
            )}
          </div>

          <div className="pt-2 space-y-2">
            {selectedItem?.phone ? (
              <a
                href={`tel:${selectedItem.phone}`}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Phone className="w-4 h-4" /> Call NGO Helpline
              </a>
            ) : (
              <button
                onClick={() => alert(`Dispatch alert re-sent to nearby rescue teams for case ${selectedItem?.id}`)}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <AlertTriangle className="w-4 h-4" /> Trigger Urgent Van Dispatch
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
