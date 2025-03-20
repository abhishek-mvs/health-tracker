import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

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
      <body className={`${inter.className} bg-gradient-to-br from-black to-green-900 min-h-screen text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
