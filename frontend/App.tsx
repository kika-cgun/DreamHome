import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import { LogoSkeleton } from './components/ui/Skeleton';
import { useAuthStore } from './stores/authStore';
import { useListingStore } from './stores/listingStore';
import { favoriteService } from './services/favoriteService';

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ListingsPage = React.lazy(() => import('./pages/ListingsPage'));
const ListingDetailsPage = React.lazy(() => import('./pages/ListingDetailsPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const AddListingPage = React.lazy(() => import('./pages/AddListingPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const FavoritesPage = React.lazy(() => import('./pages/FavoritesPage'));
const MyListingsPage = React.lazy(() => import('./pages/MyListingsPage'));
const MessagesPage = React.lazy(() => import('./pages/MessagesPage'));
const AdminCategoriesPage = React.lazy(() => import('./pages/AdminCategoriesPage'));
const AdminLocationsPage = React.lazy(() => import('./pages/AdminLocationsPage'));
const AdminListingsPage = React.lazy(() => import('./pages/AdminListingsPage'));
const EditListingPage = React.lazy(() => import('./pages/EditListingPage'));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const setFavorites = useListingStore((state) => state.setFavorites);

  // Load favorites on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      favoriteService.getFavorites()
        .then(setFavorites)
        .catch(console.error);
    }
  }, [isAuthenticated, setFavorites]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          iconTheme: {
            primary: '#C9A227',
            secondary: '#fff',
          },
        },
      }} />
      <Suspense fallback={<LogoSkeleton />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="listings" element={<ListingsPage />} />
            <Route path="listings/:id" element={<ListingDetailsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            <Route path="add-listing" element={
              <ProtectedRoute>
                <AddListingPage />
              </ProtectedRoute>
            } />

            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            <Route path="dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />

            <Route path="favorites" element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            } />

            <Route path="messages" element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            } />

            <Route path="my-listings" element={
              <ProtectedRoute>
                <MyListingsPage />
              </ProtectedRoute>
            } />

            <Route path="admin/categories" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminCategoriesPage />
              </ProtectedRoute>
            } />

            <Route path="admin/locations" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLocationsPage />
              </ProtectedRoute>
            } />

            <Route path="admin/listings" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminListingsPage />
              </ProtectedRoute>
            } />

            <Route path="edit-listing/:id" element={
              <ProtectedRoute>
                <EditListingPage />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;