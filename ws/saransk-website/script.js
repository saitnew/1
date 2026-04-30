// ===== Particle System for Hero Section =====
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== Scroll Animations =====
class ScrollAnimator {
    constructor() {
        this.elements = document.querySelectorAll('[data-animate]');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, parseInt(delay));
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.elements.forEach(el => observer.observe(el));
    }
}

// ===== Counter Animation =====
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        this.animated = new Set();
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animated.add(entry.target);
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(update);
    }
}

// ===== Navigation =====
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('navToggle');
        this.navLinks = document.getElementById('navLinks');
        this.navItems = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mobile toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobile());
        }
        
        // Active link update
        window.addEventListener('scroll', () => this.updateActiveLink());
        
        // Smooth scroll
        this.navItems.forEach(link => {
            link.addEventListener('click', (e) => this.smoothScroll(e));
        });
    }
    
    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    
    toggleMobile() {
        this.navLinks.classList.toggle('active');
        this.navToggle.classList.toggle('active');
    }
    
    updateActiveLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                this.navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    smoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            
            // Close mobile menu
            this.navLinks.classList.remove('active');
            this.navToggle.classList.remove('active');
        }
    }
}

// ===== Preloader =====
class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.init();
    }
    
    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (this.preloader) {
                    this.preloader.style.opacity = '0';
                    setTimeout(() => {
                        this.preloader.style.display = 'none';
                    }, 500);
                }
            }, 2000);
        });
    }
}

// ===== Form Handling =====
class FormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const btn = this.form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        
        btn.textContent = 'Отправка...';
        btn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            btn.textContent = 'Отправлено!';
            btn.style.background = 'var(--accent)';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
                this.form.reset();
            }, 2000);
        }, 1500);
    }
}

// ===== Tilt Effect for Cards =====
class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.attraction-card, .stat-item');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleTilt(e, card));
            card.addEventListener('mouseleave', () => this.resetTilt(card));
        });
    }
    
    handleTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -10;
        const rotateY = (x - centerX) / centerX * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }
    
    resetTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
}

// ===== Parallax Effect =====
class ParallaxEffect {
    constructor() {
        this.heroContent = document.querySelector('.hero-content');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleParallax());
    }
    
    handleParallax() {
        if (!this.heroContent) return;
        
        const scrolled = window.scrollY;
        const rate = scrolled * 0.5;
        
        if (scrolled < window.innerHeight) {
            this.heroContent.style.transform = `translateY(${rate}px)`;
            this.heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    }
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ParticleSystem('particles');
    new ScrollAnimator();
    new CounterAnimation();
    new Navigation();
    new Preloader();
    new FormHandler();
    new TiltEffect();
    new ParallaxEffect();
    
    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Gallery item click effect
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// ===== Performance Optimization =====
// Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Replace scroll listeners with throttled versions
window.removeEventListener('scroll', () => {});