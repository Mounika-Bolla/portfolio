/*
 * ✨ LEARNING NOTE: JavaScript adds INTERACTIVITY
 * 
 * HTML = Structure (the skeleton)
 * CSS = Style (the clothes)
 * JavaScript = Behavior (the actions)
 * 
 * This file handles:
 * 1. Navigation scroll effect
 * 2. Active link highlighting
 * 3. Smooth scrolling
 * 4. Scroll animations
 */

// ✨ LEARNING NOTE: DOMContentLoaded
// Waits until HTML is fully loaded before running JavaScript.
// This prevents errors from trying to access elements that don't exist yet!
document.addEventListener('DOMContentLoaded', () => {
    
    // ===================================
    // NAVBAR SCROLL EFFECT
    // ===================================
    /*
     * ✨ LEARNING NOTE: Scroll Event
     * window.addEventListener('scroll', ...) fires every time user scrolls.
     * We check scroll position to change navbar style.
     */
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===================================
    // ACTIVE NAV LINK ON SCROLL
    // ===================================
    /*
     * ✨ LEARNING NOTE: Intersection Observer
     * Modern way to detect when elements enter the viewport.
     * Much better performance than scroll events!
     */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '-50% 0px', // trigger when section is 50% visible
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove 'active' from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add 'active' to matching link
                const activeLink = document.querySelector(
                    `.nav-links a[href="#${entry.target.id}"]`
                );
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // ===================================
    // SMOOTH SCROLL FOR NAV LINKS
    // ===================================
    /*
     * ✨ LEARNING NOTE: Event Delegation
     * Instead of adding click listeners to each link,
     * we could use event delegation on the parent.
     * Here we loop for clarity in learning.
     */
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default jump
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // SCROLL REVEAL ANIMATIONS
    // ===================================
    /*
     * ✨ LEARNING NOTE: Adding Animations on Scroll
     * Elements get a class added when they enter viewport,
     * triggering CSS animations.
     */
    const revealElements = document.querySelectorAll(
        '.service-card, .skill-category, .portfolio-item, .about-content'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add delay for staggered effect
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.1 });

    // ===================================
    // ANIMATED NUMBER COUNTER
    // ===================================
    /*
     * ✨ LEARNING NOTE: Counter Animation
     * Numbers count up from 0 to target value when scrolled into view.
     * Uses requestAnimationFrame for smooth animation.
     * data-target = final number, data-suffix = what comes after (like "+")
     */
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000; // Animation duration in ms
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth deceleration
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(easeOutQuart * target);
            
            element.textContent = currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix; // Ensure final value is exact
            }
        };
        
        requestAnimationFrame(updateCounter);
    };
    
    // Observer to trigger counter when stats come into view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => counterObserver.observe(stat));

    // Set initial state for elements
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // ===================================
    // FORM SUBMISSION
    // ===================================
    /*
     * ✨ LEARNING NOTE: Form Handling
     * Prevent default form submission and handle it yourself.
     * In a real app, you'd send data to a server here.
     */
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // In a real app, you'd send this to a server
            // For now, show a success message
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
        });
    }

    // ===================================
    // TYPING EFFECT (BONUS!)
    // ===================================
    /*
     * ✨ LEARNING NOTE: Dynamic Text Effect
     * Creates that cool "typing" animation effect.
     */
    const tagline = document.querySelector('.tagline');
    if (tagline) {
        const roles = ['AGENTIC AI ENGINEER', 'DATA SCIENTIST', 'ML ENGINEER', 'AI RESEARCHER'];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeEffect() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                tagline.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                tagline.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                // Pause at end of word
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 500;
            }

            setTimeout(typeEffect, typingSpeed);
        }

        // Start typing effect after initial animation
        setTimeout(typeEffect, 2000);
    }

    // Log a friendly message for developers viewing the console
    console.log('%c👋 Hi there! Nice portfolio, right?', 'font-size: 16px; color: #c9a86c;');
    console.log('%cBuilt by Mounika B', 'font-size: 12px; color: #888;');
});

/*
 * ✨ LEARNING SUMMARY:
 * 
 * Key JavaScript concepts used:
 * 
 * 1. DOM Selection: document.querySelector(), querySelectorAll()
 *    - Finds elements in your HTML
 * 
 * 2. Event Listeners: addEventListener()
 *    - Responds to user actions (clicks, scrolls, etc.)
 * 
 * 3. Intersection Observer
 *    - Efficiently detects when elements enter/exit viewport
 * 
 * 4. Class Manipulation: classList.add(), classList.remove()
 *    - Changes element styling dynamically
 * 
 * 5. Timeouts: setTimeout()
 *    - Delays code execution
 * 
 * Next steps to level up:
 * - Add a hamburger menu for mobile
 * - Connect form to a real backend (like Formspree or Netlify Forms)
 * - Add more animations with libraries like GSAP
 * - Add a light/dark theme toggle
 */

