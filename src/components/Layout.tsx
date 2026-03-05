import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AIChatbot from './AIChatbot';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin: boolean;
}

export default function Layout({ children, isAdmin }: LayoutProps) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {!isAdminPath && <Navbar isAdmin={isAdmin} />}
      <main className={`flex-grow ${isAdminPath ? '' : 'pt-16'}`}>
        {children}
      </main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <AIChatbot />}
    </div>
  );
}
