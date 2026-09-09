import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import MapPage from './pages/MapPage';
import NGODashboard from './pages/NGODashboard';
import NGORegister from './pages/NGORegister';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-gray-900 font-sans selection:bg-orange-500 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportForm />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/ngo" element={<NGODashboard />} />
            <Route path="/ngo-register" element={<NGORegister />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800">StreetCare India Initiative</span>
              <span>•</span>
              <span>Rehabilitating Lives with Compassion & Legal Due Diligence</span>
            </div>
            <div className="flex items-center gap-4">
              <span>National Childline: <strong>1098</strong></span>
              <span>Elderline: <strong>14567</strong></span>
              <span>SMILE MoSJE Empanelled</span>
            </div>
          </div>
        </footer>

        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
