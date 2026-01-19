'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Cpu, Clock, Activity, Zap } from 'lucide-react';

export default function RequestDetail() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<any>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      const res = await fetch(`/api/requests/${params.id}`);
      const data = await res.json();
      setRequest(data);
    };
    fetchRequest();
  }, [params.id]);

  if (!request) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse text-slate-400 font-medium">Loading Trace Details...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-slate-500 mb-8 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Trace #{request.id}</h1>
              <p className="text-slate-500 text-sm">Detailed AI Execution Log</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              request.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {request.status || 'Success'}
            </span>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-2 gap-8 mb-10">
              <DetailBox icon={<Clock size={16}/>} label="Timestamp" value={new Date(request.createdAt).toLocaleString()} />
              <DetailBox icon={<Cpu size={16}/>} label="Model" value={request.model} />
              <DetailBox icon={<Zap size={16}/>} label="Latency" value={`${request.latencyMs}ms`} />
              <DetailBox icon={<Activity size={16}/>} label="Cost" value={`$${parseFloat(request.cost).toFixed(6)}`} />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Prompt Input</h3>
                <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-sm leading-relaxed overflow-x-auto">
                  {request.prompt}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Model Response</h3>
                <div className="bg-blue-50 text-blue-900 p-6 rounded-2xl border border-blue-100 text-sm leading-relaxed">
                  {request.response || "No response content recorded."}
                </div>
              </div>

              {request.status === 'error' && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm italic">
                  <strong>Error Log:</strong> {request.error || "System failed to capture specific error string."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailBox({ label, value, icon }: { label: string; value: any; icon: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-slate-900 font-semibold">{value}</p>
    </div>
  );
}