import React, { useState } from 'react';
import {
  Camera, MapPin, AlertCircle, CheckCircle2, Send, Building2,
  Upload, Loader2, AlertTriangle, User, Phone
} from 'lucide-react';
import toast from 'react-hot-toast';
import { INITIAL_NGOS } from '../data/mockData';

const STEPS = ['Location', 'Person Details', 'NGO & Reporter'];
const MAX_CONDITION_CHARS = 400;

const validatePhone = (phone) =>
  phone === '' || /^[6-9]\d{9}$/.test(phone.replace(/[\s\-+91]/g, ''));

export default function ReportForm() {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    selectedNGO: INITIAL_NGOS[0]?.name || '',
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
      setSubmitting(false);
      setSubmitted(true);
      toast.success('Report submitted! Nearby NGO notified.');
    }, 1200);
  };

  const resetForm = () => {
    setSubmitted(false);
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
      selectedNGO: INITIAL_NGOS[0]?.name || '',
      reporterName: '',
      reporterContact: '',
      photoPreview: null,
    });
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-3">
          Rescue Dispatched
        </span>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Rescue Request Sent!</h2>
        <p className="text-gray-600 text-base mb-6 leading-relaxed max-w-lg mx-auto">
          Thank you for being a compassionate citizen. An automated alert has been routed to{' '}
          <strong>{formData.selectedNGO}</strong> and the local social welfare rescue team.
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
          <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Status: Dispatched to Rescue Van
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={resetForm}
            className="px-6 py-3 rounded-xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 transition-colors"
          >
            Submit Another Report
          </button>
          <a
            href="/map"
            className="px-6 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            View on Live Map
          </a>
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
                <label htmlFor="selectedNGO" className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-orange-600" />
                  Alert Nearest Verified Rehabilitation NGO
                </label>
                <select
                  id="selectedNGO"
                  value={formData.selectedNGO}
                  onChange={(e) => update('selectedNGO', e.target.value)}
                  className="form-input bg-white font-medium text-gray-800"
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
