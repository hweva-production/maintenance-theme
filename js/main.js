/**
 * Website Under Maintenance - Main JavaScript
 * Handles countdown timer, dark mode toggle, preloader, and form submission
 */

(function() {
    'use strict';

    // ============================================
    // Configuration - Edit these values
    // ============================================
    const CONFIG = {
        // Countdown end date (Edit this to change when maintenance ends)
        // This will be set dynamically to persist across page reloads
        countdownEndDate: null, // Will be initialized below
        
        // Form submission endpoint (Update with your backend URL)
        formEndpoint: 'https://your-backend.com/api/notify',
        
        // Enable/disable dark mode by default
        defaultDarkMode: false,
        
        // Preloader delay (milliseconds)
        preloaderDelay: 1000
    };

    // ============================================
    // Initialize Countdown End Date (Persistent)
    // ============================================
    // Get or set countdown end date from localStorage to persist across reloads
    function initializeCountdownDate() {
        const STORAGE_KEY = 'maintenance-countdown-end';
        let endDate = null;

        try {
            const savedDate = localStorage.getItem(STORAGE_KEY);
            
            if (savedDate) {
                endDate = new Date(savedDate);
                // Check if saved date is still in the future
                if (endDate.getTime() > Date.now()) {
                    CONFIG.countdownEndDate = endDate;
                    return;
                }
                // If past date, remove it and create new one
                localStorage.removeItem(STORAGE_KEY);
            }
            
            // If no saved date or expired, create new one (2 weeks from now)
            endDate = new Date(Date.now() + (14 * 24 * 60 * 60 * 1000));
            CONFIG.countdownEndDate = endDate;
            localStorage.setItem(STORAGE_KEY, endDate.toISOString());
            
        } catch (error) {
            console.warn('Could not access localStorage for countdown date:', error);
            // Fallback: set date to 2 weeks from now (non-persistent)
            CONFIG.countdownEndDate = new Date(Date.now() + (14 * 24 * 60 * 60 * 1000));
        }
    }

    // Initialize the countdown date immediately
    initializeCountdownDate();

    // ============================================
    // DOM Elements - with null checks
    // ============================================
    function getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id "${id}" not found`);
        }
        return element;
    }

    const elements = {
        preloader: getElement('preloader'),
        themeToggle: getElement('theme-toggle'),
        days: getElement('days'),
        hours: getElement('hours'),
        minutes: getElement('minutes'),
        seconds: getElement('seconds'),
        notifyForm: getElement('notify-form'),
        emailInput: getElement('email-input'),
        emailError: getElement('email-error'),
        formSuccess: getElement('form-success'),
        currentYear: getElement('current-year')
    };

    // Check if critical elements exist
    if (!elements.days || !elements.hours || !elements.minutes || !elements.seconds) {
        console.error('Countdown elements not found. Countdown timer will not work.');
    }

    // ============================================
    // Theme Management (Dark/Light Mode)
    // ============================================
    function initTheme() {
        if (!elements.themeToggle) {
            console.warn('Theme toggle button not found.');
            return;
        }

        try {
            // Check for saved theme preference or default
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            let theme = savedTheme || (CONFIG.defaultDarkMode ? 'dark' : 'light');
            
            // If no saved preference, use system preference
            if (!savedTheme && !CONFIG.defaultDarkMode && prefersDark !== undefined) {
                theme = prefersDark ? 'dark' : 'light';
            }
            
            setTheme(theme);
        } catch (error) {
            console.error('Error initializing theme:', error);
            // Fallback to light theme
            setTheme('light');
        }
    }

    function setTheme(theme) {
        if (!theme || (theme !== 'dark' && theme !== 'light')) {
            theme = 'light';
        }
        
        document.documentElement.setAttribute('data-theme', theme);
        
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.warn('Could not save theme preference:', error);
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    // ============================================
    // Preloader
    // ============================================
    function initPreloader() {
        if (!elements.preloader) {
            return;
        }

        // Hide preloader when page is loaded
        if (document.readyState === 'complete') {
            setTimeout(() => {
                if (elements.preloader) {
                    elements.preloader.classList.add('hidden');
                    setTimeout(() => {
                        if (elements.preloader) {
                            elements.preloader.style.display = 'none';
                        }
                    }, 500);
                }
            }, CONFIG.preloaderDelay);
        } else {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    if (elements.preloader) {
                        elements.preloader.classList.add('hidden');
                        // Remove from DOM after animation completes
                        setTimeout(function() {
                            if (elements.preloader) {
                                elements.preloader.style.display = 'none';
                            }
                        }, 500);
                    }
                }, CONFIG.preloaderDelay);
            });
        }
    }

    // ============================================
    // Countdown Timer
    // ============================================
    function initCountdown() {
        if (!elements.days || !elements.hours || !elements.minutes || !elements.seconds) {
            console.warn('Countdown elements not found. Countdown disabled.');
            return;
        }

        const countdownElements = {
            days: elements.days,
            hours: elements.hours,
            minutes: elements.minutes,
            seconds: elements.seconds
        };

        // Validate countdown date (should already be set by initializeCountdownDate)
        if (!CONFIG.countdownEndDate || !(CONFIG.countdownEndDate instanceof Date) || isNaN(CONFIG.countdownEndDate.getTime())) {
            console.error('Invalid countdown end date. Re-initializing...');
            initializeCountdownDate();
        }

        // Store previous values to detect changes
        let previousValues = {
            days: null,
            hours: null,
            minutes: null,
            seconds: null
        };

        let countdownInterval = null;

        function updateCountdown() {
            const now = new Date().getTime();
            const endTime = CONFIG.countdownEndDate.getTime();
            const timeLeft = endTime - now;

            if (timeLeft < 0) {
                // Countdown has ended
                Object.values(countdownElements).forEach(el => {
                    if (el) el.textContent = '00';
                });
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                }
                return;
            }

            // Calculate time units
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            // Update display with zero-padding
            const values = {
                days: String(days).padStart(2, '0'),
                hours: String(hours).padStart(2, '0'),
                minutes: String(minutes).padStart(2, '0'),
                seconds: String(seconds).padStart(2, '0')
            };

            // Update each element and animate if value changed
            Object.keys(values).forEach(key => {
                const element = countdownElements[key];
                if (!element) return;

                const currentValue = values[key];
                
                if (previousValues[key] !== null && previousValues[key] !== currentValue) {
                    // Value changed - add animation
                    element.classList.add('changed');
                    setTimeout(() => {
                        element.classList.remove('changed');
                    }, 500);
                }
                
                element.textContent = currentValue;
                previousValues[key] = currentValue;
            });
        }

        // Update immediately and then every second
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
        
        // Store interval reference globally for cleanup if needed
        window.countdownInterval = countdownInterval;
    }

    // ============================================
    // Utility Functions
    // ============================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ============================================
    // Form Validation & Submission
    // ============================================
    function validateEmail(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }
        // More robust email validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email.trim()) && email.length <= 254;
    }

    function showError(message) {
        if (!elements.emailError) return;
        elements.emailError.textContent = message || 'An error occurred.';
        elements.emailError.classList.add('active');
        if (elements.formSuccess) {
            elements.formSuccess.classList.remove('active');
        }
        // Announce to screen readers
        elements.emailError.setAttribute('aria-live', 'assertive');
    }

    function showSuccess(message) {
        if (!elements.formSuccess) return;
        elements.formSuccess.textContent = message || 'Success!';
        elements.formSuccess.classList.add('active');
        if (elements.emailError) {
            elements.emailError.classList.remove('active');
        }
        // Announce to screen readers
        elements.formSuccess.setAttribute('aria-live', 'polite');
    }

    function hideMessages() {
        if (elements.emailError) {
            elements.emailError.classList.remove('active');
        }
        if (elements.formSuccess) {
            elements.formSuccess.classList.remove('active');
        }
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        
        if (!elements.notifyForm || !elements.emailInput) {
            console.error('Form elements not found');
            return;
        }

        hideMessages();

        const email = elements.emailInput.value.trim();

        // Validation
        if (!email) {
            showError('Please enter your email address.');
            elements.emailInput.focus();
            return;
        }

        if (!validateEmail(email)) {
            showError('Please enter a valid email address.');
            elements.emailInput.focus();
            elements.emailInput.setAttribute('aria-invalid', 'true');
            return;
        }

        elements.emailInput.removeAttribute('aria-invalid');

        // Disable submit button
        const submitBtn = elements.notifyForm.querySelector('.submit-btn');
        if (!submitBtn) {
            console.error('Submit button not found');
            return;
        }

        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        submitBtn.setAttribute('aria-busy', 'true');

        try {
            // Submit form data
            // Replace CONFIG.formEndpoint with your actual backend endpoint
            // For production, implement CSRF protection and rate limiting
            
            // Uncomment the following code and replace with your backend endpoint:
            /*
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(CONFIG.formEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add CSRF token if needed
                    // 'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ email: email }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Network response was not ok');
            }

            const data = await response.json();
            */

            // Simulate API call delay for demo
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Success - show success message
            showSuccess('Thank you! We\'ll notify you when we\'re back online.');
            elements.emailInput.value = '';

            // Log submission (for analytics or debugging)
            // In production, use proper analytics service
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_submitted', {
                    'event_category': 'form',
                    'event_label': 'notify_form'
                });
            }

        } catch (error) {
            console.error('Form submission error:', error);
            
            let errorMessage = 'Something went wrong. Please try again later.';
            if (error.name === 'AbortError') {
                errorMessage = 'Request timed out. Please check your connection and try again.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            showError(errorMessage);
        } finally {
            // Re-enable submit button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.removeAttribute('aria-busy');
            }
        }
    }

    function initForm() {
        if (!elements.notifyForm || !elements.emailInput) {
            console.warn('Form elements not found. Form functionality disabled.');
            return;
        }

        elements.notifyForm.addEventListener('submit', handleFormSubmit);
        
        // Debounced real-time validation
        const debouncedValidation = debounce(function() {
            const email = elements.emailInput.value.trim();
            if (email && !validateEmail(email)) {
                elements.emailInput.setAttribute('aria-invalid', 'true');
            } else {
                elements.emailInput.removeAttribute('aria-invalid');
            }
        }, 300);

        // Clear error messages when user starts typing
        elements.emailInput.addEventListener('input', function() {
            if (elements.emailError && elements.emailError.classList.contains('active')) {
                hideMessages();
            }
            debouncedValidation();
        });

        // Validate on blur
        elements.emailInput.addEventListener('blur', function() {
            const email = elements.emailInput.value.trim();
            if (email && !validateEmail(email)) {
                elements.emailInput.setAttribute('aria-invalid', 'true');
            }
        });
    }

    // ============================================
    // Current Year (Footer)
    // ============================================
    function updateCurrentYear() {
        if (elements.currentYear) {
            elements.currentYear.textContent = new Date().getFullYear();
        }
    }

    // ============================================
    // Smooth Scroll Behavior
    // ============================================
    function initSmoothScroll() {
        // Check if browser supports smooth scroll
        if ('scrollBehavior' in document.documentElement.style) {
            return; // Already supported via CSS
        }

        // Fallback for older browsers
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ============================================
    // Accessibility Enhancements
    // ============================================
    function initAccessibility() {
        // Add keyboard navigation for theme toggle
        elements.themeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });

        // Improve focus visibility
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // ============================================
    // Initialize Everything
    // ============================================
    function init() {
        // Initialize theme
        initTheme();

        // Initialize countdown timer
        initCountdown();

        // Initialize form
        initForm();

        // Initialize preloader
        initPreloader();

        // Update current year
        updateCurrentYear();

        // Initialize smooth scroll
        initSmoothScroll();

        // Initialize accessibility features
        initAccessibility();

        // Theme toggle event listener
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', toggleTheme);
        }

        // Log initialization
        console.log('Maintenance page initialized successfully');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export configuration for external access
    window.MaintenanceConfig = CONFIG;

})();

