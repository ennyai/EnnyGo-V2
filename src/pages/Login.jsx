import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setCredentials, 
  setLoading, 
  setError,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError
} from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    
    try {
      // Simulating API call - replace with actual API call later
      const mockResponse = {
        user: {
          id: 1,
          name: 'John Doe',
          email: e.target.email.value,
        },
        token: 'mock-jwt-token'
      };

      dispatch(setCredentials(mockResponse));
      dispatch(showToast({ 
        message: 'Successfully logged in!', 
        type: 'success' 
      }));
      navigate('/dashboard');
    } catch (err) {
      dispatch(setError('Invalid email or password'));
      dispatch(showToast({ 
        message: 'Login failed. Please try again.', 
        type: 'error' 
      }));
    }
  };

  const handleSocialLogin = (provider) => {
    // Implement social login logic here
    console.log(`${provider} login clicked`);
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to continue your fitness journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          
          <div className="grid gap-4">
            <Button 
              variant="outline" 
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
                alt="Google" 
                className="mr-2 h-4 w-4"
              />
              Continue with Google
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleSocialLogin('strava')}
              disabled={isLoading}
              className="w-full"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Strava_Logo.svg" 
                alt="Strava"
                className="mr-2 h-4 w-4"
              />
              Continue with Strava
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" name="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <Link 
                to="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login; 