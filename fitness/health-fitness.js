document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Initialize all calculators
    initBMICalculator();
    initBodyFatCalculator();
    initCalorieCalculator();
    initHeartRateCalculator();

    // Add event listeners for tab links in the footer
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            const tabButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
            if (tabButton) {
                tabButton.click();
                // Scroll to the tab container
                document.querySelector('.tab-container').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Track events - mock function for analytics implementation
    function trackEvent(eventName, params) {
        // This would connect to analytics in a real implementation
        console.log(`Event tracked: ${eventName}`, params);
    }

    // BMI Calculator
    function initBMICalculator() {
        const heightInput = document.getElementById('bmi-height');
        const heightUnit = document.getElementById('bmi-height-unit');
        const inchesContainer = document.getElementById('height-inches-container');
        const inchesInput = document.getElementById('bmi-inches');
        const weightInput = document.getElementById('bmi-weight');
        const weightUnit = document.getElementById('bmi-weight-unit');
        const calculateBtn = document.getElementById('calculate-bmi');
        const bmiResult = document.getElementById('bmi-result');
        const bmiCategory = document.getElementById('bmi-category');
        const bmiIndicator = document.getElementById('bmi-indicator');

        // Toggle inches input visibility when height unit changes
        heightUnit.addEventListener('change', () => {
            if (heightUnit.value === 'ft') {
                inchesContainer.classList.remove('hidden');
                // Convert cm to feet and inches
                if (heightInput.value) {
                    const cm = parseFloat(heightInput.value);
                    const totalInches = cm / 2.54;
                    const feet = Math.floor(totalInches / 12);
                    const inches = Math.round(totalInches % 12);
                    heightInput.value = feet;
                    inchesInput.value = inches;
                }
            } else {
                inchesContainer.classList.add('hidden');
                // Convert feet and inches to cm
                if (heightInput.value) {
                    const feet = parseFloat(heightInput.value);
                    const inches = parseFloat(inchesInput.value) || 0;
                    const cm = Math.round((feet * 12 + inches) * 2.54);
                    heightInput.value = cm;
                }
            }
        });

        // Calculate BMI
        calculateBtn.addEventListener('click', calculateBMI);
        
        // Also calculate on input change for responsive feel
        [heightInput, inchesInput, weightInput, heightUnit, weightUnit].forEach(el => {
            el.addEventListener('change', calculateBMI);
        });

        function calculateBMI() {
            // Get height in meters
            let heightInMeters;
            if (heightUnit.value === 'cm') {
                heightInMeters = parseFloat(heightInput.value) / 100;
            } else {
                const feet = parseFloat(heightInput.value);
                const inches = parseFloat(inchesInput.value) || 0;
                const totalInches = feet * 12 + inches;
                heightInMeters = totalInches * 0.0254;
            }

            // Get weight in kg
            let weightInKg;
            if (weightUnit.value === 'kg') {
                weightInKg = parseFloat(weightInput.value);
            } else {
                weightInKg = parseFloat(weightInput.value) * 0.453592;
            }

            // Calculate BMI
            const bmi = weightInKg / (heightInMeters * heightInMeters);
            
            // Update result
            if (!isNaN(bmi) && bmi > 0) {
                bmiResult.textContent = bmi.toFixed(1);
                
                // Update category and indicator
                let category;
                let indicatorPosition;
                
                if (bmi < 16.5) {
                    category = "Severely Underweight";
                    indicatorPosition = 0;
                } else if (bmi < 18.5) {
                    category = "Underweight";
                    indicatorPosition = (bmi - 16.5) / (18.5 - 16.5) * 10;
                } else if (bmi < 25) {
                    category = "Normal Weight";
                    indicatorPosition = 10 + (bmi - 18.5) / (25 - 18.5) * 32.5;
                } else if (bmi < 30) {
                    category = "Overweight";
                    indicatorPosition = 42.5 + (bmi - 25) / (30 - 25) * 25;
                } else if (bmi < 40) {
                    category = "Obese";
                    indicatorPosition = 67.5 + (bmi - 30) / (40 - 30) * 32.5;
                } else {
                    category = "Severely Obese";
                    indicatorPosition = 100;
                }
                
                bmiCategory.textContent = category;
                bmiIndicator.style.left = `${indicatorPosition}%`;
                
                // Track the calculation
                trackEvent('bmi_calculated', { 
                    bmi: bmi.toFixed(1), 
                    category: category 
                });
            }
        }

        // Initialize with default values
        calculateBMI();
    }

    // Body Fat Calculator
    function initBodyFatCalculator() {
        const genderMale = document.getElementById('bodyfat-male');
        const genderFemale = document.getElementById('bodyfat-female');
        const ageInput = document.getElementById('bodyfat-age');
        const heightInput = document.getElementById('bodyfat-height');
        const heightUnit = document.getElementById('bodyfat-height-unit');
        const inchesContainer = document.getElementById('bodyfat-inches-container');
        const inchesInput = document.getElementById('bodyfat-inches');
        const weightInput = document.getElementById('bodyfat-weight');
        const weightUnit = document.getElementById('bodyfat-weight-unit');
        const neckInput = document.getElementById('bodyfat-neck');
        const waistInput = document.getElementById('bodyfat-waist');
        const hipInput = document.getElementById('bodyfat-hip');
        const hipGroup = document.getElementById('hip-measurement-group');
        const measurementUnit = document.getElementById('bodyfat-measurement-unit');
        const calculateBtn = document.getElementById('calculate-bodyfat');
        const bodyfatResult = document.getElementById('bodyfat-result');
        const bodyfatCategory = document.getElementById('bodyfat-category');
        const bodyfatIndicator = document.getElementById('bodyfat-indicator');
        const silhouette = document.getElementById('silhouette');

        // Toggle hip measurement visibility based on gender
        genderMale.addEventListener('change', () => {
            if (genderMale.checked) {
                hipGroup.classList.add('hidden');
                silhouette.classList.remove('female');
                silhouette.classList.add('male');
            }
        });

        genderFemale.addEventListener('change', () => {
            if (genderFemale.checked) {
                hipGroup.classList.remove('hidden');
                silhouette.classList.remove('male');
                silhouette.classList.add('female');
            }
        });

        // Toggle inches input visibility when height unit changes
        heightUnit.addEventListener('change', () => {
            if (heightUnit.value === 'ft') {
                inchesContainer.classList.remove('hidden');
                // Convert cm to feet and inches
                if (heightInput.value) {
                    const cm = parseFloat(heightInput.value);
                    const totalInches = cm / 2.54;
                    const feet = Math.floor(totalInches / 12);
                    const inches = Math.round(totalInches % 12);
                    heightInput.value = feet;
                    inchesInput.value = inches;
                }
            } else {
                inchesContainer.classList.add('hidden');
                // Convert feet and inches to cm
                if (heightInput.value) {
                    const feet = parseFloat(heightInput.value);
                    const inches = parseFloat(inchesInput.value) || 0;
                    const cm = Math.round((feet * 12 + inches) * 2.54);
                    heightInput.value = cm;
                }
            }
        });

        // Handle measurement unit changes
        measurementUnit.addEventListener('change', () => {
            const unit = measurementUnit.value;
            document.querySelectorAll('.measurement-unit').forEach(el => {
                el.textContent = unit;
            });

            // Convert values
            if (unit === 'in') {
                // Convert cm to inches
                if (neckInput.value) neckInput.value = (parseFloat(neckInput.value) / 2.54).toFixed(1);
                if (waistInput.value) waistInput.value = (parseFloat(waistInput.value) / 2.54).toFixed(1);
                if (hipInput.value) hipInput.value = (parseFloat(hipInput.value) / 2.54).toFixed(1);
            } else {
                // Convert inches to cm
                if (neckInput.value) neckInput.value = (parseFloat(neckInput.value) * 2.54).toFixed(1);
                if (waistInput.value) waistInput.value = (parseFloat(waistInput.value) * 2.54).toFixed(1);
                if (hipInput.value) hipInput.value = (parseFloat(hipInput.value) * 2.54).toFixed(1);
            }
        });

        // Calculate Body Fat Percentage
        calculateBtn.addEventListener('click', calculateBodyFat);

        // Also calculate on input change for responsive feel
        [genderMale, genderFemale, ageInput, heightInput, inchesInput, weightInput, 
         neckInput, waistInput, hipInput, heightUnit, weightUnit, measurementUnit].forEach(el => {
            if (el) {
                el.addEventListener('change', calculateBodyFat);
            }
        });

        function calculateBodyFat() {
            // Get measurements in the correct units
            let neckCircumference, waistCircumference, hipCircumference;
            
            if (measurementUnit.value === 'cm') {
                neckCircumference = parseFloat(neckInput.value) / 2.54; // Convert to inches for formula
                waistCircumference = parseFloat(waistInput.value) / 2.54;
                hipCircumference = genderFemale.checked ? parseFloat(hipInput.value) / 2.54 : 0;
            } else {
                neckCircumference = parseFloat(neckInput.value);
                waistCircumference = parseFloat(waistInput.value);
                hipCircumference = genderFemale.checked ? parseFloat(hipInput.value) : 0;
            }

            // Get height in inches
            let heightInInches;
            if (
