'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from 'react';
import { ChartSplineIcon } from '@/components/ui/chart-spline';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        setIsLoggedIn(!!data.session);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const NavLinks = () => (
    <>
      {isLoggedIn ? (
        <>
          <Link
            href="/dashboard/groups"
            className={`${pathname.includes('/dashboard/groups') ? 'text-rose-500 font-bold' : 'text-purple-800 hover:text-rose-400'} transition-colors`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Groups
          </Link>
          <Link
            href="/dashboard/profile"
            className={`${pathname.includes('/dashboard/profile') ? 'text-rose-500 font-bold' : 'text-purple-800 hover:text-rose-400'} transition-colors`}
            onClick={() => setIsMobileMenuOpen(false)}
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
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg shadow-md transition-all hover:shadow-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white/90 shadow-lg rounded-xl mb-6 backdrop-blur-sm w-full p-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Link href={isLoggedIn ? "/dashboard/groups" : "/"} className="text-xl font-bold text-purple-900 flex items-center gap-2 transition-all hover:text-purple-800">
            <ChartSplineIcon className="w-8 h-8" />
            <span className="">Health Tracker</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoading ? (
              <div className="flex items-center space-x-6">
                <div className="w-16 h-4 bg-purple-100 rounded-md animate-pulse"></div>
                <div className="w-16 h-4 bg-purple-100 rounded-md animate-pulse"></div>
              </div>
            ) : (
              <NavLinks />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-purple-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-purple-900" />
            ) : (
              <Menu className="w-6 h-6 text-purple-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-purple-100">
            <div className="flex flex-col space-y-4 pt-4">
              {isLoading ? (
                <div className="flex flex-col space-y-4">
                  <div className="w-24 h-4 bg-purple-100 rounded-md animate-pulse"></div>
                  <div className="w-24 h-4 bg-purple-100 rounded-md animate-pulse"></div>
                </div>
              ) : (
                <NavLinks />
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 