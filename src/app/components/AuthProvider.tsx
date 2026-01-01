/**
 * GRADE A REALTY - Auth Provider Component
 * Initializes authentication state on app load
 * Phase 1 Implementation
 */

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store';

interface AuthProviderProps {
    children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false);
    const { accessToken, refreshToken, setLoading } = useAuthStore();

    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);

            try {
                // Check for existing tokens
                if (accessToken || refreshToken) {
                    // In a real app, we would validate the token and fetch user data
                    // For now, we just mark as initialized
                    console.log('Auth: Found existing tokens');
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
                setIsInitialized(true);
            }
        };

        initializeAuth();
    }, []);

    // Show loading screen while initializing
    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                            <span className="text-2xl font-black text-white">G</span>
                        </div>
                        <span className="text-2xl font-bold text-white">Grade A Realty</span>
                    </div>
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                    <p className="text-gray-400 mt-4 text-sm">Initializing...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
