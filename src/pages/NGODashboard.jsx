import React, { useState } from 'react';
import { Building2, CheckCircle2, Clock, MapPin, AlertCircle, Phone, ArrowRight, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { INITIAL_REPORTS } from '../data/mockData';

export default function NGODashboard() {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [activeTab, setActiveTab] = useState('active');

  const handleUpdateStatus = (id, newStatus) => {
    setReports((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    toast.success(`Case status updated to: ${newStatus}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Live Field Operation Unit
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            SPYM Rehabilitation Hub (Delhi NCR)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Darpan ID: <strong>DL/2010/0034123</strong> • Empanelled under MoSJE SMILE Beggary Scheme
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-orange-50 px-4 py-3 rounded-2xl border border-orange-100 text-center">
            <span className="block text-2xl font-black text-orange-600">{reports.length}</span>
            <span className="text-[11px] font-semibold text-gray-600">Pending Alerts</span>
          </div>
          <div className="bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100 text-center">
            <span className="block text-2xl font-black text-emerald-600">12,480</span>
            <span className="text-[11px] font-semibold text-gray-600">Total Rehabilitated</span>
          </div>
        </div>
      </div>

      {/* Case Management Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-gray-900">Incoming Field Rescue Dispatches</h2>
          <span className="text-xs text-gray-500">Auto-routed by GPS Proximity</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-gray-100">
                  <img src={report.photo} alt={report.personType} className="w-full h-full object-cover" />
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
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      <span className="truncate">{report.location.address}</span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Reported by: {report.reportedBy} ({report.reportedAt})
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-gray-500">Current Status:</span>
                    <span className="font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full">
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
                      className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" /> Dispatch Rescue Team
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(report.id, 'Rehabilitated & Safe')}
                      className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Rescued & In Shelter
                    </button>
                  </>
                ) : (
                  <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Case Successfully Resolved
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
