import React, { useState } from 'react';
import { Building2, ShieldCheck, FileText, CheckCircle2, Send, AlertTriangle, Info, Phone, Mail, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

// --- Validation helpers ---
const validatePAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone.replace(/[\s\-+91]/g, ''));
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateDarpanId = (id) => /^[A-Z]{2}\/\d{4}\/\d{7}$/.test(id.toUpperCase());

// Progress Steps
const STEPS = ['Legal & Accreditation', 'Operational Details', 'Contact Person'];

export default function NGORegister() {
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});

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
    focusArea: 'Elderly homeless & destitute',
  });

  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Validate per step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.ngoName.trim()) newErrors.ngoName = 'Organization name is required.';
      if (!formData.darpanId.trim()) {
        newErrors.darpanId = 'NGO Darpan ID is required.';
      } else if (!validateDarpanId(formData.darpanId)) {
        newErrors.darpanId = 'Format must be: ST/YYYY/XXXXXXX (e.g. DL/2021/0284910)';
      }
      if (formData.pan && !validatePAN(formData.pan)) {
        newErrors.pan = 'Invalid PAN format. Expected: AAAAA9999A';
      }
    }

    if (step === 1) {
      if (!formData.city.trim()) newErrors.city = 'City is required.';
      if (!formData.state.trim()) newErrors.state = 'State is required.';
      if (!formData.address.trim()) newErrors.address = 'Shelter address is required.';
    }

    if (step === 2) {
      if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact name is required.';
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required.';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Enter a valid 10-digit Indian mobile number.';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required.';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Enter a valid email address.';
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
    setSubmitted(true);
    toast.success('Registration submitted! Application forwarded to StreetCare verification cell.');
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-3">
          Application Received
        </span>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Application Under Review</h2>
        <p className="text-gray-600 text-sm leading-relaxed max-w-lg mx-auto mb-6">
          Your NGO <strong>{formData.ngoName}</strong> has been received. Our verification officers will validate your{' '}
          <strong>NGO Darpan ID ({formData.darpanId || 'Pending'})</strong> and 12A/80G status within 24–48 hours.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-left text-xs max-w-md mx-auto space-y-2 mb-8">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            Verification Level: Tier 1 (Bronze — In Progress)
          </div>
          <div className="text-amber-800">
            Once approved, your rescue team will receive real-time SMS &amp; webhook dispatches whenever a citizen reports in your city.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            View in Admin Portal
          </a>
          <button
            onClick={() => { setSubmitted(false); setCurrentStep(0); setErrors({}); }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            Register Another NGO
          </button>
        </div>
      </div>
    );
  }

  // ── Progress Indicator ──────────────────────────────────────────────────────
  const ProgressBar = () => (
    <div className="mb-8" role="navigation" aria-label="Form progress">
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((label, idx) => (
          <React.Fragment key={label}>
            <button
              type="button"
              onClick={() => idx < currentStep && setCurrentStep(idx)}
              disabled={idx > currentStep}
              aria-current={idx === currentStep ? 'step' : undefined}
              className={`flex items-center gap-2 text-xs font-semibold transition-colors disabled:cursor-default ${
                idx === currentStep
                  ? 'text-orange-600'
                  : idx < currentStep
                  ? 'text-emerald-600 cursor-pointer hover:text-emerald-700'
                  : 'text-gray-400'
              }`}
            >
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                idx < currentStep
                  ? 'bg-emerald-100 text-emerald-700'
                  : idx === currentStep
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {idx < currentStep ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </span>
              <span className="hidden sm:block">{label}</span>
            </button>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${idx < currentStep ? 'bg-emerald-300' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-xs text-gray-500 text-center">
        Step {currentStep + 1} of {STEPS.length} — <span className="font-semibold text-gray-700">{STEPS[currentStep]}</span>
      </p>
    </div>
  );

  // ── Field Error Helper ─────────────────────────────────────────────────────
  const FieldError = ({ name }) =>
    errors[name] ? (
      <p className="mt-1 text-xs text-red-600 flex items-center gap-1" role="alert">
        <AlertTriangle className="w-3 h-3 shrink-0" />
        {errors[name]}
      </p>
    ) : null;

  // ── Tooltip Helper ─────────────────────────────────────────────────────────
  const Tooltip = ({ text }) => (
    <span className="group relative inline-flex ml-1 cursor-help">
      <Info className="w-3.5 h-3.5 text-gray-400 hover:text-orange-500 transition-colors" />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-900 text-white text-[11px] rounded-xl p-2.5 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 leading-relaxed">
        {text}
      </span>
    </span>
  );

  // ── Input Class Helper ─────────────────────────────────────────────────────
  const inputClass = (field) =>
    `form-input ${errors[field] ? 'form-input-error' : ''}`;

  // ── Main Form ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full mb-2">
          <Building2 className="w-3.5 h-3.5" /> Institutional Onboarding
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">NGO &amp; Rehabilitation Center Registration</h1>
        <p className="text-sm text-gray-600 mt-1">
          Join the national network of verified shelters and rescue teams helping destitute and homeless individuals.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm">
        <ProgressBar />

        <form onSubmit={handleSubmit} noValidate>

          {/* ─ Step 0: Legal & Accreditation ─ */}
          {currentStep === 0 && (
            <div className="space-y-5">
              <div>
                <label htmlFor="ngoName" className="block text-xs font-bold text-gray-700 mb-1">
                  Organization Name <span className="text-red-500">*</span> <span className="text-gray-400 font-normal">(as per Certificate)</span>
                </label>
                <input
                  id="ngoName"
                  type="text"
                  required
                  value={formData.ngoName}
                  onChange={(e) => update('ngoName', e.target.value)}
                  placeholder="e.g. Hope Social Welfare Foundation"
                  className={inputClass('ngoName')}
                  aria-describedby={errors.ngoName ? 'ngoName-error' : undefined}
                />
                <FieldError name="ngoName" />
              </div>

              <div>
                <label htmlFor="darpanId" className="block text-xs font-bold text-gray-700 mb-1 flex items-center">
                  NITI Aayog NGO Darpan Unique ID <span className="text-red-500 ml-1">*</span>
                  <Tooltip text="Register at ngodarpan.gov.in to get your Unique ID. Format: STATE/YEAR/7-DIGIT-NUMBER (e.g. DL/2021/0284910)" />
                </label>
                <input
                  id="darpanId"
                  type="text"
                  required
                  value={formData.darpanId}
                  onChange={(e) => update('darpanId', e.target.value.toUpperCase())}
                  placeholder="e.g. DL/2021/0284910"
                  className={inputClass('darpanId')}
                />
                <FieldError name="darpanId" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pan" className="block text-xs font-bold text-gray-700 mb-1 flex items-center">
                    PAN Card Number <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                    <Tooltip text="PAN format: 5 letters + 4 digits + 1 letter (e.g. AABCH2345D)" />
                  </label>
                  <input
                    id="pan"
                    type="text"
                    value={formData.pan}
                    onChange={(e) => update('pan', e.target.value.toUpperCase())}
                    placeholder="e.g. AABCH2345D"
                    maxLength={10}
                    className={inputClass('pan')}
                  />
                  <FieldError name="pan" />
                </div>

                <div>
                  <label htmlFor="registrationType" className="block text-xs font-bold text-gray-700 mb-1">
                    Registration Type
                  </label>
                  <select
                    id="registrationType"
                    value={formData.registrationType}
                    onChange={(e) => update('registrationType', e.target.value)}
                    className="form-input bg-white"
                  >
                    <option value="Section 8 Company">Section 8 Company (Companies Act 2013)</option>
                    <option value="Registered Trust">Public Charitable Trust (Trust Act 1882)</option>
                    <option value="Registered Society">Society (Societies Registration Act 1860)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="has12A80G" className="block text-xs font-bold text-gray-700 mb-1">
                    Has 12A &amp; 80G Tax Exemption?
                  </label>
                  <select
                    id="has12A80G"
                    value={formData.has12A80G}
                    onChange={(e) => update('has12A80G', e.target.value)}
                    className="form-input bg-white"
                  >
                    <option value="Yes">Yes (Eligible for Silver/Gold Tier)</option>
                    <option value="Under Process">Applied / Under Process</option>
                    <option value="No">No (Bronze Tier)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="focusArea" className="block text-xs font-bold text-gray-700 mb-1">
                    Primary Focus Area
                  </label>
                  <select
                    id="focusArea"
                    value={formData.focusArea}
                    onChange={(e) => update('focusArea', e.target.value)}
                    className="form-input bg-white"
                  >
                    <option value="Elderly homeless & destitute">Elderly Homeless &amp; Destitute</option>
                    <option value="Children & minors">Children &amp; Minors</option>
                    <option value="Mentally ill persons">Mentally Ill Persons</option>
                    <option value="Women & mothers">Women &amp; Mothers</option>
                    <option value="General rescue">General Rescue (All categories)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all"
                >
                  Next: Operational Details →
                </button>
              </div>
            </div>
          )}

          {/* ─ Step 1: Operational Capacity ─ */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-xs font-bold text-gray-700 mb-1">
                    Operating City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      id="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => update('city', e.target.value)}
                      placeholder="e.g. Pune"
                      className={`${inputClass('city')} pl-9`}
                    />
                  </div>
                  <FieldError name="city" />
                </div>

                <div>
                  <label htmlFor="state" className="block text-xs font-bold text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="state"
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => update('state', e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className={inputClass('state')}
                  />
                  <FieldError name="state" />
                </div>

                <div>
                  <label htmlFor="shelterCapacity" className="block text-xs font-bold text-gray-700 mb-1">
                    Bed / Shelter Capacity
                  </label>
                  <input
                    id="shelterCapacity"
                    type="number"
                    min="1"
                    value={formData.shelterCapacity}
                    onChange={(e) => update('shelterCapacity', e.target.value)}
                    placeholder="e.g. 100"
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-xs font-bold text-gray-700 mb-1">
                  Permanent Shelter / Center Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder="Full address of shelter home or main office"
                  className={inputClass('address')}
                />
                <FieldError name="address" />
              </div>

              <div>
                <label htmlFor="hasRescueVan" className="block text-xs font-bold text-gray-700 mb-1">
                  Do you have a dedicated Rescue Van?
                </label>
                <select
                  id="hasRescueVan"
                  value={formData.hasRescueVan}
                  onChange={(e) => update('hasRescueVan', e.target.value)}
                  className="form-input bg-white"
                >
                  <option value="Yes">Yes — Available for immediate dispatch</option>
                  <option value="No">No — Rely on hired transport</option>
                  <option value="Shared">Shared with partner NGO</option>
                </select>
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
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all"
                >
                  Next: Contact Details →
                </button>
              </div>
            </div>
          )}

          {/* ─ Step 2: Contact Details ─ */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <p className="text-xs text-gray-500 bg-orange-50 rounded-xl px-4 py-3 border border-orange-100">
                📡 This contact will receive <strong>real-time SMS &amp; dashboard alerts</strong> for rescue dispatches in your city.
              </p>

              <div>
                <label htmlFor="contactPerson" className="block text-xs font-bold text-gray-700 mb-1">
                  Contact Officer Name &amp; Designation <span className="text-red-500">*</span>
                </label>
                <input
                  id="contactPerson"
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => update('contactPerson', e.target.value)}
                  placeholder="e.g. Priya Sharma — Field Coordinator"
                  className={inputClass('contactPerson')}
                />
                <FieldError name="contactPerson" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-gray-700 mb-1">
                    Emergency Dispatch Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="+91-XXXXXXXXXX"
                      className={`${inputClass('phone')} pl-9`}
                    />
                  </div>
                  <FieldError name="phone" />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-gray-700 mb-1">
                    Official Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="ngo@example.org"
                      className={`${inputClass('email')} pl-9`}
                    />
                  </div>
                  <FieldError name="email" />
                </div>
              </div>

              {/* Summary before submit */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-1 text-xs text-gray-600">
                <p className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-orange-500" /> Registration Summary
                </p>
                <p><span className="font-semibold text-gray-700">NGO:</span> {formData.ngoName || '—'}</p>
                <p><span className="font-semibold text-gray-700">Darpan ID:</span> {formData.darpanId || '—'}</p>
                <p><span className="font-semibold text-gray-700">Location:</span> {formData.city ? `${formData.city}, ${formData.state}` : '—'}</p>
                <p><span className="font-semibold text-gray-700">Type:</span> {formData.registrationType}</p>
                <p><span className="font-semibold text-gray-700">12A/80G:</span> {formData.has12A80G}</p>
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
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  Submit for Accreditation &amp; Verification
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
