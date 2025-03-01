document.addEventListener('DOMContentLoaded', async function() {
    // Get restaurant from URL parameter or default to "rest1"
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('restaurant') || 'thai';
    
    // Set restaurant name element
    const restaurantNameEl = document.getElementById('restaurant-name');
    const openingHoursEl = document.getElementById('opening-hours');
    
    let config;
    
    try {
        // Load restaurant configuration
        const response = await fetch(`restaurants/${restaurantId}.json`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        config = await response.json();
        
        // Update restaurant name with fade-in effect
        restaurantNameEl.textContent = config.restaurantName;
        restaurantNameEl.style.opacity = 0;
        requestAnimationFrame(() => {
            restaurantNameEl.style.transition = 'opacity 0.5s ease';
            restaurantNameEl.style.opacity = 1;
        });
        
        // Update opening hours if available
        if (config.openingHours) {
            openingHoursEl.textContent = config.openingHours;
        }
    } catch (error) {
        console.error('Error loading configuration:', error);
        document.querySelector('.menu-container').innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #dc3545;">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">Unable to load menu data</p>
                <p style="color: #6c757d;">Please try again later</p>
            </div>
        `;
        hideLoadingIndicator();
        return;
    }

    const categoryLinks = document.querySelectorAll('.category-nav a');
    const menuItemsContainer = document.getElementById('menu-items');

    // Add touch target size for better mobile experience
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const category = link.dataset.category;
            displayMenuItems(category);
            
            // Preload next category images for faster navigation
            const currentIndex = Array.from(categoryLinks).findIndex(l => l === link);
            const nextLink = categoryLinks[(currentIndex + 1) % categoryLinks.length];
            if (nextLink) {
                preloadCategoryImages(nextLink.dataset.category);
            }
        });
    });

    function displayMenuItems(category) {
        const items = config.categories?.[category] || [];
        menuItemsContainer.style.opacity = 0;
        
        setTimeout(() => {
            menuItemsContainer.innerHTML = '';

            if (items.length === 0) {
                menuItemsContainer.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #6c757d;">
                        <i class="fas fa-utensils" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                        <p>No items available in this category</p>
                    </div>
                `;
            } else {
                // Create fragment for better performance
                const fragment = document.createDocumentFragment();
                
                items.forEach((item, index) => {
                    const menuItem = document.createElement('div');
                    menuItem.className = 'menu-item';
                    
                    let imageContent;
                    if (item.image) {
                        imageContent = `
                            <div class="image-container">
                                <img src="${item.image}" alt="${item.name}" loading="lazy" 
                                     onerror="this.parentElement.innerHTML='<div class=\\'placeholder-image\\'><i class=\\'fas fa-utensils\\'></i></div>'">
                            </div>`;
                    } else {
                        imageContent = `
                            <div class="image-container">
                                <div class="placeholder-image">
                                    <i class="fas fa-utensils"></i>
                                </div>
                            </div>`;
                    }

                    menuItem.innerHTML = `
                        ${imageContent}
                        <div class="menu-item-content">
                            <h3 class="menu-item-title">${item.name}</h3>
                            <p class="menu-item-description">${item.description}</p>
                            <p class="menu-item-price" data-currency="${config.currency}">${item.price}</p>
                        </div>
                    `;

                    menuItem.style.opacity = 0;
                    menuItem.style.transform = 'translateY(20px)';
                    fragment.appendChild(menuItem);
                });
                
                menuItemsContainer.appendChild(fragment);
                
                // Animate items into view (limit animation delay for better performance on large menus)
                Array.from(menuItemsContainer.children).forEach((menuItem, index) => {
                    requestAnimationFrame(() => {
                        menuItem.style.transition = 'all 0.3s ease';
                        menuItem.style.transitionDelay = `${Math.min(index * 0.1, 0.5)}s`;
                        menuItem.style.opacity = 1;
                        menuItem.style.transform = 'translateY(0)';
                    });
                });
            }
            
            requestAnimationFrame(() => {
                menuItemsContainer.style.transition = 'opacity 0.3s ease';
                menuItemsContainer.style.opacity = 1;
            });
        }, 300);
    }

    // Preload images for better experience
    function preloadCategoryImages(category) {
        const items = config.categories?.[category] || [];
        // Only preload a few images to save bandwidth
        const itemsToPreload = items.slice(0, 3);
        itemsToPreload.forEach(item => {
            if (item.image) {
                const img = new Image();
                img.src = item.image;
            }
        });
    }

    // Add pull-to-refresh functionality
    let touchStartY = 0;
    let touchEndY = 0;
    let isRefreshing = false;

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (window.scrollY === 0 && touchEndY > touchStartY + 100 && !isRefreshing) {
            // Pull down gesture at top of page
            isRefreshing = true;
            const activeCategory = document.querySelector('.category-nav a.active').dataset.category;
            
            // Show refresh indicator
            const refreshIndicator = document.createElement('div');
            refreshIndicator.className = 'refresh-indicator';
            refreshIndicator.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Refreshing...';
            document.body.appendChild(refreshIndicator);
            
            setTimeout(() => {
                displayMenuItems(activeCategory);
                refreshIndicator.remove();
                isRefreshing = false;
            }, 800);
        }
    }

    // Load initial category
    displayMenuItems('special');
    
    // Preload other categories for faster navigation
    setTimeout(() => {
        preloadCategoryImages('meat');
        preloadCategoryImages('beer');
    }, 2000);
    
    // Hide loading indicator
    hideLoadingIndicator();
    
    // Double tap to zoom image on mobile
    menuItemsContainer.addEventListener('click', function(e) {
        const image = e.target.closest('img');
        if (image && image.parentElement.classList.contains('image-container')) {
            // Handle tap on image
            if (image.classList.contains('zoomed')) {
                // Zoom out
                image.style.transform = '';
                image.style.zIndex = '';
                image.classList.remove('zoomed');
            } else {
                // Zoom in
                image.style.transform = 'scale(1.5)';
                image.style.zIndex = '10';
                image.classList.add('zoomed');
            }
        }
    });
});

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

// Handle offline mode gracefully
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

// Detect device orientation changes for responsive layout
window.addEventListener('orientationchange', function() {
    // Force recalculation of layout after orientation change
    setTimeout(() => {
        const activeCategory = document.querySelector('.category-nav a.active').dataset.category;
        if (activeCategory) {
            // Redisplay menu items to adjust layout
            document.querySelector(`[data-category="${activeCategory}"]`).click();
        }
    }, 300);
});
