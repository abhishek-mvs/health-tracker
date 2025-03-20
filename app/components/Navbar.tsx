'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email || null);
      }
    };

    getUserEmail();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="glass p-4 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard/groups" className="text-xl font-bold">
          WeightLoss Tracker
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link 
            href="/dashboard/groups" 
            className={`${pathname.includes('/dashboard/groups') ? 'text-green-400 font-bold' : ''}`}
          >
            Groups
          </Link>
          <Link 
            href="/dashboard/profile" 
            className={`${pathname.includes('/dashboard/profile') ? 'text-green-400 font-bold' : ''}`}
          >
            {userEmail || 'Profile'}
          </Link>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
} 