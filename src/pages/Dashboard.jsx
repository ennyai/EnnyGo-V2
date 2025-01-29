import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import StravaService from '@/services/strava';
import { clientStorage } from '@/utils/storage';
import {
  startConnecting,
  connectionSuccess,
  connectionFailed,
  disconnected,
} from '@/store/slices/stravaSlice';
import { useActivities } from '@/hooks/useActivities';
import { Trophy, MapPin, Timer, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import { Switch } from '@/components/ui/switch';
import { toggleWatchActivities, setWatchActivities } from '@/store/slices/settingsSlice';

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function getWeekNumber(date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + firstDayOfMonth.getDay()) / 7);
}

function prepareWeeklyData(activities) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Initialize weekly data
  const weeklyData = Array.from({ length: 5 }, (_, i) => ({
    week: `Week ${i + 1}`,
    distance: 0,
    activities: 0
  }));

  // Filter current month's activities and aggregate by week
  activities.forEach(activity => {
    const activityDate = new Date(activity.start_date);
    if (activityDate.getMonth() === currentMonth && 
        activityDate.getFullYear() === currentYear) {
      const weekNum = getWeekNumber(activityDate) - 1;
      if (weekNum >= 0 && weekNum < 5) {
        weeklyData[weekNum].distance += activity.distance / 1000; // Convert to km
        weeklyData[weekNum].activities += 1;
      }
    }
  });

  // Round distances to 1 decimal place
  weeklyData.forEach(week => {
    week.distance = parseFloat(week.distance.toFixed(1));
  });

  return weeklyData;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-2 shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-sm">{payload[0].value} km</p>
        <p className="text-sm text-muted-foreground">
          {payload[0].payload.activities} activities
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { isConnected, isConnecting, error: stravaError, athlete } = useSelector((state) => state.strava);
  const processedCode = useRef(null);
  const { activities, isLoading, error, hasMore, fetchActivities, loadMore } = useActivities();
  const { user, loading } = useUser();
  const { watchActivities } = useSelector((state) => state.settings);

  // Add state for visible activities count
  const [visibleCount, setVisibleCount] = React.useState(5);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const handleSeeLess = () => {
    setVisibleCount(5);
  };

  // Calculate stats for current and last month
  const calculateStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get last month and year correctly
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    // Initialize stats objects
    const stats = {
      currentMonth: { distance: 0, time: 0, count: 0 },
      lastMonth: { distance: 0, time: 0, count: 0 }
    };

    activities.forEach(activity => {
      const activityDate = new Date(activity.start_date);
      const activityMonth = activityDate.getMonth();
      const activityYear = activityDate.getFullYear();

      const isCurrentMonth = activityMonth === currentMonth && 
                           activityYear === currentYear;
      
      const isLastMonth = activityMonth === lastMonth && 
                         activityYear === lastMonthYear;

      if (isCurrentMonth) {
        stats.currentMonth.distance += activity.distance;
        stats.currentMonth.time += activity.moving_time;
        stats.currentMonth.count += 1;
      } else if (isLastMonth) {
        stats.lastMonth.distance += activity.distance;
        stats.lastMonth.time += activity.moving_time;
        stats.lastMonth.count += 1;
      }
    });

    // Calculate percentage changes
    const calculatePercentChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous * 100).toFixed(1);
    };

    // Add month names for better context
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    return {
      ...stats,
      changes: {
        distance: calculatePercentChange(stats.currentMonth.distance, stats.lastMonth.distance),
        time: calculatePercentChange(stats.currentMonth.time, stats.lastMonth.time),
        count: calculatePercentChange(stats.currentMonth.count, stats.lastMonth.count)
      },
      currentMonthName: monthNames[currentMonth],
      lastMonthName: monthNames[lastMonth]
    };
  };

  const stats = calculateStats();

  // Handle Strava OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const error = params.get('error');
    const success = params.get('success');

    if (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to Strava. Please try again.',
        variant: 'destructive'
      });
      return;
    }

    if (success === 'true') {
      toast({
        title: 'Connected!',
        description: 'Successfully connected to Strava.',
      });
      dispatch(connectionSuccess());
      return;
    }

    if (code && code !== processedCode.current) {
      processedCode.current = code;
      dispatch(startConnecting());
      
      // The backend will handle the token exchange and database updates
      window.location.href = `/api/strava/callback?code=${code}`;
    }
  }, [location.search, dispatch, toast]);

  const handleStravaConnect = () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Please sign in to connect your Strava account.",
        variant: "destructive"
      });
      return;
    }

    try {
      const authUrl = StravaService.getAuthUrl(user.id);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error generating Strava auth URL:', error);
      toast({
        title: "Error",
        description: "Failed to connect to Strava. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStravaDisconnect = async () => {
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
      dispatch(disconnected());
      
      toast({
        title: "Disconnected from Strava",
        description: "Your Strava connection has been removed.",
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

  const handleWatchActivitiesToggle = () => {
    dispatch(toggleWatchActivities());
    toast({
      title: watchActivities ? "Activity Watching Disabled" : "Activity Watching Enabled",
      description: watchActivities 
        ? "We'll no longer automatically update your activity titles." 
        : "We'll now automatically generate creative titles for your new activities!",
    });
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto max-w-7xl p-6">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Connect with Strava</CardTitle>
            <CardDescription>
              Connect your Strava account to see your activities and track your progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button onClick={handleStravaConnect} className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
              </svg>
              Connect with Strava
            </Button>
            <p className="text-sm text-muted-foreground">
              Your activities and achievements will appear here after connecting your account.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        
        {/* Webhook Settings Card - Only show after Strava connection */}
        {isConnected && (
          <Card>
            <CardHeader>
              <CardTitle>Automatic Activity Updates</CardTitle>
              <CardDescription>
                Enable EnnyGo to automatically enhance your new Strava activities with creative titles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">Enable Activity Updates</div>
                  <div className="text-sm text-muted-foreground">
                    When enabled, EnnyGo will automatically generate creative titles for your new activities as soon as they are uploaded to Strava
                  </div>
                </div>
                <Switch
                  checked={watchActivities}
                  onCheckedChange={handleWatchActivitiesToggle}
                />
              </div>
              {!watchActivities ? (
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    🚀 Turn on automatic updates to have EnnyGo instantly generate creative titles for your new Strava activities. 
                    Each time you complete an activity, we'll create an engaging title that captures your achievement!
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-primary/10 p-4">
                  <p className="text-sm">
                    ✨ Automatic updates are enabled! Your next Strava activity will automatically receive a creative title. 
                    You can always adjust this in your settings later.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Strava Connection Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Strava Connection</CardTitle>
            <CardDescription>
              Connect your Strava account to automatically generate creative titles for your activities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={athlete?.profile}
                    alt={athlete?.firstname}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{`${athlete?.firstname} ${athlete?.lastname}`}</p>
                    <p className="text-sm text-muted-foreground">Connected to Strava</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="watch-activities"
                      checked={watchActivities}
                      onCheckedChange={handleWatchActivitiesToggle}
                    />
                    <label htmlFor="watch-activities">
                      Auto-generate titles
                    </label>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleStravaDisconnect}
                    disabled={isConnecting}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleStravaConnect}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect with Strava'}
              </Button>
            )}
          </CardContent>
        </Card>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Distance This Month</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats.currentMonth.distance / 1000).toFixed(1)} km</div>
              <p className="text-xs text-muted-foreground">
                {stats.changes.distance > 0 ? '+' : ''}{stats.changes.distance}% vs {stats.lastMonthName}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time This Month</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(stats.currentMonth.time)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.changes.time > 0 ? '+' : ''}{stats.changes.time}% vs {stats.lastMonthName}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activities This Month</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentMonth.count}</div>
              <p className="text-xs text-muted-foreground">
                {stats.changes.count > 0 ? '+' : ''}{stats.changes.count}% vs {stats.lastMonthName}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Per Activity</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.currentMonth.count > 0 
                  ? (stats.currentMonth.distance / stats.currentMonth.count / 1000).toFixed(1) 
                  : '0'} km
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.currentMonth.count > 0 
                  ? formatDuration(Math.floor(stats.currentMonth.time / stats.currentMonth.count))
                  : '0h 0m'} avg time
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Activities Table */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-4">
                  {activities.slice(0, visibleCount).map((activity) => (
                    <div key={activity.id} className="flex items-center">
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium leading-none">{activity.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(activity.start_date)}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {(activity.distance / 1000).toFixed(1)} km
                      </div>
                      <div className="ml-4 font-medium">
                        {formatDuration(activity.moving_time)}
                      </div>
                      <div className="ml-4 font-medium flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {activity.location_city || 'Unknown'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
              <CardDescription>Distance covered per week this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareWeeklyData(activities)}>
                    <XAxis 
                      dataKey="week" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}km`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="distance" 
                      fill="currentColor" 
                      radius={[4, 4, 0, 0]}
                      className="fill-primary"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Load More/Less Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          {visibleCount > 5 && (
            <Button onClick={handleSeeLess} variant="outline">
              See Less
            </Button>
          )}
          {activities.length > visibleCount && (
            <Button onClick={handleLoadMore} variant="outline">
              Show 5 More Activities
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}
      </div>
    </div>
  );
} 