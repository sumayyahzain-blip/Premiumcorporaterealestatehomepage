/**
 * GRADE A REALTY - Forgot Password Page
 * Password reset request component
 * Phase 1 Implementation
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuthHook } from '../../../hooks/useAuth';

export default function ForgotPasswordPage() {
    const { forgotPassword, isLoading, error, clearError } = useAuthHook();

    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const success = await forgotPassword({ email });

        if (success) {
            setSubmitted(true);
        }
    };

    // Success View
    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-3">Check Your Email</h1>
                        <p className="text-gray-400 mb-6">
                            We've sent password reset instructions to{' '}
                            <span className="text-white font-medium">{email}</span>
                        </p>

                        <div className="space-y-4">
                            <Link
                                to="/login"
                                className="block w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all text-center"
                            >
                                Back to Login
                            </Link>

                            <button
                                onClick={() => {
                                    setSubmitted(false);
                                    setEmail('');
                                }}
                                className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
                            >
                                Didn't receive the email? Try again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Form View
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
            <div className="w-full max-w-md">
                {/* Back Link */}
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                </Link>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Forgot Password?</h1>
                        <p className="text-gray-400 mt-2">
                            No worries, we'll send you reset instructions.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) clearError();
                                    }}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error.message}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
