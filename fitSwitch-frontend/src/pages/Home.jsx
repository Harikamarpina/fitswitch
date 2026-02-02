import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                FitSwitch
              </h1>
              <p className="text-zinc-300 mt-2 text-lg">
                Switch gyms. Keep your progress 💪
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Feature title="Fitness Card" desc="Use services across partner gyms." />
              <Feature title="Membership Switch" desc="Switch membership without losing money." />
              <Feature title="Map View" desc="Find gyms easily and view location." />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link
                to="/register"
                className="bg-lime-500 hover:bg-lime-400 text-black font-semibold px-6 py-3 rounded-xl text-center transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white/10 hover:bg-white/15 border border-white/10 px-6 py-3 rounded-xl text-center transition"
              >
                Login
              </Link>
            </div>

            <p className="text-sm text-zinc-400 mt-2">
              Built for gym members & owners — secure login with Email OTP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-zinc-300 text-sm mt-1">{desc}</p>
    </div>
  );
}
