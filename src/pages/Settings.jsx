import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWatchActivities } from '../store/slices/settingsSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { useToast } from '../components/ui/use-toast';

export default function Settings() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { watchActivities } = useSelector((state) => state.settings);
  const { isConnected } = useSelector((state) => state.strava);

  const handleWatchActivitiesToggle = () => {
    if (!isConnected && !watchActivities) {
      toast({
        title: "Strava Connection Required",
        description: "Please connect your Strava account to enable activity watching.",
        variant: "destructive",
      });
      return;
    }
    
    dispatch(toggleWatchActivities());
    toast({
      title: watchActivities ? "Activity Watching Disabled" : "Activity Watching Enabled",
      description: watchActivities 
        ? "We'll no longer automatically update your activity titles." 
        : "We'll now automatically generate creative titles for your new activities!",
    });
  };

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Activity Settings</CardTitle>
          <CardDescription>
            Configure how EnnyGo interacts with your Strava activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Watch Activities</Label>
              <div className="text-sm text-muted-foreground">
                Automatically generate creative titles for new Strava activities
              </div>
            </div>
            <Switch
              checked={watchActivities}
              onCheckedChange={handleWatchActivitiesToggle}
              disabled={!isConnected}
            />
          </div>
          
          <Separator />
          
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium">About Activity Watching</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              When enabled, EnnyGo will monitor your Strava account for new activities
              and automatically generate creative titles for them. This requires an active
              Strava connection and the "activity:write" permission.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 