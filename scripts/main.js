/**
 * Portfolio Website - Main JavaScript
 * Professional version with improved functionality and error handling
 */

// ===== CONSTANTS =====
const SELECTORS = {
    FRAME: '.frame',
    RIGHT_ROCK: '.rightrock',
    EMAIL_BUTTON: '.email-button',
    NAV_LINKS: '.nav-link',
    NAV_ITEMS: '.nav-item',
    SKILL_ICONS: '.skill-icon'
};

const CLASSES = {
    ACTIVE: 'active',
    HOVER: 'hover',
    LOADED: 'loaded'
};

// ===== UTILITY FUNCTIONS =====
const utils = {
    /**
     * Debounce function to limit how often a function can be called
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Check if element is in viewport
     * @param {Element} element - Element to check
     * @returns {boolean} True if element is in viewport
     */
    isInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Smooth scroll to element
     * @param {string} selector - CSS selector of target element
     */
    smoothScrollTo(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
};

// ===== SCROLL HANDLER =====
class ScrollHandler {
    constructor() {
        this.frame = document.querySelector(SELECTORS.FRAME);
        this.rightRock = document.querySelector(SELECTORS.RIGHT_ROCK);
        this.isInitialized = false;
    }

    /**
     * Initialize scroll handler
     */
    init() {
        if (!this.frame || !this.rightRock) {
            console.warn('ScrollHandler: Required elements not found');
            return;
        }

        this.isInitialized = true;
        this.handleScroll = utils.debounce(this.handleScroll.bind(this), 16); // ~60fps
        document.addEventListener('scroll', this.handleScroll);
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        try {
            const frameRect = this.frame.getBoundingClientRect();
            const rockRect = this.rightRock.getBoundingClientRect();

            const isOutOfBounds = rockRect.top < frameRect.top || rockRect.bottom > frameRect.bottom;
            
            this.rightRock.style.backgroundColor = isOutOfBounds ? 'white' : 'transparent';
        } catch (error) {
            console.error('ScrollHandler: Error handling scroll event', error);
        }
    }

    /**
     * Clean up event listeners
     */
    destroy() {
        if (this.isInitialized) {
            document.removeEventListener('scroll', this.handleScroll);
            this.isInitialized = false;
        }
    }
}

// ===== NAVIGATION HANDLER =====
class NavigationHandler {
    constructor() {
        this.navLinks = document.querySelectorAll(SELECTORS.NAV_LINKS);
        this.navItems = document.querySelectorAll(SELECTORS.NAV_ITEMS);
        this.isInitialized = false;
    }

    /**
     * Initialize navigation handler
     */
    init() {
        this.isInitialized = true;
        this.bindEvents();
    }

    /**
     * Bind navigation events
     */
    bindEvents() {
        // Handle navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Handle footer navigation items
        this.navItems.forEach(item => {
            item.addEventListener('click', this.handleNavItemClick.bind(this));
        });
    }

    /**
     * Handle navigation link clicks
     * @param {Event} event - Click event
     */
    handleNavClick(event) {
        event.preventDefault();
        const href = event.currentTarget.getAttribute('href');
        if (href && href.startsWith('#')) {
            utils.smoothScrollTo(href);
        }
    }

    /**
     * Handle footer navigation item clicks
     * @param {Event} event - Click event
     */
    handleNavItemClick(event) {
        event.preventDefault();
        const href = event.currentTarget.getAttribute('href');
        if (href && href.startsWith('#')) {
            utils.smoothScrollTo(href);
        }
    }

    /**
     * Clean up event listeners
     */
    destroy() {
        if (this.isInitialized) {
            this.navLinks.forEach(link => {
                link.removeEventListener('click', this.handleNavClick);
            });
            this.navItems.forEach(item => {
                item.removeEventListener('click', this.handleNavItemClick);
            });
            this.isInitialized = false;
        }
    }
}

// ===== EMAIL HANDLER =====
class EmailHandler {
    constructor() {
        this.emailButton = document.querySelector(SELECTORS.EMAIL_BUTTON);
        this.isInitialized = false;
    }

    /**
     * Initialize email handler
     */
    init() {
        if (!this.emailButton) {
            console.warn('EmailHandler: Email button not found');
            return;
        }

        this.isInitialized = true;
        this.emailButton.addEventListener('click', this.handleEmailClick.bind(this));
    }

    /**
     * Handle email button click
     * @param {Event} event - Click event
     */
    handleEmailClick(event) {
        event.preventDefault();
        
        try {
            // You can customize this to open email client or show contact form
            const email = 'roshan.alawe@example.com'; // Replace with actual email
            const subject = 'Portfolio Inquiry';
            const body = 'Hello Roshan, I would like to discuss a project with you.';
            
            const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(mailtoLink, '_blank');
        } catch (error) {
            console.error('EmailHandler: Error opening email client', error);
            // Fallback: copy email to clipboard
            this.copyEmailToClipboard();
        }
    }

    /**
     * Copy email to clipboard as fallback
     */
    copyEmailToClipboard() {
        const email = 'roshan.alawe@example.com'; // Replace with actual email
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(email).then(() => {
                this.showNotification('Email copied to clipboard!');
            }).catch(() => {
                this.showNotification('Please copy the email manually: ' + email);
            });
        } else {
            this.showNotification('Please copy the email manually: ' + email);
        }
    }

    /**
     * Show notification to user
     * @param {string} message - Notification message
     */
    showNotification(message) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 1rem;
            border-radius: 5px;
            z-index: 10000;
            font-family: var(--font-primary);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Clean up event listeners
     */
    destroy() {
        if (this.isInitialized && this.emailButton) {
            this.emailButton.removeEventListener('click', this.handleEmailClick);
            this.isInitialized = false;
        }
    }
}

// ===== ANIMATION HANDLER =====
class AnimationHandler {
    constructor() {
        this.skillIcons = document.querySelectorAll(SELECTORS.SKILL_ICONS);
        this.isInitialized = false;
    }

    /**
     * Initialize animation handler
     */
    init() {
        this.isInitialized = true;
        this.setupAnimations();
    }

    /**
     * Setup animations
     */
    setupAnimations() {
        // Add hover animations to skill icons
        this.skillIcons.forEach(icon => {
            icon.addEventListener('mouseenter', this.handleSkillHover.bind(this));
            icon.addEventListener('mouseleave', this.handleSkillLeave.bind(this));
        });

        // Add page load animation
        this.addPageLoadAnimation();
    }

    /**
     * Handle skill icon hover
     * @param {Event} event - Mouse enter event
     */
    handleSkillHover(event) {
        const icon = event.currentTarget;
        icon.style.transform = 'scale(1.1) rotate(5deg)';
    }

    /**
     * Handle skill icon leave
     * @param {Event} event - Mouse leave event
     */
    handleSkillLeave(event) {
        const icon = event.currentTarget;
        icon.style.transform = 'scale(1) rotate(0deg)';
    }

    /**
     * Add page load animation
     */
    addPageLoadAnimation() {
        document.body.classList.add(CLASSES.LOADED);
        
        // Animate elements on page load
        const animateElements = document.querySelectorAll('.hero-title, .hero-text, .logo, .navigation');
        animateElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    /**
     * Clean up event listeners
     */
    destroy() {
        if (this.isInitialized) {
            this.skillIcons.forEach(icon => {
                icon.removeEventListener('mouseenter', this.handleSkillHover);
                icon.removeEventListener('mouseleave', this.handleSkillLeave);
            });
            this.isInitialized = false;
        }
    }
}

// ===== MAIN APPLICATION CLASS =====
class PortfolioApp {
    constructor() {
        this.handlers = {
            scroll: new ScrollHandler(),
            navigation: new NavigationHandler(),
            email: new EmailHandler(),
            animation: new AnimationHandler()
        };
        this.isInitialized = false;
    }

    /**
     * Initialize the application
     */
    init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.initializeHandlers.bind(this));
            } else {
                this.initializeHandlers();
            }

            // Handle page visibility changes
            document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
            
            this.isInitialized = true;
            console.log('PortfolioApp: Initialized successfully');
        } catch (error) {
            console.error('PortfolioApp: Error during initialization', error);
        }
    }

    /**
     * Initialize all handlers
     */
    initializeHandlers() {
        Object.values(this.handlers).forEach(handler => {
            if (handler && typeof handler.init === 'function') {
                handler.init();
            }
        });
    }

    /**
     * Handle page visibility changes
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden, pause animations if needed
            console.log('PortfolioApp: Page hidden');
        } else {
            // Page is visible again
            console.log('PortfolioApp: Page visible');
        }
    }

    /**
     * Clean up the application
     */
    destroy() {
        if (this.isInitialized) {
            Object.values(this.handlers).forEach(handler => {
                if (handler && typeof handler.destroy === 'function') {
                    handler.destroy();
                }
            });
            this.isInitialized = false;
            console.log('PortfolioApp: Cleaned up successfully');
        }
    }
}

// ===== INITIALIZATION =====
// Create and initialize the main application
const app = new PortfolioApp();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => app.destroy());

// Export for potential external use
window.PortfolioApp = app; 