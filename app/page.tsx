"use client";
import { useState, useEffect } from "react";
import { Table, RefreshCcw, Database, Activity } from "lucide-react";

export default function Home() {
  // const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  type Log = {
    id: number;
    timestamp: string;
    provider: string;
    model: string;
    status: string;
  };
  const [logs, setLogs] = useState<Log[]>([]);
  

  // Function to fetch data from our new API
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/logs");
      const data = await res.json();
      // 3. Cast the data or ensure it matches the type
      setLogs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load logs");
    } finally {
      setLoading(false);
    }
  };
  // Load logs on page open
  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans dark:bg-zinc-950">
      <main className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="text-blue-600" /> Nodum Infrastructure
            </h1>
            <p className="text-slate-500 text-sm">Real-time traces from Neon Database</p>
          </div>
          <button 
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium shadow-sm active:scale-95 disabled:opacity-50"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "Syncing..." : "Refresh Logs"}
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border shadow-sm dark:bg-zinc-900">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Traces</p>
            <p className="text-2xl font-mono mt-1">{logs.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border shadow-sm dark:bg-zinc-900">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Storage</p>
            <p className="text-2xl font-mono mt-1 text-blue-600">Neon Postgre</p>
          </div>
          <div className="bg-white p-4 rounded-xl border shadow-sm dark:bg-zinc-900 border-green-100">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Status</p>
            <p className="text-2xl font-mono mt-1 text-green-600 flex items-center gap-2">
              <Activity size={20} /> Live
            </p>
          </div>
        </div>

        {/* The Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden dark:bg-zinc-900">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b dark:bg-zinc-800">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Prompt</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400">
                    No data found. Send your first AI request to see it appear here!
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors dark:hover:bg-zinc-800">
                    <td className="p-4 font-mono text-sm text-slate-400">#{log.id}</td>
                    <td className="p-4 text-sm font-medium">{log.userId}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-zinc-400">{log.prompt}</td>
                    <td className="p-4 text-sm text-right font-mono text-blue-600">{log.latencyMs}ms</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}