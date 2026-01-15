// ==========================================
// FIREBASE CONFIGURATION
// ==========================================
// REPLACE WITH YOUR OWN FIREBASE CONFIG
// 1. Go to https://console.firebase.google.com
// 2. Create project → Add web app
// 3. Enable Authentication → Google
// 4. Enable Firestore Database
// 5. Copy config below

const firebaseConfig = {
    apiKey: "AIzaSyCZYRf5PM6aWCjeKPVdPPcMh46EVI_sSJg",
    authDomain: "theking-1139-portfolio.firebaseapp.com",
    projectId: "theking-1139-portfolio",
    storageBucket: "theking-1139-portfolio.firebasestorage.app",
    messagingSenderId: "686587219644",
    appId: "1:686587219644:web:5bed60774af18dd2120ab9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ==========================================
// DOM ELEMENTS
// ==========================================
const elements = {
    // Loader
    loader: document.getElementById('loader'),
    
    // Navigation
    navbar: document.getElementById('navbar'),
    navLinks: document.getElementById('navLinks'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    
    // Auth
    loginBtn: document.getElementById('loginBtn'),
    loginBtnReview: document.getElementById('loginBtnReview'),
    logoutBtn: document.getElementById('logoutBtn'),
    userInfo: document.getElementById('userInfo'),
    userAvatar: document.getElementById('userAvatar'),
    userName: document.getElementById('userName'),
    
    // Testimonials
    testimonialPrompt: document.getElementById('testimonialPrompt'),
    testimonialForm: document.getElementById('testimonialForm'),
    starRating: document.getElementById('starRating'),
    reviewText: document.getElementById('reviewText'),
    submitReview: document.getElementById('submitReview'),
    testimonialsGrid: document.getElementById('testimonialsGrid'),
    noReviews: document.getElementById('noReviews'),
    
    // Portfolio
    portfolioGrid: document.getElementById('portfolioGrid'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    
    // FAQ
    faqItems: document.querySelectorAll('.faq-item'),
    
    // Modal
    imageModal: document.getElementById('imageModal'),
    modalImage: document.getElementById('modalImage'),
    modalClose: document.getElementById('modalClose'),
    
    // Other
    backToTop: document.getElementById('backToTop'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
};

// ==========================================
// STATE
// ==========================================
let currentUser = null;
let currentRating = 0;

// ==========================================
// LOADER
// ==========================================
function hideLoader() {
    setTimeout(() => {
        elements.loader.classList.add('hidden');
    }, 500);
}

window.addEventListener('load', hideLoader);

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'success') {
    elements.toastMessage.textContent = message;
    elements.toast.className = `toast active ${type}`;
    
    setTimeout(() => {
        elements.toast.classList.remove('active');
    }, 3000);
}

// ==========================================
// NAVIGATION
// ==========================================
// Scroll effect
function handleNavScroll() {
    if (window.scrollY > 50) {
        elements.navbar.classList.add('scrolled');
    } else {
        elements.navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavScroll);

// Mobile menu
function toggleMobileMenu() {
    elements.mobileMenuBtn.classList.toggle('active');
    elements.navLinks.classList.toggle('active');
    document.body.style.overflow = elements.navLinks.classList.contains('active') ? 'hidden' : '';
}

elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// Close menu on link click
elements.navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        elements.mobileMenuBtn.classList.remove('active');
        elements.navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const position = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({
                top: position,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// BACK TO TOP
// ==========================================
function handleBackToTop() {
    if (window.scrollY > 500) {
        elements.backToTop.classList.add('visible');
    } else {
        elements.backToTop.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleBackToTop);

elements.backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ==========================================
// PORTFOLIO FILTER
// ==========================================
function initPortfolioFilter() {
    const cards = document.querySelectorAll('.portfolio-card');
    
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            elements.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            cards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

initPortfolioFilter();

// Add fadeInUp animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// IMAGE MODAL
// ==========================================
function initImageModal() {
    const cards = document.querySelectorAll('.portfolio-card');
    
    cards.forEach(card => {
        const expandBtn = card.querySelector('.card-expand');
        const img = card.querySelector('img');
        
        if (expandBtn && img) {
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openImageModal(img.src, img.alt);
            });
        }
        
        card.addEventListener('click', () => {
            if (img) {
                openImageModal(img.src, img.alt);
            }
        });
    });
}

function openImageModal(src, alt) {
    elements.modalImage.src = src;
    elements.modalImage.alt = alt || 'Portfolio Image';
    elements.imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    elements.imageModal.classList.remove('active');
    document.body.style.overflow = '';
}

elements.modalClose.addEventListener('click', closeImageModal);

elements.imageModal.addEventListener('click', (e) => {
    if (e.target === elements.imageModal) {
        closeImageModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.imageModal.classList.contains('active')) {
        closeImageModal();
    }
});

initImageModal();

// ==========================================
// FAQ ACCORDION
// ==========================================
function initFAQ() {
    elements.faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            elements.faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked if wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

initFAQ();

// ==========================================
// AUTHENTICATION
// ==========================================
function handleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    auth.signInWithPopup(provider)
        .then((result) => {
            showToast('Welcome, ' + result.user.displayName + '!', 'success');
        })
        .catch((error) => {
            console.error('Login error:', error.code, error.message);
            
            // More detailed error messages
            let message = 'Sign in failed. Please try again.';
            if (error.code === 'auth/popup-blocked') {
                message = 'Pop-up was blocked. Please allow pop-ups for this site.';
            } else if (error.code === 'auth/popup-closed-by-user') {
                message = 'Sign in cancelled.';
            } else if (error.code === 'auth/unauthorized-domain') {
                message = 'This domain is not authorized. Check Firebase Console.';
            } else if (error.code === 'auth/operation-not-supported-in-this-environment') {
                message = 'Google Sign-In not supported. Check Firebase setup.';
            }
            
            showToast(message, 'error');
        });
}

function handleLogout() {
    auth.signOut()
        .then(() => {
            showToast('Signed out successfully', 'success');
        })
        .catch((error) => {
            console.error('Logout error:', error);
            showToast('Sign out failed', 'error');
        });
}

// Auth state listener
auth.onAuthStateChanged((user) => {
    currentUser = user;
    
    if (user) {
        // User is signed in
        elements.loginBtn.classList.add('hidden');
        elements.userInfo.classList.add('active');
        elements.userAvatar.src = user.photoURL || '';
        elements.userName.textContent = user.displayName || 'User';
        
        // Show review form, hide prompt
        elements.testimonialPrompt.classList.add('hidden');
        elements.testimonialForm.classList.add('active');
    } else {
        // User is signed out
        elements.loginBtn.classList.remove('hidden');
        elements.userInfo.classList.remove('active');
        
        // Show prompt, hide form
        elements.testimonialPrompt.classList.remove('hidden');
        elements.testimonialForm.classList.remove('active');
    }
});

// Event listeners
elements.loginBtn.addEventListener('click', handleLogin);
elements.loginBtnReview.addEventListener('click', handleLogin);
elements.logoutBtn.addEventListener('click', handleLogout);

// ==========================================
// STAR RATING
// ==========================================
function initStarRating() {
    const stars = elements.starRating.querySelectorAll('button');
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            currentRating = parseInt(star.dataset.rating);
            updateStars();
        });
        
        star.addEventListener('mouseenter', () => {
            highlightStars(parseInt(star.dataset.rating));
        });
    });
    
    elements.starRating.addEventListener('mouseleave', updateStars);
}

function highlightStars(rating) {
    const stars = elements.starRating.querySelectorAll('button');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

function updateStars() {
    highlightStars(currentRating);
}

initStarRating();

// ==========================================
// TESTIMONIALS
// ==========================================
async function loadTestimonials() {
    try {
        const snapshot = await db.collection('testimonials')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();

        if (snapshot.empty) {
            elements.noReviews.classList.remove('hidden');
            return;
        }

        elements.noReviews.classList.add('hidden');
        
        // Clear existing
        const existingCards = elements.testimonialsGrid.querySelectorAll('.testimonial-card');
        existingCards.forEach(card => card.remove());

        snapshot.forEach(doc => {
            const data = doc.data();
            const card = createTestimonialCard(data);
            elements.testimonialsGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}

function createTestimonialCard(data) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.setAttribute('data-animate', '');
    
    const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);
    const date = data.createdAt ? formatDate(data.createdAt.toDate()) : '';
    
    card.innerHTML = `
        <div class="testimonial-header">
            <img class="testimonial-avatar" src="${data.userPhoto || ''}" alt="${data.userName}" 
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 48 48%22%3E%3Crect fill=%22%2318181b%22 width=%2248%22 height=%2248%22/%3E%3Ctext fill=%22%2371717a%22 font-family=%22sans-serif%22 font-size=%2218%22 x=%2224%22 y=%2232%22 text-anchor=%22middle%22%3E${data.userName ? data.userName.charAt(0).toUpperCase() : '?'}%3C/text%3E%3C/svg%3E'">
            <div class="testimonial-author">
                <h4>${escapeHtml(data.userName || 'Anonymous')}</h4>
                <span>${date}</span>
            </div>
            <div class="testimonial-stars">${stars}</div>
        </div>
        <p class="testimonial-content">${escapeHtml(data.text)}</p>
    `;
    
    // Trigger animation
    setTimeout(() => card.classList.add('visible'), 100);
    
    return card;
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Submit review
async function submitReview() {
    if (!currentUser) {
        showToast('Please sign in first', 'error');
        return;
    }

    if (currentRating === 0) {
        showToast('Please select a rating', 'error');
        return;
    }

    const text = elements.reviewText.value.trim();
    if (!text) {
        showToast('Please write a review', 'error');
        return;
    }

    if (text.length < 10) {
        showToast('Review is too short', 'error');
        return;
    }

    if (text.length > 500) {
        showToast('Review is too long (max 500 characters)', 'error');
        return;
    }

    // Disable button
    elements.submitReview.disabled = true;
    elements.submitReview.textContent = 'Submitting...';

    try {
        // Check if user already submitted
        const existingReview = await db.collection('testimonials')
            .where('userId', '==', currentUser.uid)
            .get();

        if (!existingReview.empty) {
            showToast('You have already submitted a review', 'error');
            elements.submitReview.disabled = false;
            elements.submitReview.textContent = 'Submit Review';
            return;
        }

        await db.collection('testimonials').add({
            userId: currentUser.uid,
            userName: currentUser.displayName,
            userPhoto: currentUser.photoURL,
            rating: currentRating,
            text: text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showToast('Thank you for your review!', 'success');
        
        // Reset form
        elements.reviewText.value = '';
        currentRating = 0;
        updateStars();
        
        // Reload testimonials
        loadTestimonials();
    } catch (error) {
        console.error('Error submitting review:', error.code, error.message);
        
        let message = 'Failed to submit review';
        if (error.code === 'permission-denied') {
            message = 'Permission denied. Check Firestore rules.';
        } else if (error.code === 'unavailable') {
            message = 'Firebase is temporarily unavailable. Try again.';
        } else if (error.message.includes('Firestore')) {
            message = 'Firestore not enabled. Enable it in Firebase Console.';
        }
        
        showToast(message, 'error');
    }

    elements.submitReview.disabled = false;
    elements.submitReview.textContent = 'Submit Review';
}

elements.submitReview.addEventListener('click', submitReview);

// Load testimonials on page load
loadTestimonials();

// ==========================================
// TYPING EFFECT FOR HERO (Optional)
// ==========================================
function initTypingEffect() {
    const element = document.querySelector('.hero-subtitle');
    if (!element) return;
    
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 20);
        }
    }
    
    // Start after hero animations
    setTimeout(type, 1000);
}

// Uncomment to enable:
// initTypingEffect();

// ==========================================
// PARALLAX EFFECT (Optional)
// ==========================================
function initParallax() {
    const orbs = document.querySelectorAll('.hero-orb');
    
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
}

initParallax();

// ==========================================
// COPY TO CLIPBOARD (Utility)
// ==========================================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => showToast('Copied to clipboard!', 'success'))
        .catch(() => showToast('Failed to copy', 'error'));
}

// ==========================================
// LAZY LOADING IMAGES
// ==========================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

initLazyLoading();

// ==========================================
// IMAGE ERROR HANDLING
// ==========================================
document.querySelectorAll('.portfolio-card img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 250%22%3E%3Crect fill=%22%23131316%22 width=%22400%22 height=%22250%22/%3E%3Ctext fill=%22%2371717a%22 font-family=%22sans-serif%22 font-size=%2214%22 x=%22200%22 y=%22125%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EImage Not Found%3C/text%3E%3C/svg%3E';
    });
});

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================
document.addEventListener('keydown', (e) => {
    // Close modals on Escape
    if (e.key === 'Escape') {
        closeImageModal();
        elements.mobileMenuBtn.classList.remove('active');
        elements.navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ==========================================
// PERFORMANCE: DEBOUNCE SCROLL
// ==========================================
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

// Apply debounce to scroll handlers
window.addEventListener('scroll', debounce(() => {
    handleNavScroll();
    handleBackToTop();
}, 10));

// ==========================================
// CONSOLE MESSAGE
// ==========================================
console.log('%c THEKING_1139 Portfolio ', 'background: linear-gradient(135deg, #6366f1, #a855f7); color: white; font-size: 16px; padding: 10px 20px; border-radius: 5px; font-weight: bold;');
console.log('%c Want a UI like this? Contact me! ', 'color: #a1a1aa; font-size: 12px;');