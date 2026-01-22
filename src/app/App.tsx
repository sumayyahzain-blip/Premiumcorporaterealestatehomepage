import React, { useState } from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* --- HEADER --- */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg font-bold">GA</div>
            <span className="text-xl font-bold text-gray-800">Grade A Realty</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-blue-600">Buy</a>
            <a href="#" className="hover:text-blue-600">Rent</a>
            <a href="#" className="hover:text-blue-600">Sell</a>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main>
        <div className="bg-blue-900 text-white py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Your Premium Corporate Space
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse exclusive listings for offices, commercial lots, and luxury condos.
          </p>
          
          {/* Search Bar Placeholder */}
          <div className="max-w-3xl mx-auto bg-white p-2 rounded-lg shadow-lg flex flex-col md:flex-row gap-2">
            <input 
              type="text" 
              placeholder="Enter an address, neighborhood, or city" 
              className="flex-1 p-3 rounded-md text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>

        {/* --- CONTENT STATUS --- */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-2">✅ System Fully Operational</h2>
            <p className="text-green-700">
              We have successfully bypassed the localhost firewall issue.
              <br/>
              You can now safely start uncommenting your original components one by one.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}