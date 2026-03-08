import type { Metadata } from 'next';
import { Inter, Playfair_Display, Geist, Montserrat } from 'next/font/google';
import { Suspense } from 'react';
import { AuthProvider } from '@/providers/AuthProvider';
import './globals.css';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata: Metadata = {
  title: 'TaxCopilot AI',
  description: 'Automated Tax Strategy & Legal Drafting',
  icons: {
    icon: '/image.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(playfair.variable, "font-sans", geist.variable, montserrat.variable)}>
      <body className="bg-background-light text-text-main font-sans antialiased">
        <Suspense fallback={null}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
