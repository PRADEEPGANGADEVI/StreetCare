import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, MapPin, PlusCircle, Shield, Building2, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Heart },
    { name: 'Report Someone', path: '/report', icon: PlusCircle, highlight: true },
    { name: 'Live Map', path: '/map', icon: MapPin },
    { name: 'NGO Dashboard', path: '/ngo', icon: Building2 },
    { name: 'NGO Portal', path: '/ngo-register', icon: Building2 },
    { name: 'Admin', path: '/admin', icon: Shield },
  ];

  const isActive = (path) => location.pathname === path;

  // Get the current page name for mobile display
  const currentPage = navLinks.find((l) => l.path === location.pathname);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <nav
      className="bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-100 sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group" aria-label="StreetCare India — Go to homepage">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Heart className="w-6 h-6 fill-white" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent tracking-tight">
                  StreetCare
                </span>
                {/* Show current page name on mobile */}
                <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider md:block">
                  {currentPage && location.pathname !== '/'
                    ? <span className="text-orange-500">{currentPage.name}</span>
                    : 'India Rescue & Care'}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1" role="menubar">
            {navLinks.map((link) => {
              const Icon = link.icon;
              if (link.highlight) {
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    role="menuitem"
                    aria-current={isActive(link.path) ? 'page' : undefined}
                    className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {link.name}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  role="menuitem"
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-orange-600 bg-orange-50 font-semibold'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50/50'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-70" aria-hidden="true" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              {isOpen
                ? <X className="w-6 h-6" aria-hidden="true" />
                : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-orange-100 bg-white px-4 pt-2 pb-4 space-y-1"
          role="menu"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                role="menuitem"
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium min-h-[48px] ${
                  link.highlight
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-sm'
                    : isActive(link.path)
                    ? 'text-orange-600 bg-orange-50 font-semibold'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>{link.name}</span>
                {isActive(link.path) && !link.highlight && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-orange-500" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
