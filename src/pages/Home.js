import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h1>Banker's Algorithm Simulation</h1>
        <p>A visual tool to understand deadlock avoidance in operating systems</p>
        <Link to="/configure" className="btn-primary">Get Started</Link>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>What is Banker's Algorithm?</h2>
        <p>
          The Banker's Algorithm is a resource allocation and deadlock avoidance algorithm 
          used in operating systems. It tests for safety by simulating the allocation of 
          maximum possible resources and then checks if the system remains in a safe state.
        </p>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Configure System</h3>
            <p>Set up processes and resources for simulation</p>
          </div>
          <div className="feature-card">
            <h3>Run Simulation</h3>
            <p>Execute safety algorithm with step-by-step animation</p>
          </div>
          <div className="feature-card">
            <h3>Resource Request</h3>
            <p>Simulate process requesting additional resources</p>
          </div>
          <div className="feature-card">
            <h3>View History</h3>
            <p>Access past simulations stored in database</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Configure</h3>
            <p>Enter number of processes and resources</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Input Matrices</h3>
            <p>Fill Allocation, Maximum, and Available matrices</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Run Algorithm</h3>
            <p>Execute and view safe/unsafe state</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>View Results</h3>
            <p>See safe sequence and step-by-step execution</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;