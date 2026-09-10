import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Search, ShieldCheck, CheckCircle2, Clock, MapPin, Building2, Phone,
  ExternalLink, AlertTriangle, ArrowLeft, Truck, FileText, UserCheck, Heart
} from 'lucide-react';
import { getAllReports, getReportById } from '../data/mockData';

export default function TrackCase() {
  const { caseId: paramCaseId } = useParams();
  const [searchParams] = useSearchParams();
  const queryCaseId = searchParams.get('id');

  const initialId = paramCaseId || queryCaseId || 'SC-2026-8841';
  const [inputCaseId, setInputCaseId] = useState(initialId);
  const [currentCase, setCurrentCase] = useState(() => getReportById(initialId));
  const [searchError, setSearchError] = useState('');
  const [allReports, setAllReports] = useState([]);

  useEffect(() => {
    const reports = getAllReports();
    setAllReports(reports);
    const found = getReportById(inputCaseId);
    if (found) {
      setCurrentCase(found);
      setSearchError('');
    }
  }, [inputCaseId]);

  useEffect(() => {
    if (paramCaseId) {
      setInputCaseId(paramCaseId);
      const found = getReportById(paramCaseId);
      if (found) setCurrentCase(found);
    }
  }, [paramCaseId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputCaseId.trim()) return;
    const found = getReportById(inputCaseId.trim());
    if (found) {
      setCurrentCase(found);
      setSearchError('');
    } else {
      setSearchError(`No active case found for "${inputCaseId.trim()}". Please check your Case ID.`);
    }
  };

  const ngo = currentCase?.assignedNGOData;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            Official Government-Verified Tracking Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Live Case Progress &amp; NGO Verification
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time rescue tracking under Ministry of Social Justice &amp; Empowerment (MoSJE) protocols.
          </p>
        </div>

        <Link
          to="/report"
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20"
        >
          + Report Another Case
        </Link>
      </div>

      {/* Case ID Search Form */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              value={inputCaseId}
              onChange={(e) => {
                setInputCaseId(e.target.value);
                setSearchError('');
              }}
              placeholder="Enter Case Tracking ID (e.g. SC-2026-8841)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-300 text-sm font-mono focus:outline-none focus:border-orange-500 bg-slate-50 focus:bg-white transition-all uppercase"
              aria-label="Enter Case Tracking ID"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all whitespace-nowrap active:scale-[0.98]"
          >
            Track Process
          </button>
        </form>

        {searchError && (
          <div className="flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-xl">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Quick Sample / Recent Cases chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Sample Cases:
          </span>
          {allReports.slice(0, 4).map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setInputCaseId(r.id);
                setCurrentCase(r);
                setSearchError('');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                currentCase?.id === r.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {r.id} ({r.personType.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {currentCase ? (
        <div className="space-y-6">
          {/* Case Summary Banner */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl sm:text-2xl font-black font-mono text-gray-900 tracking-tight">
                  Case ID: {currentCase.id}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  currentCase.urgency === 'Critical'
                    ? 'bg-red-600 text-white'
                    : 'bg-orange-500 text-white'
                }`}>
                  {currentCase.urgency} Priority
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {currentCase.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {currentCase.personType} {currentCase.estimatedAge ? `(~${currentCase.estimatedAge})` : ''}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>{currentCase.location.address}</span>
              </div>
            </div>

            <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 text-xs space-y-1.5 self-start md:min-w-[240px]">
              <div className="text-[11px] font-bold text-gray-400 uppercase">Case Metadata</div>
              <div>Reported: <strong>{currentCase.reportedAt}</strong></div>
              <div>Reported By: <strong>{currentCase.reportedBy || 'Anonymous Citizen'}</strong></div>
              <div>Assigned Agency: <strong className="text-orange-950">{currentCase.assignedNGO}</strong></div>
            </div>
          </div>

          {/* Real-time Rescue Process Timeline */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900">Live Rescue &amp; Rehabilitation Progress</h2>
                <p className="text-xs text-gray-500">Official step-by-step dispatch audit trail</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Active Monitoring
              </span>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-orange-400 before:to-gray-200">
              {(currentCase.timeline || [
                { title: 'Report Geotagged & Authenticated', time: currentCase.reportedAt, completed: true, note: 'Coordinates logged on field map' },
                { title: `Assigned to Government-Verified NGO: ${currentCase.assignedNGO}`, time: 'Verified', completed: true, note: `Transmitted to empanelled nodal team` },
                { title: 'Rescue Van Dispatched & En Route', time: 'Active', completed: currentCase.status !== 'Assigned', note: 'Emergency response team dispatched' },
                { title: 'Shelter Admission & Medical Rehabilitation', time: 'In Progress', completed: currentCase.status === 'Rehabilitated & Safe', note: 'Under MoSJE care guidelines' },
              ]).map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Step Pin */}
                  <div className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.completed
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 ring-4 ring-white'
                      : 'bg-white border-2 border-gray-300 text-gray-400 ring-4 ring-white'
                  }`}>
                    {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:border-orange-200 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className={`text-sm font-black ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.title}
                      </h3>
                      <span className="text-[11px] font-mono text-gray-400 font-semibold">{step.time}</span>
                    </div>
                    {step.note && (
                      <p className="text-xs text-gray-600 leading-relaxed mt-1">
                        {step.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Receiver NGO Government Accreditation Dossier */}
          {ngo && (
            <div className="bg-gradient-to-br from-white to-orange-50/40 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    100% Government-Verified Receiver Organization
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                    {ngo.name}
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    Accredited under: <strong>{ngo.verificationAgency || 'NITI Aayog & MoSJE'}</strong>
                  </p>
                </div>

                <a
                  href="https://ngodarpan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-300 hover:border-orange-500 text-gray-800 text-xs font-bold transition-all shadow-sm"
                >
                  Verify on NITI Aayog Portal <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
                </a>
              </div>

              {/* Complete Credential Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    NITI Aayog Darpan ID
                  </div>
                  <div className="font-mono font-bold text-gray-900 text-sm">{ngo.darpanId}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated &amp; Active
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    MoSJE SMILE Empanelment
                  </div>
                  <div className="font-mono font-bold text-gray-900 text-sm">
                    {ngo.mosjeRegNo || 'MoSJE/SMILE/PAN-INDIA'}
                  </div>
                  <div className="text-[11px] text-orange-600 font-semibold">
                    Beggary Scheme National Partner
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Income Tax 12A &amp; 80G Status
                  </div>
                  <div className="font-bold text-gray-900 text-sm">Tax-Exempt Registered</div>
                  <div className="text-[11px] text-gray-500">{ngo.taxExemption}</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Shelter License &amp; Capacity
                  </div>
                  <div className="font-bold text-gray-900 text-sm">
                    License: {ngo.shelterLicense || 'SWD/SHL/VERIFIED'}
                  </div>
                  <div className="text-[11px] text-gray-600">
                    Capacity: <strong>{ngo.shelterCapacity} Beds</strong> • Cases Resolved: <strong>{ngo.casesResolved}+</strong>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-orange-600" /> Assigned Rescue Van Fleet
                  </div>
                  <div className="font-mono font-bold text-gray-900 text-sm">
                    {ngo.rescueVan?.vanNumber || 'Dedicated Emergency Van'}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    Status: {ngo.rescueVan?.status || 'Active On Call'}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Assigned Nodal Officer
                  </div>
                  <div className="font-bold text-gray-900 text-sm">
                    {ngo.nodalOfficer?.name || 'Director In-Charge'}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {ngo.nodalOfficer?.designation || 'Field Rehabilitation Lead'}
                  </div>
                </div>
              </div>

              {/* Direct Contact Action Strip */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-gray-900">Need to share more location landmarks?</div>
                  <div className="text-xs text-gray-500">
                    Direct helpline: <strong>{ngo.phone}</strong> • Nodal Officer:{' '}
                    <strong>{ngo.nodalOfficer?.phone || ngo.phone}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${ngo.phone}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call NGO Helpline
                  </a>
                  <a
                    href={`mailto:${ngo.email}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-all"
                  >
                    Email Office
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Case Selected</h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
            Enter your Case Tracking ID above or select one of the sample cases to inspect live rescue status and government verification credentials.
          </p>
        </div>
      )}
    </div>
  );
}
