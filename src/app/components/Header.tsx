import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthHook } from '../../hooks';
import { User, LogOut, LayoutDashboard, Settings } from 'lucide-react';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Auth State
    const { isAuthenticated, user, logout } = useAuthHook();

    const isActive = (path: string) => location.pathname === path;

    // Check if we are on the homepage
    const isHomePage = location.pathname === '/';

    // Scroll Listener
    useEffect(() => {
        const handleScroll = () => {
            // Updated to simple check, can be refined
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    // Dynamic classes based on scroll state & Route
    // Logic: Solid Dark Blue if Scrolled OR NOT Homepage
    const headerClasses = (isScrolled || !isHomePage)
        ? 'bg-[#0f172a] shadow-lg py-4' // User requested #0f172a
        : 'bg-transparent py-6';

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out border-b border-white/10 ${headerClasses}`}>
            <nav className="px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo - Gold/Bronze style */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-[#101A2C] font-bold text-xl">G</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-light text-xs tracking-[0.3em]">GRADE A</span>
                            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent font-bold text-lg tracking-wide">REALTY</span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {[
                            { path: '/', label: 'HOME' },
                            { path: '/buy', label: 'BUY' },
                            { path: '/rent', label: 'RENT' },
                            { path: '/sell', label: 'SELL' },
                            // Only show Dashboard if logged in? Or for everyone? Assuming protected route elsewhere.
                            ...(isAuthenticated ? [{ path: '/dashboard', label: 'DASHBOARD' }] : []),
                        ].map(({ path, label }) => {
                            const active = isActive(path);
                            return (
                                <Link
                                    key={path}
                                    to={path}
                                    className={`relative font-medium transition-colors group ${active ? 'text-white hover:text-amber-400' : 'text-white/80 hover:text-white'
                                        }`}
                                >
                                    {label}
                                    {active && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400"></span>}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated && user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-white">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-500 font-bold">
                                        {user.firstName?.[0] || user.email[0].toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium">{user.firstName || 'User'}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-white/70 hover:text-white transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/register" className="text-white/80 hover:text-white font-medium transition-colors">
                                    Register
                                </Link>
                                <Link to="/login" className="border border-white/30 hover:border-amber-400 hover:text-amber-400 text-white px-6 py-2 rounded-lg font-medium transition-all">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a1628] border-b border-white/10 shadow-xl animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col py-4 px-6 gap-4">
                        {[
                            { path: '/', label: 'HOME' },
                            { path: '/buy', label: 'BUY' },
                            { path: '/rent', label: 'RENT' },
                            { path: '/sell', label: 'SELL' },
                            ...(isAuthenticated ? [{ path: '/dashboard', label: 'DASHBOARD' }] : []),
                        ].map(({ path, label }) => (
                            <Link
                                key={path}
                                to={path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-sm font-medium transition-colors ${isActive(path) ? 'text-amber-400' : 'text-white/80 hover:text-white'
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}

                        <div className="h-px bg-white/10 my-2" />

                        {isAuthenticated && user ? (
                            <>
                                <div className="flex items-center gap-3 py-2 text-white">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-500 font-bold">
                                        {user.firstName?.[0] || user.email[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                                        <div className="text-xs text-white/50">{user.email}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-left text-white/80 hover:text-white text-sm font-medium flex items-center gap-2"
                                >
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-white/80 hover:text-white text-sm font-medium"
                                >
                                    Register
                                </Link>
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-center border border-white/30 text-white py-2 rounded-lg text-sm font-medium hover:border-amber-400 hover:text-amber-400 transition-all"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
