import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* Import Context Providers */
import { ComparisonProvider } from './context/ComparisonContext';

/* Import Navigation Component */
import Navbar from './components/Navigation';

/* Public pages */
import Homepage from './pages/public/Homepage';
import BuyListing from './pages/public/BuyListing';
import RentListing from './pages/public/RentListing';
import Sell from './pages/public/Sell';
import ComparePage from './pages/public/ComparePage';
import PropertyDetail from './pages/public/PropertyDetail';

/* Auth pages */
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

/* Admin Dashboard */
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <ComparisonProvider>
        {/* Use the real Navigation component */}
        <Navbar />
        
        <div className="min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/buy" element={<BuyListing />} />
            <Route path="/rent" element={<RentListing />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Dashboard Route */}
            <Route path="/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </ComparisonProvider>
    </BrowserRouter>
  );
}