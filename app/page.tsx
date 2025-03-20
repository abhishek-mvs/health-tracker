import Link from 'next/link';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is already logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard/groups");
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-white/90 shadow-lg rounded-xl p-8 max-w-2xl backdrop-blur-sm">
        <h1 className="text-4xl font-bold mb-6 text-purple-900">WeightLoss Tracker</h1>
        <p className="text-xl mb-8 text-purple-800">
          Track your weight loss journey with friends and groups. Stay motivated and achieve your goals together.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sign-up"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-all hover:shadow-lg"
          >
            Sign Up
          </Link>
          <Link
            href="/sign-in"
            className="bg-rose-400 hover:bg-rose-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-all hover:shadow-lg"
          >
            Login
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-purple-50 p-6 rounded-lg shadow-md border border-purple-100">
            <div className="text-rose-400 text-2xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2 text-purple-900">Track Progress</h3>
            <p className="text-purple-800">Log your weight and see your progress over time with beautiful charts.</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow-md border border-purple-100">
            <div className="text-rose-400 text-2xl mb-3">👥</div>
            <h3 className="text-lg font-semibold mb-2 text-purple-900">Join Groups</h3>
            <p className="text-purple-800">Create or join groups with friends to stay motivated together.</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow-md border border-purple-100">
            <div className="text-rose-400 text-2xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold mb-2 text-purple-900">Stay Accountable</h3>
            <p className="text-purple-800">Share your journey with others and keep each other accountable.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
