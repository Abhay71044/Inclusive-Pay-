import React from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Hero from './components/home/Hero';
import PersonaSwitcher from './components/home/PersonaSwitcher';
import FeaturesSection from './components/home/FeaturesSection';
import AboutSection from './components/home/AboutSection';
import ScreenshotsSection from './components/home/ScreenshotsSection';
import DownloadSection from './components/home/DownloadSection';
import FaqSection from './components/home/FaqSection';
import ContactSection from './components/home/ContactSection';

import LoginView from './components/auth/LoginView';
import SignupView from './components/auth/SignupView';
import DashboardView from './components/dashboard/DashboardView';
import DownloadHubView from './components/download/DownloadHubView';
import ProfileView from './components/profile/ProfileView';

import ToastContainer from './components/common/ToastContainer';
import ModalDialog from './components/common/ModalDialog';

const AppContent = () => {
  const { activeView } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow" id="main-content">
        {activeView === 'home' && (
          <>
            <Hero />
            <PersonaSwitcher />
            <FeaturesSection />
            <AboutSection />
            <ScreenshotsSection />
            <DownloadSection />
            <FaqSection />
            <ContactSection />
          </>
        )}

        {activeView === 'login' && <LoginView />}
        {activeView === 'signup' && <SignupView />}
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'download-hub' && <DownloadHubView />}
        {activeView === 'profile' && <ProfileView />}
      </main>

      <Footer />
      <ToastContainer />
      <ModalDialog />
    </div>
  );
};

export default AppContent;
