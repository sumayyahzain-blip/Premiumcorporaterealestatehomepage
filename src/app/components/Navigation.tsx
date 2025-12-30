import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className = '' }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className={`sticky top-0 z-50 bg-white border-b border-[var(--gray-200)] ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-semibold text-[var(--emerald-800)] tracking-tight">
              Estate
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#buy" className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors">
              Buy
            </a>
            <a href="#rent" className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors">
              Rent
            </a>
            <a href="#sell" className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors">
              Sell
            </a>
            <a href="#manage" className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors">
              Manage
            </a>
            <a href="#invest" className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors">
              Invest
            </a>
            <a href="#learn" className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors">
              Learn
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors px-4 py-2">
              Login
            </button>
            <button className="bg-[var(--gold-500)] hover:bg-[var(--gold-600)] text-white px-6 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[var(--gray-700)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[var(--gray-200)]">
            <div className="flex flex-col space-y-4">
              <a href="#buy" className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors py-2">
                Buy
              </a>
              <a href="#rent" className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors py-2">
                Rent
              </a>
              <a href="#sell" className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors py-2">
                Sell
              </a>
              <a href="#manage" className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors py-2">
                Manage
              </a>
              <a href="#invest" className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors py-2">
                Invest
              </a>
              <a href="#learn" className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors py-2">
                Learn
              </a>
              <div className="flex flex-col space-y-3 pt-4">
                <button className="text-[var(--gray-700)] hover:text-[var(--emerald-800)] transition-colors py-2 text-left">
                  Login
                </button>
                <button className="bg-[var(--gold-500)] hover:bg-[var(--gold-600)] text-white px-6 py-2.5 rounded-lg transition-all">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
