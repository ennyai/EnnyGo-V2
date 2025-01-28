import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useDispatch } from 'react-redux';
import { setWatchActivities } from '@/store/slices/settingsSlice';
import { clientStorage } from '@/utils/storage';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Clear any existing settings from local storage
      clientStorage.clearSettings();
      
      // After successful login, ensure settings are initialized
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching settings:', settingsError);
      }

      if (!settings) {
        // Create default settings if they don't exist
        const { error: createError } = await supabase
          .from('user_settings')
          .upsert({
            user_id: data.user.id,
            watch_activities: false
          });

        if (createError) {
          console.error('Error creating settings:', createError);
        }
      }

      // Always ensure Redux state is set to false on login
      dispatch(setWatchActivities(false));
      
      // Explicitly set settings in local storage
      clientStorage.setSettings({ watchActivities: false });

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Log in to your EnnyGo account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 