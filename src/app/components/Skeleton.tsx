/**
 * GRADE A REALTY - Skeleton Components
 * Loading skeleton placeholders for various UI elements
 * Phase 1 Implementation
 */

import React from 'react';

// =============================================================================
// BASE SKELETON
// =============================================================================

interface SkeletonProps {
    className?: string;
    animate?: boolean;
    style?: React.CSSProperties;
}

export function Skeleton({ className = '', animate = true, style }: SkeletonProps) {
    return (
        <div
            className={`bg-white/10 rounded ${animate ? 'animate-pulse' : ''} ${className}`}
            style={style}
        />
    );
}

// =============================================================================
// PROPERTY CARD SKELETON
// =============================================================================

interface PropertyCardSkeletonProps {
    variant?: 'default' | 'compact' | 'horizontal';
}

export function PropertyCardSkeleton({ variant = 'default' }: PropertyCardSkeletonProps) {
    if (variant === 'compact') {
        return (
            <div className="flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded-xl">
                <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            </div>
        );
    }

    if (variant === 'horizontal') {
        return (
            <div className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                <Skeleton className="w-48 h-32 rounded-lg flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-6 w-24" />
                    </div>
                </div>
            </div>
        );
    }

    // Default card skeleton
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {/* Image skeleton */}
            <Skeleton className="aspect-[4/3] rounded-none" />

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-4 pt-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// PROPERTY GRID SKELETON
// =============================================================================

interface PropertyGridSkeletonProps {
    count?: number;
    columns?: number;
}

export function PropertyGridSkeleton({ count = 6, columns = 3 }: PropertyGridSkeletonProps) {
    const gridClass = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

    return (
        <div className={`grid ${gridClass} gap-6`}>
            {Array.from({ length: count }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
            ))}
        </div>
    );
}

// =============================================================================
// DASHBOARD STATS SKELETON
// =============================================================================

export function DashboardStatsSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                </div>
            ))}
        </div>
    );
}

// =============================================================================
// TABLE SKELETON
// =============================================================================

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex gap-4 p-4 border-b border-white/10 bg-white/5">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>

            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div
                    key={rowIndex}
                    className="flex gap-4 p-4 border-b border-white/5 last:border-0"
                >
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton
                            key={colIndex}
                            className="h-4 flex-1"
                            style={{ width: `${60 + Math.random() * 40}%` }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

// =============================================================================
// FORM SKELETON
// =============================================================================

export function FormSkeleton() {
    return (
        <div className="space-y-6">
            {/* Form group */}
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>
            ))}

            {/* Button */}
            <Skeleton className="h-12 w-full rounded-xl mt-8" />
        </div>
    );
}

// =============================================================================
// PAGE SKELETON
// =============================================================================

export function PageSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32 rounded-xl" />
                </div>

                {/* Stats */}
                <DashboardStatsSkeleton />

                {/* Content */}
                <div className="space-y-4">
                    <Skeleton className="h-6 w-40" />
                    <PropertyGridSkeleton count={6} />
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// TEXT SKELETON
// =============================================================================

interface TextSkeletonProps {
    lines?: number;
    className?: string;
}

export function TextSkeleton({ lines = 3, className = '' }: TextSkeletonProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className="h-4"
                    style={{ width: i === lines - 1 ? '60%' : '100%' }}
                />
            ))}
        </div>
    );
}

// =============================================================================
// AVATAR SKELETON
// =============================================================================

interface AvatarSkeletonProps {
    size?: 'sm' | 'md' | 'lg';
}

export function AvatarSkeleton({ size = 'md' }: AvatarSkeletonProps) {
    const sizeClass = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    }[size];

    return <Skeleton className={`${sizeClass} rounded-full`} />;
}

// =============================================================================
// NOTIFICATION SKELETON
// =============================================================================

export function NotificationSkeleton() {
    return (
        <div className="flex gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/4" />
            </div>
        </div>
    );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
    Skeleton,
    PropertyCardSkeleton,
    PropertyGridSkeleton,
    DashboardStatsSkeleton,
    TableSkeleton,
    FormSkeleton,
    PageSkeleton,
    TextSkeleton,
    AvatarSkeleton,
    NotificationSkeleton,
};
