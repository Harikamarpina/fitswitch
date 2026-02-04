import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-lime-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-5xl w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-500 text-xs font-bold tracking-wider uppercase">
                The Future of Fitness
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none">
                Fit<span className="text-lime-500">Switch</span>
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl max-w-lg leading-relaxed">
                One membership, unlimited possibilities. Access premium gyms, switch locations, and track your progress in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-lime-500 hover:bg-lime-400 text-black font-bold px-8 py-4 rounded-2xl text-center transition-all shadow-lg shadow-lime-500/20 active:scale-95"
              >
                Start Your Journey
              </Link>
              <Link
                to="/login"
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-8 py-4 rounded-2xl text-center transition-all active:scale-95"
              >
                Sign In
              </Link>
            </div>

            <div className="pt-4 flex items-center gap-3 text-sm text-zinc-500">
              <span className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800" />
                ))}
              </span>
              <p>Trusted by 10,000+ fitness enthusiasts</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-1 gap-4">
            <Feature 
              title="Global Access" 
              desc="Your digital fitness card works across our entire partner network instantly." 
              icon="💳"
            />
            <Feature 
              title="Seamless Switching" 
              desc="Move between memberships with zero friction and preserved progress." 
              icon="🔄"
            />
            <Feature 
              title="Smart Tracking" 
              desc="Detailed insights into your gym visits and facility usage patterns." 
              icon="📊"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc, icon }) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm group hover:border-lime-500/30 transition-colors">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
