const kitchenCalc = (function () {
    let currentStep = 1;
    const totalSteps = 14;
    const basePrice = 60000; // base price for kitchen remodel

    // Selection labels
    const labels = {
        size: { small: 'Small Kitchen 75-100 sq ft (no island)', medium: 'Medium Kitchen 100-200 sq ft (maybe small island)', large: 'Large Kitchen 200+ sq ft (large island)' },
        structural: { none: 'No Changes', 'non-load': 'Move/Remove Walls - Not Load Bearing', load: 'Move/Remove Walls - Load Bearing', doors: 'Move/Add/Change Doors', windows: 'Move/Add/Change Windows' },
        'plumbing-location': { none: 'Not moving plumbing', some: 'Move/Add Some Plumbing/Appliances', all: 'Move All Plumbing Fixtures/Appliances' },
        'electric-location': { none: 'No Changes', some: 'Move/Add some fixtures/devices', all: 'Move Most/All Fixtures and Devices' },
        'plumbing-fixtures': { basic: 'Basic Plumbing Fixtures', designer: 'Designer Plumbing Fixtures', luxury: 'Luxury Plumbing Fixtures' },
        'electric-fixtures': { recessed: 'Recessed/Wafer Lights', undercabinet: 'Undercabinet lights', accent: 'Accent lights', pendant: 'Pendant lights' },
        countertops: { granite: 'Granite Countertops', quartz: 'Quartz Countertop (included)', marble: 'Marble/Other Natural Stone Countertops' },
        cabinets: { stock: "Stock 'RTA' Cabinets", semi: 'Semi Custom Cabinets (included)', custom: 'Full Custom Cabinets' },
        flooring: { yes: 'Yes, in kitchen', no: 'No, the flooring is fine' },
        features: { pantry: 'Pantry Shelving/Organizers', backsplash: 'Backsplash tile', crown: 'Crown molding', fridge: 'Undercounter Fridge/Wine Fridge', icemaker: 'Undercounter Icemaker', potfiller: 'Pot Filler' },
        paint: { none: 'No, Touch up only', walls: 'Yes, walls only', both: 'Yes - walls and ceiling (included)' },
        appliances: { none: 'No New Appliances', dishwasher: 'New Dishwasher', range: 'New Range', fridge: 'New Fridge', ovens: 'New Wall Ovens' },
        island: { none: 'No Island', basic: 'Basic Island (storage & countertop)', premium: 'Premium Island (seating & high-end countertop)' },
        misc: { smart: 'Smart Kitchen Features', wine: 'Wine Fridge', highend: 'High-End Finishes', vent: 'Upgraded Vent Hood' }
    };

    const categories = {
        size: 'Kitchen Size',
        structural: 'Structural Changes',
        'plumbing-location': 'Plumbing Locations',
        'electric-location': 'Electric Locations',
        'plumbing-fixtures': 'Plumbing Fixture Options',
        'electric-fixtures': 'Electric Fixture Options',
        countertops: 'Countertop Options',
        cabinets: 'Cabinet Options',
        flooring: 'New Flooring',
        features: 'Additional Features',
        paint: 'Paint Options',
        appliances: 'Appliances',
        island: 'Kitchen Island Options',
        misc: 'Miscellaneous Upgrades',
        client: 'Client Information'
    };

    function init() {
        // Option card click handling
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const input = this.querySelector('input');
                if (!input) return;

                if (input.type === 'radio') {
                    this.parentElement.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                    input.checked = true;
                    this.classList.add('selected');
                } else if (input.type === 'checkbox') {
                    input.checked = !input.checked;
                    this.classList.toggle('selected', input.checked);
                }
            });
        });

        // Prevent links from navigating
        document.querySelectorAll('.learn-more').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // Buttons with data-action
        document.querySelectorAll('button[data-action]').forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault();
                const action = button.dataset.action;
                if (kitchenCalc[action]) kitchenCalc[action]();
            });
        });

        updateProgress();
    }

    function updateProgress() {
        const progress = (currentStep / totalSteps) * 100;
        const bar = document.getElementById('progressBar');
        if (bar) bar.style.width = progress + '%';
    }

    function validateStep() {
        const stepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
        if (!stepEl) return true;

        // Validate radio inputs
        const inputs = stepEl.querySelectorAll('input[type="radio"]');
        if (inputs.length > 0 && !Array.from(inputs).some(i => i.checked)) {
            alert('Please select an option before continuing');
            return false;
        }

        // Step 13: Client info validation
        if (stepEl.dataset.step == "13") {
            const name = stepEl.querySelector('input[name="client-name"]').value.trim();
            const email = stepEl.querySelector('input[name="client-email"]').value.trim();
            const phone = stepEl.querySelector('input[name="client-phone"]').value.trim();
            if (!name || !email || !phone) {
                alert('Please enter your Name, Email, and Phone Number');
                return false;
            }
        }

        return true;
    }

    function nextStep() {
        if (!validateStep()) return;

        const currentStepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
        if (currentStepEl) currentStepEl.classList.remove('active');

        currentStep++;

        // Step 14: show results
        if (currentStep === 14) {
            calculateResults();
            updateProgress();
            return;
        }

        const nextEl = document.querySelector(`.step[data-step="${currentStep}"]`);
        if (nextEl) nextEl.classList.add('active');

        updateProgress();
    }

    function prevStep() {
        const currentStepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
        if (!currentStepEl) return;

        currentStepEl.classList.remove('active');
        currentStep--;
        const prevEl = document.querySelector(`.step[data-step="${currentStep}"]`);
        if (prevEl) prevEl.classList.add('active');

        updateProgress();
    }

    function reset() {
        currentStep = 1;
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
        const firstStep = document.querySelector('.step[data-step="1"]');
        if (firstStep) firstStep.classList.add('active');

        const results = document.querySelector('.results');
        if (results) results.classList.remove('active');

        document.querySelectorAll('input').forEach(i => i.checked = false);
        document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));

        updateProgress();
    }

    function formatPrice(min, max) {
        if (min === max) return `$${min.toLocaleString()}`;
        return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }

    function calculateResults() {
        let minTotal = basePrice, maxTotal = basePrice;
        const breakdown = [];

        // Radio groups
        const radioGroups = ['size', 'structural', 'plumbing-location', 'electric-location', 'plumbing-fixtures', 'electric-fixtures', 'countertops', 'cabinets', 'flooring', 'paint', 'appliances', 'island'];
        radioGroups.forEach(group => {
            const selected = document.querySelector(`input[name="${group}"]:checked`);
            if (selected) {
                const costs = selected.dataset.cost ? selected.dataset.cost.split(',').map(c => parseInt(c)) : [0];
                const min = costs[0], max = costs.length > 1 ? costs[1] : costs[0];
                minTotal += min; maxTotal += max;
                breakdown.push({ label: labels[group][selected.value], category: categories[group], min, max });
            }
        });

        // Checkbox groups
        const checkboxGroups = ['features', 'misc', 'electric-fixtures'];
        checkboxGroups.forEach(group => {
            const selectedBoxes = document.querySelectorAll(`input[name="${group}"]:checked`);
            selectedBoxes.forEach(f => {
                const costs = f.dataset.cost ? f.dataset.cost.split(',').map(c => parseInt(c)) : [0];
                const min = costs[0], max = costs.length > 1 ? costs[1] : costs[0];
                minTotal += min; maxTotal += max;
                breakdown.push({ label: labels[group][f.value], category: categories[group], min, max });
            });
        });

        // Client Info
        const clientStep = document.querySelector('.step[data-step="13"]');
        if (clientStep) {
            const name = clientStep.querySelector('input[name="client-name"]').value.trim();
            const email = clientStep.querySelector('input[name="client-email"]').value.trim();
            const phone = clientStep.querySelector('input[name="client-phone"]').value.trim();
            breakdown.push({ label: `Name: ${name}, Email: ${email}, Phone: ${phone}`, category: categories['client'], min: 0, max: 0 });
        }

        // Display results
        const priceRangeEl = document.getElementById('priceRange');
        const totalPriceEl = document.getElementById('totalPrice');
        if (priceRangeEl) priceRangeEl.textContent = formatPrice(minTotal, maxTotal);
        if (totalPriceEl) totalPriceEl.textContent = formatPrice(minTotal, maxTotal);

        let breakdownHTML = '';
        breakdown.forEach(item => {
            breakdownHTML += `
                <div class="breakdown-item">
                    <div>
                        <div class="breakdown-label">${item.label}</div>
                        <div class="breakdown-category">(${item.category})</div>
                    </div>
                    <div class="breakdown-price">${formatPrice(item.min, item.max)}</div>
                </div>
            `;
        });
        const breakdownItems = document.getElementById('breakdownItems');
        if (breakdownItems) breakdownItems.innerHTML = breakdownHTML;

        // Hide any active step
        document.querySelectorAll('.step.active').forEach(s => s.classList.remove('active'));

        // Show results
        const resultsEl = document.querySelector('.results');
        if (resultsEl) resultsEl.classList.add('active');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { nextStep, prevStep, reset, calculateResults };
})();
window.kitchenCalc = kitchenCalc;
