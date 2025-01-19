import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser, logout } from '../../store/slices/authSlice';
import { setSidebarState } from '../../store/slices/uiSlice';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  const NavLinks = ({ className = "", onClick }) => (
    <div className={`flex gap-8 ${className}`}>
      <Link to="/dashboard" className="text-base font-medium transition-colors hover:text-primary hover:scale-105" onClick={onClick}>
        Dashboard
      </Link>
      <Link to="/events" className="text-base font-medium transition-colors hover:text-primary hover:scale-105" onClick={onClick}>
        Events
      </Link>
      <Link to="/blog" className="text-base font-medium transition-colors hover:text-primary hover:scale-105" onClick={onClick}>
        Blog
      </Link>
    </div>
  );

  const AuthButtons = ({ className = "", onClick }) => (
    <div className={`flex items-center gap-4 ${className}`}>
      {isAuthenticated ? (
        <>
          <span className="text-base font-medium">{currentUser?.name}</span>
          <Button size="lg" variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </>
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
                  <NavLinks onClick={() => dispatch(setSidebarState({ isOpen: false }))} />
                  <AuthButtons onClick={() => dispatch(setSidebarState({ isOpen: false }))} />
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