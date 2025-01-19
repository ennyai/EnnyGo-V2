import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';

// Lazy load other pages
const Events = React.lazy(() => import('./pages/Events'));
const Blog = React.lazy(() => import('./pages/Blog'));
const Login = React.lazy(() => import('./pages/Login'));
const SignUp = React.lazy(() => import('./pages/SignUp'));

function App() {
  return (
    <Router>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="events" element={<Events />} />
            <Route path="blog" element={<Blog />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
          </Route>
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;
