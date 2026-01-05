import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, TrendingUp, Users, Calendar, ArrowUpRight } from 'lucide-react';

const data = [
    { name: 'Mon', views: 240, inquiries: 12 },
    { name: 'Tue', views: 450, inquiries: 18 },
    { name: 'Wed', views: 680, inquiries: 25 },
    { name: 'Thu', views: 590, inquiries: 20 },
    { name: 'Fri', views: 890, inquiries: 32 },
    { name: 'Sat', views: 1200, inquiries: 45 },
    { name: 'Sun', views: 1100, inquiries: 38 },
];

const feedback = [
    { id: 1, agent: "Sarah J.", date: "Today, 2:30 PM", comment: "Client loved the open kitchen concept but felt the master bath was outdated.", sentiment: "neutral" },
    { id: 2, agent: "Mike T.", date: "Yesterday, 11:00 AM", comment: "Very interested. Asking about school district specifics.", sentiment: "positive" },
    { id: 3, agent: "David L.", date: "Oct 24, 4:00 PM", comment: "Backyard is a huge selling point. Might put in an offer.", sentiment: "positive" },
];

export default function SellerDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
                    <p className="text-gray-500 mt-1">Property: 1234 Luxury Lane, Beverly Hills</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Total Views</div>
                            <div className="text-2xl font-bold text-gray-900">5,150</div>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <Eye size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Inquiries</div>
                            <div className="text-2xl font-bold text-gray-900">190</div>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Showings</div>
                            <div className="text-2xl font-bold text-gray-900">24</div>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Days on Market</div>
                            <div className="text-2xl font-bold text-gray-900">12</div>
                        </div>
                        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                            <Calendar size={24} />
                        </div>
                    </div>
                </div>

                {/* Chart & Feedback Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart Section */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Traffic Overview</h2>
                            <select className="bg-gray-50 border-gray-200 text-sm rounded-lg border p-2 text-gray-700">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                    <CartesianGrid vertical={false} stroke="#f3f4f6" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Feedback */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Recent Feedback</h2>
                            <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
                        </div>

                        <div className="space-y-6">
                            {feedback.map((item) => (
                                <div key={item.id} className="relative pl-6 border-l-2 border-gray-100">
                                    <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full ${item.sentiment === 'positive' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                    <div className="text-sm text-gray-500 mb-1">{item.date} • {item.agent}</div>
                                    <p className="text-gray-800 text-sm leading-relaxed">"{item.comment}"</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <ArrowUpRight size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-blue-900">Insight</h4>
                                    <p className="text-xs text-blue-800 mt-1">
                                        Visits are up <span className="font-bold">24%</span> this week. Consider hosting an open house this weekend to capitalize on interest.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
