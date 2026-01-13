import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import SellerDashboard from './pages/customer/SellerDashboard';
import Homepage from './pages/public/Homepage';
import BuyListing from './pages/public/BuyListing';
import RentListing from './pages/public/RentListing';
import PropertyDetail from './pages/public/PropertyDetail';
import ComparePage from './pages/public/ComparePage';
import UserDashboard from './pages/protected/UserDashboard';
import SellLandingPage from './pages/public/Sell';
import CreatePropertyPage from './pages/customer/CreatePropertyPage';
import MyPropertiesPage from './pages/customer/MyPropertiesPage';
import AddProperty from './pages/protected/AddProperty';

// Auth pages
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/auth';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import { UsersPage } from './pages/admin';

// Auth & Error components
import AuthProvider from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from './components/ToastContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AdminLayout, RoleBasedRoute } from './components/RoleLayouts';

// Comparison Feature
import { ComparisonProvider } from './context/ComparisonContext';
import CompareDock from './components/CompareDock';
import ChatWidget from './components/ChatWidget';

// Layout component to conditionally show header
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // Hide header on auth pages, full-screen forms, and admin pages
  const noHeaderRoutes = ['/login', '/register', '/forgot-password', '/properties/new', '/properties/edit', '/admin'];
  const isNoHeaderPage = noHeaderRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {!isNoHeaderPage && <Header />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Application Error:', error);
        console.error('Component Stack:', errorInfo.componentStack);
      }}
    >
      <AuthProvider>
        {/* Comparison Provider wraps the app to provide global access to comparison state */}
        <ComparisonProvider>
          <Layout>
            <Routes>
              {/* ============================================================ */}
              {/* PUBLIC ROUTES - User Site (Renters/Buyers) */}
              {/* ============================================================ */}
              <Route path="/" element={<Homepage />} />
              <Route path="/buy" element={<BuyListing />} />
              <Route path="/rent" element={<RentListing />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/sell" element={<SellLandingPage />} />
              <Route path="/pricing" element={<PlaceholderPage title="Pricing" description="View our competitive pricing plans for buyers and sellers." />} />
              <Route path="/compare" element={<ComparePage />} />

              {/* ============================================================ */}
              {/* AUTH ROUTES */}
              {/* ============================================================ */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* ============================================================ */}
              {/* CUSTOMER ROUTES - Owner/Investor Site */}
              {/* ============================================================ */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requireAuth>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              {/* New route for seller dashboard */}
              <Route
                path="/seller/dashboard"
                element={
                  <ProtectedRoute>
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-properties"
                element={
                  <ProtectedRoute requireAuth requireAnyRole={['owner', 'investor', 'operations_admin', 'super_admin']}>
                    <MyPropertiesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-property"
                element={
                  <ProtectedRoute requireAuth>
                    <AddProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/properties/new"
                element={
                  <ProtectedRoute requireAuth requireAnyRole={['owner', 'investor', 'operations_admin', 'super_admin']}>
                    <CreatePropertyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/properties/:id/edit"
                element={
                  <ProtectedRoute requireAuth requireAnyRole={['owner', 'investor', 'operations_admin', 'super_admin']}>
                    <CreatePropertyPage />
                  </ProtectedRoute>
                }
              />
              {/* Placeholder routes for customer portal */}
              <Route
                path="/applications"
                element={
                  <ProtectedRoute requireAuth>
                    <PlaceholderPage title="Applications" description="View and manage rental applications for your properties." />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute requireAuth>
                    <PlaceholderPage title="Payments" description="Track rent payments and transaction history." />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/maintenance"
                element={
                  <ProtectedRoute requireAuth>
                    <PlaceholderPage title="Maintenance" description="Manage maintenance requests and vendor assignments." />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute requireAuth>
                    <PlaceholderPage title="Account Settings" description="Manage your profile, notifications, and security settings." />
                  </ProtectedRoute>
                }
              />

              {/* ============================================================ */}
              {/* ADMIN ROUTES - Admin Site */}
              {/* ============================================================ */}
              <Route
                path="/admin"
                element={
                  <RoleBasedRoute allowedRoles={['operations_admin', 'super_admin']} layout="admin">
                    <AdminDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/properties"
                element={
                  <RoleBasedRoute allowedRoles={['operations_admin', 'super_admin']} layout="admin">
                    <PlaceholderPage title="Property Management" description="Review, approve, and manage all platform properties." isAdmin />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <RoleBasedRoute allowedRoles={['operations_admin', 'super_admin']} layout="admin">
                    <UsersPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/applications"
                element={
                  <RoleBasedRoute allowedRoles={['operations_admin', 'super_admin']} layout="admin">
                    <PlaceholderPage title="Application Management" description="Review tenant applications and screening results." isAdmin />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/transactions"
                element={
                  <RoleBasedRoute allowedRoles={['operations_admin', 'super_admin']} layout="admin">
                    <PlaceholderPage title="Transactions" description="Monitor payments, refunds, and financial activity." isAdmin />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/maintenance"
                element={
                  <RoleBasedRoute allowedRoles={['operations_admin', 'super_admin']} layout="admin">
                    <PlaceholderPage title="Maintenance Requests" description="Manage maintenance requests and vendor assignments." isAdmin />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <RoleBasedRoute allowedRoles={['super_admin']} layout="admin">
                    <PlaceholderPage title="Reports & Analytics" description="View platform performance, revenue, and usage analytics." isAdmin />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <RoleBasedRoute allowedRoles={['super_admin']} layout="admin">
                    <PlaceholderPage title="Platform Settings" description="Configure platform fees, approval thresholds, and system settings." isAdmin />
                  </RoleBasedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>

          {/* Global Comparison Dock - Appears when items are selected */}
          <CompareDock />

          {/* Global Toast Notifications */}
          <ToastContainer />

          {/* AI Chat Widget */}
          <ChatWidget />
        </ComparisonProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

// Placeholder page component for routes not yet fully implemented
function PlaceholderPage({ title, description, isAdmin = false }: { title: string; description: string; isAdmin?: boolean }) {
  return (
    <div className={`${isAdmin ? '' : 'pt-24 pb-12'} min-h-screen bg-gray-50`}>
      <div className={`${isAdmin ? '' : 'max-w-7xl mx-auto px-4 sm:px-6'}`}>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1.5 text-gray-500">{description}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            This page is part of Phase 2 development. The structure and navigation are in place,
            and functionality will be added in upcoming iterations.
          </p>
        </div>
      </div>
    </div>
  );
}
