/**
 * GRADE A REALTY - Register Page
 * User registration component
 * Phase 1 Implementation
 */

import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Phone, AlertCircle, Loader2, Check, X } from 'lucide-react';
import { useAuthHook } from '../../../hooks/useAuth';
import { validatePassword } from '../../../types/auth';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError } = useAuthHook();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordValidation = useMemo(
        () => validatePassword(formData.password),
        [formData.password]
    );

    const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (error) clearError();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordValidation.isValid) return;
        if (!passwordsMatch) return;
        if (!formData.acceptTerms) return;

        const success = await register({
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone || undefined,
            acceptTerms: formData.acceptTerms,
        });

        if (success) {
            navigate('/dashboard', { replace: true });
        }
    };

    const getStrengthColor = (strength: string) => {
        switch (strength) {
            case 'strong': return 'bg-green-500';
            case 'good': return 'bg-amber-500';
            case 'fair': return 'bg-orange-500';
            default: return 'bg-red-500';
        }
    };

    const getStrengthWidth = (strength: string) => {
        switch (strength) {
            case 'strong': return 'w-full';
            case 'good': return 'w-3/4';
            case 'fair': return 'w-1/2';
            default: return 'w-1/4';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block">
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                                <span className="text-2xl font-black text-white">G</span>
                            </div>
                            <span className="text-2xl font-bold text-white">Grade A Realty</span>
                        </div>
                    </Link>
                </div>

                {/* Register Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white">Create Account</h1>
                        <p className="text-gray-400 mt-2">Join the premium real estate platform</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    First Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="John"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Phone Field (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Phone Number <span className="text-gray-500">(Optional)</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••••••"
                                    required
                                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength */}
                            {formData.password && (
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-400">Password strength:</span>
                                        <span className={`font-medium capitalize ${passwordValidation.strength === 'strong' ? 'text-green-400' :
                                            passwordValidation.strength === 'good' ? 'text-amber-400' :
                                                passwordValidation.strength === 'fair' ? 'text-orange-400' : 'text-red-400'
                                            }`}>
                                            {passwordValidation.strength}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className={`h-full transition-all duration-300 ${getStrengthColor(passwordValidation.strength)} ${getStrengthWidth(passwordValidation.strength)}`} />
                                    </div>

                                    {/* Requirements */}
                                    <div className="grid grid-cols-2 gap-1 mt-2">
                                        {[
                                            { label: '12+ characters', met: formData.password.length >= 12 },
                                            { label: 'Uppercase', met: /[A-Z]/.test(formData.password) },
                                            { label: 'Lowercase', met: /[a-z]/.test(formData.password) },
                                            { label: 'Number', met: /\d/.test(formData.password) },
                                            { label: 'Special char', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) },
                                        ].map(({ label, met }) => (
                                            <div key={label} className={`flex items-center gap-1 text-xs ${met ? 'text-green-400' : 'text-gray-500'}`}>
                                                {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                {label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••••••"
                                    required
                                    className={`w-full pl-12 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all ${formData.confirmPassword
                                        ? passwordsMatch
                                            ? 'border-green-500/50 focus:ring-green-500/50 focus:border-green-500'
                                            : 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500'
                                        : 'border-white/10 focus:ring-amber-500/50 focus:border-amber-500'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formData.confirmPassword && !passwordsMatch && (
                                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                            )}
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                name="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                required
                                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/50"
                            />
                            <label className="text-sm text-gray-400">
                                I agree to the{' '}
                                <Link to="/terms" className="text-amber-400 hover:text-amber-300">Terms of Service</Link>
                                {' '}and{' '}
                                <Link to="/privacy" className="text-amber-400 hover:text-amber-300">Privacy Policy</Link>
                            </label>
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
                            disabled={isLoading || !passwordValidation.isValid || !passwordsMatch || !formData.acceptTerms}
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p className="text-center text-gray-400 mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
