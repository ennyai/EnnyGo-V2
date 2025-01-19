import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectAllEvents, 
  selectIsEventLoading, 
  selectEventError,
  setEvents,
  joinEvent,
  setLoading,
  setError 
} from '../store/slices/eventSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { toggleModal } from '../store/slices/uiSlice';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Calendar, Users, PlusCircle, Loader2 } from "lucide-react";

const Events = ({ disableFetch = false }) => {
  const dispatch = useDispatch();
  const events = useSelector(selectAllEvents);
  const isLoading = useSelector(selectIsEventLoading);
  const error = useSelector(selectEventError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (disableFetch) return;

    // Simulating API call - replace with actual API call later
    const fetchEvents = async () => {
      try {
        dispatch(setLoading(true));
        // Temporary mock data
        const mockEvents = [
          {
            id: 1,
            title: "Summer Ultra Challenge",
            date: "August 1-31, 2024",
            description: "A month-long virtual ultra-endurance challenge covering 500km",
            participants: 234,
            difficulty: "Challenging",
            image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3"
          },
          {
            id: 2,
            title: "Weekend Warriors",
            date: "Every Weekend",
            description: "Join fellow athletes for weekend virtual races and challenges",
            participants: 156,
            difficulty: "Moderate",
            image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211"
          }
        ];
        dispatch(setEvents(mockEvents));
      } catch (err) {
        dispatch(setError('Failed to fetch events. Please try again later.'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchEvents();
  }, [dispatch]);

  const handleJoinEvent = (eventId) => {
    if (!isAuthenticated) {
      dispatch(toggleModal({ modalName: 'login', isOpen: true }));
      return;
    }
    dispatch(joinEvent({ eventId }));
  };

  const handleCreateEvent = () => {
    if (!isAuthenticated) {
      dispatch(toggleModal({ modalName: 'login', isOpen: true }));
      return;
    }
    dispatch(toggleModal({ modalName: 'createEvent', isOpen: true }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="flex items-center justify-center min-h-[60vh]">
          <CardContent>
            <div className="flex items-center gap-2 text-muted-foreground" data-testid="loading-spinner">
              <Loader2 className="h-6 w-6 animate-spin" />
              Loading events...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle data-testid="error-title">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Virtual Events</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join exciting virtual challenges and compete with athletes worldwide
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {events.map(event => (
          <Card key={event.id} className="overflow-hidden flex flex-col">
            <div 
              className="h-48 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${event.image})` }}
            />
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {event.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{event.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{event.participants} participants</span>
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs ml-auto">
                  {event.difficulty}
                </span>
              </div>
            </CardContent>
            <CardFooter className="mt-auto pt-6">
              <Button 
                className="w-full"
                onClick={() => handleJoinEvent(event.id)}
              >
                Join Event
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>

      <section className="mb-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Create Your Own Event</h2>
              <p className="text-primary-foreground/90">
                Organize virtual challenges for your community
              </p>
            </div>
            <Button 
              variant="secondary"
              size="lg"
              onClick={handleCreateEvent}
              className="gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              Create Event
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Events; 