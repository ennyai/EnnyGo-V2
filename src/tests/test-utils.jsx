import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import authReducer from '../store/slices/authSlice';
import eventReducer from '../store/slices/eventSlice';
import activityReducer from '../store/slices/activitySlice';
import uiReducer from '../store/slices/uiSlice';

// Create a test store with all reducers
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      events: eventReducer,
      activities: activityReducer,
      ui: uiReducer,
    },
    preloadedState,
  });
}

// Custom render function that includes Redux Provider
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    mockDispatch = null,
    ...renderOptions
  } = {}
) {
  const store = createTestStore(preloadedState);
  
  if (mockDispatch) {
    store.dispatch = mockDispatch;
  }

  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Helper function to create a mock store with dispatch spy
export function createMockStore() {
  const store = createTestStore();
  const originalDispatch = store.dispatch;
  store.dispatch = vi.fn(originalDispatch);
  return store;
}

// Re-export everything
export * from '@testing-library/react'; 