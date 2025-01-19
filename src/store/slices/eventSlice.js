import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  userEvents: [],
  currentEvent: null,
  isLoading: false,
  error: null
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
      state.error = null;
    },
    setUserEvents: (state, action) => {
      state.userEvents = action.payload;
      state.error = null;
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
      state.error = null;
    },
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    joinEvent: (state, action) => {
      const event = state.events.find(event => event.id === action.payload.eventId);
      if (event) {
        event.participants = (event.participants || 0) + 1;
        state.userEvents.push(action.payload.eventId);
      }
    },
    leaveEvent: (state, action) => {
      const event = state.events.find(event => event.id === action.payload.eventId);
      if (event && event.participants > 0) {
        event.participants--;
        state.userEvents = state.userEvents.filter(id => id !== action.payload.eventId);
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

export const {
  setEvents,
  setUserEvents,
  setCurrentEvent,
  addEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  setLoading,
  setError
} = eventSlice.actions;

// Selectors
export const selectAllEvents = (state) => state.events.events;
export const selectUserEvents = (state) => state.events.userEvents;
export const selectCurrentEvent = (state) => state.events.currentEvent;
export const selectEventById = (state, eventId) => 
  state.events.events.find(event => event.id === eventId);
export const selectIsEventLoading = (state) => state.events.isLoading;
export const selectEventError = (state) => state.events.error;

export default eventSlice.reducer; 