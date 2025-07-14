import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/layout/LandingNavbar';
import Spinner from '../components/common/Spinner';

const FeatureCard = ({ icon, title, description }) => (
  <div className="group bg-sky-800/30 p-6 rounded-2xl text-center border border-sky-700/50 hover:border-sky-500/50 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-sky-900/20">
    <div className="text-4xl mb-4 flex justify-center transition-transform group-hover:-translate-y-1">{icon}</div>
    <h3 className="font-semibold text-lg mb-2 text-white tracking-wide group-hover:text-sky-300 transition-colors">{title}</h3>
    <p className="text-sky-200/80 text-sm leading-relaxed">{description}</p>
  </div>
);

const LandingPage = () => {
  const [loadingStates, setLoadingStates] = useState({
    login: false,
    signup: false,
    getStarted: false,
    cardsLoading: true
  });

  const handleLearnMoreClick = (e) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigate = useNavigate();

  // Simulate cards loading on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, cardsLoading: false }));
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-sky-900 text-white min-h-screen">
      <LandingNavbar />

      {/* Hero Section */}
      <main className="pt-32 pb-20 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/50 to-sky-950/50 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-300 leading-[1.15]">
              Your Campus, <br />
              <span className="text-sky-300 inline-block mt-2">Connected.</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-sky-200/90 leading-relaxed font-medium">
              The single, trusted platform for official announcements, peer-to-peer knowledge, and essential student support services at your university.
            </p>
          </div>
          <div className="mt-10 space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => {
                setLoadingStates(prev => ({ ...prev, getStarted: true }));
                setTimeout(() => {
                  navigate('/login');
                }, 500);
              }}
              disabled={loadingStates.getStarted}
              className="px-6 py-3 text-base font-bold text-sky-900 bg-sky-300 hover:bg-sky-200 rounded-lg shadow-lg inline-flex items-center hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-75 disabled:hover:translate-y-0"
            >
              {loadingStates.getStarted ? (
                <>
                  <Spinner size="sm" className="text-sky-900" />
                  <span className="ml-2">Loading...</span>
                </>
              ) : (
                <>
                  Get Started
                  <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
            <button
              onClick={handleLearnMoreClick}
              className="px-6 py-3 text-base font-semibold text-sky-300 border border-sky-300/50 hover:border-sky-300 hover:bg-sky-300/10 rounded-lg shadow-lg inline-flex items-center hover:-translate-y-0.5 transition-all duration-300"
            >
              Learn More
              <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-sky-950/50 to-sky-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-white/90">All of Campus, In One Place</h2>
          <p className="text-sky-300/80 text-center mb-12 max-w-2xl mx-auto text-sm md:text-base">Experience a seamless integration of all your campus needs in one unified platform.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {loadingStates.cardsLoading ? (
              <>
                {[1, 2, 3].map((index) => (
                  <div key={index} className="bg-sky-800/30 p-6 rounded-2xl text-center border border-sky-700/50 flex flex-col items-center justify-center min-h-[200px] animate-pulse">
                    <Spinner size="lg" className="text-sky-300/50" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <FeatureCard
                  icon="📢"
                  title="Official Class Feed"
                  description="Get verified updates directly from your CR. No more noise, just the facts."
                />
                <FeatureCard
                  icon="💡"
                  title="Student Growth Hub"
                  description="Discover internships, upskilling resources, and campus tips shared by your peers."
                />
                <FeatureCard
                  icon="🛡️"
                  title="Campus Voice Box"
                  description="A safe space to ask for help anonymously or confidentially report incidents."
                />
              </>
            )}
          </div>
        </div>
      </section>

       {/* Footer */}
      <footer className="text-center py-10">
        <p className="text-sky-400">&copy; 2025 Amar Campus. Built for students, by students.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
