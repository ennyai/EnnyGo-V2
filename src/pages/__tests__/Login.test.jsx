import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../tests/test-utils';
import { setLoading, setCredentials } from '../../store/slices/authSlice';
import { showToast } from '../../store/slices/uiSlice';
import Login from '../Login';
import { vi } from 'vitest';

describe('Login Component', () => {
  test('renders social login buttons', () => {
    renderWithProviders(<Login />);
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Continue with Strava')).toBeInTheDocument();
  });

  test('renders login form', () => {
    renderWithProviders(<Login />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    const mockDispatch = vi.fn();
    const preloadedState = {
      auth: {
        isAuthenticated: false,
        isLoading: false,
        error: null
      }
    };

    renderWithProviders(<Login />, { 
      preloadedState,
      mockDispatch
    });

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    fireEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
  });

  test('displays loading state during submission', () => {
    const preloadedState = {
      auth: {
        isAuthenticated: false,
        isLoading: true,
        error: null
      }
    };
    renderWithProviders(<Login />, { preloadedState });
    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled();
  });

  test('displays error message', () => {
    const preloadedState = {
      auth: {
        isAuthenticated: false,
        isLoading: false,
        error: 'Invalid email or password'
      }
    };
    renderWithProviders(<Login />, { preloadedState });
    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
  });
}); 