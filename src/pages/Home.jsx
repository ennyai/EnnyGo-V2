import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowRight, Activity, Users, Trophy } from "lucide-react";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Welcome to EnnyGo
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Transform your athletic journey with creative activity naming and virtual events
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/events">
            <Button size="lg" variant="outline">
              Explore Events
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="relative overflow-hidden group">
          <CardContent className="p-6">
            <div className="mb-4 bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Creative Activity Names</h2>
            <p className="text-muted-foreground mb-4">
              Generate unique and inspiring names for your Strava activities that reflect your achievements
            </p>
            <Button variant="link" className="p-0 gap-2 group-hover:gap-4 transition-all">
              Learn More <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group">
          <CardContent className="p-6">
            <div className="mb-4 bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Virtual Events</h2>
            <p className="text-muted-foreground mb-4">
              Join exciting virtual ultra-endurance events and challenge yourself with like-minded athletes
            </p>
            <Button variant="link" className="p-0 gap-2 group-hover:gap-4 transition-all">
              View Events <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group">
          <CardContent className="p-6">
            <div className="mb-4 bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Community</h2>
            <p className="text-muted-foreground mb-4">
              Connect with fellow athletes, share your journey, and inspire each other to reach new heights
            </p>
            <Button variant="link" className="p-0 gap-2 group-hover:gap-4 transition-all">
              Join Community <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <Card className="bg-primary text-primary-foreground p-8">
          <CardContent className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-primary-foreground/90 mb-6 max-w-xl mx-auto">
              Join EnnyGo today and transform your athletic experience with creative activity naming and exciting virtual events.
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Home; 