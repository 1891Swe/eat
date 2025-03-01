document.addEventListener('DOMContentLoaded', function() {
    // Toggle pricing boxes when clicking the Price button
    const priceBtn = document.getElementById('price-btn');
    const pricingBoxes = document.getElementById('pricing-boxes');
    
    priceBtn.addEventListener('click', function() {
        pricingBoxes.classList.toggle('show');
    });
    
    // Close pricing boxes when clicking outside
    document.addEventListener('click', function(event) {
        if (!priceBtn.contains(event.target) && !pricingBoxes.contains(event.target)) {
            pricingBoxes.classList.remove('show');
        }
    });

    // Add the restaurant demo
    const restaurantList = document.getElementById('restaurant-list');
    
    // Create restaurant demo
    const restaurantDemo = document.createElement('div');
    restaurantDemo.innerHTML = `
        <h3>Thai food</h3>
        <p>Second Road, Pattaya City</p>
        <p>Cuisine: Traditional Thai Food</p>
        <button id="view-menu-btn">View Menu</button>
    `;
    
    restaurantList.appendChild(restaurantDemo);
    
    // Add click event to view menu button
    document.getElementById('view-menu-btn').addEventListener('click', function() {
        window.location.href = 'index.html?id=rest1';
    });
});
