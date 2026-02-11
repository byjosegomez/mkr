const bathroomCalc = (function () {
    let currentStep = 1;
    const totalSteps = 12; // updated total steps
    const basePrice = 50000;

    // Selection labels
    const labels = {
        size: { small: 'Typical hall bath with tub/shower combo', medium: 'Mid sized bath with 2 sink vanity', large: 'Large bath with separate toilet room' },
        structural: { none: 'No Changes', 'non-load': 'Move Walls - Not Load Bearing', load: 'Move Walls - Load Bearing', doors: 'Move/Add/Change doors', windows: 'Move/Add/Change Windows' },
        'plumbing-location': { none: 'Not Moving Plumbing', some: 'Move/Add Some Plumbing Fixtures' },
        'electric-location': { none: 'Not Changing Electric Fixtures Locations', some: 'Change/Add Some Electric Fixtures Locations' },
        'plumbing-fixtures': { basic: 'Basic Plumbing Fixtures', designer: 'Designer Plumbing Fixtures', luxury: 'Luxury Plumbing Fixtures' },
        'electric-fixtures': { basic: 'Basic Electric Fixtures Package', designer: 'Designer Electric Fixtures Package', luxury: 'Luxury Electric Fixtures' },
        tile: { budget: 'Budget Tile Package (included) $5-$8 sq ft', designer: 'Designer Tile Package ($12-$18 sq ft)', luxury: 'Luxury tile package ($18 - $45 sq ft)' },
        cabinets: { budget: "Budget 'RTA' Cabinets", semi: 'Semi Custom Cabinets (included)', custom: 'Full Custom Cabinets' },
        countertops: { corian: 'Corian Countertops', granite: 'Granite Countertops', quartz: 'Quartz Countertops (Included)', marble: 'Marble Countertops' },
        walls: { paint: 'Paint Walls and ceiling (included)', wallpaper: 'Wallpaper Walls, Paint Ceiling', 'tile-walls': 'Tile Walls, Paint Ceiling', none: 'None, touch up only.' },
        features: { 'barrier-free': 'Barrier Free Shower', 'heated-floors': 'Heated Floors', 'steam-shower': 'Steam Shower', 'soaker-tub': 'Soaker Tub', 'glass-doors': 'Glass Shower Doors', 'shower-bench': 'Shower Bench', bidet: 'Bidet', 'grab-bars': 'Grab Bars', 'strip-wallpaper': 'Strip Wall Paper', 'popcorn-ceiling': 'Remove Popcorn Ceiling' }
    };

    const categories = {
        size: 'What is the size of your bathroom?',
        structural: 'Structural Changes',
        'plumbing-location': 'Plumbing Locations',
        'electric-location': 'Electric Locations',
        'plumbing-fixtures': 'Plumbing Fixture Options',
        'electric-fixtures': 'Electric Fixture Options',
        tile: 'Tile Options (shower, floors)',
        cabinets: 'Cabinet Options',
        countertops: 'Countertop Options',
        walls: 'Wall Finishes',
        features: 'Other features (choose all that apply)',
        client: 'Client Information' // added client category
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
                    input.blur();
                } else if (input.type === 'checkbox') {
                    input.checked = !input.checked;
                    this.classList.toggle('selected', input.checked);
                    input.blur();
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

        // Button clicks using data-action
        document.querySelectorAll('button[data-action]').forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault();
                const action = button.dataset.action;
                if (bathroomCalc[action]) bathroomCalc[action]();
            });
        });

        updateProgress();
    }

    function updateProgress() {
        const progress = (currentStep / totalSteps) * 100;
        const bar = document.getElementById('progressBar');
        if (bar) bar.style.width = progress + '%';
    }

    function nextStep() {
        const currentStepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
        if (!currentStepEl) return;

        // Validate radio buttons
        const radios = currentStepEl.querySelectorAll('input[type="radio"]');
        if (radios.length > 0 && !Array.from(radios).some(i => i.checked)) {
            alert('Please select an option before continuing');
            return;
        }

        // Step 11: Client info validation
        if (currentStepEl.dataset.step == "11") {
            const name = currentStepEl.querySelector('input[name="client-name"]').value.trim();
            const email = currentStepEl.querySelector('input[name="client-email"]').value.trim();
            const phone = currentStepEl.querySelector('input[name="client-phone"]').value.trim();
            if (!name || !email || !phone) {
                alert('Please enter your Name, Email, and Phone Number');
                return;
            }
        }

        currentStepEl.classList.remove('active');
        currentStep++;
        const nextEl = document.querySelector(`.step[data-step="${currentStep}"]`);
        if (nextEl) nextEl.classList.add('active');

        // Step 12: Show results
        if (currentStep === 12) {
            calculateResults();
        }

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
        if (min === max) return min >= 0 ? `$${min.toLocaleString()}` : `-$${Math.abs(min).toLocaleString()}`;
        return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }

    function calculateResults() {
        let minTotal = basePrice, maxTotal = basePrice;
        const breakdown = [];

        const radioGroups = ['size', 'structural', 'plumbing-location', 'electric-location', 'plumbing-fixtures', 'electric-fixtures', 'tile', 'cabinets', 'countertops', 'walls'];
        radioGroups.forEach(group => {
            const selected = document.querySelector(`input[name="${group}"]:checked`);
            if (selected) {
                const costs = selected.dataset.cost.split(',').map(c => parseInt(c));
                const min = costs[0], max = costs.length > 1 ? costs[1] : costs[0];
                minTotal += min; maxTotal += max;
                breakdown.push({ label: labels[group][selected.value], category: categories[group], min, max });
            }
        });

        const features = document.querySelectorAll('input[name="features"]:checked');
        features.forEach(f => {
            const costs = f.dataset.cost.split(',').map(c => parseInt(c));
            const min = costs[0], max = costs.length > 1 ? costs[1] : costs[0];
            minTotal += min; maxTotal += max;
            breakdown.push({ label: labels.features[f.value], category: categories.features, min, max });
        });

        // Client Info Step 11
        const clientStep = document.querySelector('.step[data-step="11"]');
        if (clientStep) {
            const name = clientStep.querySelector('input[name="client-name"]').value.trim();
            const email = clientStep.querySelector('input[name="client-email"]').value.trim();
            const phone = clientStep.querySelector('input[name="client-phone"]').value.trim();
            if (name || email || phone) {
                breakdown.push({
                    label: `Name: ${name}, Email: ${email}, Phone: ${phone}`,
                    category: categories.client,
                    min: 0,
                    max: 0
                });
            }
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

        const activeStep = document.querySelector('.step.active');
        if (activeStep) activeStep.classList.remove('active');
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
window.bathroomCalc = bathroomCalc;
