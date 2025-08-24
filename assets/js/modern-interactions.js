// Enhanced JavaScript for Vehigo - Modern Interactions

document.addEventListener('DOMContentLoaded', function() {
    
    // ================================
    // ENHANCED FORM VALIDATION
    // ================================
    
    const searchForm = document.getElementById('searchForm');
    const inputFields = document.querySelectorAll('.input-field');
    
    // Real-time validation for input fields
    inputFields.forEach(field => {
        field.addEventListener('input', function() {
            validateField(this);
        });
        
        field.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        const errorElement = document.getElementById(fieldName + '-error') || 
                           document.querySelector(`#${fieldName}-error`);
        
        // Remove existing error classes
        field.classList.remove('error-border');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        
        // Basic validation rules
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'text' && fieldName.includes('location') && value && value.length < 3) {
            isValid = false;
            errorMessage = 'Location must be at least 3 characters';
        } else if (fieldName.includes('pay') && value && isNaN(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid amount';
        }
        
        if (!isValid) {
            field.classList.add('error-border');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
            }
        }
        
        return isValid;
    }
    
    // Form submission handler
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let allValid = true;
            inputFields.forEach(field => {
                if (!validateField(field)) {
                    allValid = false;
                }
            });
            
            if (allValid) {
                // Add loading state
                const submitBtn = searchForm.querySelector('.search-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span>🔍 Searching...</span>';
                submitBtn.disabled = true;
                
                // Simulate search (replace with actual API call)
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    showNotification('Search completed! Redirecting to results...', 'success');
                    
                    // Redirect to results page (replace with actual URL)
                    setTimeout(() => {
                        // window.location.href = '/search-results';
                        console.log('Would redirect to search results');
                    }, 1500);
                }, 2000);
            } else {
                showNotification('Please fill in all required fields correctly', 'error');
            }
        });
    }
    
    // ================================
    // ENHANCED CARD INTERACTIONS
    // ================================
    
    // Add ripple effect to cards
    const cards = document.querySelectorAll('.featured-car-card, .get-start-card, .blog-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(52, 152, 219, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${x - 10}px;
                top: ${y - 10}px;
                width: 20px;
                height: 20px;
                pointer-events: none;
                z-index: 1000;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // ================================
    // SMOOTH SCROLLING & NAVIGATION
    // ================================
    
    // Enhanced smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // ================================
    // NOTIFICATION SYSTEM
    // ================================
    
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || icons.info}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 400px;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // ================================
    // ENHANCED HEADER BEHAVIOR
    // ================================
    
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add shadow when scrolled
        if (currentScrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // ================================
    // INTERSECTION OBSERVER ANIMATIONS
    // ================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Stagger animations for children
                const children = entry.target.querySelectorAll('.featured-car-card, .get-start-card, .blog-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections for animations
    const sectionsToObserve = document.querySelectorAll('.section');
    sectionsToObserve.forEach(section => {
        observer.observe(section);
    });
    
    // ================================
    // ENHANCED BACK TO TOP BUTTON
    // ================================
    
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ================================
    // LOADING STATES
    // ================================
    
    // Add loading class to body until page is fully loaded
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        showNotification('Welcome to Vehigo! 🚗', 'success');
    });
    
    console.log('🚗 Vehigo enhanced features loaded successfully!');
});

// Add CSS for animations and effects via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .header {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .header.scrolled {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.2s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .error-border {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
    }
    
    .search-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none !important;
    }
    
    .section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .featured-car-card,
    .get-start-card,
    .blog-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    body.loaded .section {
        opacity: 1;
        transform: translateY(0);
    }
`;

document.head.appendChild(style);
