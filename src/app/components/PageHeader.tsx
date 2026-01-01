/**
 * GRADE A REALTY - Page Header Component
 * Consistent page title, description, and actions for all pages
 * Phase 1 Implementation
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LucideIcon } from 'lucide-react';

interface PageAction {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
    variant?: 'primary' | 'secondary' | 'outline';
}

interface PageHeaderProps {
    title: string;
    description?: string;
    backLink?: string;
    backLabel?: string;
    actions?: PageAction[];
    badge?: {
        label: string;
        color?: 'green' | 'amber' | 'red' | 'blue' | 'gray';
    };
    className?: string;
}

export function PageHeader({
    title,
    description,
    backLink,
    backLabel = 'Back',
    actions = [],
    badge,
    className = '',
}: PageHeaderProps) {
    const badgeColors = {
        green: 'bg-green-100 text-green-800',
        amber: 'bg-amber-100 text-amber-800',
        red: 'bg-red-100 text-red-800',
        blue: 'bg-blue-100 text-blue-800',
        gray: 'bg-gray-100 text-gray-800',
    };

    return (
        <div className={`mb-8 ${className}`}>
            {/* Back Link */}
            {backLink && (
                <Link
                    to={backLink}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm font-medium transition-colors"
                >
                    <ArrowLeft size={16} />
                    {backLabel}
                </Link>
            )}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Title & Description */}
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
                        {badge && (
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColors[badge.color || 'gray']}`}>
                                {badge.label}
                            </span>
                        )}
                    </div>
                    {description && (
                        <p className="mt-1.5 text-gray-500 max-w-2xl">{description}</p>
                    )}
                </div>

                {/* Actions */}
                {actions.length > 0 && (
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {actions.map((action, index) => {
                            const Icon = action.icon;
                            const baseClasses = "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all";
                            const variantClasses = {
                                primary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm",
                                secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
                                outline: "border border-gray-200 hover:bg-gray-50 text-gray-700",
                            }[action.variant || 'secondary'];

                            const className = `${baseClasses} ${variantClasses}`;

                            if (action.href) {
                                return (
                                    <Link key={index} to={action.href} className={className}>
                                        {Icon && <Icon size={18} />}
                                        {action.label}
                                    </Link>
                                );
                            }

                            return (
                                <button key={index} onClick={action.onClick} className={className}>
                                    {Icon && <Icon size={18} />}
                                    {action.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Empty State Component
 * Shows helpful guidance when no data is available
 */
interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            {Icon && (
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Icon size={32} className="text-gray-400" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-sm mb-6">{description}</p>
            {action && (
                action.href ? (
                    <Link
                        to={action.href}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                        {action.label}
                    </Link>
                ) : (
                    <button
                        onClick={action.onClick}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                        {action.label}
                    </button>
                )
            )}
        </div>
    );
}

/**
 * Loading State Component
 */
interface LoadingStateProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Loading...', size = 'md' }: LoadingStateProps) {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className={`${sizes[size]} border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4`} />
            <p className="text-gray-500 text-sm">{message}</p>
        </div>
    );
}

/**
 * Permission Denied Component
 */
interface PermissionDeniedProps {
    title?: string;
    description?: string;
    requiredRole?: string;
}

export function PermissionDenied({
    title = 'Access Denied',
    description = 'You do not have permission to view this page.',
    requiredRole,
}: PermissionDeniedProps) {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-500 max-w-md mb-2">{description}</p>
            {requiredRole && (
                <p className="text-sm text-gray-400">Required role: <span className="font-medium">{requiredRole}</span></p>
            )}
            <Link
                to="/"
                className="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
            >
                Go to Homepage
            </Link>
        </div>
    );
}

export default PageHeader;
