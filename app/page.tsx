import Link from 'next/link';
import { ArrowRight, Zap, BarChart3, Shield, Terminal } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold mb-6">
              <Zap size={14} /> NOW IN PRIVATE BETA
            </div>
            <h1 className="text-7xl font-black tracking-tighter mb-8 text-slate-900 italic">
              AI Infrastructure <br />
              <span className="text-blue-600 not-italic">Visibility.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              The high-performance tracing layer for AI Agents. Monitor latency, track costs, and debug prompts with <b>Effect-powered</b> reliability.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/demo"
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 flex items-center shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                Try Live Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/dashboard"
                className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 border border-slate-200 transition-all"
              >
                Open Dashboard
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32">
            <FeatureCard
              icon={<Terminal className="w-6 h-6 text-blue-600" />}
              title="Effect Runtime"
              description="Built on Effect for resilient error handling and sub-millisecond overhead."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-indigo-600" />}
              title="Serverless Neon DB"
              description="Global tracing storage powered by Neon's serverless PostgreSQL engine."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-emerald-600" />}
              title="Audit Trails"
              description="Immutable logs of every prompt and response for compliance and debugging."
            />
          </div>

          {/* Code Example (Showing your actual stack) */}
          <div className="mt-32 bg-slate-900 rounded-3xl shadow-2xl p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Terminal size={200} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500" />
               <div className="w-3 h-3 rounded-full bg-yellow-500" />
               <div className="w-3 h-3 rounded-full bg-green-500" />
               <span className="ml-2 opacity-50 text-sm font-mono">trace-logic.ts</span>
            </h2>
            <pre className="text-blue-400 font-mono text-sm overflow-x-auto leading-7">
{`// Your Nodum Trace integration
const program = Effect.gen(function* (_) {
  const trace = yield* _(Nodum.startTrace({ model: "gpt-4o" }));
  
  const response = yield* _(AI.generate(prompt));
  
  yield* _(trace.complete({ response }));
});

// Resilient, Scalable, and Fully Observable.`}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="group">
      <div className="mb-6 p-4 bg-slate-50 rounded-2xl w-fit group-hover:bg-blue-50 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}