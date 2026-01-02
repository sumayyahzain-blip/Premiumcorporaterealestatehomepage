/**
 * GRADE A REALTY - Admin Dashboard Page
 * Main dashboard for admin users with platform overview
 * Phase 2 Implementation (Connected to API)
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Building2, Users, DollarSign, TrendingUp, AlertCircle,
    Clock, CheckCircle, XCircle, ArrowUpRight, ArrowRight
} from 'lucide-react';
import { PageHeader, LoadingState } from '../../components/PageHeader';
import { api } from '../../../services/api';
import type { DashboardStatsResponse } from '../../../types/api';

// Mock lists (To be implemented in future phases)
const pendingItems = [
    { id: 1, type: 'Property Approval', title: 'Modern Luxury Villa', user: 'John Owner', time: '2 hours ago', value: '$2,450,000' },
    { id: 2, type: 'KYC Verification', title: 'Sarah Johnson', user: 'New Owner', time: '4 hours ago', value: null },
    { id: 3, type: 'Refund Request', title: 'Application Fee Refund', user: 'Mike Renter', time: '1 day ago', value: '$150' },
    { id: 4, type: 'Property Approval', title: 'Downtown Apartment', user: 'Lisa Investor', time: '1 day ago', value: '$890,000' },
    { id: 5, type: 'Maintenance Approval', title: 'HVAC Replacement', user: '1234 Oak St', time: '2 days ago', value: '$4,500' },
];

const recentActivity = [
    { id: 1, action: 'Property Listed', details: 'Beach House - Naples, FL', user: 'System', time: '10 min ago', status: 'success' },
    { id: 2, action: 'Payment Received', details: 'Rent payment - $3,200', user: 'John Smith', time: '1 hour ago', status: 'success' },
    { id: 3, action: 'Application Submitted', details: '567 Pine Ave, Seattle', user: 'New Applicant', time: '2 hours ago', status: 'pending' },
    { id: 4, action: 'Listing Rejected', details: 'Incomplete documentation', user: 'Admin', time: '3 hours ago', status: 'error' },
    { id: 5, action: 'User Registered', details: 'New owner account', user: 'Sarah Wilson', time: '5 hours ago', status: 'success' },
];

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStatsResponse | null>(null);

    useEffect(() => {
        let ismounted = true;
        const fetchStats = async () => {
            try {
                const response = await api.dashboard.getStats();
                if (ismounted && response.success && response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                if (ismounted) setIsLoading(false);
            }
        };

        fetchStats();
        return () => { ismounted = false; };
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
    };

    return (
        <div>
            <PageHeader
                title="Admin Dashboard"
                description="Platform overview and management. Monitor properties, users, and transactions."
                badge={{ label: 'Admin', color: 'green' }}
            />

            {isLoading || !stats ? (
                <LoadingState message="Loading dashboard data..." />
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {/* Properties */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Building2 size={20} className="text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-600">Total Properties</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.totalProperties}</div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">{stats.activeListings} active</span>
                                <span className="text-xs text-amber-600 font-medium">{stats.pendingApprovals} pending</span>
                            </div>
                        </div>

                        {/* Users */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <Users size={20} className="text-emerald-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-600">Total Users</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">{stats.activeOwners} owners</span>
                                <span className="text-xs text-gray-500">{stats.activeRenters} renters</span>
                            </div>
                        </div>

                        {/* Revenue */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <DollarSign size={20} className="text-amber-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-600">Monthly Revenue</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</div>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowUpRight size={14} className="text-emerald-500" />
                                <span className="text-xs text-emerald-600 font-medium">+{stats.incomeTrend}% from last month</span>
                            </div>
                        </div>

                        {/* Platform Fees */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <TrendingUp size={20} className="text-purple-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-600">Platform Fees</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.platformFees)}</div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">5% of transactions</span>
                            </div>
                        </div>
                    </div>

                    {/* Alerts */}
                    {(stats.pendingApprovals > 0 || stats.pendingPayments > 0 || stats.maintenanceRequests > 0) && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                            <div className="flex items-center gap-3 mb-3">
                                <AlertCircle size={20} className="text-amber-600" />
                                <span className="font-semibold text-amber-900">Items Requiring Attention</span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm">
                                {stats.pendingApprovals > 0 && (
                                    <Link to="/admin/properties" className="flex items-center gap-2 text-amber-800 hover:text-amber-900 font-medium">
                                        {stats.pendingApprovals} property approvals pending
                                        <ArrowRight size={14} />
                                    </Link>
                                )}
                                {stats.pendingPayments > 0 && (
                                    <Link to="/admin/transactions" className="flex items-center gap-2 text-amber-800 hover:text-amber-900 font-medium">
                                        {stats.pendingPayments} payments to process
                                        <ArrowRight size={14} />
                                    </Link>
                                )}
                                {stats.maintenanceRequests > 0 && (
                                    <Link to="/admin/maintenance" className="flex items-center gap-2 text-amber-800 hover:text-amber-900 font-medium">
                                        {stats.maintenanceRequests} maintenance requests
                                        <ArrowRight size={14} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pending Approvals */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="font-semibold text-gray-900">Pending Approvals</h2>
                                <Link to="/admin/properties" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                                    View All
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {pendingItems.map((item) => (
                                    <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                                                        {item.type}
                                                    </span>
                                                    <span className="text-xs text-gray-400">{item.time}</span>
                                                </div>
                                                <p className="font-medium text-gray-900 truncate">{item.title}</p>
                                                <p className="text-sm text-gray-500">{item.user}</p>
                                            </div>
                                            <div className="text-right">
                                                {item.value && <p className="font-semibold text-gray-900">{item.value}</p>}
                                                <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                                                    Review →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="font-semibold text-gray-900">Recent Activity</h2>
                                <Link to="/admin/logs" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                                    View Logs
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {recentActivity.map((item) => (
                                    <div key={item.id} className="p-4 flex items-start gap-3">
                                        <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                      ${item.status === 'success' ? 'bg-emerald-100' : ''}
                      ${item.status === 'pending' ? 'bg-amber-100' : ''}
                      ${item.status === 'error' ? 'bg-red-100' : ''}
                    `}>
                                            {item.status === 'success' && <CheckCircle size={16} className="text-emerald-600" />}
                                            {item.status === 'pending' && <Clock size={16} className="text-amber-600" />}
                                            {item.status === 'error' && <XCircle size={16} className="text-red-600" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900">{item.action}</p>
                                            <p className="text-sm text-gray-500 truncate">{item.details}</p>
                                        </div>
                                        <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
