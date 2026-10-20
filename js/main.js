
/**
 * Town Ruins — Service Status
 *
 * Handles:
 * - Live elapsed-downtime counter
 * - Dark/light mode toggle
 *
 * Does not use a restoration countdown or a simulated notification form.
 */

(function () {
    'use strict';

    // ============================================
    // Configuration
    // ============================================

    const CONFIG = {
        /*
         * Set the confirmed time the application actually
         * became unavailable.
         *
         * Format: YYYY-MM-DDTHH:mm:ss+02:00
         *
         * Example only:
         * outageStartedAt: '2026-10-20T08:30:00+02:00'
         *
         * Leave empty until the actual start time is confirmed.
         */
        outageStartedAt: '2026-10-20T08:30:00',

        // Default theme when no saved preference exists.
        defaultTheme: 'dark',

        // Update the elapsed-time display every second.
        updateInterval: 1000
    };

    // ============================================
    // DOM Elements
    // ============================================

    const elements = {
        downtimeCounter: document.getElementById('downtime-counter'),
        downtimeStartLabel: document.getElementById(
            'downtime-start-label'
        ),
        themeToggle: document.getElementById('theme-toggle')
    };

    // ============================================
    // Downtime Counter
    // ============================================

    function initDowntimeCounter() {
        const counter = elements.downtimeCounter;
        const startLabel = elements.downtimeStartLabel;

        if (!counter || !startLabel) {
            console.warn(
                'Downtime counter elements were not found. ' +
                'Check the HTML element IDs.'
            );
            return;
        }

        // Do not invent an outage start time.
        if (!CONFIG.outageStartedAt) {
            counter.textContent = 'Start time not configured';

            startLabel.textContent =
                'The confirmed application outage start time ' +
                'has not yet been configured.';

            return;
        }

        const startTime = new Date(CONFIG.outageStartedAt);

        if (
            Number.isNaN(startTime.getTime()) ||
            startTime.getTime() > Date.now()
        ) {
            counter.textContent = 'Start time requires verification';

            startLabel.textContent =
                'Please verify the configured outage date and time.';

            console.error('Invalid outage start time:', CONFIG.outageStartedAt);
            return;
        }

        function updateDowntime() {
            const elapsedMilliseconds = Date.now() - startTime.getTime();

            if (elapsedMilliseconds < 0) {
                counter.textContent = 'Start time requires verification';
                return;
            }

            const totalSeconds = Math.floor(
                elapsedMilliseconds / 1000
            );

            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            counter.textContent =
                `${days} days, ` +
                `${hours} hours, ` +
                `${minutes} minutes, ` +
                `${seconds} seconds`;
        }

        // Display the configured starting point.
        startLabel.textContent =
            'Counting from ' +
            startTime.toLocaleString('en-GB', {
                dateStyle: 'medium',
                timeStyle: 'medium',
                timeZone: 'Africa/Harare'
            }) +
            ' (Harare time).';

        // Display immediately, then refresh every second.
        updateDowntime();
        window.setInterval(updateDowntime, CONFIG.updateInterval);
    }

    // ============================================
    // Theme Management
    // ============================================

    function getSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('theme');

            if (savedTheme === 'dark' || savedTheme === 'light') {
                return savedTheme;
            }
        } catch (error) {
            console.warn('Could not read saved theme preference:', error);
        }

        return CONFIG.defaultTheme;
    }

    function applyTheme(theme) {
        const validTheme =
            theme === 'dark' ? 'dark' : 'light';

        document.documentElement.setAttribute(
            'data-theme',
            validTheme
        );

        if (elements.themeToggle) {
            elements.themeToggle.setAttribute(
                'aria-pressed',
                String(validTheme === 'dark')
            );

            elements.themeToggle.setAttribute(
                'aria-label',
                validTheme === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
            );
        }

        try {
            localStorage.setItem('theme', validTheme);
        } catch (error) {
            // The theme still works for the current page session.
            console.warn('Could not save theme preference:', error);
        }
    }

    function initTheme() {
        applyTheme(getSavedTheme());

        if (!elements.themeToggle) {
            return;
        }

        elements.themeToggle.addEventListener('click', function () {
            const currentTheme =
                document.documentElement.getAttribute('data-theme') ||
                'light';

            applyTheme(
                currentTheme === 'dark' ? 'light' : 'dark'
            );
        });
    }

    // ============================================
    // Initialize
    // ============================================

    function init() {
        initTheme();
        initDowntimeCounter();

        console.log('Town Ruins service-status page initialized.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Optional access to configuration for debugging.
    window.TownRuinsStatusConfig = CONFIG;

})();
