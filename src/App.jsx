import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page components
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Careers from './pages/Careers';
import ClientBrief from './pages/ClientBrief';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin components
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import DashboardHome from './pages/admin/DashboardHome';
import HomePageEditor from './pages/admin/HomePageEditor';
import ClientBriefs from './pages/admin/ClientBriefs';
import ProjectsEditor from './pages/admin/ProjectsEditor';
import TestimonialsEditor from './pages/admin/TestimonialsEditor';
import StatsEditor from './pages/admin/StatsEditor';
import CareersEditor from './pages/admin/CareersEditor';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminToken') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

function App() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current route is admin route
  useEffect(() => {
    setIsAdmin(location.pathname.startsWith('/admin'));
  }, [location.pathname]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className={`app ${i18n.language === 'ar' ? 'font-tajawal' : 'font-poppins'}`}>
      {!isAdmin && <Header />}
      <main className={`${isAdmin ? '' : 'min-h-screen'}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/client-brief" element={<ClientBrief />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:postId" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="home-page" element={<HomePageEditor />} />
            <Route path="about" element={<div>About Page Editor</div>} />
            <Route path="services" element={<div>Services Editor</div>} />
            <Route path="projects" element={<ProjectsEditor />} />
            <Route path="blog" element={<div>Blog Editor</div>} />
            <Route path="careers" element={<CareersEditor />} />
            <Route path="client-briefs" element={<ClientBriefs />} />
            <Route path="settings" element={<div>Settings</div>} />
            
            {/* Additional admin routes for new components */}
            <Route path="testimonials" element={<TestimonialsEditor />} />
            <Route path="stats" element={<StatsEditor />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default App;
