import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { disconnect } from '../../store/slices/stravaSlice';
import { clientStorage } from '@/utils/storage';
import { useToast } from '../ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Separator
} from "../ui/separator";

export default function DashboardNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConnected } = useSelector((state) => state.strava);
  const { user } = useUser();

  const handleStravaDisconnect = async () => {
    if (!user) {
      console.error('No user found');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to disconnect. Please try signing out and back in.",
      });
      return;
    }

    try {
      // Remove tokens from Supabase
      const { error } = await supabase
        .from('strava_tokens')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error removing Strava tokens:', error);
        throw new Error('Failed to remove Strava tokens');
      }

      // Clear local storage and Redux state
      clientStorage.clearStravaData();
      dispatch(disconnect());
      
      toast({
        title: "Disconnected from Strava",
        description: "Your Strava connection has been removed.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error disconnecting from Strava:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to disconnect from Strava. Please try again.",
      });
    }
  };

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
    <TooltipProvider>
      <nav className="border-b bg-background">
        <div className="flex h-16 items-center px-6 max-w-7xl mx-auto">

          <div className="ml-auto flex items-center space-x-4">
            {/* Strava Disconnect Button - Only show if connected */}
            {isConnected && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    onClick={handleStravaDisconnect}
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  >
                    Disconnect Strava
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove Strava connection</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Sign Out Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="gap-2 hover:bg-muted"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sign out of your account</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
} 