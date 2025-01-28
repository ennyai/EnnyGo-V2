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
import { Calendar, Users, PlusCircle, Loader2, Trophy, ArrowRight } from "lucide-react";
import { events as eventData } from '../data/events';

const Events = ({ disableFetch = false }) => {
  const dispatch = useDispatch();
  const events = useSelector(selectAllEvents);
  const isLoading = useSelector(selectIsEventLoading);
  const error = useSelector(selectEventError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (disableFetch) return;

    const fetchEvents = async () => {
      try {
        dispatch(setLoading(true));
        // Using our events data source
        dispatch(setEvents(eventData));
      } catch (err) {
        dispatch(setError('Failed to load events. Please try again later.'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchEvents();
  }, [dispatch, disableFetch]);

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
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#FC4C02] to-[#FC4C02]/60 bg-clip-text text-transparent">
          Virtual Events
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join exciting virtual challenges and compete with athletes worldwide
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {events.map(event => (
          <Card key={event.id} className="overflow-hidden flex flex-col border-2 hover:border-[#FC4C02]/50 transition-colors">
            <div 
              className="h-48 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${event.image})` }}
            />
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {event.startDate} to {event.endDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{event.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{event.participants} participants</span>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#FC4C02]/10 text-[#FC4C02] text-xs ml-auto">
                  <Trophy className="h-3 w-3" />
                  {event.goal ? `${event.goal}${event.unit}` : 'No limit'}
                </div>
              </div>
            </CardContent>
            <CardFooter className="mt-auto pt-6">
              <Button 
                className="w-full bg-[#FC4C02] hover:bg-[#FC4C02]/90 group"
                onClick={() => handleJoinEvent(event.id)}
              >
                Join Challenge <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>

      <section className="mb-16">
        <Card className="bg-[#FC4C02] text-white">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Create Your Own Challenge</h2>
              <p className="text-white/90">
                Organize virtual events for your community
              </p>
            </div>
            <Button 
              variant="secondary"
              size="lg"
              onClick={handleCreateEvent}
              className="gap-2 bg-white text-[#FC4C02] hover:bg-white/90"
            >
              <PlusCircle className="h-5 w-5" />
              Create Challenge
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Events; 