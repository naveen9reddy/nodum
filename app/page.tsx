'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, DollarSign, RefreshCw, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { 
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface Request {
  id: number;
  timestamp: string; // Changed from timestamp to match Drizzle schema
  model: string;
  prompt: string;
  tokensUsed: number;
  cost: string;
  latencyMs: number;
  status: string;
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Single Effect for Lifecycle
  useEffect(() => {
    setMounted(true);
    
    const loadAllData = async () => {
      await Promise.all([fetchRequests(), fetchAnalytics()]);
      setLoading(false);
    };

    loadAllData();
    
    // Auto-refresh every 10 seconds (optimized frequency)
    const interval = setInterval(loadAllData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const stats = {
    total: requests.length,
    successful: requests.filter(r => r.status === 'success' || r.status === null).length,
    failed: requests.filter(r => r.status === 'error').length,
    totalCost: requests.reduce((sum, r) => sum + parseFloat(r.cost || "0"), 0),
  };

  // Prevent Hydration Mismatch for Recharts
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <RefreshCw className="animate-spin text-blue-600" />
          <span className="text-gray-600 font-medium">Syncing with Neon...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Nodum Trace</h1>
            <p className="text-slate-500 mt-1">Infrastructure Observability Dashboard</p>
          </div>
          <button
            onClick={() => { setLoading(true); fetchRequests(); fetchAnalytics().then(() => setLoading(false)); }}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync Now
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Requests" value={stats.total} icon={<Clock className="text-blue-600" />} bgColor="bg-white" />
          <StatsCard title="Successful" value={stats.successful} icon={<CheckCircle className="text-emerald-600" />} bgColor="bg-white" />
          <StatsCard title="Failed" value={stats.failed} icon={<XCircle className="text-rose-600" />} bgColor="bg-white" />
          <StatsCard title="Total Cost" value={`$${stats.totalCost.toFixed(4)}`} icon={<DollarSign className="text-amber-600" />} bgColor="bg-white" />
        </div>

        {/* Analytics Charts */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Traffic Volume</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.timeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: '#94a3b8', fontSize: 12}}
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{r: 4, fill: '#2563eb'}} activeDot={{r: 6}} name="Requests" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Model Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.modelData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="model" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Requests" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Requests Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800">Live Trace Log</h2>
          </div>
          
          {requests.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-400 font-medium">No infrastructure traces detected yet.</p>
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold mt-2 inline-block transition-colors">Generate first trace →</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <th className="px-8 py-4 text-left">Timestamp</th>
                    <th className="px-8 py-4 text-left">Model</th>
                    <th className="px-8 py-4 text-left">Prompt</th>
                    <th className="px-8 py-4 text-right">Latency</th>
                    <th className="px-8 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-8 py-4 text-sm text-slate-500 font-mono">
                        {new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-8 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold border border-slate-200">
                          {req.model}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-sm text-slate-600 max-w-md">
                        <div className="truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:wrap-break-word">
                          {req.prompt}
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right text-sm font-mono font-bold text-blue-600">
                        {req.latencyMs}ms
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex justify-center">
                          {req.status !== 'error' ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-500" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, bgColor }: any) {
  return (
    <div className={`${bgColor} rounded-2xl border border-slate-200 p-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}