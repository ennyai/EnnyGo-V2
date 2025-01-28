import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowRight, Activity, Users, Sparkles, Zap, Target } from "lucide-react";

const Home = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FC4C02]/10 rounded-full blur-3xl -z-10"></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FC4C02] to-[#FC4C02]/60 bg-clip-text text-transparent">
            Give Your Activities 
            <br />
            The Names They Deserve
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            EnnyGo adds personality to your Strava activities with witty titles that engage your followers and inspire more kudos
          </p>
          <div className="flex justify-center">
            <Link to="/signup">
              <Button size="lg" className="gap-2 group bg-[#FC4C02] hover:bg-[#FC4C02]/90">
                Start Your Journey <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How EnnyGo Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#FC4C02]/10 rounded-full flex items-center justify-center mx-auto">
              <Activity className="h-8 w-8 text-[#FC4C02]" />
            </div>
            <h3 className="text-xl font-semibold">1. Connect Strava</h3>
            <p className="text-muted-foreground">
              Link your Strava account with just one click and let EnnyGo work its magic
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#FC4C02]/10 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="h-8 w-8 text-[#FC4C02]" />
            </div>
            <h3 className="text-xl font-semibold">2. Auto-Magic Titles</h3>
            <p className="text-muted-foreground">
              We automatically generate creative titles for your activities as soon as they sync
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#FC4C02]/10 rounded-full flex items-center justify-center mx-auto">
              <Target className="h-8 w-8 text-[#FC4C02]" />
            </div>
            <h3 className="text-xl font-semibold">3. Share Your Story</h3>
            <p className="text-muted-foreground">
              Show off your achievements with titles that make your activities stand out
            </p>
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Transform Your Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-6 border-2 border-destructive/50">
            <h3 className="text-lg font-semibold mb-4 text-destructive">Before EnnyGo</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li>• Morning Run</li>
              <li>• Evening Ride</li>
              <li>• Afternoon Walk</li>
              <li>• Lunch Run</li>
            </ul>
          </Card>
          <Card className="p-6 border-2 border-[#FC4C02]/50">
            <h3 className="text-lg font-semibold mb-4 text-[#FC4C02]">After EnnyGo</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li>• Dawn Warrior's Victory Lap 🌅</li>
              <li>• Sunset Speed Demon's Adventure 🚴‍♂️</li>
              <li>• Urban Explorer's Discovery Trek 🏙️</li>
              <li>• Midday Momentum Master 🏃‍♂️</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <Card className="bg-[#FC4C02] text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <CardContent className="space-y-4 relative">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Activities?</h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              Join EnnyGo today and give your athletic achievements the epic titles they deserve.
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="gap-2 group bg-white text-[#FC4C02] hover:bg-white/90">
                Get Started Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default Home; 