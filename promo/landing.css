document.addEventListener('DOMContentLoaded', function() {
    // Load demo restaurant
    const restaurantList = document.getElementById('restaurant-list');
    
    // Create a demo restaurant card
    const restaurantCard = document.createElement('div');
    restaurantCard.className = 'restaurant-card';
    
    restaurantCard.innerHTML = `
        <img src="../restaurants/images/demorest.jpg" alt="Demo Thai Restaurant" class="restaurant-image" onerror="this.src='https://via.placeholder.com/300x200?text=Thai+Restaurant'">
        <div class="restaurant-content">
            <h3 class="restaurant-name">Thai Delight Demo</h3>
            <p class="restaurant-address">123 Pattaya Beach Road, Thailand</p>
            <a href="../restaurants/demorest.html" class="view-menu-btn">View Menu</a>
        </div>
    `;
    
    restaurantList.appendChild(restaurantCard);
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
