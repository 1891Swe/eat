document.addEventListener('DOMContentLoaded', async function() {
    // Get restaurant from URL parameter or default to "thai"
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('restaurant') || 'thai';
    
    // Set restaurant name element
    const restaurantNameEl = document.getElementById('restaurant-name');
    const openingHoursEl = document.getElementById('opening-hours');
    
    let config;
    
    try {
        console.log('Attempting to fetch configuration:', `${restaurantId}.json`);
        console.log('Current URL:', window.location.href);
        console.log('Current directory:', window.location.pathname);
        
        // Make sure to hide loading indicator even if there's an error
        setTimeout(hideLoadingIndicator, 2000); // Fallback timeout
        
        // Detailed fetch with error handling
        const response = await fetch(`${restaurantId}.json`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Fetch Response:', response);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
        }
        
        config = await response.json();
        console.log('JSON Parsed Successfully:', config);
        
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
        
        // Rest of your existing code for category links and menu items...
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
                    const fragment = document.createDocumentFragment();
                    
                    items.forEach((item, index) => {
                        const menuItem = document.createElement('div');
                        menuItem.className = 'menu-item';
                        
                        let imageContent;
                        if (item.image) {
                            imageContent = `
                                <div class="image-container">
                                    <img src="${item.image}" alt="${item.name}" loading="lazy" 
                                         onerror="console.error('Failed to load image:', '${item.image}'); 
                                                  this.onerror=null; 
                                                  this.src='./images/placeholder-image.jpg'; 
                                                  this.alt='Image not found';">
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
                    
                    // Animate items into view
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

        // Load initial category
        displayMenuItems('special');
        
        // Hide the loading indicator after success
        hideLoadingIndicator();
        
    } catch (error) {
        console.error('Detailed Error Loading Configuration:', error);
        
        // More detailed error display
        document.querySelector('.menu-container').innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #dc3545;">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">Unable to load menu data</p>
                <p style="color: #6c757d;">Error Details: ${error.message}</p>
                <p style="font-size: 0.9rem; color: #6c757d;">Please check file paths and network connection</p>
            </div>
        `;
        
        // Ensure loading indicator is hidden even in case of error
        hideLoadingIndicator();
        return;
    }
});

// Hide loading indicator function
function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.opacity = '0';
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
        }, 300);
    }
}
