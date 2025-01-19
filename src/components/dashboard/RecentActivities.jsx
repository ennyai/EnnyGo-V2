import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, MapPin, Timer } from 'lucide-react';

const mockActivities = [
  {
    id: 1,
    type: "Morning Run",
    date: "2024-03-19",
    distance: "5.2 km",
    duration: "28:45",
    location: "Central Park"
  },
  {
    id: 2,
    type: "Evening Ride",
    date: "2024-03-18",
    distance: "15.7 km",
    duration: "45:30",
    location: "Riverside"
  },
  {
    id: 3,
    type: "Trail Run",
    date: "2024-03-17",
    distance: "8.3 km",
    duration: "42:15",
    location: "Forest Hills"
  }
];

const RecentActivities = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{activity.type}</span>
                    <span className="text-xs text-muted-foreground">{activity.date}</span>
                  </div>
                </TableCell>
                <TableCell>{activity.distance}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Timer className="h-4 w-4" />
                    {activity.duration}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {activity.location}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentActivities; 