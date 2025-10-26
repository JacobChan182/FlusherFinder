import React from 'react';
import '../styling/About.css';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-hero">
                <h1>About FlushFinder</h1>
                <p className="hero-subtitle">Empowering people with digestive conditions to explore the world with confidence</p>
            </div>

            <div className="about-content">
                <section className="mission-section">
                    <h2>Our Mission</h2>
                    <p>
                        FlushFinder was born from a simple yet profound need: to help people with IBS, Crohn's disease, 
                        ulcerative colitis, and other digestive conditions feel safe and prepared when leaving their homes. 
                        We believe that everyone deserves the freedom to explore, travel, and live life to the fullest, 
                        regardless of their health conditions.
                    </p>
                </section>

                <section className="problem-section">
                    <h2>The Problem We Solve</h2>
                    <p>
                        For millions of people worldwide, digestive conditions create invisible barriers to daily life. 
                        The constant worry about finding a clean, accessible restroom can turn simple activities like 
                        grocery shopping, commuting, or dining out into sources of anxiety and stress. Many people 
                        with these conditions limit their activities or avoid leaving home altogether, missing out on 
                        life's experiences.
                    </p>
                </section>
                <section className="impact-section">
                    <h2>Our Impact</h2>
                    <p>
                        FlushFinder is more than just a bathroom finder app – it's a community-driven platform that 
                        empowers users to share real experiences and help each other navigate the world safely. 
                        Our users can:
                    </p>
                    <div className="impact-grid">
                        <div className="impact-item">
                            <h3>🌍 Explore Freely</h3>
                            <p>Travel and explore new places with confidence, knowing you can find safe restroom options</p>
                        </div>
                        <div className="impact-item">
                            <h3>💪 Promote Confidence</h3>
                            <p>Lower stress levels by having reliable information about restroom availability and conditions</p>
                        </div>
                        <div className="impact-item">
                            <h3>🤝 Build Community</h3>
                            <p>Connect with others who understand your experiences and can build a network of support</p>
                        </div>
                        <div className="impact-item">
                            <h3>📱 Stay Prepared</h3>
                            <p>Plan your day and routes with confidence, knowing restroom locations and conditions in advance</p>
                        </div>
                    </div>
                </section>

                <section className="values-section">
                    <h2>Our Values</h2>
                    <div className="values-grid">
                        <div className="value-item">
                            <h3>Empathy</h3>
                            <p>We understand the challenges you face because many of our team members live with these conditions too.</p>
                        </div>
                        <div className="value-item">
                            <h3>Community</h3>
                            <p>We believe in the power of shared experiences and peer support to make life better for everyone.</p>
                        </div>
                        <div className="value-item">
                            <h3>Accessibility</h3>
                            <p>We're committed to making our app accessible to people with all types of disabilities and needs.</p>
                        </div>
                        <div className="value-item">
                            <h3>Privacy</h3>
                            <p>Your health information and location data are protected with the highest standards of privacy and security.</p>
                        </div>
                    </div>
                </section>

                <section className="join-section">
                    <h2>Join Our Community</h2>
                    <p>
                        Whether you're living with a digestive condition, supporting someone who is, or simply want to 
                        help make the world more accessible, we invite you to join the FlushFinder community. 
                        Together, we can create a world where everyone feels safe and confident to explore.
                    </p>
                    <div className="cta-buttons">
                        <button className="cta-primary">Download the App</button>
                        <button className="cta-secondary">Share Your Story</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
