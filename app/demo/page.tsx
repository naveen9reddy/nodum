'use client';

import { useState } from 'react';
import { Send, Sparkles, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSend = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt, userId: 'demo-user' }),
      });
      const data = await res.json();
      setResult(data);
      setPrompt("");
    } catch (e) {
      console.error("Demo failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black mb-2 italic">TRACE PLAYGROUND</h1>
          <p className="text-slate-500">Send a prompt to generate a real-time infrastructure trace.</p>
        </div>

        <div className="relative group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything (e.g., 'How does PostgreSQL work?')..."
            className="w-full h-40 p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-blue-500 transition-all text-lg resize-none"
          />
          <button
            onClick={handleSend}
            disabled={loading || !prompt}
            className="absolute bottom-4 right-4 bg-blue-600 text-white p-4 rounded-2xl shadow-xl hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95"
          >
            {loading ? <Sparkles className="animate-spin" /> : <Send />}
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
              <Terminal size={14} /> Trace Logged
            </div>
            <p className="text-blue-900">{result.response || "Error generated (captured in trace)"}</p>
            <Link href="/dashboard" className="mt-4 inline-block text-sm font-bold text-blue-600 underline">
              View in Dashboard →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}