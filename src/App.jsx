import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// Lazy load only the larger components
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Events = React.lazy(() => import('./pages/Events'));
const Blog = React.lazy(() => import('./pages/Blog'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with top navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* Protected routes with sidebar */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<div>Loading dashboard...</div>}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/events"
            element={
              <Suspense fallback={<div>Loading events...</div>}>
                <Events />
              </Suspense>
            }
          />
          <Route
            path="/blog"
            element={
              <Suspense fallback={<div>Loading blog...</div>}>
                <Blog />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<div>Loading profile...</div>}>
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<div>Loading settings...</div>}>
                <Settings />
              </Suspense>
            }
          />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
