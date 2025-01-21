import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { disconnect } from '../../store/slices/stravaSlice';
import { storage } from '../../utils/storage';
import { useToast } from '../ui/use-toast';
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
  const { toast } = useToast();
  const { isConnected } = useSelector((state) => state.strava);

  const handleStravaDisconnect = () => {
    storage.clearStravaData();
    dispatch(disconnect());
    toast({
      title: "Disconnected from Strava",
      description: "Your Strava connection has been removed.",
      variant: "default",
    });
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