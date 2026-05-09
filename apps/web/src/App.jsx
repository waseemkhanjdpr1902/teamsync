import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import HomePage from './pages/HomePage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx';
import FAQPage from './pages/FAQPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import AboutPage from './pages/AboutPage.jsx';

import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import PasswordResetPage from './pages/PasswordResetPage.jsx';
import EmailVerificationPage from './pages/EmailVerificationPage.jsx';

import DashboardPage from './pages/DashboardPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import SubscriptionPage from './pages/SubscriptionPage.jsx';
import APIKeysPage from './pages/APIKeysPage.jsx';
import UsageHistoryPage from './pages/UsageHistoryPage.jsx';

import CVBuilderPage from './pages/CVBuilderPage.jsx';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage.jsx';
import URLShortenerPage from './pages/URLShortenerPage.jsx';
import QRCodeGeneratorPage from './pages/QRCodeGeneratorPage.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<PasswordResetPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/dashboard/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
          <Route path="/dashboard/api-keys" element={<ProtectedRoute><APIKeysPage /></ProtectedRoute>} />
          <Route path="/dashboard/usage" element={<ProtectedRoute><UsageHistoryPage /></ProtectedRoute>} />

          <Route path="/dashboard/cv-builder" element={<ProtectedRoute><CVBuilderPage /></ProtectedRoute>} />
          <Route path="/dashboard/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzerPage /></ProtectedRoute>} />
          <Route path="/dashboard/url-shortener" element={<ProtectedRoute><URLShortenerPage /></ProtectedRoute>} />
          <Route path="/dashboard/qr-code-generator" element={<ProtectedRoute><QRCodeGeneratorPage /></ProtectedRoute>} />

          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="text-primary hover:underline">Back to Home</a>
              </div>
            </div>
          } />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
