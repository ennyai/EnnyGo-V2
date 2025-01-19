import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../tests/test-utils';
import Home from '../Home';

describe('Home Component', () => {
  test('renders welcome message', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('Welcome to EnnyGo')).toBeInTheDocument();
    expect(screen.getByText('Transform your athletic journey with creative activity naming and virtual events')).toBeInTheDocument();
  });

  test('renders feature cards', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('Creative Activity Names')).toBeInTheDocument();
    expect(screen.getByText('Virtual Events')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
  });

  test('renders feature descriptions', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('Generate unique and inspiring names for your Strava activities that reflect your achievements')).toBeInTheDocument();
    expect(screen.getByText('Join exciting virtual ultra-endurance events and challenge yourself with like-minded athletes')).toBeInTheDocument();
    expect(screen.getByText('Connect with fellow athletes, share your journey, and inspire each other to reach new heights')).toBeInTheDocument();
  });

  test('renders call-to-action buttons', () => {
    renderWithProviders(<Home />);
    // Get the hero section button
    const heroGetStartedButton = screen.getByRole('button', { name: 'Get Started' });
    const exploreEventsButton = screen.getByRole('button', { name: 'Explore Events' });
    const ctaGetStartedButton = screen.getByRole('button', { name: 'Get Started Now' });
    
    expect(heroGetStartedButton).toBeInTheDocument();
    expect(exploreEventsButton).toBeInTheDocument();
    expect(ctaGetStartedButton).toBeInTheDocument();
  });
}); 