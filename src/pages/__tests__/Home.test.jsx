import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Home from '../Home';

describe('Home Component', () => {
  beforeEach(() => {
    renderWithProviders(<Home />);
  });

  it('renders hero section', () => {
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Give Your Activities');
    expect(heading).toHaveTextContent('The Names They Deserve');
    expect(screen.getByText(/EnnyGo adds personality to your Strava activities/)).toBeInTheDocument();
  });

  it('renders how it works section', () => {
    expect(screen.getByText('How EnnyGo Works')).toBeInTheDocument();
    expect(screen.getByText('1. Connect Strava')).toBeInTheDocument();
    expect(screen.getByText('2. Auto-Magic Titles')).toBeInTheDocument();
    expect(screen.getByText('3. Share Your Story')).toBeInTheDocument();
  });

  it('renders transform activities section', () => {
    expect(screen.getByText('Transform Your Activities')).toBeInTheDocument();
    expect(screen.getByText('Before EnnyGo')).toBeInTheDocument();
    expect(screen.getByText('After EnnyGo')).toBeInTheDocument();
    expect(screen.getByText(/• Morning Run/)).toBeInTheDocument();
    expect(screen.getByText(/• Dawn Warrior's Victory Lap/)).toBeInTheDocument();
  });

  it('renders call-to-action section', () => {
    expect(screen.getByText('Ready to Transform Your Activities?')).toBeInTheDocument();
    const startButton = screen.getByRole('button', { name: /Start Your Journey/i });
    expect(startButton).toBeInTheDocument();
  });
});