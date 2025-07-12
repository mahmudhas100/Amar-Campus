import React from 'react';
import LandingNavbar from '../components/layout/LandingNavbar';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-sky-800/50 p-6 rounded-lg text-center border border-sky-700 transform hover:scale-105 transition-transform duration-300">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="font-bold text-xl mb-2 text-white">{title}</h3>
    <p className="text-sky-300">{description}</p>
  </div>
);

const LandingPage = () => {
  return (
    <div className="bg-sky-900 text-white min-h-screen">
      <LandingNavbar />

      {/* Hero Section */}
      <main className="pt-32 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider">
            Your Campus, <span className="text-sky-300">Connected.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-sky-200">
            The single, trusted platform for official announcements, peer-to-peer knowledge, and essential student support services at your university.
          </p>
          <div className="mt-10">
            <Link
              to="/login"
              className="px-8 py-4 text-lg font-bold text-sky-900 bg-sky-300 hover:bg-sky-200 rounded-md shadow-lg transform hover:scale-105 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-sky-950/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">All of Campus, In One Place</h2>
            <p className="mt-2 text-sky-300">From official news to student-led growth.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
