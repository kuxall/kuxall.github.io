/**
 * Animation Utilities Library
 * Centralized animation functions for the portfolio
 */

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Intersection Observer for scroll-based animations
export const observeElements = (
  selector: string,
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
) => {
  if (typeof window === 'undefined') return;
  
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    ...options,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, defaultOptions);

  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => observer.observe(el));

  return observer;
};

// Stagger animation for multiple elements
export const staggerAnimation = (
  elements: NodeListOf<Element> | Element[],
  animationClass: string,
  delay: number = 100
) => {
  if (prefersReducedMotion()) {
    elements.forEach((el) => el.classList.add(animationClass));
    return;
  }

  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add(animationClass);
    }, index * delay);
  });
};

// Typing effect
export const typingEffect = (
  element: HTMLElement,
  text: string,
  speed: number = 50,
  callback?: () => void
) => {
  if (prefersReducedMotion()) {
    element.textContent = text;
    callback?.();
    return;
  }

  let index = 0;
  element.textContent = '';

  const type = () => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    } else {
      callback?.();
    }
  };

  type();
};

// Particle System for Neural Network Background
export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private mouse: { x: number; y: number } = { x: 0, y: 0 };

  constructor(canvas: HTMLCanvasElement, particleCount: number = 80) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.initParticles(particleCount);
    this.setupEventListeners();
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private initParticles(count: number) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this.canvas.width, this.canvas.height));
    }
  }

  private setupEventListeners() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  public start() {
    if (prefersReducedMotion()) return;
    this.animate();
  }

  public stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles.forEach((particle) => {
      particle.update(this.mouse);
      particle.draw(this.ctx);
    });

    // Draw connections
    this.drawConnections();

    this.animationId = requestAnimationFrame(this.animate);
  };

  private drawConnections() {
    const maxDistance = 150;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.5;
          this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
}

class Particle {
  public x: number;
  public y: number;
  private vx: number;
  private vy: number;
  private radius: number;
  private baseX: number;
  private baseY: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.baseX = this.x;
    this.baseY = this.y;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 1;
  }

  public update(mouse: { x: number; y: number }) {
    // Move particle
    this.x += this.vx;
    this.y += this.vy;

    // Mouse interaction
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 100;

    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance;
      this.x -= (dx / distance) * force * 2;
      this.y -= (dy / distance) * force * 2;
    }

    // Return to base position
    const returnForce = 0.05;
    this.x += (this.baseX - this.x) * returnForce;
    this.y += (this.baseY - this.y) * returnForce;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Smooth scroll with easing
export const smoothScrollTo = (target: string | number, duration: number = 1000) => {
  const targetPosition = typeof target === 'number' 
    ? target 
    : document.querySelector(target)?.getBoundingClientRect().top! + window.pageYOffset - 80;

  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

// Counter animation
export const animateCounter = (
  element: HTMLElement,
  target: number,
  duration: number = 2000,
  suffix: string = ''
) => {
  if (prefersReducedMotion()) {
    element.textContent = target + suffix;
    return;
  }

  let startTime: number | null = null;
  const startValue = 0;

  const animate = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const currentValue = Math.floor(startValue + (target - startValue) * progress);
    
    element.textContent = currentValue + suffix;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};
