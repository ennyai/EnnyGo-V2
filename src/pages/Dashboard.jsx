import React from 'react';
import ActivityStats from '@/components/dashboard/ActivityStats';
import RecentActivities from '@/components/dashboard/RecentActivities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Timer, Calendar as CalendarIcon, Trophy, Link as LinkIcon } from 'lucide-react';

// Temporary components until we create their separate files
const StravaConnect = () => (
  <Card className="border-dashed border-2">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <LinkIcon className="h-5 w-5" />
        Connect with Strava
      </CardTitle>
      <CardDescription>
        Connect your Strava account to sync your activities and track your progress
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Button className="bg-[#fc4c02] hover:bg-[#fc4c02]/90 text-white">
        <svg
          viewBox="0 0 24 24"
          className="mr-2 h-5 w-5"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7.01 13.828h4.172" />
        </svg>
        Connect with Strava
      </Button>
      <p className="mt-4 text-sm text-muted-foreground">
        Your activities and achievements will appear here after connecting your account
      </p>
    </CardContent>
  </Card>
);

const ProgressChart = () => (
  <Card className="col-span-4">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <LineChart className="h-5 w-5" />
        Progress Overview
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
        Chart visualization coming soon...
      </div>
    </CardContent>
  </Card>
);

const UpcomingEvents = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5" />
        Upcoming Events
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Timer className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">Virtual Marathon</p>
            <p className="text-sm text-muted-foreground">March 25, 2024</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Timer className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">10K Challenge</p>
            <p className="text-sm text-muted-foreground">April 1, 2024</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AchievementShowcase = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Trophy className="h-5 w-5" />
        Recent Achievements
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-500/10 p-2 rounded-lg">
            <Trophy className="h-4 w-4 text-yellow-500" />
          </div>
          <div>
            <p className="font-medium">Early Bird</p>
            <p className="text-sm text-muted-foreground">Completed 5 morning runs</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-yellow-500/10 p-2 rounded-lg">
            <Trophy className="h-4 w-4 text-yellow-500" />
          </div>
          <div>
            <p className="font-medium">Distance Master</p>
            <p className="text-sm text-muted-foreground">Ran 100km this month</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  // Auth check temporarily removed for development
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        
        <div className="space-y-4">
          <StravaConnect />
          
          <ActivityStats />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <RecentActivities />
            <div className="col-span-4">
              <ProgressChart />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <UpcomingEvents />
            </div>
            <div className="col-span-3">
              <AchievementShowcase />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 