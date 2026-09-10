import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, MapPin, PlusCircle, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      {/* Icon */}
      <div className="w-24 h-24 rounded-3xl bg-orange-100 flex items-center justify-center mx-auto mb-6 shadow-inner">
        <AlertTriangle className="w-12 h-12 text-orange-500" />
      </div>

      {/* Heading */}
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest mb-4">
        404 — Page Not Found
      </span>
      <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-3">
        Oops! Wrong Turn.
      </h1>
      <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed mb-8">
        The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
      </p>

      {/* Quick Nav Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-sm hover:from-orange-700 hover:to-amber-600 shadow-md shadow-orange-500/25 transition-all hover:scale-[1.02]"
        >
          <Home className="w-4 h-4" />
          Go to Home
        </Link>
        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-sm hover:bg-orange-50 hover:border-orange-200 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-orange-600" />
          Report Someone
        </Link>
        <Link
          to="/map"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-sm hover:bg-orange-50 hover:border-orange-200 transition-all"
        >
          <MapPin className="w-4 h-4 text-orange-600" />
          Live Map
        </Link>
      </div>

      {/* Branding Footer Note */}
      <div className="mt-12 flex items-center gap-2 text-xs text-gray-400">
        <Heart className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
        <span>StreetCare India — Rehabilitating Lives with Compassion</span>
      </div>
    </div>
  );
}
