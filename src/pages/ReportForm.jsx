import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera, MapPin, AlertCircle, CheckCircle2, Send, Building2,
  Upload, Loader2, AlertTriangle, User, Phone, ShieldCheck,
  ExternalLink, Truck, Copy, Check, Compass, ArrowRight, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getGovtVerifiedNGOs, saveNewReport } from '../data/mockData';

const STEPS = ['Location', 'Person Details', 'NGO & Reporter'];
const MAX_CONDITION_CHARS = 400;

const validatePhone = (phone) =>
  phone === '' || /^[6-9]\d{9}$/.test(phone.replace(/[\s\-+91]/g, ''));

export default function ReportForm() {
  const govtVerifiedNGOs = getGovtVerifiedNGOs();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedCase, setSubmittedCase] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    personType: 'Elderly Person',
    estimatedAge: '',
    urgency: 'High',
    address: '',
    city: 'New Delhi',
    landmark: '',
    lat: null,
    lng: null,
    condition: '',
    selectedNGO: govtVerifiedNGOs[0]?.name || '',
    reporterName: '',
    reporterContact: '',
    photoPreview: null,
  });

  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(5);
        const lng = position.coords.longitude.toFixed(5);
        update('lat', lat);
        update('lng', lng);
        setFormData((prev) => ({
          ...prev,
          lat,
          lng,
          address: `GPS Pin: ${lat}, ${lng}`,
        }));
        setLoadingLocation(false);
        toast.success('Exact GPS coordinates captured!');
        if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
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
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Photo must be under 10MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => update('photoPreview', reader.result);
    reader.readAsDataURL(file);
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 0) {
      if (!formData.address.trim() && (!formData.lat || !formData.lng)) {
        newErrors.address = 'Please provide a street address or use GPS.';
      }
    }
    if (step === 1) {
      if (!formData.estimatedAge.trim()) {
        newErrors.estimatedAge = 'Please provide an estimated age.';
      }
      if (!formData.condition.trim()) {
        newErrors.condition = 'Please describe the person\'s condition.';
      }
    }
    if (step === 2) {
      if (formData.reporterContact && !validatePhone(formData.reporterContact)) {
        newErrors.reporterContact = 'Enter a valid 10-digit Indian mobile number.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) setCurrentStep((s) => s + 1);
    else toast.error('Please fix the errors before continuing.');
  };

  const prevStep = () => setCurrentStep((s) => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(2)) {
      toast.error('Please fix all errors before submitting.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const selectedNGOData = govtVerifiedNGOs.find((n) => n.name === formData.selectedNGO) || govtVerifiedNGOs[0];
      const caseId = 'SC-2026-' + Math.floor(1000 + Math.random() * 9000);
      
      const newCase = {
        id: caseId,
        personType: formData.personType,
        estimatedAge: formData.estimatedAge || 'Unknown',
        condition: formData.condition,
        location: {
          address: formData.address || (formData.lat ? `GPS: ${formData.lat}, ${formData.lng}` : 'Reported Location'),
          city: formData.city,
          landmark: formData.landmark,
          lat: formData.lat || 28.6139,
          lng: formData.lng || 77.2090,
        },
        photo: formData.photoPreview || 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&auto=format&fit=crop&q=60',
        reportedAt: 'Just now',
        status: 'Rescue Van Dispatched',
        assignedNGO: selectedNGOData.name,
        assignedNGOData: selectedNGOData,
        reportedBy: formData.reporterName ? `Citizen (${formData.reporterName})` : 'Citizen Reporter',
        urgency: formData.urgency,
        currentStage: 2,
        timeline: [
          {
            title: 'Report Geotagged & Authenticated',
            time: 'Just now',
            completed: true,
            note: `Coordinates logged for ${formData.city}. Case assigned ID ${caseId}.`
          },
          {
            title: `Transmitted to Verified NGO: ${selectedNGOData.name}`,
            time: 'Just now',
            completed: true,
            note: `Official NITI Aayog Darpan: ${selectedNGOData.darpanId} • MoSJE: ${selectedNGOData.mosjeRegNo}`
          },
          {
            title: `Rescue Van ${selectedNGOData.rescueVan?.vanNumber || 'Unit'} Dispatched`,
            time: 'In Progress',
            completed: true,
            note: `Field team mobilized. Driver contact: ${selectedNGOData.rescueVan?.driverContact || selectedNGOData.phone}. ETA ~15-20 mins.`
          },
          {
            title: 'Shelter Admission & Medical Rehabilitation',
            time: 'Pending field arrival',
            completed: false,
            note: `Admission coordinated at registered shelter: ${selectedNGOData.registeredAddress}`
          }
        ]
      };

      saveNewReport(newCase);
      setSubmittedCase(newCase);
      setSubmitting(false);
      setSubmitted(true);
      toast.success(`Case ${caseId} registered and dispatched!`);
    }, 1000);
  };

  const copyCaseId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    toast.success('Case Tracking ID copied!');
    setTimeout(() => setCopiedId(false), 2500);
  };

  const resetForm = () => {
    setSubmitted(false);
    setSubmittedCase(null);
    setCurrentStep(0);
    setErrors({});
    setFormData({
      personType: 'Elderly Person',
      estimatedAge: '',
      urgency: 'High',
      address: '',
      city: 'New Delhi',
      landmark: '',
      lat: null,
      lng: null,
      condition: '',
      selectedNGO: govtVerifiedNGOs[0]?.name || '',
      reporterName: '',
      reporterContact: '',
      photoPreview: null,
    });
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (submitted && submittedCase) {
    const assignedNGO = submittedCase.assignedNGOData;

    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-fadeIn">
        {/* Success Alert Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Alert Successfully Transmitted to Government-Verified Agency
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Rescue Dispatched to Government-Empanelled NGO
          </h1>

          <p className="text-gray-600 text-sm max-w-xl mx-auto leading-relaxed">
            Your report has been geotagged and securely assigned to <strong>{assignedNGO?.name}</strong>. A dedicated rescue unit has been dispatched in compliance with Ministry of Social Justice &amp; Empowerment (MoSJE) shelter standards.
          </p>

          {/* Unique Case Tracking ID Box */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 max-w-md mx-auto flex items-center justify-between gap-3">
            <div className="text-left">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Your Case Tracking ID</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-orange-700 tracking-tight">{submittedCase.id}</span>
            </div>
            <button
              onClick={() => copyCaseId(submittedCase.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-orange-200 hover:border-orange-400 text-orange-700 text-xs font-bold transition-all shadow-sm active:scale-95"
              aria-label="Copy Tracking ID"
            >
              {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copiedId ? 'Copied' : 'Copy ID'}
            </button>
          </div>
        </div>

        {/* Complete Receiver NGO Government Accreditation Dossier */}
        {assignedNGO && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block mb-1">
                  100% Government Verified &amp; Empanelled
                </span>
                <h2 className="text-xl font-black text-gray-900">{assignedNGO.name}</h2>
                <p className="text-xs text-gray-500">
                  Accredited by: <strong>{assignedNGO.verificationAgency}</strong>
                </p>
              </div>
              <a
                href="https://ngodarpan.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold transition-all"
              >
                NITI Aayog Darpan Portal <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">NITI Aayog Darpan ID</span>
                <div className="font-mono font-bold text-gray-900 text-sm">{assignedNGO.darpanId}</div>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Government Authenticated
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">MoSJE SMILE Empanelment</span>
                <div className="font-mono font-bold text-gray-900 text-sm">{assignedNGO.mosjeRegNo}</div>
                <div className="text-[11px] text-orange-600 font-semibold">Beggary Rehabilitation Scheme</div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Income Tax Exemption</span>
                <div className="font-bold text-gray-900 text-sm">12A &amp; 80G Certified</div>
                <div className="text-[11px] text-gray-500 truncate">{assignedNGO.taxExemption}</div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">State Shelter License</span>
                <div className="font-bold text-gray-900 text-sm">{assignedNGO.shelterLicense}</div>
                <div className="text-[11px] text-gray-600">Capacity: <strong>{assignedNGO.shelterCapacity} Beds</strong></div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Assigned Rescue Van</span>
                <div className="font-mono font-bold text-gray-900 text-sm">{assignedNGO.rescueVan?.vanNumber}</div>
                <div className="text-[11px] text-emerald-700 font-semibold">Driver: {assignedNGO.rescueVan?.driverContact}</div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Nodal Officer In-Charge</span>
                <div className="font-bold text-gray-900 text-sm">{assignedNGO.nodalOfficer?.name}</div>
                <div className="text-[11px] text-gray-600">{assignedNGO.nodalOfficer?.designation}</div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-orange-950 block">Official NGO Helpline:</span>
                <span className="text-gray-700">{assignedNGO.registeredAddress}</span>
              </div>
              <a
                href={`tel:${assignedNGO.phone}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all self-start sm:self-auto"
              >
                <Phone className="w-3.5 h-3.5" /> Call {assignedNGO.phone}
              </a>
            </div>
          </div>
        )}

        {/* Live Rescue Timeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900">Live Rescue Process Tracking</h2>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:to-gray-200">
            {submittedCase.timeline.map((item, idx) => (
              <div key={idx} className="relative">
                <div className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  item.completed
                    ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-white'
                    : 'bg-white border-2 border-gray-300 text-gray-400 ring-4 ring-white'
                }`}>
                  {item.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                    <span>{item.title}</span>
                    <span className="text-gray-400 text-[11px] font-normal">{item.time}</span>
                  </div>
                  {item.note && <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">{item.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={`/track/${submittedCase.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Compass className="w-4 h-4" />
            Track Live Status Portal
          </Link>
          <button
            onClick={resetForm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-sm transition-all"
          >
            Submit Another Report
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-gray-500 hover:text-gray-800 text-sm font-semibold transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // ── Progress Bar ────────────────────────────────────────────────────────────
  const ProgressBar = () => (
    <div className="mb-8" role="navigation" aria-label="Report form progress">
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((label, idx) => (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                idx < currentStep
                  ? 'bg-emerald-100 text-emerald-700'
                  : idx === currentStep
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {idx < currentStep ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </span>
              <span className={`hidden sm:block text-xs font-semibold ${
                idx === currentStep ? 'text-orange-600' : idx < currentStep ? 'text-emerald-600' : 'text-gray-400'
              }`}>{label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded-full ${idx < currentStep ? 'bg-emerald-300' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-xs text-gray-500 text-center">
        Step {currentStep + 1} of {STEPS.length} — <span className="font-semibold text-gray-700">{STEPS[currentStep]}</span>
      </p>
    </div>
  );

  const FieldError = ({ name }) =>
    errors[name] ? (
      <p className="mt-1 text-xs text-red-600 flex items-center gap-1" role="alert">
        <AlertTriangle className="w-3 h-3 shrink-0" />
        {errors[name]}
      </p>
    ) : null;

  const inputClass = (field) =>
    `form-input ${errors[field] ? 'form-input-error' : ''}`;

  // ── Main Form ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full mb-2">
          <Camera className="w-3.5 h-3.5" /> Direct Field Report
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Report a Person in Need</h1>
        <p className="text-sm text-gray-600 mt-1">
          Provide accurate details and photos to help outreach teams locate and support the individual safely.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm">
        <ProgressBar />

        <form onSubmit={handleSubmit} noValidate>

          {/* ─ Step 0: Location ─ */}
          {currentStep === 0 && (
            <div className="space-y-5">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Photo of Person / Surroundings <span className="text-gray-400 font-normal text-xs">(Recommended)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 hover:border-orange-400 rounded-2xl transition-colors bg-gray-50/50">
                  {formData.photoPreview ? (
                    <div className="relative inline-flex items-center justify-center w-full p-4">
                      <img
                        src={formData.photoPreview}
                        alt="Uploaded preview of the person or location"
                        className="max-h-56 rounded-xl object-contain shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => update('photoPreview', null)}
                        className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow hover:bg-red-700 transition-colors min-h-[36px]"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center py-10 px-4">
                      <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                        <Upload className="w-7 h-7" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 mb-1">
                        Tap to upload a photo or take a picture
                      </span>
                      <span className="text-xs text-gray-400">JPG, PNG up to 10MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        aria-label="Upload photo of person or surroundings"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* GPS / Address */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Exact Location <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={loadingLocation}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 min-h-[44px]"
                    aria-live="polite"
                  >
                    {loadingLocation ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Detecting GPS...</>
                    ) : (
                      <><MapPin className="w-4 h-4" /> Use My Current GPS Location</>
                    )}
                  </button>
                  {formData.lat && formData.lng && (
                    <span className="inline-flex items-center text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      GPS: {formData.lat}, {formData.lng}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="address" className="block text-xs font-semibold text-gray-600 mb-1">
                      Street Address or Crossroad <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={formData.address}
                      onChange={(e) => update('address', e.target.value)}
                      placeholder="e.g. Under Connaught Place Outer Circle flyover"
                      className={inputClass('address')}
                    />
                    <FieldError name="address" />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-xs font-semibold text-gray-600 mb-1">City / Region</label>
                    <select
                      id="city"
                      value={formData.city}
                      onChange={(e) => update('city', e.target.value)}
                      className="form-input bg-white"
                    >
                      <option value="New Delhi">New Delhi / NCR</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Jaipur">Jaipur</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Pune">Pune</option>
                      <option value="Other">Other City</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label htmlFor="landmark" className="block text-xs font-semibold text-gray-600 mb-1">
                    Nearby Landmark <span className="text-gray-400 font-normal">(Optional — helps rescuers find them faster)</span>
                  </label>
                  <input
                    id="landmark"
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => update('landmark', e.target.value)}
                    placeholder="e.g. Near red traffic signal, opposite SBI ATM"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all"
                >
                  Next: Person Details →
                </button>
              </div>
            </div>
          )}

          {/* ─ Step 1: Person Details ─ */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="personType" className="block text-xs font-bold text-gray-700 mb-1">
                    Individual Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="personType"
                    value={formData.personType}
                    onChange={(e) => update('personType', e.target.value)}
                    className="form-input bg-white"
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
                  <label htmlFor="estimatedAge" className="block text-xs font-bold text-gray-700 mb-1">
                    Estimated Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="estimatedAge"
                    type="text"
                    value={formData.estimatedAge}
                    onChange={(e) => update('estimatedAge', e.target.value)}
                    placeholder="e.g. 50-60 or Child &lt; 10"
                    className={inputClass('estimatedAge')}
                  />
                  <FieldError name="estimatedAge" />
                </div>

                <div>
                  <label htmlFor="urgency" className="block text-xs font-bold text-gray-700 mb-1">
                    Urgency Level
                  </label>
                  <select
                    id="urgency"
                    value={formData.urgency}
                    onChange={(e) => update('urgency', e.target.value)}
                    className="form-input bg-white"
                  >
                    <option value="Critical">🔴 Critical (Immediate danger/sick)</option>
                    <option value="High">🟠 High (Urgent food/shelter)</option>
                    <option value="Medium">🟡 Medium (Routine rescue)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="condition" className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Condition &amp; Observations <span className="text-red-500">*</span></span>
                  <span className={`font-normal ${formData.condition.length > MAX_CONDITION_CHARS * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
                    {formData.condition.length}/{MAX_CONDITION_CHARS}
                  </span>
                </label>
                <textarea
                  id="condition"
                  rows="4"
                  maxLength={MAX_CONDITION_CHARS}
                  value={formData.condition}
                  onChange={(e) => update('condition', e.target.value)}
                  placeholder="Describe physical condition, whether they can walk, language spoken, visible injuries, if accompanied by others, approximate time seen at this location..."
                  className={`${inputClass('condition')} resize-none`}
                />
                <FieldError name="condition" />
              </div>

              {formData.personType === 'Child / Minor (High Priority)' && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-800">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Child Rescue — High Priority</p>
                    <p className="text-xs mt-0.5">
                      This will be flagged as a <strong>CHILDLINE (1098)</strong> case. If the child appears in immediate danger, call <strong>1098</strong> directly now.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all"
                >
                  Next: Select NGO →
                </button>
              </div>
            </div>
          )}

          {/* ─ Step 2: NGO & Reporter ─ */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <label htmlFor="selectedNGO" className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    Government-Verified Rescue Partner
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> NITI Aayog &amp; MoSJE Empanelled Only
                  </span>
                </label>
                <select
                  id="selectedNGO"
                  value={formData.selectedNGO}
                  onChange={(e) => update('selectedNGO', e.target.value)}
                  className="form-input bg-white font-semibold text-gray-800"
                >
                  {govtVerifiedNGOs.map((ngo) => (
                    <option key={ngo.id} value={ngo.name}>
                      ✓ {ngo.name} — {ngo.city} (Darpan: {ngo.darpanId})
                    </option>
                  ))}
                </select>

                {/* Live Government Credential Preview for Selected NGO */}
                {(() => {
                  const selected = govtVerifiedNGOs.find((n) => n.name === formData.selectedNGO) || govtVerifiedNGOs[0];
                  if (!selected) return null;
                  return (
                    <div className="mt-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Authenticated Government Credentials
                        </span>
                        <span className="text-[10px] font-black uppercase text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                          {selected.tier} Tier Verified
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                        <div>
                          <span className="text-gray-500 block">NITI Aayog Darpan:</span>
                          <strong className="font-mono text-gray-900">{selected.darpanId}</strong>
                        </div>
                        <div>
                          <span className="text-gray-500 block">MoSJE SMILE Reg:</span>
                          <strong className="font-mono text-gray-900">{selected.mosjeRegNo}</strong>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Tax Exemption:</span>
                          <strong className="text-gray-900">12A &amp; 80G Certified</strong>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Nodal Officer:</span>
                          <strong className="text-gray-900">{selected.nodalOfficer?.name}</strong>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Rescue Van Fleet:</span>
                          <strong className="text-gray-900">{selected.rescueVan?.vanNumber}</strong>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Shelter Capacity:</span>
                          <strong className="text-gray-900">{selected.shelterCapacity} Beds</strong>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <p className="text-[11px] text-gray-500 mt-2">
                  🔒 Only accredited organizations with verified NITI Aayog registration, dedicated rescue vans, and MoSJE shelter licenses receive citizen dispatch notifications.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-500" /> Reporter Information <span className="text-gray-400 font-normal">(Optional — for status updates)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reporterName" className="block text-xs text-gray-500 mb-1">Your Name</label>
                    <input
                      id="reporterName"
                      type="text"
                      value={formData.reporterName}
                      onChange={(e) => update('reporterName', e.target.value)}
                      placeholder="Your Name (Optional)"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="reporterContact" className="block text-xs text-gray-500 mb-1">Your Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        id="reporterContact"
                        type="tel"
                        value={formData.reporterContact}
                        onChange={(e) => update('reporterContact', e.target.value)}
                        placeholder="Phone for status updates"
                        className={`${inputClass('reporterContact')} pl-9`}
                      />
                    </div>
                    <FieldError name="reporterContact" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Dispatching Alert...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Submit Report &amp; Notify NGO</>
                  )}
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
