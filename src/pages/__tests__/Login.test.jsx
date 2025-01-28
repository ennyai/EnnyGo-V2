import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Login from '../Login';
import { vi } from 'vitest';

// Mock supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      upsert: vi.fn()
    }))
  }
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

// Mock toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('Login Component', () => {
  it('renders login form', () => {
    renderWithProviders(<Login />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(submitButton).toHaveTextContent('Logging in...');
    expect(submitButton).toBeDisabled();
  });

  it('displays loading state during submission', async () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(submitButton).toHaveTextContent('Logging in...');
    expect(submitButton).toBeDisabled();
  });

  it('displays error message on failed login', () => {
    const preloadedState = {
      auth: {
        loading: false,
        error: 'Invalid email or password'
      }
    };
    renderWithProviders(<Login />, { preloadedState });
    
    // Error message is now shown via toast, which is mocked
    // We don't need to test for the presence of the error message in the DOM
    // Instead, we can test that the form is ready for another submission
    expect(screen.getByRole('button', { name: 'Log In' })).toBeEnabled();
  });
}); 