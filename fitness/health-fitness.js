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
            
            // If it's the index tab, redirect to index page
            if (tabId === 'index') {
                window.location.href = 'index.html';
                return;
            }
            
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
            calculateBMI(); // Recalculate after unit change
        });

        // Calculate BMI
        calculateBtn.addEventListener('click', calculateBMI);
        
        // Also calculate on input change for responsive feel
        [heightInput, weightInput, weightUnit].forEach(el => {
            el.addEventListener('input', calculateBMI);
            el.addEventListener('change', calculateBMI);
        });
        
        if (inchesInput) {
            inchesInput.addEventListener('input', calculateBMI);
            inchesInput.addEventListener('change', calculateBMI);
        }

        function calculateBMI() {
            // Get height in meters
            let heightInMeters;
            if (heightUnit.value === 'cm') {
                heightInMeters = parseFloat(heightInput.value) / 100;
            } else {
                const feet = parseFloat(heightInput.value) || 0;
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
                let categoryColor;
                
                if (bmi < 16.5) {
                    category = "Severely Underweight";
                    indicatorPosition = 0;
                    categoryColor = "#3498db"; // blue
                } else if (bmi < 18.5) {
                    category = "Underweight";
                    indicatorPosition = (bmi - 16.5) / (18.5 - 16.5) * 10;
                    categoryColor = "#3498db"; // blue
                } else if (bmi < 25) {
                    category = "Normal Weight";
                    indicatorPosition = 10 + (bmi - 18.5) / (25 - 18.5) * 32.5;
                    categoryColor = "#2ecc71"; // green
                } else if (bmi < 30) {
                    category = "Overweight";
                    indicatorPosition = 42.5 + (bmi - 25) / (30 - 25) * 25;
                    categoryColor = "#f39c12"; // orange
                } else if (bmi < 40) {
                    category = "Obese";
                    indicatorPosition = 67.5 + (bmi - 30) / (40 - 30) * 32.5;
                    categoryColor = "#e74c3c"; // red
                } else {
                    category = "Severely Obese";
                    indicatorPosition = 100;
                    categoryColor = "#c0392b"; // dark red
                }
                
                bmiCategory.textContent = category;
                bmiCategory.style.backgroundColor = categoryColor;
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
                calculateBodyFat(); // Recalculate
            }
        });

        genderFemale.addEventListener('change', () => {
            if (genderFemale.checked) {
                hipGroup.classList.remove('hidden');
                silhouette.classList.remove('male');
                silhouette.classList.add('female');
                calculateBodyFat(); // Recalculate
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
            calculateBodyFat(); // Recalculate
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
            calculateBodyFat(); // Recalculate
        });

        // Calculate Body Fat Percentage
        calculateBtn.addEventListener('click', calculateBodyFat);

        // Also calculate on input change for responsive feel
        [genderMale, genderFemale, ageInput, heightInput, weightInput, 
         neckInput, waistInput, weightUnit].forEach(el => {
            if (el) {
                el.addEventListener('input', calculateBodyFat);
                el.addEventListener('change', calculateBodyFat);
            }
        });
        
        if (hipInput) {
            hipInput.addEventListener('input', calculateBodyFat);
            hipInput.addEventListener('change', calculateBodyFat);
        }
        
        if (inchesInput) {
            inchesInput.addEventListener('input', calculateBodyFat);
            inchesInput.addEventListener('change', calculateBodyFat);
        }

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
            if (heightUnit.value === 'cm') {
                heightInInches = parseFloat(heightInput.value) / 2.54;
            } else {
                const feet = parseFloat(heightInput.value) || 0;
                const inches = parseFloat(inchesInput.value) || 0;
                heightInInches = feet * 12 + inches;
            }

            // Calculate body fat percentage using Navy method
            let bodyFatPercentage;
            
            if (genderMale.checked) {
                // Men: 86.010 × log10(abdomen - neck) - 70.041 × log10(height) + 36.76
                bodyFatPercentage = 86.010 * Math.log10(waistCircumference - neckCircumference) - 
                                    70.041 * Math.log10(heightInInches) + 36.76;
            } else {
                // Women: 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387
                bodyFatPercentage = 163.205 * Math.log10(waistCircumference + hipCircumference - neckCircumference) - 
                                    97.684 * Math.log10(heightInInches) - 78.387;
            }
            
            // Update result
            if (!isNaN(bodyFatPercentage) && bodyFatPercentage > 0) {
                bodyFatPercentage = Math.max(Math.min(bodyFatPercentage, 60), 2); // Limit range for visualization
                bodyfatResult.textContent = bodyFatPercentage.toFixed(1);
                
                // Update category and indicator
                let category;
                let indicatorPosition;
                let categoryColor;
                
                if (genderMale.checked) {
                    // Men categories
                    if (bodyFatPercentage < 6) {
                        category = "Essential Fat";
                        indicatorPosition = bodyFatPercentage / 6 * 20;
                        categoryColor = "#3498db"; // blue
                    } else if (bodyFatPercentage < 14) {
                        category = "Athletic";
                        indicatorPosition = 20 + (bodyFatPercentage - 6) / 8 * 20;
                        categoryColor = "#2ecc71"; // green
                    } else if (bodyFatPercentage < 18) {
                        category = "Fitness";
                        indicatorPosition = 40 + (bodyFatPercentage - 14) / 4 * 20;
                        categoryColor = "#27ae60"; // darker green
                    } else if (bodyFatPercentage < 25) {
                        category = "Acceptable";
                        indicatorPosition = 60 + (bodyFatPercentage - 18) / 7 * 20;
                        categoryColor = "#f39c12"; // orange
                    } else {
                        category = "Obese";
                        indicatorPosition = 80 + Math.min((bodyFatPercentage - 25) / 15, 1) * 20;
                        categoryColor = "#e74c3c"; // red
                    }
                } else {
                    // Women categories
                    if (bodyFatPercentage < 14) {
                        category = "Essential Fat";
                        indicatorPosition = bodyFatPercentage / 14 * 20;
                        categoryColor = "#3498db"; // blue
                    } else if (bodyFatPercentage < 21) {
                        category = "Athletic";
                        indicatorPosition = 20 + (bodyFatPercentage - 14) / 7 * 20;
                        categoryColor = "#2ecc71"; // green
                    } else if (bodyFatPercentage < 25) {
                        category = "Fitness";
                        indicatorPosition = 40 + (bodyFatPercentage - 21) / 4 * 20;
                        categoryColor = "#27ae60"; // darker green
                    } else if (bodyFatPercentage < 32) {
                        category = "Acceptable";
                        indicatorPosition = 60 + (bodyFatPercentage - 25) / 7 * 20;
                        categoryColor = "#f39c12"; // orange
                    } else {
                        category = "Obese";
                        indicatorPosition = 80 + Math.min((bodyFatPercentage - 32) / 15, 1) * 20;
                        categoryColor = "#e74c3c"; // red
                    }
                }
                
                bodyfatCategory.textContent = category;
                bodyfatCategory.style.backgroundColor = categoryColor;
                bodyfatIndicator.style.top = `${indicatorPosition}%`;
                
                // Track the calculation
                trackEvent('bodyfat_calculated', { 
                    bodyfat: bodyFatPercentage.toFixed(1), 
                    category: category,
                    gender: genderMale.checked ? 'male' : 'female'
                });
            }
        }

        // Initialize with default values
        calculateBodyFat();
    }

    // Calorie Calculator
    function initCalorieCalculator() {
        const genderInputs = document.querySelectorAll('input[name="calories-gender"]');
        const ageInput = document.getElementById('calories-age');
        const heightInput = document.getElementById('calories-height');
        const heightUnit = document.getElementById('calories-height-unit');
        const inchesContainer = document.getElementById('calories-inches-container');
        const inchesInput = document.getElementById('calories-inches');
        const weightInput = document.getElementById('calories-weight');
        const weightUnit = document.getElementById('calories-weight-unit');
        const activityLevel = document.getElementById('activity-level');
        const weightGoal = document.getElementById('weight-goal');
        const calculateBtn = document.getElementById('calculate-calories');
        const bmrResult = document.getElementById('bmr-result');
        const tdeeResult = document.getElementById('tdee-result');
        const targetResult = document.getElementById('target-result');
        const proteinGrams = document.getElementById('protein-grams');
        const proteinCals = document.getElementById('protein-cals');
        const carbsGrams = document.getElementById('carbs-grams');
        const carbsCals = document.getElementById('carbs-cals');
        const fatGrams = document.getElementById('fat-grams');
        const fatCals = document.getElementById('fat-cals');
        const goalDescription = document.querySelector('.calorie-info');

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
            calculateCalories(); // Recalculate
        });

        // Calculate Calories
        calculateBtn.addEventListener('click', calculateCalories);

        // Also calculate on input change for responsive feel
        genderInputs.forEach(input => {
            input.addEventListener('change', calculateCalories);
        });
        
        [ageInput, heightInput, weightInput, activityLevel, weightGoal, weightUnit].forEach(el => {
            if (el) {
                el.addEventListener('input', calculateCalories);
                el.addEventListener('change', calculateCalories);
            }
        });
        
        if (inchesInput) {
            inchesInput.addEventListener('input', calculateCalories);
            inchesInput.addEventListener('change', calculateCalories);
        }

        function calculateCalories() {
            // Get gender
            const isMale = document.querySelector('input[name="calories-gender"][value="male"]').checked;
            
            // Get age
            const age = parseFloat(ageInput.value);
            
            // Get height in cm
            let heightInCm;
            if (heightUnit.value === 'cm') {
                heightInCm = parseFloat(heightInput.value);
            } else {
                const feet = parseFloat(heightInput.value) || 0;
                const inches = parseFloat(inchesInput.value) || 0;
                heightInCm = (feet * 12 + inches) * 2.54;
            }
            
            // Get weight in kg
            let weightInKg;
            if (weightUnit.value === 'kg') {
                weightInKg = parseFloat(weightInput.value);
            } else {
                weightInKg = parseFloat(weightInput.value) * 0.453592;
            }
            
            // Calculate BMR using Mifflin-St Jeor Equation
            let bmr;
            if (isMale) {
                bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
            } else {
                bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
            }
            
            // Calculate TDEE
            const activity = parseFloat(activityLevel.value);
            const tdee = bmr * activity;
            
            // Calculate target calories based on goal
            let targetCalories;
            let goalDescriptionText;
            
            switch (weightGoal.value) {
                case 'maintain':
                    targetCalories = tdee;
                    goalDescriptionText = "maintenance";
                    break;
                case 'mildlose':
                    targetCalories = tdee - 250;
                    goalDescriptionText = "mild weight loss (0.25 kg/week)";
                    break;
                case 'weightlose':
                    targetCalories = tdee - 500;
                    goalDescriptionText = "weight loss (0.5 kg/week)";
                    break;
                case 'extremelose':
                    targetCalories = tdee - 1000;
                    goalDescriptionText = "extreme weight loss (1 kg/week)";
                    break;
                case 'mildgain':
                    targetCalories = tdee + 250;
                    goalDescriptionText = "mild weight gain (0.25 kg/week)";
                    break;
                case 'weightgain':
                    targetCalories = tdee + 500;
                    goalDescriptionText = "weight gain (0.5 kg/week)";
                    break;
                case 'extremegain':
                    targetCalories = tdee + 1000;
                    goalDescriptionText = "fast weight gain (1 kg/week)";
                    break;
            }
            
            // Ensure minimum healthy calories
            const minHealthyCalories = isMale ? 1500 : 1200;
            targetCalories = Math.max(targetCalories, minHealthyCalories);
            
            // Calculate macronutrients (30% protein, 40% carbs, 30% fat)
            const proteinCalories = targetCalories * 0.3;
            const carbCalories = targetCalories * 0.4;
            const fatCalories = targetCalories * 0.3;
            
            const proteinG = Math.round(proteinCalories / 4); // 4 calories per gram of protein
            const carbG = Math.round(carbCalories / 4); // 4 calories per gram of carbs
            const fatG = Math.round(fatCalories / 9); // 9 calories per gram of fat
            
            // Update results
            bmrResult.textContent = Math.round(bmr).toLocaleString();
            tdeeResult.textContent = Math.round(tdee).toLocaleString();
            targetResult.textContent = Math.round(targetCalories).toLocaleString();
            
            proteinGrams.textContent = proteinG;
            proteinCals.textContent = Math.round(proteinCalories);
            carbsGrams.textContent = carbG;
            carbsCals.textContent = Math.round(carbCalories);
            fatGrams.textContent = fatG;
            fatCals.textContent = Math.round(fatCalories);
            
            // Update goal description
            if (goalDescription) {
                goalDescription.textContent = `For your selected goal (${goalDescriptionText})`;
            }
            
            // Track the calculation
            trackEvent('calories_calculated', { 
                bmr: Math.round(bmr),
                tdee: Math.round(tdee),
                target: Math.round(targetCalories),
                goal: weightGoal.value
            });
        }

        // Initialize with default values
        calculateCalories();
    }

    // Heart Rate Zone Calculator
    function initHeartRateCalculator() {
        const ageInput = document.getElementById('heartrate-age');
        const restingHRInput = document.getElementById('resting-hr');
        const hrMethod = document.getElementById('hr-method');
        const calculateBtn = document.getElementById('calculate-hr');
        const maxHRResult = document.getElementById('max-hr-result');
        const zone1Range = document.getElementById('zone1-range');
        const zone2Range = document.getElementById('zone2-range');
        const zone3Range = document.getElementById('zone3-range');
        const zone4Range = document.getElementById('zone4-range');
        const zone5Range = document.getElementById('zone5-range');

        // Calculate Heart Rate Zones
        calculateBtn.addEventListener('click', calculateHeartRateZones);

        // Also calculate on input change for responsive feel
        [ageInput, restingHRInput, hrMethod].forEach(el => {
            if (el) {
                el.addEventListener('input', calculateHeartRateZones);
                el.addEventListener('change', calculateHeartRateZones);
            }
        });

        function calculateHeartRateZones() {
            const age = parseFloat(ageInput.value);
            const restingHR = parseFloat(restingHRInput.value);
            const method = hrMethod.value;
            
            // Calculate max HR based on selected method
            let maxHR;
            switch (method) {
                case 'max':
                    // Standard formula (220 - age)
                    maxHR = 220 - age;
                    break;
                case 'hrr':
                    // Heart Rate Reserve (Karvonen) - first calculate with 220-age
                    maxHR = 220 - age;
                    break;
                case 'tanaka':
                    // Tanaka formula (better for older adults): 208 - (0.7 × age)
                    maxHR = 208 - (0.7 * age);
                    break;
            }
            
            // Calculate zones
            let zone1Low, zone1High, zone2Low, zone2High, zone3Low, zone3High, zone4Low, zone4High, zone5Low, zone5High;
            
            if (method === 'hrr') {
                // Karvonen Formula using Heart Rate Reserve (HRR)
                const hrr = maxHR - restingHR;
                
                zone1Low = Math.round(restingHR + (hrr * 0.5));
                zone1High = Math.round(restingHR + (hrr * 0.6));
                zone2Low = zone1High + 1;
                zone2High = Math.round(restingHR + (hrr * 0.7));
                zone3Low = zone2High + 1;
                zone3High = Math.round(restingHR + (hrr * 0.8));
                zone4Low = zone3High + 1;
                zone4High = Math.round(restingHR + (hrr * 0.9));
                zone5Low = zone4High + 1;
                zone5High = Math.round(maxHR);
            } else {
                // Direct percentage of max HR
                zone1Low = Math.round(maxHR * 0.5);
                zone1High = Math.round(maxHR * 0.6);
                zone2Low = zone1High + 1;
                zone2High = Math.round(maxHR * 0.7);
                zone3Low = zone2High + 1;
                zone3High = Math.round(maxHR * 0.8);
                zone4Low = zone3High + 1;
                zone4High = Math.round(maxHR * 0.9);
                zone5Low = zone4High + 1;
                zone5High = Math.round(maxHR);
            }
            
            // Update results
            maxHRResult.textContent = Math.round(maxHR);
            zone1Range.textContent = `${zone1Low}-${zone1High}`;
            zone2Range.textContent = `${zone2Low}-${zone2High}`;
            zone3Range.textContent = `${zone3Low}-${zone3High}`;
            zone4Range.textContent = `${zone4Low}-${zone4High}`;
            zone5Range.textContent = `${zone5Low}-${zone5High}`;
            
            // Track the calculation
            trackEvent('heartrate_calculated', { 
                age: age,
                maxHR: Math.round(maxHR),
                method: method
            });
        }

        // Initialize with default values
        calculateHeartRateZones();
    }
});
