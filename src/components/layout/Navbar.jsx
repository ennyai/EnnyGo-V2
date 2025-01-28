import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { supabase } from '@/lib/supabase';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

const Navbar = ({ isAuthenticated }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const NavLinks = ({ className = "", onClick }) => (
    <div className={`flex gap-8 ${className}`}>
      {/* <Link to="/events" className="text-base font-medium transition-colors hover:text-primary hover:scale-105" onClick={onClick}>
        Events
      </Link>
      <Link to="/blog" className="text-base font-medium transition-colors hover:text-primary hover:scale-105" onClick={onClick}>
        Blog
      </Link> */}
      {isAuthenticated && (
        <Link to="/dashboard" className="text-base font-medium transition-colors hover:text-primary hover:scale-105" onClick={onClick}>
          Dashboard
        </Link>
      )}
    </div>
  );

  const AuthButtons = ({ className = "", onClick }) => (
    <div className={`flex items-center gap-4 ${className}`}>
      {isAuthenticated ? (
        <Button size="lg" variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        <>
          <Link to="/login" onClick={onClick}>
            <Button size="lg" variant="ghost">Login</Button>
          </Link>
          <Link to="/signup" onClick={onClick}>
            <Button size="lg">Sign Up</Button>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-20 items-center">
        <div className="flex-1 hidden md:flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight hover:text-primary transition-colors">EnnyGo</span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center">
          <NavLinks />
        </div>

        <div className="flex flex-1 items-center justify-between md:justify-end">
          <Link to="/" className="md:hidden">
            <span className="text-xl font-bold tracking-tight">EnnyGo</span>
          </Link>
          <div className="flex items-center">
            <div className="hidden md:flex">
              <AuthButtons />
            </div>
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="lg" className="ml-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="text-xl">EnnyGo</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-4">
                  <NavLinks onClick={() => {}} />
                  <AuthButtons onClick={() => {}} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 