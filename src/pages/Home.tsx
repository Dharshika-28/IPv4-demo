
'use client';

import React from 'react';
import '../css/Home.css'; // 👈 Import CSS here
import Navbar from '../main/Navbar.tsx'; // No need to add .tsx
import Footer from '../main/Footer.tsx';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <header className="home-header">
        <h1 className="home-title">Interactive learning</h1>
        <p className="home-subtitle">
          Practice with  real-world Scenarios  and get immediate feedback on your progress.
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
          <AutoStoriesIcon />
            <h3 className="feature-card-title">Interactive Quizzes</h3>
            <p className="feature-card-desc">
              Test your knowledge with interactive quizzes and track your progress.
            </p>
          </div>
          <div className="feature-card">
          <AutoStoriesIcon />
            <h3 className="feature-card-title">Comprehensive Content </h3>
            <p className="feature-card-desc">
              Cover all essential Ipv4 topic including subnetting, CIDR, VLSM and route Summarization.
            </p>
          </div>
          <div className="feature-card">
          <AutoStoriesIcon />
            <h3 className="feature-card-title">Self-paced Modules</h3>
            <p className="feature-card-desc">
              Learn at your own pace with structured modules that fit your schedule and clear learning objectices.
            </p>
          </div>
          <div className="feature-card">
          <AutoStoriesIcon />
            <h3 className="feature-card-title">Practice Exercises</h3>
            <p className="feature-card-desc">
              Reinforce your learning with hands-on exercises, real-world scenarios and quizzes.
            </p>
          </div>
          <div className="feature-card">
          <AutoStoriesIcon />
            <h3 className="feature-card-title">Progress Tracking </h3>
            <p className="feature-card-desc">
              Monitor your progress and identify areas for improvement with detailed analytics.
            </p>
          </div>
          <div className="feature-card">
          <AutoStoriesIcon />
            <h3 className="feature-card-title">CCNA Aligned</h3>
            <p className="feature-card-desc">
              Content is aligned with CCNA certification objectives, ensuring you are well-prepared for the exam.
            </p>
          </div>
         
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home