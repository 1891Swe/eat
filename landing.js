document.addEventListener('DOMContentLoaded', async () => {
    // Just one demo restaurant
    const restaurants = [
        {
            id: 'rest1',
            name: 'Thai food',
            address: 'Second Road, Pattaya City',
            image: 'images/thairestdemo.jpg',
            cuisine: 'Traditional Thai Food'
        }
    ];

    const restaurantListElement = document.getElementById('restaurant-list');

    // Populate restaurant cards with animation
    restaurants.forEach((restaurant, index) => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        
        // Use placeholder image if restaurant image doesn't load
        let imageContent = `
            <img 
                src="${restaurant.image}" 
                alt="${restaurant.name}" 
                class="restaurant-image"
                onerror="this.src='images/placeholder-restaurant.jpg'">
        `;
        
        card.innerHTML = `
            ${imageContent}
            <div class="restaurant-content">
                <h3 class="restaurant-name">${restaurant.name}</h3>
                <p class="restaurant-address">${restaurant.address}</p>
                <p>Cuisine: ${restaurant.cuisine}</p>
                <button class="view-menu-btn" data-restaurant-id="${restaurant.id}">View Menu</button>
            </div>
        `;
        
        // Add fade-in and slide-up animation
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
        }, 100 * index);
        
        restaurantListElement.appendChild(card);
        
        // Add click event to navigate to the restaurant menu page
        const viewMenuBtn = card.querySelector('.view-menu-btn');
        viewMenuBtn.addEventListener('click', () => {
            window.location.href = `index.html?id=${restaurant.id}`;
        });
        
        // Make entire card clickable
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('view-menu-btn')) {
                window.location.href = `index.html?id=${restaurant.id}`;
            }
        });
    });

    // Animate welcome title with a typing effect
    const welcomeTitle = document.getElementById('welcome-title');
    const titleText = welcomeTitle.textContent;
    welcomeTitle.textContent = '';
    welcomeTitle.style.opacity = 1;
    
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < titleText.length) {
            welcomeTitle.textContent += titleText.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 50);

    // Add scroll reveal animation to feature cards and step cards
    const animatedElements = document.querySelectorAll('.feature-card, .step-card, .mobile-friendly');
    
    const options = {
        threshold: 0.2
    };
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    animatedElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.5s ease';
        observer.observe(element);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
