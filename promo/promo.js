document.addEventListener('DOMContentLoaded', function() {
    // Load demo restaurant
    const restaurantList = document.getElementById('restaurant-list');
    
    // Create a demo restaurant card
    const restaurantCard = document.createElement('div');
    restaurantCard.className = 'restaurant-card';
    
    restaurantCard.innerHTML = `
        <img src="images/restfront.jpg" alt="Demo Thai Restaurant" class="restaurant-image" loading="lazy" 
             onerror="this.src='https://via.placeholder.com/300x200?text=Thai+Restaurant'">
        <div class="restaurant-content">
            <h3 class="restaurant-name">Thai Delight Demo</h3>
            <p class="restaurant-address">123 Pattaya Beach Road, Thailand</p>
            <a href="https://1891swe.github.io/eat/thai/thai.html" class="view-menu-btn">View Menu</a>
        </div>
    `;
    
    restaurantList.appendChild(restaurantCard);
    
    // Add touch feedback to elements
    addTouchFeedback('.restaurant-card, .header-pricing-box, .step-card, .feature-card');
    
    // Add active state for buttons
    addActiveState('.contact-button, .view-menu-btn');
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Add lazy loading for images
    document.querySelectorAll('img').forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
    
    // Handle offline mode
    window.addEventListener('online', function() {
        document.body.classList.remove('offline');
        if (document.querySelector('.offline-message')) {
            document.querySelector('.offline-message').remove();
        }
    });

    window.addEventListener('offline', function() {
        document.body.classList.add('offline');
        
        if (!document.querySelector('.offline-message')) {
            const offlineMessage = document.createElement('div');
            offlineMessage.className = 'offline-message';
            offlineMessage.style.position = 'fixed';
            offlineMessage.style.bottom = '20px';
            offlineMessage.style.left = '50%';
            offlineMessage.style.transform = 'translateX(-50%)';
            offlineMessage.style.backgroundColor = 'rgba(0,0,0,0.8)';
            offlineMessage.style.color = 'white';
            offlineMessage.style.padding = '10px 20px';
            offlineMessage.style.borderRadius = '20px';
            offlineMessage.style.zIndex = '9999';
            offlineMessage.innerHTML = '<i class="fas fa-wifi" style="margin-right: 8px;"></i> You are currently offline';
            document.body.appendChild(offlineMessage);
        }
    });
    
    // Detect orientation changes for responsive layout
    window.addEventListener('orientationchange', function() {
        // Force recalculation of layout after orientation change
        setTimeout(() => {
            resizeCards();
        }, 300);
    });
    
    // Handle resize events for responsive card layouts
    window.addEventListener('resize', debounce(resizeCards, 250));
    
    // Initialize any special layouts
    resizeCards();
    
    // Hide loading indicator when everything is loaded
    hideLoadingIndicator();
});

// Add touch feedback to elements
function addTouchFeedback(selector) {
    document.querySelectorAll(selector).forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
}

// Add active state for buttons
function addActiveState(selector) {
    document.querySelectorAll(selector).forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('btn-active');
        }, { passive: true });
        
        button.addEventListener('touchend', function() {
            this.classList.remove('btn-active');
        }, { passive: true });
    });
}

// Resize cards for responsive layout
function resizeCards() {
    const cards = document.querySelectorAll('.restaurant-card, .feature-card, .step-card');
    if (cards.length === 0) return;
    
    // Adjust card heights for uniform appearance on mobile
    const isMobile = window.innerWidth <= 768;
    
    cards.forEach(card => {
        // Reset heights for recalculation
        card.style.height = '';
    });
    
    if (!isMobile) {
        // On larger screens, get the tallest card in each row
        const getRowCards = () => {
            const rows = {};
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const rowKey = Math.floor(rect.top);
                if (!rows[rowKey]) rows[rowKey] = [];
                rows[rowKey].push(card);
            });
            return Object.values(rows);
        };
        
        const rowCards = getRowCards();
        rowCards.forEach(row => {
            let maxHeight = 0;
            row.forEach(card => {
                maxHeight = Math.max(maxHeight, card.offsetHeight);
            });
            row.forEach(card => {
                card.style.height = `${maxHeight}px`;
            });
        });
    }
}

// Debounce function to limit rapid-firing events
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Hide loading indicator
function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.opacity = '0';
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
        }, 300);
    }
}
