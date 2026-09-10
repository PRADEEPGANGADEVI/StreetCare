import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, ShieldCheck, PhoneCall, Users, ArrowRight, CheckCircle2, AlertTriangle, Building2 } from 'lucide-react';
import { EMERGENCY_NUMBERS, INITIAL_REPORTS } from '../data/mockData';

export default function Home() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-transparent pt-12 pb-20" aria-label="Hero - StreetCare India">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold tracking-wide uppercase">
              <Heart className="w-3.5 h-3.5 fill-orange-600" />
              Empowering Compassionate Citizens Across India
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight">
              See someone in need on the street?{' '}
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Don't look away. Connect them to care.
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              StreetCare helps you capture a photo, pinpoint their exact location, and immediately notify verified local rehabilitation centers and government-backed shelters under India's <strong>SMILE scheme</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/report"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <AlertTriangle className="w-5 h-5" />
                Report Someone in Need Now
              </Link>
              <Link
                to="/map"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition-all"
              >
                <MapPin className="w-5 h-5 text-orange-600" />
                View Live Rescue Map
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Helplines Quick Access */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Emergency helplines">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-orange-200 font-bold">24/7 Official Emergency</span>
              <h2 className="text-2xl font-bold mt-1">National Government Helplines</h2>
              <p className="text-orange-100 text-sm mt-1">
                For immediate life-threatening situations, child rescue, or severe medical emergencies:
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EMERGENCY_NUMBERS.map((h) => (
              <a
                key={h.number}
                href={`tel:${h.number.replace(/[^0-9]/g, '')}`}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl p-4 transition-all border border-white/15 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black group-hover:underline">{h.number}</span>
                    <PhoneCall className="w-5 h-5 text-orange-200" />
                  </div>
                  <h3 className="font-semibold text-sm mt-2">{h.label}</h3>
                </div>
                <p className="text-xs text-orange-100 mt-2 opacity-90">{h.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="How StreetCare works">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-gray-900">How StreetCare Saves Lives</h2>
          <p className="text-gray-600 mt-2">A simple 3-step action for every citizen that bridges the gap to rehabilitation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xl mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Snap & Share Location</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Take a quick photo of the individual, specify their estimated condition, and let GPS pinpoint the street or landmark.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-black text-xl mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Automated NGO Alert</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our system alerts nearby verified NGOs, night shelters, and District Social Welfare teams equipped with rescue vans.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Rehabilitation & Dignity</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Trained social workers arrive, offer medical care, arrange safe shelter, and initiate family reunion or vocational training.
            </p>
          </div>
        </div>
      </section>

      {/* Active Rescue Cases Stream */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Recent Community Reports</h2>
            <p className="text-sm text-gray-600">Real-time alerts submitted by citizens across India.</p>
          </div>
          <Link to="/map" className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700">
            View all on interactive map <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_REPORTS.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="relative h-44 bg-gray-100">
                <img
                    src={r.photo}
                    alt={`${r.personType}, estimated age ${r.estimatedAge}, in ${r.location.city}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                    r.urgency === 'Critical' ? 'bg-red-600 text-white' :
                    r.urgency === 'High' ? 'bg-orange-600 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {r.urgency} Urgency
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{r.reportedAt}</span>
                    <span className="font-semibold text-orange-600">{r.location.city}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">{r.personType} (Age ~{r.estimatedAge})</h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{r.condition}</p>
                  
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-3">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    <span className="truncate">{r.location.address}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Status:</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {r.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Callout for NGOs and Volunteers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-stone-900 via-gray-900 to-stone-800 text-white rounded-3xl p-8 sm:p-12">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-orange-400">For Rehabilitation Centers</span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Are you an NGO or Shelter working with the homeless?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Register your organization on StreetCare to receive real-time case alerts in your operational radius. Access verification tiers (Bronze, Silver, Gold) verified against NGO Darpan and 12A/80G credentials.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/ngo-register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all"
              >
                <Building2 className="w-4 h-4" />
                Register Your NGO Now
              </Link>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Verification Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
