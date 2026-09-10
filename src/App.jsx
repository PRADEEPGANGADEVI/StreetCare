import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';

// Lazy-load pages for faster initial load
const Home = lazy(() => import('./pages/Home'));
const ReportForm = lazy(() => import('./pages/ReportForm'));
const MapPage = lazy(() => import('./pages/MapPage'));
const NGODashboard = lazy(() => import('./pages/NGODashboard'));
const NGORegister = lazy(() => import('./pages/NGORegister'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Full-screen loading spinner shown while pages load
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]" role="status" aria-label="Loading page">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
        <span className="text-sm text-gray-500 font-medium">Loading...</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50 text-gray-900 font-sans selection:bg-orange-500 selection:text-white">
        <Navbar />
        <main className="flex-grow" id="main-content">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/report" element={<ReportForm />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/ngo" element={<NGODashboard />} />
              <Route path="/ngo-register" element={<NGORegister />} />
              <Route path="/admin" element={<AdminPanel />} />
              {/* 404 catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-10" role="contentinfo">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800">StreetCare India Initiative</span>
              <span>•</span>
              <span>Rehabilitating Lives with Compassion &amp; Legal Due Diligence</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <a href="tel:1098" className="hover:text-orange-600 transition-colors">
                National Childline: <strong>1098</strong>
              </a>
              <a href="tel:14567" className="hover:text-orange-600 transition-colors">
                Elderline: <strong>14567</strong>
              </a>
              <span>SMILE MoSJE Empanelled</span>
            </div>
          </div>
        </footer>

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
