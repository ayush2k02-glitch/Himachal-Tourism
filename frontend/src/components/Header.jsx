import React, { useState, useEffect } from 'react';

export default function Header({ onOpenInquiry, searchQuery, onSearchChange, currentUser, onOpenAuth, onSignOut }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      // Header scrolled background effect
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Scroll active navigation highlight
      const sections = document.querySelectorAll('section, header.hero');
      let current = 'home';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop - 150) {
          const id = section.getAttribute('id');
          if (id) {
            current = id;
          }
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'Circuits', href: '#destinations', id: 'destinations' },
    { label: 'Planner', href: '#planner', id: 'planner' },
    { label: 'Climate & Gear', href: '#weather', id: 'weather' },
    { label: 'Culture', href: '#culture', id: 'culture' },
    { label: 'Stays', href: '#stays', id: 'stays' },
  ];

  const handleLinkClick = (e, href, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="#home" className="logo" onClick={(e) => handleLinkClick(e, '#home', 'home')}>
          <svg className="logo-icon" viewBox="0 0 24 24">
            <path
              d="M17 11l-5-5-5 5M12 2L2 12h3v8h14v-8h3L12 2z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          HIMA<span>CHAL</span>
        </a>



        {/* Central Navigation Links (Pill styled on desktop) */}
        <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={activeSection === item.id ? 'active' : ''}
              onClick={(e) => handleLinkClick(e, item.href, item.id)}
            >
              {item.label}
            </a>
          ))}

          {/* Mobile-Only Actions inside drawer */}
          <div className="mobile-only-actions">
            {currentUser ? (
              <>
                <span className="user-greeting">
                  👤 {currentUser.name}
                </span>
                <button className="signout-btn" onClick={() => { setIsMobileMenuOpen(false); onSignOut(); }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button className="signin-btn" onClick={() => { setIsMobileMenuOpen(false); onOpenAuth('login'); }}>
                  Sign In
                </button>
                <button className="signup-btn" onClick={() => { setIsMobileMenuOpen(false); onOpenAuth('register'); }}>
                  Create Account
                </button>
              </>
            )}
            <button className="nav-btn" onClick={() => { setIsMobileMenuOpen(false); onOpenInquiry(); }}>
              Book Now
            </button>
          </div>
        </nav>

        {/* Right-side Auth & Booking Actions (Pill styled on desktop) */}
        <div className="nav-actions-wrapper">
          {currentUser ? (
            <>
              <span className="user-greeting">
                👤 {currentUser.name.split(' ')[0]}
              </span>
              <button className="signout-btn" onClick={onSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button className="signin-btn" onClick={() => onOpenAuth('login')}>
                Sign In
              </button>
              <button className="signup-btn" onClick={() => onOpenAuth('register')}>
                Create Account
              </button>
            </>
          )}
        </div>

        <button
          className="burger-menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            {isMobileMenuOpen ? (
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}
