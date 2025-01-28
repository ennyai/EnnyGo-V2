import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  User
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { supabase } from '@/lib/supabase';
import { clientStorage } from '@/utils/storage';
import { disconnect } from '@/store/slices/stravaSlice';

const NavigationItems = ({ className }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/dashboard'
    },
    {
      icon: User,
      label: 'Profile',
      href: '/profile'
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings'
    }
  ];

  return (
    <nav className={cn("flex-1 space-y-1", className)}>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive(item.href)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-primary'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      clientStorage.clearStravaData();
      dispatch(disconnect());
      navigate('/');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <SheetHeader>
            <SheetTitle>
              <Link to="/" className="flex items-center gap-2">
                <span className="font-bold text-xl">EnnyGo</span>
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col py-4">
            <NavigationItems className="mt-8" />
            <div className="border-t pt-4">
              <button 
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-[240px] flex-col border-r bg-background px-3 py-4">
        <Link to="/" className="flex items-center gap-2 px-4 py-3">
          <span className="font-bold text-xl">EnnyGo</span>
        </Link>
        <NavigationItems className="mt-8" />
        <div className="border-t pt-4">
          <button 
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
} 