import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import BuyListing from './pages/BuyListing';
import RentListing from './pages/RentListing';
import PropertyDetail from './pages/PropertyDetail';
import OwnerDashboard from './pages/OwnerDashboard';
import Pricing from './pages/Pricing';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/buy" element={<BuyListing />} />
      <Route path="/rent" element={<RentListing />} />
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/dashboard" element={<OwnerDashboard />} />
      <Route path="/pricing" element={<Pricing />} />
    </Routes>
  );
}