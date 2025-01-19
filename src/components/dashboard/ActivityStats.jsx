import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity, 
  Timer, 
  Route, 
  Trophy 
} from 'lucide-react';

const statCards = [
  {
    title: "Total Distance",
    value: "123.5 km",
    change: "+20.1% from last month",
    icon: Route
  },
  {
    title: "Total Time",
    value: "24h 30m",
    change: "+15% from last month",
    icon: Timer
  },
  {
    title: "Activities",
    value: "12",
    change: "+2 from last month",
    icon: Activity
  },
  {
    title: "Achievements",
    value: "5",
    change: "+3 new this month",
    icon: Trophy
  }
];

const ActivityStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ActivityStats; 