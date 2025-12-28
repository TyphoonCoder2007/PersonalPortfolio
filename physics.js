
// Antigravity Physics Engine (High-Performance Spring System)
class SpringSolver {
    constructor(tension = 170, friction = 26) {
        this.tension = tension;
        this.friction = friction;
        this.currentValue = 0;
        this.targetValue = 0;
        this.velocity = 0;
    }

    update(dt) {
        const force = (this.targetValue - this.currentValue) * this.tension;
        const acceleration = force - this.velocity * this.friction;
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

        // Physics Solvers (X and Y axes)
        // High tension/low friction for "snappy" magnetic feel
        // Low tension/low friction for "floaty" feel
        const tension = this.isMagnetic ? 120 : 20;
        const friction = this.isMagnetic ? 12 : 5;

        this.springX = new SpringSolver(tension, friction);
        this.springY = new SpringSolver(tension, friction);

        this.mouseX = 0;
        this.mouseY = 0;
        this.isActive = false;

        this.init();
    }

    init() {
        if (this.isMagnetic) {
            this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
            this.element.addEventListener('mouseleave', () => this.onMouseLeave());
            // Update rect on scroll/resize to keep physics accurate
            window.addEventListener('scroll', () => this.updateRect(), { passive: true });
            window.addEventListener('resize', () => this.updateRect(), { passive: true });
        }

        if (this.isFloating) {
            // For global floating/parallax elements
            window.addEventListener('mousemove', (e) => this.onGlobalMouseMove(e), { passive: true });
        }
    }

    updateRect() {
        this.rect = this.element.getBoundingClientRect();
    }

    onMouseMove(e) {
        this.isActive = true;
        // Calculate distance from center
        const x = (e.clientX - this.rect.left) - this.rect.width / 2;
        const y = (e.clientY - this.rect.top) - this.rect.height / 2;

        this.springX.setTarget(x * 0.5); // 0.5 is the magnetic pull strength
        this.springY.setTarget(y * 0.5);
    }

    onGlobalMouseMove(e) {
        // Parallax effect relative to center of screen
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const moveX = (e.clientX - centerX) * 0.02; // Subtle factor
        const moveY = (e.clientY - centerY) * 0.02;

        this.springX.setTarget(moveX);
        this.springY.setTarget(moveY);
    }

    onMouseLeave() {
        this.isActive = false;
        this.springX.setTarget(0);
        this.springY.setTarget(0);
    }

    render(dt) {
        const x = this.springX.update(dt);
        const y = this.springY.update(dt);

        // Optimization: Stop updating if minimal movement and target is 0
        if (!this.isActive && Math.abs(x) < 0.01 && Math.abs(y) < 0.01 && Math.abs(this.springX.velocity) < 0.01) {
            return;
        }

        // Sub-pixel rendering with translate3d for GPU promotion
        this.element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
}

// Master Loop
class PhysicsWorld {
    constructor() {
        this.elements = [];
        this.lastTime = performance.now();
        this.frameRequest = null;
        this.initLoop();
    }

    addElement(el, options) {
        this.elements.push(new AntigravityElement(el, options));
    }

    initLoop() {
        const loop = (time) => {
            const dt = (time - this.lastTime) / 1000;
            this.lastTime = time;

            // Cap dt to prevent physics explosions on lag
            const safeDt = Math.min(dt, 0.1);

            this.elements.forEach(el => el.render(safeDt));
            this.frameRequest = requestAnimationFrame(loop);
        };
        this.frameRequest = requestAnimationFrame(loop);
    }
}

const world = new PhysicsWorld();

// Init function to replace old magnetic buttons
const initAntigravity = () => {
    // Magnetic Buttons
    const magnets = document.querySelectorAll('.cta-button, .nav-links a, .contact-box');
    magnets.forEach(el => {
        world.addElement(el, { magnetic: true });
    });

    // Floating Parallax Elements
    const floaters = document.querySelectorAll('.glossy-card, .project-card');
    floaters.forEach(el => {
        world.addElement(el, { floating: true });
    });
};
