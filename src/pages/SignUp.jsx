import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setLoading, 
  setError,
  selectIsLoading,
  selectAuthError
} from '../store/slices/authSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SocialButtons } from "@/components/ui/social-buttons";

const SignUp = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    // Handle signup logic here
    console.log('Signup attempt:', formData);
  };

  const handleGoogleSignUp = () => {
    dispatch(setLoading(true));
    // Handle Google sign up
    console.log('Google sign up clicked');
  };

  const handleStravaSignUp = () => {
    dispatch(setLoading(true));
    // Handle Strava sign up
    console.log('Strava sign up clicked');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Join EnnyGo</h1>
          <p className="text-sm text-muted-foreground text-center">Create an account to start your fitness journey</p>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            
            <SocialButtons
              onGoogleClick={handleGoogleSignUp}
              onStravaClick={handleStravaSignUp}
              isLoading={isLoading}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, acceptTerms: checked }))
                  }
                  required
                />
                <Label htmlFor="acceptTerms" className="text-sm">
                  I accept the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </Label>
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp; 