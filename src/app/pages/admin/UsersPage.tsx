/**
 * GRADE A REALTY - Admin Users Page
 * User management and listing
 * Phase 2 Implementation (Connected to API Client)
 */

import React, { useState, useEffect } from 'react';
import {
    Search, Filter, MoreVertical, Shield, User as UserIcon, Users,
    CheckCircle, XCircle, Loader2, AlertCircle
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { api } from '../../../services/api/client';
import type { User, UserRole } from '../../../types';

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
    owner: { label: 'Owner', color: 'bg-emerald-100 text-emerald-800' },
    renter: { label: 'Renter', color: 'bg-blue-100 text-blue-800' },
    investor: { label: 'Investor', color: 'bg-purple-100 text-purple-800' },
    operations_admin: { label: 'Admin', color: 'bg-amber-100 text-amber-800' },
    super_admin: { label: 'Super Admin', color: 'bg-red-100 text-red-800' },
    buyer: { label: 'Buyer', color: 'bg-cyan-100 text-cyan-800' },
    finance_admin: { label: 'Finance', color: 'bg-amber-100 text-amber-800' },
    compliance_admin: { label: 'Compliance', color: 'bg-amber-100 text-amber-800' },
    maintenance_admin: { label: 'Maintenance', color: 'bg-amber-100 text-amber-800' }
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');

    // Fetch Data
    useEffect(() => {
        let ismounted = true;

        const fetchUsers = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await api.users.list({
                    query: searchTerm,
                    role: roleFilter !== 'all' ? roleFilter : undefined
                });

                if (ismounted) {
                    if (response.success && response.data) {
                        setUsers(response.data.data);
                    } else {
                        setError(response.error?.message || 'Failed to load users');
                    }
                }
            } catch (err) {
                if (ismounted) {
                    setError('An unexpected error occurred');
                    console.error(err);
                }
            } finally {
                if (ismounted) {
                    setLoading(false);
                }
            }
        };

        // Debounce search slightly
        const timeoutId = setTimeout(fetchUsers, 300);
        return () => {
            ismounted = false;
            clearTimeout(timeoutId);
        };
    }, [searchTerm, roleFilter]);

    // Helper to get primary role label
    const getPrimaryRole = (user: User) => {
        if (!user.roles || (Array.isArray(user.roles) && user.roles.length === 0)) return { label: 'User', color: 'bg-gray-100 text-gray-800' };
        // Just take the first one for now
        // Helper handles string[] or object[] depending on what API returns.
        // API returns strings in current controller implementation
        const role: string = typeof user.roles[0] === 'string' ? user.roles[0] : (user.roles[0] as any).role;
        return ROLE_CONFIG[role] || { label: role, color: 'bg-gray-100 text-gray-800' };
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="User Management"
                description="Manage platform users, roles, and permissions."
                badge={{ label: `${users.length} Users`, color: 'blue' }}
            />

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    <button
                        onClick={() => setRoleFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${roleFilter === 'all'
                            ? 'bg-gray-900 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        All Users
                    </button>
                    <button
                        onClick={() => setRoleFilter('owner')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${roleFilter === 'owner'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Owners
                    </button>
                    <button
                        onClick={() => setRoleFilter('renter')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${roleFilter === 'renter'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Renters
                    </button>
                    <button
                        onClick={() => setRoleFilter('investor')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${roleFilter === 'investor'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Investors
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[300px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Loader2 size={32} className="animate-spin mb-2" />
                        <p>Loading users...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((user) => {
                                        const roleConfig = getPrimaryRole(user);
                                        return (
                                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-600 uppercase">
                                                            {(user.firstName?.[0] || user.email[0])}{(user.lastName?.[0] || '')}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {user.firstName} {user.lastName}
                                                            </div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleConfig.color}`}>
                                                        {roleConfig.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.status === 'active' && (
                                                        <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                                                            <CheckCircle size={14} /> Active
                                                        </span>
                                                    )}
                                                    {user.status === 'suspended' && ( // Mapped 'suspended' to warning color
                                                        <span className="flex items-center gap-1.5 text-sm text-amber-600 font-medium">
                                                            <Shield size={14} /> Suspended
                                                        </span>
                                                    )}
                                                    {user.status === 'deactivated' && (
                                                        <span className="flex items-center gap-1.5 text-sm text-gray-400 font-medium">
                                                            <XCircle size={14} /> Deactivated
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded">
                                                        <MoreVertical size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {users.length === 0 && (
                            <div className="p-12 text-center text-gray-500 bg-gray-50">
                                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                                <p className="mt-1">Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
