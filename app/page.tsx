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
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="glass p-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-6">WeightLoss Tracker</h1>
        <p className="text-xl mb-8">
          Track your weight loss journey with friends and groups. Stay motivated and achieve your goals together.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/sign-up" 
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-lg font-semibold"
          >
            Sign Up
          </Link>
          <Link 
            href="/sign-in" 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg font-semibold"
          >
            Login
          </Link>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-4">
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p>Log your weight and see your progress over time with beautiful charts.</p>
          </div>
          <div className="glass p-4">
            <h3 className="text-lg font-semibold mb-2">Join Groups</h3>
            <p>Create or join groups with friends to stay motivated together.</p>
          </div>
          <div className="glass p-4">
            <h3 className="text-lg font-semibold mb-2">Stay Accountable</h3>
            <p>Share your journey with others and keep each other accountable.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
