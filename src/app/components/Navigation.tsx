import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // The "Scroll Listener" Engine
  useEffect(() => {
    const handleScroll = () => {
      // Switch to dark mode after scrolling 10px
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-[#0f172a] shadow-lg py-4' : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-yellow-500 text-black font-bold text-xl w-10 h-10 flex items-center justify-center rounded-lg group-hover:scale-105 transition-transform">
            G
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-tight tracking-wide">GRADE A</span>
            <span className="text-yellow-500 font-bold text-xs tracking-[0.2em]">REALTY</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-yellow-500 font-medium transition-colors">HOME</Link>
          <Link to="/properties" state={{ globalSearch: 'Buy' }} className="text-white hover:text-yellow-500 font-medium transition-colors">BUY</Link>
          <Link to="/properties" state={{ globalSearch: 'Rent' }} className="text-white hover:text-yellow-500 font-medium transition-colors">RENT</Link>
          <Link to="/sell" className="text-white hover:text-yellow-500 font-medium transition-colors">SELL</Link>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-white hover:text-yellow-500 font-medium transition">
            Sign In
          </Link>
          <Link
            to="/register"
            className={`px-5 py-2 rounded-full font-medium transition-all ${isScrolled
              ? 'bg-yellow-500 text-black hover:bg-yellow-400'
              : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900'
              }`}
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;