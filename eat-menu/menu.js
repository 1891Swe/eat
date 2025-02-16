document.addEventListener('DOMContentLoaded', async () => {
    let config = {};

    try {
        // Get restaurant ID from URL parameter or default to 'greatest-restaurant'
        const urlParams = new URLSearchParams(window.location.search);
        const restaurantId = urlParams.get('id') || 'greatest-restaurant';
        
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

    // Update the navigation links to include food subcategories
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
        
        // Clear container with fade-out effect
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
                    
                    // Update image path to use restaurant-specific folder
                    const imagePath = item.image ?
                        item.image.replace('images/', `images/${urlParams.get('id') || 'greatest-restaurant'}/`) :
                        null;
                    
                    const imageContent = imagePath
                        ? `<img src="${imagePath}" alt="${item.name}" onerror="this.style.display='none'">`
                        : `<div class="placeholder-image"></div>`;

                    menuItem.innerHTML = `
                        ${imageContent}
                        <div class="menu-item-content">
                            <h3 class="menu-item-title">${item.name}</h3>
                            <p class="menu-item-description">${item.description}</p>
                            <p class="menu-item-price">${config.currency}${item.price}</p>
                        </div>
                    `;

                    // Add stagger effect to items
                    menuItem.style.opacity = 0;
                    menuItem.style.transform = 'translateY(20px)';
                    
                    menuItemsContainer.appendChild(menuItem);
                    
                    // Trigger animation
                    requestAnimationFrame(() => {
                        menuItem.style.transition = 'all 0.3s ease';
                        menuItem.style.transitionDelay = `${index * 0.1}s`;
                        menuItem.style.opacity = 1;
                        menuItem.style.transform = 'translateY(0)';
                    });
                });
            }
            
            // Fade in container
            requestAnimationFrame(() => {
                menuItemsContainer.style.transition = 'opacity 0.3s ease';
                menuItemsContainer.style.opacity = 1;
            });
        }, 300);
    }

    // Display initial category
    displayMenuItems('special');
});
