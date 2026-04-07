import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';
import PreviewListener from './components/PreviewListener';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const ProductListing = lazy(() => import('./pages/ProductListing'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Feedback = lazy(() => import('./pages/Feedback'));
const Orders = lazy(() => import('./pages/Orders'));
const Settings = lazy(() => import('./pages/Settings'));
const Notifications = lazy(() => import('./pages/Notifications'));

// Loading fallback component
const LoadingScreen = () => (
  <div className="min-h-screen bg-sf-background flex flex-col justify-center items-center">
    <div className="w-16 h-16 relative">
       <div className="absolute inset-0 border-4 border-sf-primary/10 rounded-full" />
       <div className="absolute inset-0 border-4 border-t-sf-primary rounded-full animate-spin" />
    </div>
    <p className="mt-8 text-[10px] font-black tracking-[0.3em] text-sf-primary uppercase animate-pulse">Entering Atelier</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PreviewListener />
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/categories" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            {/* Catch-all route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
};

export default App;
