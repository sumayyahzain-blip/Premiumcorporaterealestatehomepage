import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, DollarSign, TrendingUp, Users, Plus, FileText, Settings, AlertCircle, Bell, ArrowUpRight, Search, LogOut } from 'lucide-react';
import { useAuth, useAuthActions } from '../../hooks';
import { showInfoToast, showSuccessToast } from '../components/ToastContainer';

export default function OwnerDashboard() {
    const { user, isAuthenticated } = useAuth();
    const { logout } = useAuthActions();

    const handleLogout = () => {
        logout();
        showInfoToast('Logged Out', 'You have been signed out successfully');
    };

    const handleQuickAction = (action: string) => {
        showInfoToast('Coming Soon', `${action} feature will be available soon!`);
    };

    const navigate = useNavigate();

    const handleViewDetails = (propertyId: number) => {
        navigate(`/property/${propertyId}`);
    };

    const handleManage = (propertyAddress: string) => {
        showInfoToast('Property Management', `Opening management tools for ${propertyAddress}`);
    };

    return (
        <div className="pt-24 pb-12 min-h-screen bg-gray-50">
            <div className="max-w-[1440px] mx-auto px-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
                        <p className="text-gray-500 mt-1">
                            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! Manage your properties and track performance.
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
                {user && (
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 mb-8 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
                                <p className="text-emerald-100">{user.email}</p>
                                <div className="flex gap-2 mt-2">
                                    {user.roles.map(role => (
                                        <span key={role} className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium capitalize">
                                            {role.replace('_', ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                        <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
                        <div className="text-sm text-gray-500">2 Occupied, 1 Vacant</div>
                    </div>
                    {/* Stat 2 */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <DollarSign size={20} />
                            </div>
                            <span className="font-medium text-gray-600">Monthly Income</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">$7,300</div>
                        <div className="text-sm text-emerald-600 flex items-center gap-1 font-medium">
                            <ArrowUpRight size={14} />
                            +5.2% from last month
                        </div>
                    </div>
                    {/* Stat 3 */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <TrendingUp size={20} />
                            </div>
                            <span className="font-medium text-gray-600">Annual Yield</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">5.4%</div>
                        <div className="text-sm text-gray-500">Portfolio average</div>
                    </div>
                    {/* Stat 4 */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <Users size={20} />
                            </div>
                            <span className="font-medium text-gray-600">Occupancy Rate</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">66.7%</div>
                        <div className="text-sm text-gray-500">2 of 3 properties</div>
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
                                {/* Property Item 1 */}
                                <div className="border border-gray-200 rounded-xl p-4 hover:border-emerald-500/50 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900">1234 Oak Street, SF</h3>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mt-1">
                                                Occupied
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">$3,200</div>
                                            <div className="text-xs text-gray-500">per month</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                        <div>
                                            <div className="text-gray-500 mb-1">Tenant</div>
                                            <div className="font-medium text-gray-900">John Smith</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 mb-1">Next Payment</div>
                                            <div className="font-medium text-gray-900">Jan 1, 2025</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleViewDetails(1)}
                                            className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleManage('1234 Oak Street')}
                                            className="flex-1 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700"
                                        >
                                            Manage
                                        </button>
                                    </div>
                                </div>

                                {/* Property Item 2 */}
                                <div className="border border-gray-200 rounded-xl p-4 hover:border-emerald-500/50 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900">567 Pine Ave, Seattle</h3>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mt-1">
                                                Occupied
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">$4,100</div>
                                            <div className="text-xs text-gray-500">per month</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                        <div>
                                            <div className="text-gray-500 mb-1">Tenant</div>
                                            <div className="font-medium text-gray-900">Emma Davis</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 mb-1">Next Payment</div>
                                            <div className="font-medium text-gray-900">Jan 1, 2025</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleViewDetails(2)}
                                            className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleManage('567 Pine Ave')}
                                            className="flex-1 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700"
                                        >
                                            Manage
                                        </button>
                                    </div>
                                </div>

                                {/* Property Item 3 */}
                                <div className="border border-gray-200 rounded-xl p-4 hover:border-emerald-500/50 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900">890 Maple Dr, Austin</h3>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                                                Vacant
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">$2,800</div>
                                            <div className="text-xs text-gray-500">per month</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                        <div>
                                            <div className="text-gray-500 mb-1">Tenant</div>
                                            <div className="font-medium text-gray-900">Vacant</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 mb-1">Next Payment</div>
                                            <div className="font-medium text-gray-900">-</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleViewDetails(3)}
                                            className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleManage('890 Maple Dr')}
                                            className="flex-1 py-2 bg-emerald-600 rounded-lg text-sm font-medium text-white hover:bg-emerald-700"
                                        >
                                            Manage
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                        <DollarSign size={20} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Payment Received</p>
                                        <p className="text-xs text-gray-500 mt-0.5">$3,200 from John Smith - 1234 Oak Street</p>
                                        <p className="text-xs text-gray-400 mt-1">Dec 28, 2024</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                        <Settings size={20} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Maintenance Request</p>
                                        <p className="text-xs text-gray-500 mt-0.5">New request from Emma Davis - HVAC Inspection</p>
                                        <p className="text-xs text-gray-400 mt-1">Dec 27, 2024</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <Users size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Showing Scheduled</p>
                                        <p className="text-xs text-gray-500 mt-0.5">890 Maple Dr - Potential tenant viewing on Dec 30</p>
                                        <p className="text-xs text-gray-400 mt-1">Dec 26, 2024</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                        <DollarSign size={20} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Payment Received</p>
                                        <p className="text-xs text-gray-500 mt-0.5">$4,100 from Emma Davis - 567 Pine Avenue</p>
                                        <p className="text-xs text-gray-400 mt-1">Dec 25, 2024</p>
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
                                <button
                                    onClick={() => handleQuickAction('Generate Report')}
                                    className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                                >
                                    📊 Generate Report
                                </button>
                            </div>
                        </div>

                        {/* Upcoming Tasks */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Upcoming Tasks</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Rent Collection</p>
                                        <p className="text-xs text-gray-500">Due in 2 days</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Property Inspection</p>
                                        <p className="text-xs text-gray-500">Due in 5 days</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Annual Tax Filing</p>
                                        <p className="text-xs text-gray-500">Due in 30 days</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Portfolio Performance */}
                        <div className="bg-emerald-900 rounded-2xl shadow-lg p-6 text-white">
                            <h3 className="font-bold mb-1">Portfolio Performance</h3>
                            <div className="text-emerald-200 text-xs mb-6">Total Value</div>
                            <div className="text-3xl font-bold mb-1">$2,265,000</div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-emerald-200 text-xs">Annual Income</div>
                                    <div className="font-bold">$87,600</div>
                                </div>
                            </div>
                            <div className="border-t border-emerald-800 pt-4">
                                <div className="text-xs text-emerald-200 mb-1">YoY Growth</div>
                                <div className="text-xl font-bold text-emerald-400">+12.3%</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    );
}
