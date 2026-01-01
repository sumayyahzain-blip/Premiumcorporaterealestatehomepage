/**
 * GRADE A REALTY - Role-Based Layouts
 * Distinct layouts for Admin, Customer (Owner/Investor), and User sites
 * Phase 1 Implementation
 */

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home, Building2, Users, DollarSign, FileText, Settings,
    Bell, LogOut, ChevronRight, Menu, X, Shield, Wrench,
    LayoutDashboard, PlusCircle, ClipboardList, CreditCard,
    LineChart, UserCog, Key, HelpCircle
} from 'lucide-react';
import { useAuth, useAuthActions } from '../../hooks';
import { showInfoToast, showSuccessToast } from './ToastContainer';

// =============================================================================
// SIDEBAR NAVIGATION ITEM
// =============================================================================

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    href: string;
    active?: boolean;
    badge?: string | number;
    collapsed?: boolean;
}

function NavItem({ icon, label, href, active, badge, collapsed }: NavItemProps) {
    return (
        <Link
            to={href}
            className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all
        ${active
                    ? 'bg-emerald-50 text-emerald-700 border-l-2 border-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
        ${collapsed ? 'justify-center' : ''}
      `}
            title={collapsed ? label : undefined}
        >
            {icon}
            {!collapsed && <span className="flex-1">{label}</span>}
            {!collapsed && badge && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    {badge}
                </span>
            )}
        </Link>
    );
}

// =============================================================================
// ADMIN LAYOUT
// =============================================================================

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { logout } = useAuthActions();
    const [sidebarOpen, setSidebarOpen] = React.useState(true);

    const handleLogout = () => {
        logout();
        showSuccessToast('Logged Out', 'You have been signed out');
        navigate('/login');
    };

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/admin' },
        { icon: <Building2 size={20} />, label: 'Properties', href: '/admin/properties', badge: 3 },
        { icon: <Users size={20} />, label: 'Users', href: '/admin/users' },
        { icon: <ClipboardList size={20} />, label: 'Applications', href: '/admin/applications', badge: 5 },
        { icon: <CreditCard size={20} />, label: 'Transactions', href: '/admin/transactions' },
        { icon: <Wrench size={20} />, label: 'Maintenance', href: '/admin/maintenance' },
        { icon: <LineChart size={20} />, label: 'Reports', href: '/admin/reports' },
        { icon: <Settings size={20} />, label: 'Settings', href: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                    {sidebarOpen && (
                        <Link to="/admin" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                                <Shield size={16} className="text-white" />
                            </div>
                            <span className="font-bold text-gray-900">Admin Panel</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
                    >
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.href}
                            {...item}
                            active={location.pathname === item.href}
                            collapsed={!sidebarOpen}
                        />
                    ))}
                </nav>

                {/* User Section */}
                <div className="p-3 border-t border-gray-100">
                    <div className={`flex items-center gap-3 p-2 ${sidebarOpen ? '' : 'justify-center'}`}>
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-bold text-emerald-700">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                                <p className="text-xs text-gray-500 truncate capitalize">{user?.roles?.[0]?.replace('_', ' ')}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`w-full mt-2 flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
                    >
                        <LogOut size={18} />
                        {sidebarOpen && 'Log Out'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link to="/admin" className="hover:text-gray-700">Admin</Link>
                        {location.pathname !== '/admin' && (
                            <>
                                <ChevronRight size={14} />
                                <span className="text-gray-900 font-medium capitalize">
                                    {location.pathname.split('/').pop()?.replace('-', ' ')}
                                </span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => showInfoToast('Notifications', 'No new notifications')}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 relative"
                        >
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        <button
                            onClick={() => showInfoToast('Help', 'Help center coming soon!')}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                        >
                            <HelpCircle size={20} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

// =============================================================================
// CUSTOMER LAYOUT (Owner/Investor)
// =============================================================================

interface CustomerLayoutProps {
    children: React.ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { logout } = useAuthActions();

    const handleLogout = () => {
        logout();
        showSuccessToast('Logged Out', 'You have been signed out');
        navigate('/login');
    };

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
        { icon: <Building2 size={20} />, label: 'My Properties', href: '/my-properties' },
        { icon: <PlusCircle size={20} />, label: 'Add Property', href: '/properties/new' },
        { icon: <ClipboardList size={20} />, label: 'Applications', href: '/applications' },
        { icon: <CreditCard size={20} />, label: 'Payments', href: '/payments' },
        { icon: <Wrench size={20} />, label: 'Maintenance', href: '/maintenance' },
        { icon: <UserCog size={20} />, label: 'Account', href: '/account' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="h-16 flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                                <Home size={16} className="text-white" />
                            </div>
                            <span className="font-bold text-gray-900">Grade A Realty</span>
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Owner</span>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.slice(0, 5).map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${location.pathname === item.href
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }
                  `}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* User Menu */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => showInfoToast('Notifications', 'No new notifications')}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                            >
                                <Bell size={20} />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-bold text-emerald-700">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                                    title="Log out"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {children}
            </main>
        </div>
    );
}

// =============================================================================
// USER LAYOUT (Renters/Buyers - Public)
// =============================================================================

interface UserLayoutProps {
    children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
    const { user, isAuthenticated } = useAuth();
    const { logout } = useAuthActions();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        showSuccessToast('Logged Out', 'You have been signed out');
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Public Navigation - This would typically be in Header.tsx */}
            {/* Page content renders children which includes existing pages with Header */}
            {children}
        </div>
    );
}

// =============================================================================
// ROLE-BASED ROUTE WRAPPER
// =============================================================================

interface RoleBasedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
    layout?: 'admin' | 'customer' | 'user';
}

export function RoleBasedRoute({ children, allowedRoles, layout = 'user' }: RoleBasedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <Key size={32} className="text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
                <p className="text-gray-500 mb-6">Please log in to access this page.</p>
                <Link
                    to="/login"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    // Check role access
    const hasAccess = user?.roles.some(role => allowedRoles.includes(role));
    if (!hasAccess) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <Shield size={32} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                <p className="text-gray-500 mb-2">You don't have permission to access this page.</p>
                <p className="text-sm text-gray-400 mb-6">Required roles: {allowedRoles.join(', ')}</p>
                <Link
                    to="/"
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                    Go to Homepage
                </Link>
            </div>
        );
    }

    // Wrap in appropriate layout
    switch (layout) {
        case 'admin':
            return <AdminLayout>{children}</AdminLayout>;
        case 'customer':
            return <CustomerLayout>{children}</CustomerLayout>;
        default:
            return <>{children}</>;
    }
}

export default { AdminLayout, CustomerLayout, UserLayout, RoleBasedRoute };
