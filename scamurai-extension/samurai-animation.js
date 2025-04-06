// Samurai Animation Script
// This script provides advanced animations for the Scamurai icon

/**
 * Advanced animations for the Samurai icon
 */
class SamuraiAnimator {
    constructor() {
        this.isAnimating = false;
        this.animations = [
            this.swordSwing,
            this.bounce,
            this.spin,
            this.waveHand,
            this.nod
        ];
    }

    /**
     * Animate the samurai icon
     * @param {HTMLElement} element - The button element to animate
     * @param {string} [specificAnimation] - Optional specific animation to play
     * @returns {Promise} - Resolves when animation is complete
     */
    animate(element, specificAnimation = null) {
        if (this.isAnimating || !element) return Promise.resolve();
        
        this.isAnimating = true;
        
        let animationFn;
        if (specificAnimation && typeof this[specificAnimation] === 'function') {
            animationFn = this[specificAnimation];
        } else {
            // Select a random animation
            animationFn = this.animations[Math.floor(Math.random() * this.animations.length)];
        }
        
        // Create promise that resolves when animation is complete
        return new Promise((resolve) => {
            animationFn.call(this, element)
                .then(() => {
                    this.isAnimating = false;
                    resolve();
                })
                .catch((error) => {
                    console.error('Animation error:', error);
                    this.isAnimating = false;
                    resolve();
                });
        });
    }

    /**
     * Sword swing animation
     * @param {HTMLElement} element - The button element to animate
     * @returns {Promise} - Resolves when animation is complete
     */
    swordSwing(element) {
        return new Promise((resolve) => {
            element.classList.add('animate-swing');
            
            const handleAnimationEnd = () => {
                element.classList.remove('animate-swing');
                element.removeEventListener('animationend', handleAnimationEnd);
                resolve();
            };
            
            element.addEventListener('animationend', handleAnimationEnd);
        });
    }

    /**
     * Bounce animation
     * @param {HTMLElement} element - The button element to animate
     * @returns {Promise} - Resolves when animation is complete
     */
    bounce(element) {
        return new Promise((resolve) => {
            element.classList.add('animate-bounce');
            
            const handleAnimationEnd = () => {
                element.classList.remove('animate-bounce');
                element.removeEventListener('animationend', handleAnimationEnd);
                resolve();
            };
            
            element.addEventListener('animationend', handleAnimationEnd);
        });
    }

    /**
     * Spin animation
     * @param {HTMLElement} element - The button element to animate
     * @returns {Promise} - Resolves when animation is complete
     */
    spin(element) {
        return new Promise((resolve) => {
            element.classList.add('animate-spin');
            
            const handleAnimationEnd = () => {
                element.classList.remove('animate-spin');
                element.removeEventListener('animationend', handleAnimationEnd);
                resolve();
            };
            
            element.addEventListener('animationend', handleAnimationEnd);
        });
    }

    /**
     * Waving hand animation using CSS transform
     * @param {HTMLElement} element - The button element to animate
     * @returns {Promise} - Resolves when animation is complete
     */
    waveHand(element) {
        return new Promise((resolve) => {
            // Save original transform
            const originalTransform = element.style.transform;
            
            // Define keyframes for the animation
            const keyframes = [
                { transform: 'rotate(-10deg) scale(1.05)' },
                { transform: 'rotate(10deg) scale(1.05)' },
                { transform: 'rotate(-8deg) scale(1.05)' },
                { transform: 'rotate(8deg) scale(1.05)' },
                { transform: 'rotate(-5deg) scale(1.05)' },
                { transform: 'rotate(5deg) scale(1.05)' },
                { transform: 'rotate(0deg) scale(1)' }
            ];
            
            // Animation options
            const options = {
                duration: 800,
                easing: 'ease-in-out',
                iterations: 1
            };
            
            // Start the animation
            const animation = element.animate(keyframes, options);
            
            // When animation ends, restore original transform and resolve
            animation.onfinish = () => {
                element.style.transform = originalTransform;
                resolve();
            };
        });
    }

    /**
     * Nodding animation
     * @param {HTMLElement} element - The button element to animate
     * @returns {Promise} - Resolves when animation is complete
     */
    nod(element) {
        return new Promise((resolve) => {
            // Save original transform
            const originalTransform = element.style.transform;
            
            // Define keyframes for the animation
            const keyframes = [
                { transform: 'rotate(0deg) scale(1)' },
                { transform: 'rotate(0deg) scale(0.95) translateY(2px)' },
                { transform: 'rotate(0deg) scale(1)' },
                { transform: 'rotate(0deg) scale(0.95) translateY(2px)' },
                { transform: 'rotate(0deg) scale(1)' }
            ];
            
            // Animation options
            const options = {
                duration: 600,
                easing: 'ease-in-out',
                iterations: 1
            };
            
            // Start the animation
            const animation = element.animate(keyframes, options);
            
            // When animation ends, restore original transform and resolve
            animation.onfinish = () => {
                element.style.transform = originalTransform;
                resolve();
            };
        });
    }
}

// Create a global instance for the content script to use
window.samuraiAnimator = new SamuraiAnimator();