document.addEventListener('DOMContentLoaded', function() {
    // DOM elements - Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const caloriesPanel = document.getElementById('calories-panel');
    const bmiPanel = document.getElementById('bmi-panel');
    
    // DOM elements - Calorie Calculator
    const calorieForm = document.getElementById('calorie-form');
    const ageInput = document.getElementById('age');
    const genderMale = document.getElementById('male');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const activitySelect = document.getElementById('activity');
    const goalSelect = document.getElementById('goal');
    const bmrValue = document.getElementById('bmr-value');
    const maintenanceValue = document.getElementById('maintenance-value');
    const recommendedValue = document.getElementById('recommended-value');
    const goalDescription = document.getElementById('goal-description');
    const proteinValue = document.getElementById('protein-value');
    const proteinPercentage = document.getElementById('protein-percentage');
    const carbsValue = document.getElementById('carbs-value');
    const carbsPercentage = document.getElementById('carbs-percentage');
    const fatValue = document.getElementById('fat-value');
    const fatPercentage = document.getElementById('fat-percentage');
    
    // DOM elements - BMI Calculator
    const bmiForm = document.getElementById('bmi-form');
    const bmiHeightInput = document.getElementById('bmi-height');
    const bmiWeightInput = document.getElementById('bmi-weight');
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    const bmiMarker = document.getElementById('bmi-marker');
    
    // Tab functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding panel
            const tabName = button.getAttribute('data-tab');
            if (tabName === 'calories') {
                caloriesPanel.classList.add('active');
                bmiPanel.classList.remove('active');
            } else if (tabName === 'bmi') {
                bmiPanel.classList.add('active');
                caloriesPanel.classList.remove('active');
            }
        });
    });
    
    // Calorie calculator form submission
    calorieForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateCalories();
    });
    
    // BMI calculator form submission
    bmiForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateBMI();
    });
    
    // Copy height and weight between forms for convenience
    heightInput.addEventListener('input', function() {
        bmiHeightInput.value = this.value;
    });
    
    weightInput.addEventListener('input', function() {
        bmiWeightInput.value = this.value;
    });
    
    bmiHeightInput.addEventListener('input', function() {
        heightInput.value = this.value;
    });
    
    bmiWeightInput.addEventListener('input', function() {
        weightInput.value = this.value;
    });
    
    // Calorie calculation function
    function calculateCalories() {
        // Get form values
        const age = parseInt(ageInput.value);
        const isMale = genderMale.checked;
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);
        const activityFactor = parseFloat(activitySelect.value);
        const goal = goalSelect.value;
        
        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr;
        if (isMale) {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        
        // Calculate TDEE (Total Daily Energy Expenditure)
        const tdee = bmr * activityFactor;
        
        // Calculate calories based on goal
        let goalCalories;
        let goalText;
        
        switch (goal) {
            case 'mildLoss':
                goalCalories = tdee - 250;
                goalText = 'Mild weight loss (0.25 kg/week)';
                break;
            case 'loss':
                goalCalories = tdee - 500;
                goalText = 'Weight loss (0.5 kg/week)';
                break;
            case 'extremeLoss':
                goalCalories = tdee - 1000;
                goalText = 'Extreme weight loss (1 kg/week)';
                break;
            case 'mildGain':
                goalCalories = tdee + 250;
                goalText = 'Mild weight gain (0.25 kg/week)';
                break;
            case 'gain':
                goalCalories = tdee + 500;
                goalText = 'Weight gain (0.5 kg/week)';
                break;
            default: // maintain
                goalCalories = tdee;
                goalText = 'Maintain current weight';
        }
        
        // Calculate macronutrients
        let proteinGrams, carbsGrams, fatGrams;
        
        // Different macro distributions based on goals
        if (goal.includes('Loss')) {
            // Higher protein for weight loss (30% protein, 35% carbs, 35% fat)
            proteinGrams = (goalCalories * 0.30) / 4;
            carbsGrams = (goalCalories * 0.35) / 4;
            fatGrams = (goalCalories * 0.35) / 9;
        } else if (goal.includes('Gain')) {
            // Higher carbs for weight gain (25% protein, 50% carbs, 25% fat)
            proteinGrams = (goalCalories * 0.25) / 4;
            carbsGrams = (goalCalories * 0.50) / 4;
            fatGrams = (goalCalories * 0.25) / 9;
        } else {
            // Balanced for maintenance (25% protein, 45% carbs, 30% fat)
            proteinGrams = (goalCalories * 0.25) / 4;
            carbsGrams = (goalCalories * 0.45) / 4;
            fatGrams = (goalCalories * 0.30) / 9;
        }
        
        // Update the UI with results
        bmrValue.textContent = Math.round(bmr) + ' kcal';
        maintenanceValue.textContent = Math.round(tdee) + ' kcal';
        recommendedValue.textContent = Math.round(goalCalories) + ' kcal';
        goalDescription.textContent = goalText;
        
        // Update macros
        proteinValue.textContent = Math.round(proteinGrams) + 'g';
        proteinPercentage.textContent = '30%';
        carbsValue.textContent = Math.round(carbsGrams) + 'g';
        carbsPercentage.textContent = goal.includes('Loss') ? '35%' : (goal.includes('Gain') ? '50%' : '45%');
        fatValue.textContent = Math.round(fatGrams) + 'g';
        fatPercentage.textContent = goal.includes('Loss') ? '35%' : (goal.includes('Gain') ? '25%' : '30%');
        
        // Scroll to results
        document.getElementById('calorie-results').scrollIntoView({ behavior: 'smooth' });
    }
    
    // BMI calculation function
    function calculateBMI() {
        // Get form values
        const height = parseFloat(bmiHeightInput.value) / 100; // Convert cm to meters
        const weight = parseFloat(bmiWeightInput.value);
        
        // Calculate BMI
        const bmi = weight / (height * height);
        
        // Determine BMI category
        let category;
        let markerPosition;
        let categoryClass;
        
        if (bmi < 18.5) {
            category = 'Underweight';
            categoryClass = 'underweight';
            markerPosition = (bmi / 40) * 100; // Position as percentage of scale
        } else if (bmi < 25) {
            category = 'Normal Weight';
            categoryClass = 'normal';
            markerPosition = (bmi / 40) * 100;
        } else if (bmi < 30) {
            category = 'Overweight';
            categoryClass = 'overweight';
            markerPosition = (bmi / 40) * 100;
        } else {
            category = 'Obese';
            categoryClass = 'obese';
            markerPosition = Math.min((bmi / 40) * 100, 95); // Cap at 95% for very high BMIs
        }
        
        // Update the UI with results
        bmiValue.textContent = bmi.toFixed(1);
        bmiCategory.textContent = category;
        bmiCategory.className = 'bmi-category ' + categoryClass;
        
        // Position the marker
        bmiMarker.style.left = markerPosition + '%';
        
        // Scroll to results
        document.getElementById('bmi-results').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Initialize the page with some sample calculations
    function setInitialValues() {
        // Set default values for the calorie calculator
        ageInput.value = '30';
        heightInput.value = '175';
        weightInput.value = '70';
        
        // Set the same default values for BMI calculator
        bmiHeightInput.value = '175';
        bmiWeightInput.value = '70';
    }
    
    // Call the initialization function
    setInitialValues();
});
