import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import StravaService from '@/services/strava';
import { storage } from '@/utils/storage';
import {
  startConnecting,
  connectionSuccess,
  connectionFailed,
  disconnect,
} from '@/store/slices/stravaSlice';
import { useActivities } from '@/hooks/useActivities';
import { Trophy, MapPin, Timer, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';

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

  // Check for existing Strava connection on mount
  useEffect(() => {
    const checkStravaConnection = async () => {
      if (!user || isConnected) return;

      try {
        // Check for tokens in Supabase
        const { data: tokens, error: tokenError } = await supabase
          .from('strava_tokens')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (tokenError) {
          console.error('Error fetching tokens:', tokenError);
          return;
        }

        if (tokens) {
          // Get athlete data from Strava
          const athleteData = await StravaService.getAthleteData(tokens.access_token);
          
          // Save to localStorage for frontend use
          storage.setStravaTokens({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: tokens.expires_at
          });
          storage.setStravaAthlete(athleteData);
          
          // Update Redux state
          dispatch(connectionSuccess({ 
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: tokens.expires_at,
            athlete: athleteData 
          }));
        }
      } catch (error) {
        console.error('Error restoring Strava connection:', error);
      }
    };

    checkStravaConnection();
  }, [user, isConnected, dispatch]);

  useEffect(() => {
    if (isConnected) {
      fetchActivities(true);
    }
  }, [isConnected]);

  // OAuth callback handling
  useEffect(() => {
    if (loading) {
      console.log('Waiting for user data to load...');
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const error = queryParams.get('error');

    if (error) {
      dispatch(connectionFailed('Failed to connect with Strava'));
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to connect with Strava. Please try again."
      });
      return;
    }

    if (code && !isConnected && processedCode.current !== code) {
      processedCode.current = code;
      handleStravaCallback(code);
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [location, dispatch, toast, isConnected, loading, user]);

  const handleStravaCallback = async (code) => {
    try {
      if (loading || !user) {
        console.log('Waiting for user data...', { loading, user });
        return; // The useEffect will run again when user is available
      }

      dispatch(startConnecting());
      console.log('Starting token exchange with code:', code);
      
      const tokenData = await StravaService.exchangeToken(code);
      console.log('Received token data:', tokenData);
      
      const athleteData = await StravaService.getAthleteData(tokenData.access_token);
      console.log('Received athlete data:', athleteData);
      
      // Save tokens to Supabase
      console.log('Saving tokens to Supabase...', {
        user_id: user.id,
        strava_athlete_id: athleteData.id.toString()
      });

      const { data: tokenResult, error: tokenError } = await supabase
        .from('strava_tokens')
        .upsert({
          user_id: user.id,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: tokenData.expires_at,
          strava_athlete_id: athleteData.id.toString()
        })
        .select();

      if (tokenError) {
        console.error('Error saving tokens:', tokenError);
        throw new Error('Failed to save Strava tokens');
      }

      console.log('Successfully saved tokens:', tokenResult);

      // Save user settings with activity watching enabled by default
      console.log('Saving user settings...');
      const { data: settingsResult, error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          watch_activities: true
        })
        .select();

      if (settingsError) {
        console.error('Error saving settings:', settingsError);
        throw new Error('Failed to save user settings');
      }

      console.log('Successfully saved settings:', settingsResult);
      
      // Save to localStorage for frontend use
      storage.setStravaTokens(tokenData);
      storage.setStravaAthlete(athleteData);
      
      console.log('Dispatching connection success...');
      dispatch(connectionSuccess({ ...tokenData, athlete: athleteData }));
      
      toast({
        title: "Connected to Strava",
        description: `Welcome, ${athleteData.firstname}! Your Strava account is now connected.`,
      });
    } catch (error) {
      console.error('Connection error:', error);
      console.error('Error details:', error.response?.data || error.message);
      dispatch(connectionFailed(error.message));
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to complete Strava connection. Please try again."
      });
    }
  };

  const handleStravaConnect = () => {
    window.location.href = StravaService.getAuthUrl();
  };

  const handleStravaDisconnect = () => {
    storage.clearStravaData();
    dispatch(disconnect());
    toast({
      title: "Disconnected from Strava",
      description: "Your Strava connection has been removed.",
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