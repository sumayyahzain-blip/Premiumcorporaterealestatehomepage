import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* Public pages */
import Homepage from './pages/public/Homepage';
import BuyListing from './pages/public/BuyListing';
import RentListing from './pages/public/RentListing';
import Sell from './pages/public/Sell';
import ComparePage from './pages/public/ComparePage';
import PropertyDetail from './pages/public/PropertyDetail';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">

        {/* Header stays global */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-2 rounded-lg font-bold">GA</div>
              <span className="text-xl font-bold text-gray-800">Grade A Realty</span>
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
              <a href="/buy">Buy</a>
              <a href="/rent">Rent</a>
              <a href="/sell">Sell</a>
            </nav>
          </div>
        </header>

        {/* ROUTES — this is what was missing */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/buy" element={<BuyListing />} />
          <Route path="/rent" element={<RentListing />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}
