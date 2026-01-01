/**
 * GRADE A REALTY - Error Boundary Component
 * Catches JavaScript errors in child components
 * Phase 1 Implementation
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    showDetails?: boolean;
    resetKeys?: unknown[];
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

// =============================================================================
// ERROR BOUNDARY CLASS COMPONENT
// =============================================================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ errorInfo });

        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Call optional error handler
        this.props.onError?.(error, errorInfo);
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps): void {
        // Reset error state if resetKeys change
        if (this.state.hasError && this.props.resetKeys) {
            const hasResetKeyChanged = this.props.resetKeys.some(
                (key, index) => key !== prevProps.resetKeys?.[index]
            );
            if (hasResetKeyChanged) {
                this.reset();
            }
        }
    }

    reset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <ErrorFallback
                    error={this.state.error}
                    errorInfo={this.state.errorInfo}
                    onReset={this.reset}
                    showDetails={this.props.showDetails}
                />
            );
        }

        return this.props.children;
    }
}

// =============================================================================
// ERROR FALLBACK UI
// =============================================================================

interface ErrorFallbackProps {
    error: Error | null;
    errorInfo?: ErrorInfo | null;
    onReset?: () => void;
    showDetails?: boolean;
    variant?: 'page' | 'section' | 'inline';
}

export function ErrorFallback({
    error,
    errorInfo,
    onReset,
    showDetails = false,
    variant = 'page',
}: ErrorFallbackProps) {
    const handleReload = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    // Inline variant (for small components)
    if (variant === 'inline') {
        return (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Something went wrong</span>
                {onReset && (
                    <button
                        onClick={onReset}
                        className="ml-auto text-xs underline hover:no-underline"
                    >
                        Retry
                    </button>
                )}
            </div>
        );
    }

    // Section variant (for cards/panels)
    if (variant === 'section') {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-xl text-center">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Something went wrong</h3>
                <p className="text-gray-400 text-sm mb-4">
                    {error?.message || 'An unexpected error occurred'}
                </p>
                {onReset && (
                    <button
                        onClick={onReset}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                )}
            </div>
        );
    }

    // Page variant (full page error)
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
            <div className="max-w-lg w-full text-center">
                {/* Icon */}
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-red-400" />
                </div>

                {/* Message */}
                <h1 className="text-2xl font-bold text-white mb-3">
                    Oops! Something went wrong
                </h1>
                <p className="text-gray-400 mb-6">
                    We're sorry, but something unexpected happened. Please try refreshing the page
                    or going back to the homepage.
                </p>

                {/* Error details (development only) */}
                {showDetails && error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-left">
                        <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-2">
                            <Bug className="w-4 h-4" />
                            Error Details
                        </div>
                        <p className="text-red-300 text-sm font-mono break-all">
                            {error.message}
                        </p>
                        {errorInfo?.componentStack && (
                            <details className="mt-3">
                                <summary className="text-gray-500 text-xs cursor-pointer hover:text-gray-400">
                                    Component Stack
                                </summary>
                                <pre className="mt-2 text-xs text-gray-500 overflow-auto max-h-40">
                                    {errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={handleReload}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Refresh Page
                    </button>
                    <button
                        onClick={handleGoHome}
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Go to Homepage
                    </button>
                </div>

                {/* Support link */}
                <p className="mt-8 text-gray-500 text-sm">
                    If this problem persists, please{' '}
                    <a href="/support" className="text-amber-400 hover:text-amber-300">
                        contact support
                    </a>
                </p>
            </div>
        </div>
    );
}

// =============================================================================
// HIGHER-ORDER COMPONENT
// =============================================================================

export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
    return function WithErrorBoundary(props: P) {
        return (
            <ErrorBoundary {...errorBoundaryProps}>
                <Component {...props} />
            </ErrorBoundary>
        );
    };
}

// =============================================================================
// HOOK FOR ERROR HANDLING
// =============================================================================

export function useErrorHandler() {
    const [error, setError] = React.useState<Error | null>(null);

    const handleError = React.useCallback((error: Error) => {
        setError(error);
    }, []);

    const resetError = React.useCallback(() => {
        setError(null);
    }, []);

    // Throw error to be caught by nearest error boundary
    if (error) {
        throw error;
    }

    return { handleError, resetError };
}

// =============================================================================
// ASYNC ERROR BOUNDARY
// =============================================================================

interface AsyncBoundaryProps {
    children: ReactNode;
    loading?: ReactNode;
    error?: ReactNode;
}

export function AsyncBoundary({ children, loading, error }: AsyncBoundaryProps) {
    return (
        <ErrorBoundary fallback={error}>
            <React.Suspense fallback={loading || <DefaultLoadingFallback />}>
                {children}
            </React.Suspense>
        </ErrorBoundary>
    );
}

function DefaultLoadingFallback() {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
    );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default ErrorBoundary;
