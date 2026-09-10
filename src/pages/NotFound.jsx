import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Home, MapPin, PlusCircle, AlertTriangle, ArrowLeft, PhoneCall } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = '404 - Page Not Found | StreetCare India';
  }, []);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center" role="region" aria-label="Page not found">
      {/* 404 Visual Indicator */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-orange-100 flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-12 h-12 text-orange-600 animate-pulse" aria-hidden="true" />
        </div>
        <span className="absolute -bottom-2 right-1/2 translate-x-1/2 px-2.5 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
          Error 404
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-3">
        Page Not Found
      </h1>
      <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8">
        The link you followed may be broken or the page may have been moved. Let's get you back to safety.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap mb-10 w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm transition-all active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Go Back
        </button>
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-sm hover:from-orange-700 hover:to-amber-600 shadow-md shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          Go to Home
        </Link>
        <Link
          to="/report"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-sm hover:bg-orange-50 hover:border-orange-200 transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4 text-orange-600" aria-hidden="true" />
          Report Someone
        </Link>
        <Link
          to="/map"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-sm hover:bg-orange-50 hover:border-orange-200 transition-all active:scale-[0.98]"
        >
          <MapPin className="w-4 h-4 text-orange-600" aria-hidden="true" />
          Live Map
        </Link>
      </div>

      {/* Immediate Rescue Helpline Helper */}
      <div className="max-w-md w-full bg-orange-50 border border-orange-200 rounded-2xl p-4 text-left">
        <div className="flex items-center gap-2 text-xs font-bold text-orange-800 mb-1">
          <PhoneCall className="w-4 h-4 text-orange-600" aria-hidden="true" />
          <span>Need Immediate Rescue Help?</span>
        </div>
        <p className="text-xs text-orange-950/80 leading-relaxed">
          If this is a life-threatening child or destitute emergency, please call <strong>Childline 1098</strong> or <strong>Elderline 14567</strong> directly.
        </p>
      </div>

      {/* Branding Footer Note */}
      <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
        <Heart className="w-3.5 h-3.5 fill-orange-400 text-orange-400" aria-hidden="true" />
        <span>StreetCare India — Rehabilitating Lives with Compassion</span>
      </div>
    </div>
  );
}

