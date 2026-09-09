import React, { useState } from 'react';
import { Camera, MapPin, AlertCircle, CheckCircle2, Send, Building2, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { INITIAL_NGOS } from '../data/mockData';

export default function ReportForm() {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    personType: 'Elderly Person',
    estimatedAge: '60-70',
    urgency: 'High',
    address: '',
    city: 'New Delhi',
    landmark: '',
    lat: null,
    lng: null,
    condition: '',
    selectedNGO: 'SPYM (Society for Promotion of Youth & Masses)',
    reporterName: '',
    reporterContact: '',
    photoPreview: null
  });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          lat: position.coords.latitude.toFixed(5),
          lng: position.coords.longitude.toFixed(5),
          address: `GPS Pin: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
        }));
        setLoadingLocation(false);
        toast.success('Exact GPS coordinates captured!');
      },
      (error) => {
        console.error(error);
        toast.error('Could not get GPS location. Please type address manually.');
        setLoadingLocation(false);
      },
      { timeout: 10000 }
    );
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photoPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.address && (!formData.lat || !formData.lng)) {
      toast.error('Please provide a location or tap "Use Current GPS"');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success('Report submitted successfully! Nearby NGO notified.');
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Rescue Request Dispatched!</h2>
        <p className="text-gray-600 text-base mb-6 leading-relaxed max-w-lg mx-auto">
          Thank you for being a compassionate citizen. An automated alert has been routed to <strong>{formData.selectedNGO}</strong> and the local social welfare rescue team.
        </p>
        
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-left text-sm max-w-md mx-auto space-y-2 mb-8">
          <div className="font-bold text-orange-900 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-orange-600" />
            Assigned Rehabilitation Partner:
          </div>
          <div className="text-gray-700">{formData.selectedNGO}</div>
          <div className="text-xs text-gray-500 pt-1">
            Location: {formData.address || `${formData.lat}, ${formData.lng}`}
          </div>
          <div className="text-xs font-semibold text-emerald-700">Status: Dispatched to Rescue Van</div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                personType: 'Elderly Person',
                estimatedAge: '60-70',
                urgency: 'High',
                address: '',
                city: 'New Delhi',
                landmark: '',
                lat: null,
                lng: null,
                condition: '',
                selectedNGO: 'SPYM (Society for Promotion of Youth & Masses)',
                reporterName: '',
                reporterContact: '',
                photoPreview: null
              });
            }}
            className="px-6 py-3 rounded-xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700"
          >
            Submit Another Report
          </button>
          <a
            href="/map"
            className="px-6 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50"
          >
            View on Live Map
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full mb-2">
          <Camera className="w-3.5 h-3.5" /> Direct Field Report
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Report a Beggar or Homeless Person</h1>
        <p className="text-sm text-gray-600 mt-1">
          Provide accurate details and photos to help outreach teams locate and support the individual safely.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            1. Photo of Person / Surroundings
          </label>
          <div className="border-2 border-dashed border-gray-300 hover:border-orange-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-gray-50/50">
            {formData.photoPreview ? (
              <div className="relative inline-block">
                <img
                  src={formData.photoPreview}
                  alt="Upload preview"
                  className="max-h-56 rounded-xl object-contain shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, photoPreview: null }))}
                  className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center py-6">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Click to upload photo or take picture</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Location Section */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            2. Exact Location & Landmark
          </label>
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={detectLocation}
              disabled={loadingLocation}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              {loadingLocation ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Detecting GPS...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" /> Use Current GPS
                </>
              )}
            </button>
            {formData.lat && formData.lng && (
              <span className="inline-flex items-center text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Lat: {formData.lat}, Lng: {formData.lng}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Street Address or Crossroad</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Under Connaught Place Outer Circle flyover"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">City / Region</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-orange-500 bg-white"
              >
                <option value="New Delhi">New Delhi / NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Chennai">Chennai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Other">Other City</option>
              </select>
            </div>
          </div>
        </div>

        {/* Person Category & Age */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Individual Type</label>
            <select
              value={formData.personType}
              onChange={(e) => setFormData({ ...formData, personType: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white"
            >
              <option value="Elderly Person">Elderly Person</option>
              <option value="Child / Minor (High Priority)">Child / Minor (High Priority)</option>
              <option value="Mother with Infant">Mother with Infant</option>
              <option value="Disabled / Wheelchair">Disabled / Amputee</option>
              <option value="Mentally Challenged Destitute">Mentally Challenged</option>
              <option value="Injured / Critical Medical">Injured / Sick Adult</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Age</label>
            <input
              type="text"
              value={formData.estimatedAge}
              onChange={(e) => setFormData({ ...formData, estimatedAge: e.target.value })}
              placeholder="e.g. 50-60 or Child < 10"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Urgency Level</label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white"
            >
              <option value="Critical">Critical (Immediate danger/sick)</option>
              <option value="High">High (Urgent food/shelter)</option>
              <option value="Medium">Medium (Routine rescue)</option>
            </select>
          </div>
        </div>

        {/* Condition details */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Condition & Observations</label>
          <textarea
            rows="3"
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            placeholder="Describe physical condition, whether they can walk, language spoken, visible injuries, or if accompanied by others..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-orange-500"
          ></textarea>
        </div>

        {/* Target NGO Notification Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-orange-600" />
            Direct Alert To Nearest Verified Rehabilitation NGO
          </label>
          <select
            value={formData.selectedNGO}
            onChange={(e) => setFormData({ ...formData, selectedNGO: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm bg-white font-medium text-gray-800"
          >
            {INITIAL_NGOS.map((ngo) => (
              <option key={ngo.id} value={ngo.name}>
                {ngo.name} — {ngo.city} ({ngo.tier} Tier Verified)
              </option>
            ))}
          </select>
          <p className="text-[11px] text-gray-500 mt-1">
            NGOs receive immediate dashboard notifications and SMS dispatch alerts with location coordinates.
          </p>
        </div>

        {/* Optional Reporter Info */}
        <div className="pt-2 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">Reporter Information (Optional)</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={formData.reporterName}
              onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
              placeholder="Your Name (Optional)"
              className="px-3 py-2 rounded-xl border border-gray-300 text-sm"
            />
            <input
              type="tel"
              value={formData.reporterContact}
              onChange={(e) => setFormData({ ...formData, reporterContact: e.target.value })}
              placeholder="Phone number for status updates"
              className="px-3 py-2 rounded-xl border border-gray-300 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-base shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Transmitting Report & Dispatching NGO...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" /> Submit Report & Notify Nearest Center
            </>
          )}
        </button>
      </form>
    </div>
  );
}
