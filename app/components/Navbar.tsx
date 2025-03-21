'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { ChartSplineIcon } from '@/components/ui/chart-spline';
import { useAuth } from '@/app/components/AuthProvider'; 

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { isLoggedIn, isLoading, userEmail } = useAuth();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white/90 shadow-lg rounded-xl p-4 mb-6 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={isLoggedIn ? "/dashboard/groups" : "/"} className="text-xl font-bold text-purple-900 flex items-center gap-2 transition-all hover:text-purple-800">
          <span className="inline-flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
            <ChartSplineIcon className="w-14 h-14" />
          </span>
          <span className="relative top-0.5">Health Tracker</span>
        </Link>

        <div className="flex items-center space-x-6">
          {isLoading ? (
            // Show skeleton loading state
            <div className="flex items-center space-x-6">
              <div className="w-16 h-4 bg-purple-100 rounded-md animate-pulse"></div>
              <div className="w-16 h-4 bg-purple-100 rounded-md animate-pulse"></div>
            </div>
          ) : isLoggedIn ? (
            <>
              <Link
                href="/dashboard/groups"
                className={`${pathname.includes('/dashboard/groups') ? 'text-rose-500 font-bold' : 'text-purple-800 hover:text-rose-400'} transition-colors`}
              >
                Groups
              </Link>
              <Link
                href="/dashboard/profile"
                className={`${pathname.includes('/dashboard/profile') ? 'text-rose-500 font-bold' : 'text-purple-800 hover:text-rose-400'} transition-colors`}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-1.5 rounded-lg shadow-md transition-all hover:shadow-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-purple-800 hover:text-rose-500 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg shadow-md transition-all hover:shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 