import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/app/providers';
import Navbar from '@/app/components/Navbar';
import AuthProvider from '@/app/components/AuthProvider';
import { Toaster } from 'react-hot-toast';
import { SupabaseProvider } from '@/contexts/SupabaseContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'WeightLoss Tracker',
  description: 'Track your weight loss journey with friends and groups',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen text-purple-900 overflow-x-hidden bg-gray-100`}>
        <SupabaseProvider>
          <AuthProvider>
            {/* Background Elements */}
            <div className="fixed inset-0 z-0">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-gray-100"></div>

              {/* Grid Pattern */}
              <div className="absolute inset-0 bg-white/50 bg-[linear-gradient(to_right,#9f5f9120_1px,transparent_1px),linear-gradient(to_bottom,#9f5f9120_1px,transparent_1px)] bg-[size:14px_24px]"></div>

              {/* Radial Glow */}
              <div className="absolute top-0 left-0 w-full h-[100vh] bg-[radial-gradient(circle_600px_at_50%_25%,#9f5f9115,transparent)]"></div>
            </div>

            {/* DatePicker Portal */}
            <div id="datepicker-portal" className="z-50"></div>

            {/* Content */}
            <div className="relative z-10 min-h-screen">
              <Providers>
                <div className="container mx-auto px-4 py-4">
                  <Navbar />
                  {children}
                </div>
              </Providers>
            </div>
          </AuthProvider>
          <Toaster position="top-right" />
        </SupabaseProvider>
      </body>
    </html>
  );
}
