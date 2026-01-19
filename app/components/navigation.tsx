import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-black tracking-tighter text-slate-900">
            NODUM<span className="text-blue-600">TRACE</span>
          </Link>
          <div className="flex gap-8 items-center">
            <Link href="/demo" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Demo
            </Link>
            <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}