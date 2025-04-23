'use client';

import React from 'react';
import '../css/Home.css'; // 👈 Import CSS here
import Navbar from '../main/Navbar.tsx'; // No need to add .tsx
import ModulePage from './Modules.tsx';
import Footer from '../main/Footer.tsx';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      {/* <ModulePage /> Include the ModulePage component here */}
      <header className="home-header">
        <h1 className="home-title">Welcome to the Learning Portal</h1>
        <p className="home-subtitle">
          Your self-paced learning experience for IPv4 addressing and more!
        </p>
      </header>

      <section className="home-content">
        <div className="text-section1" >
        <div className="text-section">
          <h2 className="section-title">Why Learn IPv4?</h2>
          <p className="section-description">
            IPv4 addressing is essential for understanding how devices communicate across the internet. Mastering it is key to excelling in networking and getting certified in CCNA.
          </p>
          <div className="cta-buttons">
            <a href="/login" className="cta-button">
              Start Learning Now
            </a>
            <a href="#features" className="know-more-button">
              Know More
            </a>
          </div>
        </div></div>

        
      </section>

      <section className="features-section" id="features">
        <h2 className="features-title">Features</h2>
        {/* <p className="features-para">Everything you need to master IPv4 addressing concepts for your CCNA certification</p> */}
        <div className="feature-cards">
          <div className="feature-card">
            <h3 className="feature-card-title">Interactive Quizzes</h3>
            <p className="feature-card-desc">
              Test your knowledge with interactive quizzes and track your progress.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card-title">Progress Tracking</h3>
            <p className="feature-card-desc">
              Stay motivated with detailed progress tracking of your learning journey.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card-title">Admin Dashboard</h3>
            <p className="feature-card-desc">
              Manage users, content, and quizzes with an easy-to-use admin interface.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card-title">Learning Resources</h3>
            <p className="feature-card-desc">
              Access a variety of resources and materials to help you succeed.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card-title">Live Support</h3>
            <p className="feature-card-desc">
              Get support from experts during your learning journey.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card-title">Community</h3>
            <p className="feature-card-desc">
              Join a community of learners to share knowledge and experiences.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card-title">Certification</h3>
            <p className="feature-card-desc">
              Earn certificates after completing courses and quizzes.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card-title">Mobile Friendly</h3>
            <p className="feature-card-desc">
              Learn on the go with a mobile-responsive design.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
