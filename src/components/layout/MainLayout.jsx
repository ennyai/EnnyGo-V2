import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout() {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isAuthenticated={!!user} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
} 