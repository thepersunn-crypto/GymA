/**
 * VIGOR LUXE FIT - INTERACTIVE COMPONENTS & BEHAVIOR
 * Core features: Mobile Menu, Navbar Scroll Effect, Pricing Toggle,
 * Before/After Slider, BMI Calculator, Scroll Reveal, Lightbox.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. Navbar Scroll Effect & ScrollSpy
       ========================================== */
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Class toggle for scroll shadow/backdrop
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking on scroll (ScrollSpy)
        let currentSection = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            const secHeight = sec.offsetHeight;
            if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                currentSection = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================
       2. Mobile Menu Toggling
       ========================================== */
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Toggle hamburger bars morphing into "X"
            const bars = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(6px, -7px)';
                navLinksContainer.style.display = 'flex';
                navLinksContainer.style.flexDirection = 'column';
                navLinksContainer.style.position = 'fixed';
                navLinksContainer.style.top = '80px';
                navLinksContainer.style.left = '0';
                navLinksContainer.style.width = '100%';
                navLinksContainer.style.background = 'rgba(10, 10, 12, 0.98)';
                navLinksContainer.style.backdropFilter = 'blur(20px)';
                navLinksContainer.style.padding = '3rem 2rem';
                navLinksContainer.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
                navLinksContainer.style.gap = '2rem';
                navLinksContainer.style.textAlign = 'center';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
                navLinksContainer.style.display = '';
            }
        });

        // Close menu on nav link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    hamburger.classList.remove('active');
                    const bars = hamburger.querySelectorAll('span');
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                    navLinksContainer.style.display = '';
                }
            });
        });
    }

    /* ==========================================
       3. Pricing Plan Switcher (Monthly / Annual)
       ========================================== */
    const monthlyBtn = document.getElementById('btn-monthly');
    const annualBtn = document.getElementById('btn-annual');
    const priceAmounts = document.querySelectorAll('.price-amt');

    if (monthlyBtn && annualBtn) {
        // Plan rates mapping
        const prices = {
            monthly: [79, 149, 299],
            annual: [63, 119, 239] // ~20% discount
        };

        const updatePrices = (billingCycle) => {
            priceAmounts.forEach((el, index) => {
                const currentPrice = prices[billingCycle][index];
                el.innerHTML = `$${currentPrice}<span>/mo</span>`;
            });
        };

        monthlyBtn.addEventListener('click', () => {
            monthlyBtn.classList.add('active');
            annualBtn.classList.remove('active');
            updatePrices('monthly');
        });

        annualBtn.addEventListener('click', () => {
            annualBtn.classList.add('active');
            monthlyBtn.classList.remove('active');
            updatePrices('annual');
        });
    }

    /* ==========================================
       4. Interactive Before/After Photo Slider
       ========================================== */
    const sliderContainer = document.querySelector('.trans-slider-container');
    const afterImg = document.querySelector('.img-after');
    const handle = document.querySelector('.slider-handle');

    if (sliderContainer && afterImg && handle) {
        let isDragging = false;

        const updateSlider = (clientX) => {
            const rect = sliderContainer.getBoundingClientRect();
            const x = clientX - rect.left;
            let percentage = (x / rect.width) * 100;
            
            // Constrain between 0% and 100%
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;

            afterImg.style.width = `${100 - percentage}%`;
            handle.style.left = `${percentage}%`;
        };

        // Event Listeners for dragging (Mouse & Touch)
        const startDrag = () => { isDragging = true; };
        const stopDrag = () => { isDragging = false; };
        
        handle.addEventListener('mousedown', startDrag);
        window.addEventListener('mouseup', stopDrag);
        
        sliderContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSlider(e.clientX);
        });

        // Touch events for mobile support
        handle.addEventListener('touchstart', startDrag);
        window.addEventListener('touchend', stopDrag);
        
        sliderContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updateSlider(e.touches[0].clientX);
        });
    }

    /* ==========================================
       5. Interactive BMI Calculator
       ========================================== */
    const calculateBtn = document.getElementById('calc-bmi');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const resultsBox = document.getElementById('bmi-results');
    const bmiVal = document.getElementById('bmi-value');
    const bmiLbl = document.getElementById('bmi-label');
    const bmiDesc = document.getElementById('bmi-desc');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const weight = parseFloat(weightInput.value);
            const height = parseFloat(heightInput.value) / 100; // convert cm to m

            if (!weight || !height || weight <= 0 || height <= 0) {
                alert('Please enter valid, positive values for Weight and Height.');
                return;
            }

            const bmi = (weight / (height * height)).toFixed(1);
            bmiVal.textContent = bmi;

            let classification = '';
            let description = '';

            if (bmi < 18.5) {
                classification = 'Underweight';
                description = 'You are currently categorized as underweight. Focus on nutrient-dense food and dynamic strength coaching at Vigor Luxe Fit to gain lean muscle mass.';
                bmiLbl.style.color = '#38bdf8'; // Blue
            } else if (bmi >= 18.5 && bmi < 24.9) {
                classification = 'Healthy Weight';
                description = 'Incredible! You have an optimal body mass index. Boost your metabolic health, muscle tone, and absolute conditioning in our advanced training groups.';
                bmiLbl.style.color = '#39ff14'; // Neon Green
            } else if (bmi >= 25 && bmi < 29.9) {
                classification = 'Overweight';
                description = 'Your BMI is classified as overweight. Let us target visceral fat and rebuild atomic core power using our Metabolic Burn conditioning programs.';
                bmiLbl.style.color = '#f97316'; // Orange
            } else {
                classification = 'Obese';
                description = 'Your BMI corresponds to obese status. Health and structural joint mobility are key. Work 1-on-1 with our VIP Coaches to build a structural fat loss roadmap.';
                bmiLbl.style.color = '#e62e2d'; // Red
            }

            bmiLbl.textContent = classification;
            bmiDesc.textContent = description;
            resultsBox.style.display = 'block';

            // Smooth scroll into results view
            resultsBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    /* ==========================================
       6. Scroll Reveal Animation Engine
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const checkReveal = () => {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Trigger once initially to show fold elements

    /* ==========================================
       7. High-Fidelity Gallery Lightbox Modal
       ========================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (galleryItems && lightbox && lightboxImg && lightboxClose) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const bgImgUrl = getComputedStyle(item.querySelector('.gallery-img')).backgroundImage;
                // Parse out url("...") syntax
                const cleanUrl = bgImgUrl.replace(/^url\(['"](.+)['"]\)$/, '$1');
                lightboxImg.src = cleanUrl;
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Stop scrolling
            });
        });

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scroll
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    /* ==========================================
       8. Trainer & Program Booking WhatsApp Redirects
       ========================================== */
    // Helper to format WhatsApp message strings
    const sendWhatsAppMsg = (text) => {
        const phone = '+15550192831'; // Default specified in Profile
        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/${phone}?text=${encodedText}`, '_blank');
    };

    // Global booking button bindings
    window.bookTrial = () => {
        sendWhatsAppMsg('Hello Vigor Luxe Fit! I would like to book a Free VIP 3-Day Pass to check out the club. Can you help me schedule?');
    };

    window.bookTrainer = (trainerName) => {
        sendWhatsAppMsg(`Hi, I'm interested in booking a personal training assessment session with ${trainerName}. Please send details!`);
    };

    window.inquireProgram = (programName) => {
        sendWhatsAppMsg(`Hello, I'm looking for details about your "${programName}" fitness program. What are the upcoming schedules and availability?`);
    };

    window.joinPlan = (planName) => {
        sendWhatsAppMsg(`Hi! I'm ready to transform. I would like to register and get started on the "${planName}" membership plan.`);
    };

});
