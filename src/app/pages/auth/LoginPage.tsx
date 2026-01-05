/**
 * GRADE A REALTY - Login Page (Hybrid Auth)
 * Authentication login component with hybrid flow (Airbnb/Zillow style)
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2, ChevronLeft, User as UserIcon } from 'lucide-react';
import { useAuthHook } from '../../../hooks/useAuth';

type AuthView = 'initial' | 'login-password' | 'register-details';

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register, isLoading, error, clearError, requires2FA, verify2FA } = useAuthHook();

    // Flow State
    const [view, setView] = useState<AuthView>('initial');

    // Form Data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        rememberMe: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [twoFACode, setTwoFACode] = useState('');

    // Known users for prototype flow simulation
    const KNOWN_USERS = ['admin@gradea.realty', 'owner@example.com', 'investor@example.com', 'renter@example.com'];

    // Get redirect path
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (error) clearError();
    };

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email) return;

        // Simulate "Check if email exists"
        if (KNOWN_USERS.includes(formData.email)) {
            setView('login-password');
        } else {
            setView('register-details');
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login({
            email: formData.email,
            password: formData.password,
            rememberMe: formData.rememberMe,
        });

        if (success && !requires2FA) {
            navigate(from, { replace: true });
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await register({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            confirmPassword: formData.password,
            acceptTerms: true,
        });

        if (success) {
            navigate(from, { replace: true });
        }
    };

    const handle2FASubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await verify2FA({ code: twoFACode });
        if (success) {
            navigate(from, { replace: true });
        }
    };

    const goBack = () => {
        setView('initial');
        if (error) clearError();
    };


    // -------------------------------------------------------------------------
    // RENDER: 2FA View
    // -------------------------------------------------------------------------
    if (requires2FA) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">Two-Factor Authentication</h1>
                            <p className="text-gray-400 mt-2">Enter the 6-digit code</p>
                        </div>
                        <form onSubmit={handle2FASubmit} className="space-y-6">
                            <input
                                type="text"
                                value={twoFACode}
                                onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl tracking-[0.5em] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all"
                                autoFocus
                            />
                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error.message}</span>
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading || twoFACode.length !== 6}
                                className="w-full py-4 bg-[#D4AF37] hover:bg-[#b5952f] text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Verify Code'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // -------------------------------------------------------------------------
    // RENDER: Main Auth Form
    // -------------------------------------------------------------------------
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 py-12 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none"></div>
            </div>

            <div className="w-full max-w-md z-10">
                {/* Logo Area */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-block group">
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <span className="text-2xl font-black text-white">G</span>
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">Grade A Realty</span>
                        </div>
                    </Link>
                </div>

                {/* THE LUXURY CARD */}
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                    {/* Header Transition */}
                    <div className="text-center mb-8 relative mt-6">
                        {/* Mobile/Global Back Button (only for non-initial views if we want it, but 'Edit' covers it for login) */}
                        {view === 'register-details' && (
                            <button
                                onClick={goBack}
                                className="absolute left-0 top-1 text-gray-400 hover:text-white transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}

                        <h1 className="text-2xl font-bold text-white">
                            {view === 'initial' && 'Welcome'}
                            {view === 'login-password' && 'Welcome Back'}
                            {view === 'register-details' && 'Create Account'}
                        </h1>

                        <div className="text-gray-400 mt-2 text-sm min-h-[20px]">
                            {view === 'initial' && <p>Login or sign up to continue</p>}
                            {view === 'login-password' && (
                                <div className="flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
                                    <span>Logging in as <span className="text-white font-medium">{formData.email}</span></span>
                                    <button
                                        onClick={goBack}
                                        className="text-[#D4AF37] hover:text-[#eac34d] text-xs font-bold uppercase tracking-wide border border-[#D4AF37]/30 hover:border-[#D4AF37] px-2 py-0.5 rounded transition-all"
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                            {view === 'register-details' && <p>Enter your details to get started</p>}
                        </div>
                    </div>

                    <div className="space-y-6">

                        {/* ==================== VIEW: INITIAL ==================== */}
                        {view === 'initial' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* Social Stack */}
                                <button className="w-full py-3.5 border border-white/10 rounded-xl flex items-center justify-center gap-3 font-semibold text-white hover:bg-white/5 transition-all group">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button>

                                <button className="w-full py-3.5 border border-white/10 rounded-xl flex items-center justify-center gap-3 font-semibold text-white hover:bg-white/5 transition-all">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.74.79 3.5 1.84-2.88 1.88-2.4 5.25.9 6.8-.75 1.77-1.66 3.05-3 4.39l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                    </svg>
                                    Continue with Apple
                                </button>

                                {/* Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-4 bg-[#141b2d] text-xs font-bold text-gray-500 uppercase tracking-widest">or</span>
                                    </div>
                                </div>

                                <form onSubmit={handleContinue} className="space-y-4">
                                    <div>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Email Address"
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-[#D4AF37] hover:bg-[#b5952f] text-white font-bold rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all transform hover:scale-[1.02]"
                                    >
                                        Continue
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* ==================== VIEW: LOGIN (PASSWORD) ==================== */}
                        {view === 'login-password' && (
                            <form onSubmit={handleLoginSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            required
                                            autoFocus
                                            className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all font-medium"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-[#D4AF37] hover:bg-[#b5952f] text-white font-bold rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                                </button>

                                <div className="text-center">
                                    <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-[#D4AF37] transition-colors font-medium">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </form>
                        )}

                        {/* ==================== VIEW: REGISTER (DETAILS) ==================== */}
                        {view === 'register-details' && (
                            <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="First Name"
                                            required
                                            className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all font-medium"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Last Name"
                                            required
                                            className="w-full pl-4 pr-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Choose a Password"
                                        required
                                        className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                <div className="text-xs text-gray-500 px-1">
                                    By clicking Continue, you agree to our <Link to="/terms" className="text-white hover:underline">Terms</Link> and <Link to="/privacy" className="text-white hover:underline">Privacy Policy</Link>.
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-[#D4AF37] hover:bg-[#b5952f] text-white font-bold rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Agree & Join'}
                                </button>
                            </form>
                        )}

                        {/* Error Message Display */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm animate-in fade-in slide-in-from-bottom-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error.message}</span>
                            </div>
                        )}

                    </div>
                </div>

                {/* Footer / Demo Hint */}
                <div className="text-center mt-6 text-xs text-gray-500">
                    <p>&copy; 2024 Grade A Realty. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
