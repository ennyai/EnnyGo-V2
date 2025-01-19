import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../tests/test-utils';
import Events from '../Events';

const mockEvents = [
  {
    id: 1,
    title: "Summer Ultra Challenge",
    date: "August 1-31, 2024",
    description: "A month-long virtual ultra-endurance challenge covering 500km",
    participants: 234,
    difficulty: "Challenging",
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3"
  }
];

const defaultState = {
  events: {
    events: [],
    isLoading: false,
    error: null
  },
  auth: {
    isAuthenticated: false
  },
  ui: {
    modals: {}
  }
};

describe('Events Component', () => {
  test('displays loading state', () => {
    const loadingState = {
      ...defaultState,
      events: {
        ...defaultState.events,
        isLoading: true,
        events: []
      }
    };

    renderWithProviders(<Events disableFetch />, { preloadedState: loadingState });
    
    const loadingSpinner = screen.getByTestId('loading-spinner');
    expect(loadingSpinner).toBeInTheDocument();
    expect(loadingSpinner).toHaveTextContent('Loading events...');
  });

  test('displays error state', () => {
    const errorState = {
      ...defaultState,
      events: {
        ...defaultState.events,
        error: 'Failed to fetch events. Please try again later.'
      }
    };

    renderWithProviders(<Events disableFetch />, { preloadedState: errorState });
    
    const errorTitle = screen.getByTestId('error-title');
    expect(errorTitle).toHaveTextContent('Error');
    expect(screen.getByText('Failed to fetch events. Please try again later.')).toBeInTheDocument();
  });

  test('renders event list', () => {
    const eventsState = {
      ...defaultState,
      events: {
        ...defaultState.events,
        events: mockEvents
      }
    };

    renderWithProviders(<Events disableFetch />, { preloadedState: eventsState });
    
    expect(screen.getByText('Virtual Events')).toBeInTheDocument();
    expect(screen.getByText('Summer Ultra Challenge')).toBeInTheDocument();
    const joinButtons = screen.getAllByText('Join Event');
    expect(joinButtons.length).toBeGreaterThan(0);
  });

  test('renders create event section', () => {
    renderWithProviders(<Events disableFetch />, { preloadedState: defaultState });
    
    expect(screen.getByText('Create Your Own Event')).toBeInTheDocument();
    expect(screen.getByText('Organize virtual challenges for your community')).toBeInTheDocument();
  });
}); 