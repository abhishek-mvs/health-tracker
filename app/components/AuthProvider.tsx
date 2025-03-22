'use client';

import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SupabaseProvider } from '@/contexts/SupabaseContext';

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  userEmail: string | null;
  refreshAuthState: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  userEmail: null,
  refreshAuthState: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const refreshAuthState = async () => {
    try {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
      setUserEmail(data.session?.user?.email || null);
    } catch (error) {
      console.error('Auth refresh error:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAuthState();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setIsLoggedIn(!!session);
        setUserEmail(session?.user?.email || null);
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [pathname]);

  return (
    <SupabaseProvider>
      <AuthContext.Provider value={{ isLoggedIn, isLoading, userEmail, refreshAuthState }}>
        {children}
      </AuthContext.Provider>
    </SupabaseProvider>
  );
} 