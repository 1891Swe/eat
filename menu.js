// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the menu
    initializeMenu();
    
    // Add smooth scrolling
    setupSmoothScrolling();
    
    // Add image lazy loading
    setupLazyLoading();
});

/**
 * Initialize the menu functionality
 */
function initializeMenu() {
    // Get all navigation buttons
    const navButtons = document.querySelectorAll('.category-nav a');
    
    // Add click event listeners to each button
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the category from the button's href attribute
            const category = this.getAttribute('href').substring(1);
            
            // Show the selected category
            showCategory(category);
            
            // Update active state on buttons
            updateActiveButton(this);
        });
    });
    
    // If there's a hash in URL, show that category
    if (window.location.hash) {
        const category = window.location.hash.substring(1);
        const categoryElement = document.getElementById(category);
        
        if (categoryElement) {
            showCategory(category);
            
            // Find and update the active button
            const button = document.querySelector(`.category-nav a[href="#${category}"]`);
            if (button) {
                updateActiveButton(button);
            }
        }
    }
}

/**
 * Show the selected category and hide others
 * @param {string} categoryId - The ID of the category to show
 */
function showCategory(categoryId) {
    // Hide all categories
    const allCategories = document.querySelectorAll('.menu-container > div');
    allCategories.forEach(category => {
        category.style.display = 'none';
    });
    
    // Show the selected category
    const selectedCategory = document.getElementById(categoryId);
    if (selectedCategory) {
        selectedCategory.style.display = 'grid';
        
        // Add a small animation
        selectedCategory.style.opacity = '0';
        selectedCategory.style.transform = 'translateY(20px)';
        
        // Force reflow
        void selectedCategory.offsetWidth;
        
        // Animate in
        selectedCategory.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        selectedCategory.style.opacity = '1';
        selectedCategory.style.transform = 'translateY(0)';
    }
    
    // Update URL hash without scrolling
    updateUrlHash(categoryId);
}

/**
 * Update the active state of navigation buttons
 * @param {Element} activeButton - The button to set as active
 */
function updateActiveButton(activeButton) {
    // Remove active class from all buttons
    const allButtons = document.querySelectorAll('.category-nav a');
    allButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to the clicked button
    activeButton.classList.add('active');
}

/**
 * Update URL hash without scrolling
 * @param {string} hash - The hash to set in the URL
 */
function updateUrlHash(hash) {
    // Save current scroll position
    const scrollPosition = window.scrollY;
    
    // Update URL
    window.location.hash = hash;
    
    // Restore scroll position
    window.scrollTo(0, scrollPosition);
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Only handle category navigation in the nav section
            if (!this.closest('.category-nav')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100, // Adjust for header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Setup lazy loading for images
 */
function setupLazyLoading() {
    // Check if Intersection Observer API is available
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        // Get all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

/**
 * Toggle mobile menu visibility
 */
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

/**
 * Initialize special offers display
 */
function initializeSpecialOffers() {
    const specialOffers = document.querySelector('.special-offers');
    if (specialOffers) {
        // Set up automatic carousel if multiple offers
        const offers = specialOffers.querySelectorAll('.offer');
        if (offers.length > 1) {
            let currentOffer = 0;
            
            // Function to show next offer
            function showNextOffer() {
                offers.forEach(offer => offer.classList.remove('active'));
                currentOffer = (currentOffer + 1) % offers.length;
                offers[currentOffer].classList.add('active');
            }
            
            // Initialize the first offer as active
            offers[0].classList.add('active');
            
            // Set interval for rotation
            setInterval(showNextOffer, 5000);
        }
    }
}
