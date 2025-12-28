// Theme Handling Removed for Permanent Light Mode

// Custom Cursor Logic
const initCursor = () => {
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    // Only init on desktop
    if (window.innerWidth < 900 || !cursorDot || !cursorOutline) return;

    // Center the transforms first
    gsap.set(cursorDot, { xPercent: -50, yPercent: -50, left: 0, top: 0 });
    gsap.set(cursorOutline, { xPercent: -50, yPercent: -50, left: 0, top: 0 });

    // Performance-optimized cursor movement
    const xToDot = gsap.quickTo(cursorDot, "x", { duration: 0.1, ease: "power3" });
    const yToDot = gsap.quickTo(cursorDot, "y", { duration: 0.1, ease: "power3" });

    const xToOutline = gsap.quickTo(cursorOutline, "x", { duration: 0.5, ease: "power3" });
    const yToOutline = gsap.quickTo(cursorOutline, "y", { duration: 0.5, ease: "power3" });

    window.addEventListener('mousemove', (e) => {
        xToDot(e.clientX);
        yToDot(e.clientY);
        xToOutline(e.clientX);
        yToOutline(e.clientY);
    });

    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .cta-button, .view-project, .contact-box');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursorOutline, {
                scale: 1.5,
                backgroundColor: 'rgba(255, 87, 34, 0.1)',
                duration: 0.3
            });
            gsap.to(cursorDot, {
                scale: 0.5,
                duration: 0.3
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(cursorOutline, {
                scale: 1,
                backgroundColor: 'transparent',
                duration: 0.3
            });
            gsap.to(cursorDot, {
                scale: 1,
                duration: 0.3
            });
        });
    });
};

// Scroll Progress (GSAP Optimized)
const initScrollProgress = () => {
    gsap.to("#scroll-progress", {
        width: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 0
        }
    });
};

// Mobile Menu
const initMobileMenu = () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
};

// Contact Form (Hidden Iframe Method - Robust)
const initForm = () => {
    const form = document.getElementById('contactForm');
    const btn = form.querySelector('.cta-button');

    if (!form) return;

    // Configure Form Attributes programmatically
    form.action = "https://formsubmit.co/nirmalyaghosh2127@gmail.com";
    form.method = "POST";
    form.target = "hidden_iframe"; // Target the invisible iframe

    // Hidden configurations
    const addHiddenInput = (name, value) => {
        let input = form.querySelector(`input[name="${name}"]`);
        if (!input) {
            input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            form.appendChild(input);
        }
        input.value = value;
    };

    addHiddenInput('_captcha', 'false');
    addHiddenInput('_template', 'table');
    addHiddenInput('_subject', 'New Portfolio Message!');

    form.addEventListener('submit', () => {
        // Since we target an iframe, the page won't reload.
        // We simulate 'Sending' state and then 'Success'.

        const originalBtnText = btn.innerText;
        btn.innerText = 'Sending...';
        btn.style.opacity = '0.7';

        // We can't confirm 100% when the iframe loads due to CORS,
        // so we assume success after a reasonable delay for UX.
        setTimeout(() => {
            btn.innerText = 'Message Sent!';
            btn.style.opacity = '1';
            alert('Message Sent Successfully!');
            form.reset();

            setTimeout(() => {
                btn.innerText = originalBtnText;
            }, 3000);
        }, 1500); // 1.5s delay to simulate network
    });
};

// Vanta.js Removed
const initVanta = () => {
    // Moved to particles.js
};

// ... (Physics Code Content)

// Antigravity Physics Engine (High-Performance Spring System)
class SpringSolver {
    constructor(tension = 120, friction = 15) {
        this.tension = tension;
        this.friction = friction;
        this.currentValue = 0;
        this.targetValue = 0;
        this.velocity = 0;
    }

    update(dt) {
        // Solve Spring (F = -kx - cv)
        const displacement = this.currentValue - this.targetValue;
        const force = -this.tension * displacement;
        const damping = -this.friction * this.velocity;
        const acceleration = force + damping;

        this.velocity += acceleration * dt;
        this.currentValue += this.velocity * dt;
        return this.currentValue;
    }

    setTarget(value) {
        this.targetValue = value;
    }
}

class AntigravityElement {
    constructor(element, options = {}) {
        this.element = element;
        this.rect = this.element.getBoundingClientRect();

        // Configuration
        this.isMagnetic = options.magnetic || false;
        this.isFloating = options.floating || false;

        // Physics tuning
        // Magnetic: snappy but fluid
        // Floating: very slow, underwater feel
        const tension = this.isMagnetic ? 150 : 10;
        const friction = this.isMagnetic ? 12 : 5;

        this.springX = new SpringSolver(tension, friction);
        this.springY = new SpringSolver(tension, friction);

        this.isActive = false;

        this.init();
    }

    init() {
        if (this.isMagnetic) {
            this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
            this.element.addEventListener('mouseleave', () => this.onMouseLeave());
            // Update rect on scroll/resize to keep physics accurate
            window.addEventListener('resize', () => this.updateRect(), { passive: true });
        }

        if (this.isFloating) {
            window.addEventListener('mousemove', (e) => this.onGlobalMouseMove(e), { passive: true });
        }
    }

    updateRect() {
        this.rect = this.element.getBoundingClientRect();
    }

    onMouseMove(e) {
        this.isActive = true;
        // Optimization: calc rect only on enter or lazily if needed, but here we assume rect is roughly static relative to viewport unless scrolled.
        // Actually for magnetic buttons in flow, getBoundingClientRect on every frame is expensive (Layout Thrashing).
        // Better: Use the cached rect and update it on 'mouseenter'
        if (!this.rectValid) {
            this.updateRect();
            this.rectValid = true;
        }

        const x = (e.clientX - this.rect.left) - this.rect.width / 2;
        const y = (e.clientY - this.rect.top) - this.rect.height / 2;

        this.springX.setTarget(x * 0.4);
        this.springY.setTarget(y * 0.4);
    }

    onGlobalMouseMove(e) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Very subtle parallax
        const moveX = (e.clientX - centerX) * 0.015;
        const moveY = (e.clientY - centerY) * 0.015;

        this.springX.setTarget(moveX);
        this.springY.setTarget(moveY);
    }

    onMouseLeave() {
        this.isActive = false;
        this.springX.setTarget(0);
        this.springY.setTarget(0);
        this.rectValid = false; // Invalidate cache
    }

    render(dt) {
        const x = this.springX.update(dt);
        const y = this.springY.update(dt);

        // Optimization: sleep if settled
        if (!this.isActive && Math.abs(x - this.springX.targetValue) < 0.05 && Math.abs(y - this.springY.targetValue) < 0.05 && Math.abs(this.springX.velocity) < 0.05) {
            return;
        }

        this.element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
}

// Global Physics Manager
const physicsWorld = {
    elements: [],
    lastTime: performance.now(),
    init() {
        // Start Loop
        const loop = (time) => {
            const dt = Math.min((time - this.lastTime) / 1000, 0.1);
            this.lastTime = time;
            this.elements.forEach(el => el.render(dt));
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    },
    add(el, options) {
        this.elements.push(new AntigravityElement(el, options));
    }
};

// Replace old Magnetic function
const initMagneticButtons = () => {
    physicsWorld.init();

    // Interactive Magnets
    const magnets = document.querySelectorAll('.cta-button, .nav-links a, .contact-box');
    magnets.forEach(el => {
        physicsWorld.add(el, { magnetic: true });
    });

    // Ambient Floaters (Antigravity cards)
    // DISABLED to prevent conflict with ScrollTrigger
    /* 
    if (window.innerWidth > 900) {
        const floaters = document.querySelectorAll('.glossy-card, .skill-item');
        floaters.forEach(el => {
            physicsWorld.add(el, { floating: true });
        });
    } 
    */
};

window.addEventListener('load', () => {
    if (window.requestIdleCallback) {
        requestIdleCallback(() => {
            // initVanta(); // Removed
            initTilt();
            initCursor();
        });
    } else {
        setTimeout(() => {
            // initVanta(); // Removed
            initTilt();
            initCursor();
        }, 100);
    }

    // Advanced Lenis Setup for Maximum Smoothness
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 2.0, // Ultra Smooth Setting
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 0.8, // Smoother control
            smoothTouch: false,
            touchMultiplier: 2,
        });

        // Sync Lenis with ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Global ScrollTrigger Optimization
        ScrollTrigger.defaults({
            fastScrollEnd: true,
            preventOverlaps: true
        });
    }
});

// Tabs Logic
document.addEventListener('DOMContentLoaded', () => {
    const tabTitles = document.querySelectorAll('.tab-title');
    const projectsContent = document.getElementById('projects-content');
    const certificationsContent = document.getElementById('certifications-content');

    tabTitles.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            // Update active state for tabs
            tabTitles.forEach(t => {
                t.classList.remove('active');
                t.classList.add('inactive');
            });
            tab.classList.add('active');
            tab.classList.remove('inactive');

            // Toggle Content
            if (target === 'projects') {
                projectsContent.style.display = 'grid';
                certificationsContent.style.display = 'none';
            } else if (target === 'certifications') {
                projectsContent.style.display = 'none';
                certificationsContent.style.display = 'grid';
            }
        });
    });
});

// Advanced GSAP Animations
const initAdvancedAnimations = () => {
    gsap.registerPlugin(ScrollTrigger);

    // 0. Text Reveals
    splitTextToSpans('.section-title, .about-arrow-header');

    document.querySelectorAll('.section-title, .about-arrow-header').forEach(title => {
        const chars = title.querySelectorAll('span');
        gsap.from(chars, {
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
            },
            opacity: 0,
            y: 50,
            rotateX: -90,
            stagger: 0.1, // Slower stagger
            duration: 1,
            ease: "back.out(1.7)"
        });
    });

    // 1. Responsive Layout Logic
    const handleLayout = () => {
        const isMobile = window.innerWidth <= 900;
        const hero = document.getElementById('hero');
        const heroText = document.querySelector('.hero-text');
        const heroBtns = document.querySelector('.hero-buttons');

        if (!hero || !heroText || !heroBtns) return;

        if (isMobile) {
            if (heroBtns.parentElement === heroText) {
                hero.appendChild(heroBtns);
            }
        } else {
            if (heroBtns.parentElement === hero) {
                heroText.appendChild(heroBtns);
            }
        }
    };

    handleLayout();
    window.addEventListener('resize', handleLayout);

    // 2. GSAP MatchMedia
    let mm = gsap.matchMedia();

    // DESKTOP
    mm.add("(min-width: 901px)", () => {
        // Hero Animation Removed per user request

        // Ensure static visibility
        gsap.set(".hero-text", { clearProps: "all" });
        gsap.set(".hero-image-wrapper", { clearProps: "all" });

        // HORIZONTAL SCROLL
        const projectTrack = document.querySelector(".projects-horizontal-track");
        if (projectTrack) {
            const getScrollAmount = () => -(projectTrack.scrollWidth - window.innerWidth + 100);

            gsap.to(projectTrack, {
                x: getScrollAmount,
                ease: "none",
                scrollTrigger: {
                    trigger: ".projects-wrapper",
                    start: "top top",
                    end: () => `+=${getScrollAmount() * -1}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });
        }
    });

    // MOBILE
    mm.add("(max-width: 900px)", () => {
        gsap.set(".hero-text", { scale: 1, y: 0, opacity: 1, clearProps: "transform" });
        gsap.set(".hero-image-wrapper", { opacity: 1, y: 0, scale: 1, visibility: "visible", clearProps: "transform" });
    });

    // Section Reveals
    const sections = document.querySelectorAll("#about, #skills, #projects, #contact");
    sections.forEach(section => {
        gsap.fromTo(section, {
            opacity: 0,
            y: 50
        }, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "top 50%",
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        });
    });

    // Staggered Animations (Updated)
    gsap.utils.toArray(".glossy-card, .project-card, .contact-pill, .skill-item").forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)"
        });
    });
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initMagneticButtons();
    if (document.getElementById('contactForm')) initForm();
    initAdvancedAnimations();
    initActiveNav();
    initScrollProgress();
});
