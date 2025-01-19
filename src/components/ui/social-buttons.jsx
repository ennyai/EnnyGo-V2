import React from 'react';
import { Button } from "@/components/ui/button";
import googleIcon from "@/assets/icons/google.svg";
import stravaIcon from "@/assets/icons/strava.svg";

export const SocialButtons = ({ onGoogleClick, onStravaClick, isLoading }) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <Button 
        variant="outline" 
        className="relative w-full h-11 px-4 py-2 text-base border border-input bg-white hover:bg-gray-50 flex items-center justify-center gap-2"
        onClick={onGoogleClick}
        disabled={isLoading}
        type="button"
      >
        <img 
          src={googleIcon}
          alt="Google"
          className="h-5 w-5"
        />
        <span className="text-sm font-medium">Continue with Google</span>
      </Button>
      <Button 
        variant="outline" 
        className="relative w-full h-11 px-4 py-2 text-base border border-input bg-white hover:bg-gray-50 flex items-center justify-center gap-2"
        onClick={onStravaClick}
        disabled={isLoading}
        type="button"
      >
        <img 
          src={stravaIcon}
          alt="Strava"
          className="h-5 w-5"
        />
        <span className="text-sm font-medium">Continue with Strava</span>
      </Button>
    </div>
  );
};

export default SocialButtons; 