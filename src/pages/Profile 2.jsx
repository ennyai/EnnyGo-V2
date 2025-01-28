import React from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  MapPin,
  User,
  Calendar,
  Activity,
  Weight,
  Ruler,
  Heart,
  Medal,
} from 'lucide-react';
import { Separator } from '../components/ui/separator';

export default function Profile() {
  const { athlete } = useSelector((state) => state.strava);

  if (!athlete) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Not Available</CardTitle>
            <CardDescription>
              Please connect your Strava account to view your profile.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      icon: Activity,
      label: 'Activities',
      value: athlete.total_activities || '0',
    },
    {
      icon: Medal,
      label: 'Following',
      value: athlete.friend_count || '0',
    },
    {
      icon: Heart,
      label: 'Followers',
      value: athlete.follower_count || '0',
    },
  ];

  const details = [
    {
      icon: Weight,
      label: 'Weight',
      value: athlete.weight ? `${athlete.weight} kg` : 'Not set',
    },
    {
      icon: Ruler,
      label: 'Height',
      value: athlete.height ? `${(athlete.height * 100).toFixed(0)} cm` : 'Not set',
    },
    {
      icon: Calendar,
      label: 'Member Since',
      value: new Date(athlete.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-6">
            {athlete.profile && (
              <img
                src={athlete.profile}
                alt={`${athlete.firstname} ${athlete.lastname}`}
                className="rounded-full w-24 h-24 object-cover border-2 border-border"
              />
            )}
            <div className="flex-1">
              <CardTitle className="text-2xl">
                {athlete.firstname} {athlete.lastname}
              </CardTitle>
              <CardDescription className="flex items-center mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                {athlete.city}, {athlete.country}
              </CardDescription>
              {athlete.bio && (
                <p className="text-sm text-muted-foreground mt-4">{athlete.bio}</p>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {details.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <React.Fragment key={detail.label}>
                <div className="flex items-center gap-4">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{detail.label}</p>
                    <p className="font-medium">{detail.value}</p>
                  </div>
                </div>
                {index < details.length - 1 && <Separator />}
              </React.Fragment>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
} 