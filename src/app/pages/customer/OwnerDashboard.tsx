
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, DollarSign, TrendingUp, Users, Plus, Settings, Bell, ArrowUpRight, LogOut, Loader2 } from 'lucide-react';
import { useAuth, useAuthActions } from '../../../hooks';
import { showInfoToast } from '../../components/ToastContainer';
import { api } from '../../../services/api';
import type { Property } from '../../../types';

export default function OwnerDashboard() {
    const { user } = useAuth();
    const { logout } = useAuthActions();
    const navigate = useNavigate();

    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let ismounted = true;

        const fetchProperties = async () => {
            if (!user?.id) return;
            setIsLoading(true);
            try {
                // Fetch all properties for this owner (no pagination for dashboard for now, or large page size)
                const response = await api.properties.list({ ownerId: user.id, pageSize: 100 });
                if (ismounted && response.success && response.data) {
                    setProperties(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch owner properties", error);
            } finally {
                if (ismounted) setIsLoading(false);
            }
        };

        if (user) {
            fetchProperties();
        } else {
            setIsLoading(false);
        }

        return () => { ismounted = false; };
    }, [user]);

    const handleLogout = () => {
        logout();
        showInfoToast('Logged Out', 'You have been signed out successfully');
        navigate('/');
    };

    const handleQuickAction = (action: string) => {
        showInfoToast('Coming Soon', `${action} feature will be available soon!`);
    };

    const handleViewDetails = (propertyId: string) => {
        navigate(`/property/${propertyId}`);
    };

    const handleManage = (propertyTitle: string) => {
        showInfoToast('Property Management', `Opening management tools for ${propertyTitle}`);
    };

    // Calculations
    const totalProperties = properties.length;
    const occupiedCount = properties.filter(p => p.status === 'rented' || p.status === 'sold').length; // approximation
    const occupancyRate = totalProperties > 0 ? (occupiedCount / totalProperties) * 100 : 0;

    // Sum of estimated annual income / 12
    const totalMonthlyIncome = properties.reduce((sum, p) => sum + (p.estimatedAnnualIncome ? p.estimatedAnnualIncome / 12 : 0), 0);

    // Portfolio Value (Sum of salePrice or some estimate)
    const portfolioValue = properties.reduce((sum, p) => sum + (p.salePrice || (p.estimatedAnnualIncome ? p.estimatedAnnualIncome * 12 * 1.5 : 0)), 0); // Rough estimate if salePrice missing

    // Formatters
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-600" size={32} />
        </div>; // Or redirect
    }

    return (
        <div className="pt-24 pb-12 min-h-screen bg-gray-50">
            <div className="max-w-[1440px] mx-auto px-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
                        <p className="text-gray-500 mt-1">
                            Welcome back, {user.firstName}! Manage your properties and track performance.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => showInfoToast('Notifications', 'No new notifications')}
                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                        >
                            <Bell size={20} />
                        </button>
                        <button
                            onClick={() => showInfoToast('Settings', 'Settings page coming soon!')}
                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                        >
                            <Settings size={20} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 bg-white border border-gray-200 rounded-lg text-red-500 hover:bg-red-50"
                            title="Log out"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                {/* User Info Banner */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 mb-8 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
                            <p className="text-emerald-100">{user.email}</p>
                            <div className="flex gap-2 mt-2">
                                {(user.roles as any[]).map((role: any) => ( // Handle role type mismatch if any
                                    <span key={role.role || role} className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium capitalize">
                                        {(role.role || role).toString().replace('_', ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="animate-spin text-emerald-600" size={32} />
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Stat 1 */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                        <Home size={20} />
                                    </div>
                                    <span className="font-medium text-gray-600">Total Properties</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{totalProperties}</div>
                                <div className="text-sm text-gray-500">{occupiedCount} Occupied, {totalProperties - occupiedCount} Vacant</div>
                            </div>
                            {/* Stat 2 */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                        <DollarSign size={20} />
                                    </div>
                                    <span className="font-medium text-gray-600">Est. Monthly Income</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(totalMonthlyIncome)}</div>
                                <div className="text-sm text-emerald-600 flex items-center gap-1 font-medium">
                                    <ArrowUpRight size={14} />
                                    Based on estimates
                                </div>
                            </div>

                            {/* Stat 3 */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                        <TrendingUp size={20} />
                                    </div>
                                    <span className="font-medium text-gray-600">Portfolio Value</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(portfolioValue)}</div>
                                <div className="text-sm text-gray-500">Estimated value</div>
                            </div>

                            {/* Stat 4 */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                        <Users size={20} />
                                    </div>
                                    <span className="font-medium text-gray-600">Occupancy Rate</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{occupancyRate.toFixed(1)}%</div>
                                <div className="text-sm text-gray-500">{occupiedCount} of {totalProperties} properties</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content - Property List */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">My Properties</h2>
                                        <Link
                                            to="/properties/new"
                                            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                                        >
                                            <Plus size={16} />
                                            Add Property
                                        </Link>
                                    </div>

                                    <div className="space-y-4">
                                        {properties.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                You haven't listed any properties yet.
                                            </div>
                                        ) : (
                                            properties.map(property => (
                                                <div key={property.id} className="border border-gray-200 rounded-xl p-4 hover:border-emerald-500/50 transition-colors">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="font-bold text-gray-900">{property.title}</h3>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${property.status === 'rented' ? 'bg-emerald-100 text-emerald-800' :
                                                                    property.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {property.status}
                                                            </span>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-bold text-gray-900">
                                                                {property.listingType === 'rent' ? formatCurrency(property.rentPrice || 0) : formatCurrency(property.salePrice || 0)}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {property.listingType === 'rent' ? 'per month' : 'listing price'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                                        <div>
                                                            <div className="text-gray-500 mb-1">Location</div>
                                                            <div className="font-medium text-gray-900">{property.city}, {property.state}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-gray-500 mb-1">Est. Income</div>
                                                            <div className="font-medium text-gray-900">
                                                                {property.estimatedAnnualIncome ? formatCurrency(property.estimatedAnnualIncome / 12) + '/mo' : '-'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleViewDetails(property.id)}
                                                            className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                                                        >
                                                            View Details
                                                        </button>
                                                        <button
                                                            onClick={() => handleManage(property.title)}
                                                            className="flex-1 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700"
                                                        >
                                                            Manage
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity (Simulated)</h2>
                                    <div className="space-y-6">
                                        {/* Hardcoded for now */}
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                                <DollarSign size={20} className="text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Payment Received</p>
                                                <p className="text-xs text-gray-500 mt-0.5">$3,200 from System Test</p>
                                                <p className="text-xs text-gray-400 mt-1">Today</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar */}
                            <div className="lg:col-span-1 space-y-6">

                                {/* Quick Actions */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <Link
                                            to="/properties/new"
                                            className="block w-full text-left px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors"
                                        >
                                            ➕ Add New Property
                                        </Link>
                                        <button
                                            onClick={() => handleQuickAction('Record Payment')}
                                            className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                                        >
                                            💵 Record Payment
                                        </button>
                                        <button
                                            onClick={() => handleQuickAction('Schedule Maintenance')}
                                            className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                                        >
                                            🔧 Schedule Maintenance
                                        </button>
                                    </div>
                                </div>

                                {/* Upcoming Tasks */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h3 className="font-bold text-gray-900 mb-4">Upcoming Tasks (Simulated)</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Rent Collection</p>
                                                <p className="text-xs text-gray-500">Due in 2 days</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                {/* Portfolio Performance */}
                                <div className="bg-emerald-900 rounded-2xl shadow-lg p-6 text-white">
                                    <h3 className="font-bold mb-1">Portfolio Performance</h3>
                                    <div className="text-emerald-200 text-xs mb-6">Total Value</div>
                                    <div className="text-3xl font-bold mb-1">{formatCurrency(portfolioValue)}</div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <div className="text-emerald-200 text-xs">Annual Income</div>
                                            <div className="font-bold">{formatCurrency(totalMonthlyIncome * 12)}</div>
                                        </div>
                                    </div>
                                    <div className="border-t border-emerald-800 pt-4">
                                        <div className="text-xs text-emerald-200 mb-1">YoY Growth</div>
                                        <div className="text-xl font-bold text-emerald-400">--</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </>
                )}
            </div>
        </div >
    );
}
