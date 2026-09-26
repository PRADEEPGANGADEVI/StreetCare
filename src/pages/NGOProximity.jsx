import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin, Navigation, Phone, Mail, ShieldCheck, Building2,
  CheckCircle2, Clock, Send, X, Star, Package,
  Users, Award, ChevronRight, Loader2, AlertTriangle, Heart,
  Radio, ArrowLeft, Route, ExternalLink, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllNGOs, sendProposal } from '../lib/db';
import { supabase } from '../lib/supabaseClient';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored marker factory
function makeIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:32px;height:32px;background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

const userIcon   = makeIcon('#f97316');  // orange - user location
const ngoIcon    = makeIcon('#10b981');  // green  - NGO
const activeIcon = makeIcon('#6366f1');  // indigo - selected NGO

// Haversine distance in km
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Fly map to position helper
function MapFlyTo({ center, zoom = 13 }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

// Tier badge
function TierBadge({ tier }) {
  const colors = {
    Gold:   'bg-amber-100 text-amber-800 border-amber-200',
    Silver: 'bg-gray-100 text-gray-700 border-gray-200',
    Bronze: 'bg-orange-50 text-orange-700 border-orange-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${colors[tier] ?? colors.Bronze}`}>
      <Star className="w-3 h-3" />
      {tier} Tier
    </span>
  );
}

// NGO Card for sidebar list
function NGOCard({ ngo, distance, selected, onSelect, hasAccepted }) {
  return (
    <button
      onClick={() => onSelect(ngo)}
      className={`w-full text-left p-4 rounded-2xl border transition-all ${
        selected
          ? 'border-indigo-400 bg-indigo-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm leading-tight truncate">{ngo.name}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">{ngo.city}, {ngo.state}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs font-bold text-indigo-600">{distance.toFixed(1)} km</span>
          <TierBadge tier={ngo.tier} />
        </div>
      </div>
      <div className="flex gap-3 text-[11px] text-gray-600">
        <span className="flex items-center gap-1"><Users className="w-3 h-3 text-emerald-500" />{ngo.vacancies ?? 0} vacancies</span>
        <span className="flex items-center gap-1"><Package className="w-3 h-3 text-blue-500" />{ngo.storage_capacity ?? 0} units storage</span>
      </div>
      {hasAccepted && (
        <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
          <CheckCircle2 className="w-3.5 h-3.5" /> Proposal Accepted
        </div>
      )}
    </button>
  );
}

// Proposal form modal
function ProposalModal({ ngo, onClose, onSent }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Please enter your name.'); return; }
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.replace(/[\s\-+91]/g, ''))) {
      toast.error('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setSending(true);
    try {
      const proposal = await sendProposal({
        ngoId: ngo.id,
        userName: name.trim(),
        userPhone: phone.trim(),
        message: message.trim() || 'Requesting assistance and shelter placement.',
      });
      toast.success('Proposal sent! Waiting for NGO response...');
      onSent(proposal);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to send proposal. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-5 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-black text-white">Send Proposal</h3>
            <p className="text-orange-100 text-xs mt-0.5 font-medium">{ngo.name}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSend} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Your Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Mobile Number *</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Describe the situation or request..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60 min-h-[48px]"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? 'Sending...' : 'Send Proposal to NGO'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Accepted proposal — full NGO details + route map
function AcceptedView({ ngo, userPos, onBack }) {
  const routeCoords = userPos && ngo.lat && ngo.lng
    ? [[userPos.lat, userPos.lng], [ngo.lat, ngo.lng]]
    : null;

  const distance = userPos && ngo.lat ? haversineKm(userPos.lat, userPos.lng, ngo.lat, ngo.lng) : null;

  return (
    <div className="space-y-6">
      {/* Success banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-lg leading-tight">Proposal Accepted!</p>
            <p className="text-emerald-100 text-xs">NGO has confirmed your request</p>
          </div>
        </div>
        <p className="text-sm text-emerald-50 leading-relaxed">
          <strong>{ngo.name}</strong> has accepted your proposal. Report to their shelter at the address below. The rescue team will coordinate your arrival.
        </p>
      </div>

      {/* NGO Full Details */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-black text-gray-900 text-lg leading-tight">{ngo.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <TierBadge tier={ngo.tier} />
              {ngo.is_govt_verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  <ShieldCheck className="w-3 h-3" /> Govt Verified
                </span>
              )}
            </div>
          </div>
          {distance && (
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-600">{distance.toFixed(1)}</span>
              <span className="text-xs text-gray-500 block">km away</span>
            </div>
          )}
        </div>

        <div className="p-5 space-y-4">
          {/* Contact details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href={`tel:${ngo.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors group">
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-500">Phone</p>
                <p className="text-sm font-bold text-gray-900 group-hover:text-orange-600 truncate">{ngo.phone}</p>
              </div>
            </a>
            <a href={`mailto:${ngo.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group">
              <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-500">Email</p>
                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 truncate">{ngo.email}</p>
              </div>
            </a>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
            <MapPin className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] text-gray-500 mb-0.5">Registered Address</p>
              <p className="text-sm font-semibold text-gray-800">{ngo.city}, {ngo.state}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Vacancies', value: ngo.vacancies ?? 0, color: 'emerald', icon: Users },
              { label: 'Storage Units', value: ngo.storage_capacity ?? 0, color: 'blue', icon: Package },
              { label: 'Cases Resolved', value: (ngo.cases_resolved ?? 0).toLocaleString(), color: 'orange', icon: Heart },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className={`bg-${color}-50 rounded-xl p-3 text-center border border-${color}-100`}>
                <Icon className={`w-4 h-4 text-${color}-500 mx-auto mb-1`} />
                <p className={`text-lg font-black text-${color}-700`}>{value}</p>
                <p className="text-[10px] text-gray-600">{label}</p>
              </div>
            ))}
          </div>

          {/* Google Maps link */}
          {ngo.lat && ngo.lng && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${ngo.lat},${ngo.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors"
            >
              <Route className="w-4 h-4" />
              Open Route in Google Maps
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Live Map with route */}
      {routeCoords && (
        <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="bg-indigo-600 px-5 py-3 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-white" />
            <span className="text-white font-bold text-sm">Live Route Map</span>
            <span className="text-indigo-200 text-xs ml-auto">{distance?.toFixed(1)} km direct route</span>
          </div>
          <MapContainer
            center={[
              (userPos.lat + ngo.lat) / 2,
              (userPos.lng + ngo.lng) / 2,
            ]}
            zoom={9}
            style={{ height: '320px' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
              <Popup><strong>Your Location</strong></Popup>
            </Marker>
            <Marker position={[ngo.lat, ngo.lng]} icon={activeIcon}>
              <Popup><strong>{ngo.name}</strong><br />{ngo.city}</Popup>
            </Marker>
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: '#6366f1', weight: 3, dashArray: '8 6' }}
            />
          </MapContainer>
        </div>
      )}

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to NGO list
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NGOProximity() {
  const [userPos, setUserPos] = useState(null);
  const [locating, setLocating] = useState(false);
  const [ngos, setNgos] = useState([]);
  const [nearbyNGOs, setNearbyNGOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposals, setProposals] = useState({});   // { ngoId: proposal }
  const [acceptedNGO, setAcceptedNGO] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center
  const [radiusKm, setRadiusKm] = useState(100);
  const channelRef = useRef(null);

  // Load all NGOs
  useEffect(() => {
    getAllNGOs()
      .then((data) => {
        // Some initial seeded NGOs don't have lat/lng. Add mock positions for demo purposes if missing.
        const enhancedData = data.map(ngo => {
          if (!ngo.lat || !ngo.lng) {
            // Assign some random mock coordinates around India if they are missing
            const mockLats = [19.07, 28.70, 12.97, 13.08, 22.57, 17.38];
            const mockLngs = [72.87, 77.10, 77.59, 80.27, 88.36, 78.48];
            return {
              ...ngo,
              lat: mockLats[Math.floor(Math.random() * mockLats.length)] + (Math.random() * 2 - 1),
              lng: mockLngs[Math.floor(Math.random() * mockLngs.length)] + (Math.random() * 2 - 1)
            };
          }
          return ngo;
        });
        setNgos(enhancedData);
        setLoading(false);
      })
      .catch((err) => { console.error(err); setLoading(false); toast.error('Failed to load NGOs.'); });
  }, []);

  // Filter NGOs within radius when user location changes
  useEffect(() => {
    if (!userPos || ngos.length === 0) return;

    const nearby = ngos
      .map((ngo) => ({ ...ngo, distance: haversineKm(userPos.lat, userPos.lng, ngo.lat, ngo.lng) }))
      .filter((ngo) => ngo.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
      
    setNearbyNGOs(nearby);
    if (nearby.length > 0 && !selectedNGO) setSelectedNGO(nearby[0]);
  }, [userPos, ngos, radiusKm]);

  // Detect user location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(coords);
        setMapCenter([coords.lat, coords.lng]);
        setLocating(false);
        toast.success('Location detected! Finding nearby NGOs...');
      },
      () => {
        // Fallback mock location if user denies location or it fails in local dev
        toast.error('Location denied/failed. Using New Delhi as fallback.', { duration: 5000 });
        const fallbackCoords = { lat: 28.6139, lng: 77.2090 }; // New Delhi
        setUserPos(fallbackCoords);
        setMapCenter([fallbackCoords.lat, fallbackCoords.lng]);
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  // Subscribe to real-time proposal updates
  const subscribeToProposal = useCallback((proposalId, ngoId) => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
    const channel = supabase
      .channel('proposal-' + proposalId)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'proposals', filter: `id=eq.${proposalId}` },
        (payload) => {
          const updated = payload.new;
          setProposals((prev) => ({ ...prev, [ngoId]: updated }));
          if (updated.status === 'accepted') {
            toast.success('Your proposal was ACCEPTED!', { duration: 6000 });
            const ngo = ngos.find((n) => n.id === ngoId);
            if (ngo) setAcceptedNGO(ngo);
          } else if (updated.status === 'rejected') {
            toast.error('Your proposal was declined by this NGO.');
            setProposals((prev) => ({ ...prev, [ngoId]: { ...updated, status: 'rejected' } }));
          }
        }
      )
      .subscribe();
    channelRef.current = channel;
  }, [ngos]);

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, []);

  const handleProposalSent = (proposal) => {
    setProposals((prev) => ({ ...prev, [proposal.ngo_id]: proposal }));
    subscribeToProposal(proposal.id, proposal.ngo_id);
  };

  if (acceptedNGO) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AcceptedView ngo={acceptedNGO} userPos={userPos} onBack={() => setAcceptedNGO(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)',backgroundSize:'24px 24px'}} />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-3">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> Live NGO Proximity Finder
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Find NGOs Near You
            </h1>
            <p className="text-indigo-100 text-sm mt-2 max-w-lg leading-relaxed">
              Locate government-verified NGOs within {radiusKm} km, view vacancies, send proposals, and get a live route on acceptance.
            </p>
          </div>
          <button
            id="detect-location-btn"
            onClick={detectLocation}
            disabled={locating}
            className="shrink-0 flex items-center gap-2 bg-white text-indigo-700 font-bold px-5 py-3 rounded-2xl hover:bg-indigo-50 transition-all shadow-lg disabled:opacity-60 min-h-[48px]"
          >
            {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
            {locating ? 'Detecting...' : userPos ? 'Re-detect Location' : 'Detect My Location'}
          </button>
        </div>
      </div>

      {/* No location yet */}
      {!userPos && !locating && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Allow Location Access</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto mb-5">
            Click <strong>"Detect My Location"</strong> above to find NGOs within {radiusKm} km of your current position.
          </p>
          <button
            onClick={detectLocation}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <Navigation className="w-4 h-4" /> Detect Location Now
          </button>
        </div>
      )}

      {/* Main content: sidebar + map */}
      {(userPos || loading) && (
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Summary bar */}
            {userPos && (
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">
                    {loading ? 'Loading NGOs...' : `${nearbyNGOs.length} NGOs within ${radiusKm} km`}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    GPS: {userPos.lat.toFixed(4)}, {userPos.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            )}

            {/* NGO list */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              </div>
            ) : nearbyNGOs.length === 0 && userPos ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <p className="font-bold text-gray-900 mb-1">No NGOs found within {radiusKm} km</p>
                <p className="text-xs text-gray-500 mb-4">Try expanding the search area to see NGOs in other states.</p>
                {radiusKm < 5000 && (
                  <button 
                    onClick={() => setRadiusKm(5000)} 
                    className="w-full px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    Expand Search to 5000 km
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
                {nearbyNGOs.map((ngo) => (
                  <NGOCard
                    key={ngo.id}
                    ngo={ngo}
                    distance={ngo.distance}
                    selected={selectedNGO?.id === ngo.id}
                    onSelect={(n) => { setSelectedNGO(n); setMapCenter([n.lat, n.lng]); }}
                    hasAccepted={proposals[ngo.id]?.status === 'accepted'}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Map + Detail panel */}
          <div className="space-y-4">
            {/* Map */}
            <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
              <MapContainer
                center={mapCenter}
                zoom={userPos ? 10 : 5}
                style={{ height: '380px' }}
                className="z-0"
              >
                <MapFlyTo center={mapCenter} zoom={userPos ? 10 : 5} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {/* User position */}
                {userPos && (
                  <>
                    <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
                      <Popup><strong>Your Location</strong></Popup>
                    </Marker>
                    <Circle
                      center={[userPos.lat, userPos.lng]}
                      radius={radiusKm * 1000}
                      pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.04, weight: 1.5, dashArray: '6 4' }}
                    />
                  </>
                )}
                {/* NGO markers */}
                {nearbyNGOs.map((ngo) => (
                  <Marker
                    key={ngo.id}
                    position={[ngo.lat, ngo.lng]}
                    icon={selectedNGO?.id === ngo.id ? activeIcon : ngoIcon}
                    eventHandlers={{ click: () => { setSelectedNGO(ngo); setMapCenter([ngo.lat, ngo.lng]); } }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <strong>{ngo.name}</strong><br />
                        <span className="text-gray-500">{ngo.city} • {ngo.distance?.toFixed(1)} km</span><br />
                        <span className="text-emerald-600 font-semibold">{ngo.vacancies ?? 0} vacancies</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {/* Route line to selected NGO */}
                {userPos && selectedNGO && (
                  <Polyline
                    positions={[[userPos.lat, userPos.lng], [selectedNGO.lat, selectedNGO.lng]]}
                    pathOptions={{ color: '#6366f1', weight: 2.5, dashArray: '8 6', opacity: 0.6 }}
                  />
                )}
              </MapContainer>
            </div>

            {/* Selected NGO detail card */}
            {selectedNGO && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-black text-gray-900 text-base leading-tight">{selectedNGO.name}</h2>
                      <p className="text-xs text-gray-500 mt-0.5">{selectedNGO.city}, {selectedNGO.state}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <TierBadge tier={selectedNGO.tier} />
                        {selectedNGO.is_govt_verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <ShieldCheck className="w-3 h-3" /> Govt Verified
                          </span>
                        )}
                      </div>
                    </div>
                    {userPos && (
                      <div className="text-right shrink-0">
                        <span className="text-xl font-black text-indigo-600">
                          {haversineKm(userPos.lat, userPos.lng, selectedNGO.lat, selectedNGO.lng).toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500 block">km</span>
                      </div>
                    )}
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                      <Users className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                      <p className="text-lg font-black text-emerald-700">{selectedNGO.vacancies ?? 0}</p>
                      <p className="text-[10px] text-gray-600">Vacancies</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                      <Package className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                      <p className="text-lg font-black text-blue-700">{selectedNGO.storage_capacity ?? 0}</p>
                      <p className="text-[10px] text-gray-600">Storage</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                      <Heart className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                      <p className="text-lg font-black text-amber-700">{(selectedNGO.cases_resolved ?? 0).toLocaleString()}</p>
                      <p className="text-[10px] text-gray-600">Rescued</p>
                    </div>
                  </div>

                  {/* Certifications */}
                  {selectedNGO.certifications?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {selectedNGO.certifications.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-800">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Focus area */}
                  <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                    <strong className="text-gray-800">Focus:</strong> {selectedNGO.focus}
                  </p>

                  {/* Proposal status / action */}
                  <div className="mt-5">
                    {proposals[selectedNGO.id] ? (
                      <div className={`rounded-2xl p-4 flex items-center gap-3 ${
                        proposals[selectedNGO.id].status === 'accepted'
                          ? 'bg-emerald-50 border border-emerald-200'
                          : proposals[selectedNGO.id].status === 'rejected'
                          ? 'bg-red-50 border border-red-200'
                          : 'bg-indigo-50 border border-indigo-200'
                      }`}>
                        {proposals[selectedNGO.id].status === 'accepted' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : proposals[selectedNGO.id].status === 'rejected' ? (
                          <X className="w-5 h-5 text-red-600 shrink-0" />
                        ) : (
                          <Clock className="w-5 h-5 text-indigo-600 shrink-0 animate-pulse" />
                        )}
                        <div>
                          <p className={`text-sm font-bold ${
                            proposals[selectedNGO.id].status === 'accepted' ? 'text-emerald-800'
                            : proposals[selectedNGO.id].status === 'rejected' ? 'text-red-800'
                            : 'text-indigo-800'
                          }`}>
                            {proposals[selectedNGO.id].status === 'accepted'
                              ? 'Proposal Accepted!'
                              : proposals[selectedNGO.id].status === 'rejected'
                              ? 'Proposal Declined'
                              : 'Waiting for NGO Response...'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {proposals[selectedNGO.id].status === 'pending'
                              ? 'You will be notified in real time when the NGO responds.'
                              : proposals[selectedNGO.id].status === 'rejected'
                              ? 'Try sending a proposal to another nearby NGO.'
                              : 'See full details and route above.'}
                          </p>
                        </div>
                        {proposals[selectedNGO.id].status === 'accepted' && (
                          <button
                            onClick={() => setAcceptedNGO(selectedNGO)}
                            className="ml-auto text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 shrink-0"
                          >
                            View Details <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        id="send-proposal-btn"
                        onClick={() => setShowProposalModal(true)}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 min-h-[48px]"
                      >
                        <Send className="w-4 h-4" />
                        Send Proposal to This NGO
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Proposal Modal */}
      {showProposalModal && selectedNGO && (
        <ProposalModal
          ngo={selectedNGO}
          onClose={() => setShowProposalModal(false)}
          onSent={handleProposalSent}
        />
      )}
    </div>
  );
}