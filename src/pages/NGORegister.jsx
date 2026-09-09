import React, { useState } from 'react';
import { Building2, ShieldCheck, FileText, CheckCircle2, Upload, Send, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NGORegister() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    ngoName: '',
    darpanId: '',
    pan: '',
    registrationType: 'Section 8 Company',
    city: '',
    state: '',
    address: '',
    contactPerson: '',
    email: '',
    phone: '',
    shelterCapacity: '',
    hasRescueVan: 'Yes',
    has12A80G: 'Yes',
    focusArea: 'Elderly homeless & destitute'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Registration submitted! Application forwarded to StreetCare verification cell.');
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Application Under Review</h2>
        <p className="text-gray-600 text-sm leading-relaxed max-w-lg mx-auto mb-6">
          Your NGO <strong>{formData.ngoName}</strong> has been received. Our verification officers will validate your <strong>NGO Darpan ID ({formData.darpanId || 'Pending'})</strong> and 12A/80G status within 24-48 hours.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-left text-xs max-w-md mx-auto space-y-2 mb-8">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            Verification Level: Tier 1 (Bronze - In Progress)
          </div>
          <div className="text-amber-800">
            Once approved, your rescue team will receive real-time SMS & webhook dispatches whenever a citizen reports in your city.
          </div>
        </div>

        <a
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700"
        >
          View in Admin Verification Portal
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full mb-2">
          <Building2 className="w-3.5 h-3.5" /> Institutional Onboarding
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">NGO & Rehabilitation Center Registration</h1>
        <p className="text-sm text-gray-600 mt-1">
          Join the national network of verified shelters and rescue teams helping destitute and homeless individuals.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Section 1: Legal Registration */}
        <div>
          <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 border-b border-orange-100 pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" /> 1. Legal Entity & Accreditation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Organization Name (as per Certificate)</label>
              <input
                type="text"
                required
                value={formData.ngoName}
                onChange={(e) => setFormData({ ...formData, ngoName: e.target.value })}
                placeholder="e.g. Hope Social Welfare Foundation"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">NITI Aayog NGO Darpan Unique ID</label>
              <input
                type="text"
                required
                value={formData.darpanId}
                onChange={(e) => setFormData({ ...formData, darpanId: e.target.value })}
                placeholder="e.g. DL/2021/0284910"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Registration Type</label>
              <select
                value={formData.registrationType}
                onChange={(e) => setFormData({ ...formData, registrationType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
              >
                <option value="Section 8 Company">Section 8 Company (Companies Act 2013)</option>
                <option value="Registered Trust">Public Charitable Trust (Trust Act 1882)</option>
                <option value="Registered Society">Society (Societies Registration Act 1860)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Has 12A & 80G Tax Exemption?</label>
              <select
                value={formData.has12A80G}
                onChange={(e) => setFormData({ ...formData, has12A80G: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
              >
                <option value="Yes">Yes (Eligible for Silver/Gold Tier)</option>
                <option value="Under Process">Applied / Under Process</option>
                <option value="No">No (Bronze Tier)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Location & Operations */}
        <div>
          <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 border-b border-orange-100 pb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> 2. Operational Capacity & Shelter Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Operating City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Pune"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g. Maharashtra"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Bed / Shelter Capacity</label>
              <input
                type="number"
                value={formData.shelterCapacity}
                onChange={(e) => setFormData({ ...formData, shelterCapacity: e.target.value })}
                placeholder="e.g. 100"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-gray-700 mb-1">Permanent Shelter / Center Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full address of shelter home or main office"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
            />
          </div>
        </div>

        {/* Section 3: Contact Details */}
        <div>
          <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-4 border-b border-orange-100 pb-2">
            3. Point of Contact (for Rescue Dispatches)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Contact Officer Name</label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Name & Designation"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Emergency Dispatch Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91-XXXXXXXXXX"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Official Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ngo@example.org"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> Submit NGO for Accreditation & Verification
        </button>
      </form>
    </div>
  );
}
