document.addEventListener('DOMContentLoaded', async () => {
    let config = {};

    try {
        // Get restaurant ID from URL parameter or default to 'rest1'
        const urlParams = new URLSearchParams(window.location.search);
        const restaurantId = urlParams.get('id') || 'rest1';
        
        // Load restaurant configuration
        const response = await fetch(`restaurants/${restaurantId}.json`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        config = await response.json();
        
        // Update restaurant name with fade-in effect
        const restaurantName = document.getElementById('restaurant-name');
        restaurantName.textContent = config.restaurantName;
        restaurantName.style.opacity = 0;
        requestAnimationFrame(() => {
            restaurantName.style.transition = 'opacity 0.5s ease';
            restaurantName.style.opacity = 1;
        });
    } catch (error) {
        console.error('Error loading configuration:', error);
        document.querySelector('.menu-container').innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #dc3545;">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">Unable to load menu data</p>
                <p style="color: #6c757d;">Please try again later</p>
            </div>
        `;
        return;
    }

    const categoryLinks = document.querySelectorAll('.category-nav a');
    const menuItemsContainer = document.getElementById('menu-items');

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
                items.forEach((item, index) => {
                    const menuItem = document.createElement('div');
                    menuItem.className = 'menu-item';
                    
                    let imageContent;
                    if (item.image) {
                        imageContent = `
                            <div class="image-container">
                                <img src="${item.image}" alt="${item.name}" 
                                     onerror="this.parentElement.innerHTML='<div class=\'placeholder-image\'><i class=\'fas fa-utensils\'></i></div>'">
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
                            <p class="menu-item-price">${config.currency}${item.price}</p>
                        </div>
                    `;

                    menuItem.style.opacity = 0;
                    menuItem.style.transform = 'translateY(20px)';
                    menuItemsContainer.appendChild(menuItem);
                    
                    requestAnimationFrame(() => {
                        menuItem.style.transition = 'all 0.3s ease';
                        menuItem.style.transitionDelay = `${index * 0.1}s`;
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

    // Display initial category
    displayMenuItems('special');
});
