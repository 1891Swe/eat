* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-align: center;
}

body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
    background-color: #f8f9fa;
    color: #333;
}

/* Header Styles */
.landing-header {
    height: 70vh;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.landing-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                url('images/restaurant-bg.jpg');
    background-size: cover;
    background-position: center;
    z-index: -1;
}

.header-content {
    color: white;
    text-align: center;
    padding: 0 1rem;
    max-width: 800px;
    position: relative;
    z-index: 1;
}

#welcome-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 1s forwards;
}

.tagline {
    font-size: 1.5rem;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 1s 0.3s forwards;
    margin-bottom: 2rem;
}

.cta-button {
    display: inline-block;
    background: linear-gradient(90deg, #b71c1c, #1a237e);
    color: white;
    padding: 0.8rem 2rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 1s 0.6s forwards;
}

.cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.4);
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Restaurant Selection Styles */
.restaurant-selection {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 1rem;
}

.section-description {
    max-width: 800px;
    margin: 0 auto 2rem;
    color: #6c757d;
    font-size: 1.1rem;
}

.restaurant-selection h2,
.pricing-section h2 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    position: relative;
    padding-bottom: 0.5rem;
    display: inline-block;
}

.restaurant-selection h2::after,
.pricing-section h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #b71c1c, #1a237e);
    opacity: 0.7;
}

.restaurant-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.restaurant-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    position: relative;
    cursor: pointer;
}

.restaurant-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #b71c1c, #1a237e);
    opacity: 0.7;
}

.restaurant-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.15);
}

.restaurant-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.restaurant-content {
    padding: 1.5rem;
}

.restaurant-name {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
}

.restaurant-address {
    color: #6c757d;
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.view-menu-btn {
    display: inline-block;
    background: linear-gradient(90deg, #b71c1c, #1a237e);
    color: white;
    padding: 0.6rem 1.5rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.view-menu-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    opacity: 0.9;
}

/* Pricing Section */
.pricing-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 1rem;
    text-align: center;
}

/* Features Section */
.features {
    background-color: #fff;
    padding: 2rem 1rem 4rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.feature-card {
    padding: 2rem;
    border-radius: 15px;
    background-color: #f8f9fa;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    position: relative;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    background-color: #fff;
}

.feature-card i {
    font-size: 2.5rem;
    color: #b71c1c;
    margin-bottom: 1rem;
}

.feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #1a1a1a;
}

.feature-card p {
    color: #6c757d;
}

/* Pricing Card Specifics */
.feature-card.highlight {
    border: 2px solid #b71c1c;
    transform: scale(1.05);
    background-color: #fff;
    box-shadow: 0 8px 20px rgba(183, 28, 28, 0.15);
}

.feature-card.highlight:hover {
    transform: scale(1.05) translateY(-5px);
}

.best-value {
    position: absolute;
    top: -15px;
    right: 50%;
    transform: translateX(50%);
    background: linear-gradient(90deg, #b71c1c, #1a237e);
    color: white;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.price-tag {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 1.5rem 0 0.5rem;
}

.price-note {
    font-size: 0.9rem;
    font-style: italic;
    color: #6c757d;
    margin-bottom: 1rem;
}

/* Contact Section */
.contact-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 1rem;
    text-align: center;
    background-color: #f8f9fa;
    border-radius: 15px;
    margin-bottom: 3rem;
}

.contact-button {
    display: inline-block;
    background: linear-gradient(90deg, #b71c1c, #1a237e);
    color: white;
    padding: 0.8rem 2.5rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    margin-top: 1.5rem;
}

.contact-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
}

/* Footer Styles */
footer {
    background-color: #1a1a1a;
    color: white;
    padding: 2rem 1rem;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.social-links a {
    color: white;
    margin-left: 1rem;
    font-size: 1.2rem;
    transition: color 0.3s ease;
}

.social-links a:hover {
    color: #b71c1c;
}

/* Responsive Design */
@media (max-width: 768px) {
    #welcome-title {
        font-size: 2.5rem;
    }
    
    .tagline {
        font-size: 1.2rem;
    }
    
    .restaurant-selection h2 {
        font-size: 2rem;
    }
    
    .footer-content {
        flex-direction: column;
        text-align: center;
    }
    
    .social-links {
        margin-top: 1rem;
    }
    
    .social-links a {
        margin: 0 0.5rem;
    }
}

@media (max-width: 480px) {
    .landing-header {
        height: 60vh;
    }
    
    #welcome-title {
        font-size: 2rem;
    }
    
    .tagline {
        font-size: 1rem;
    }
    
    .restaurant-selection h2 {
        font-size: 1.5rem;
    }
    
    .feature-card i {
        font-size: 2rem;
    }
    
    .feature-card h3 {
        font-size: 1.3rem;
    }
}
