import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Destinations from './components/Destinations';
import ItineraryPlanner from './components/ItineraryPlanner';
import TravelEssentials from './components/TravelEssentials';
import CultureHub from './components/CultureHub';
import Stays from './components/Stays';
import MapExplorer from './components/MapExplorer';
import Footer from './components/Footer';
import InquiryModal from './components/InquiryModal';
import AuthModal from './components/AuthModal';

export default function App() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [destinationPreset, setDestinationPreset] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authMode, setAuthMode] = useState(null);

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    setCurrentUser(null);
  };

  const handleOpenInquiry = (destination = '') => {
    setDestinationPreset(destination);
    setIsInquiryOpen(true);
  };

  const handleQuickSearch = ({ destination, date }) => {
    setDestinationPreset(destination);
    setIsInquiryOpen(true);
    // Since we also capture travel date from hero, we pass destination to select it,
    // and date can be pre-filled via InquiryModal's preset if we pass it, but standard
    // presets are typically destination names.
  };

  return (
    <>
      {/* Floating Sticky Header */}
      <Header 
        onOpenInquiry={() => handleOpenInquiry('General Inquiry')} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUser={currentUser}
        onOpenAuth={(mode) => setAuthMode(mode)}
        onSignOut={handleSignOut}
      />

      {/* Main Sections */}
      <Hero onQuickSearch={handleQuickSearch} />
      
      <main>
        <Destinations 
          onOpenInquiry={handleOpenInquiry} 
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />
        <ItineraryPlanner />
        <TravelEssentials />
        <CultureHub />
        <Stays />
        <MapExplorer />
      </main>

      {/* Brand Footer */}
      <Footer />

      {/* Modal Inquiry Overlays */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        destinationPreset={destinationPreset}
      />

      {/* Modal Auth Overlay */}
      <AuthModal
        isOpen={!!authMode}
        initialMode={authMode || 'login'}
        onClose={() => setAuthMode(null)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />
    </>
  );
}
