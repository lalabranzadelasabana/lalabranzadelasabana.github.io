// Cursor Light Trails
const canvas = document.getElementById('cursorTrails');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let mouseX = 0;
let mouseY = 0;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.life = 100;
        this.color = getComputedStyle(document.body).getPropertyValue('--accent-gold').trim();
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 2;
        if (this.size > 0.2) this.size -= 0.05;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life / 100;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
    }
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    for (let i = 0; i < 3; i++) {
        particles.push(new Particle(mouseX, mouseY));
    }
});

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Control Buttons
const menuBtn = document.getElementById('menuBtn');
const musicToggle = document.getElementById('musicToggle');
const soundToggle = document.getElementById('soundToggle');
const infoPopup = document.getElementById('infoPopup');
const closePopup = document.getElementById('closePopup');

let musicEnabled = true;
let soundEnabled = true;

menuBtn.addEventListener('click', () => {
    infoPopup.classList.remove('hidden');
});

closePopup.addEventListener('click', () => {
    infoPopup.classList.add('hidden');
});

infoPopup.addEventListener('click', (e) => {
    if (e.target === infoPopup) {
        infoPopup.classList.add('hidden');
    }
});

musicToggle.addEventListener('click', () => {
    musicEnabled = !musicEnabled;
    musicToggle.classList.toggle('active');
    // Here you would control background music
    console.log('Music:', musicEnabled ? 'ON' : 'OFF');
});

soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.classList.toggle('active');
    // Here you would control sound effects
    console.log('Sound Effects:', soundEnabled ? 'ON' : 'OFF');
});

// Audio Buttons
const audioButtons = document.querySelectorAll('.audio-btn');

audioButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const audioNum = btn.dataset.audio;
        btn.classList.toggle('playing');
        
        // Simulate audio playback
        console.log(`Playing audio ${audioNum}`);
        
        // Here you would integrate actual audio playback
        // For example: new Audio(`audio${audioNum}.mp3`).play();
        
        setTimeout(() => {
            btn.classList.remove('playing');
        }, 3000);
    });
});

// Interactive 3D Orb
const orb = document.getElementById('interactiveOrb');
const orbName = document.getElementById('orbName');
let orbRotationX = 0;
let orbRotationY = 0;
let orbInteractions = 0;

orb.addEventListener('mousedown', (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    
    function onMouseMove(e) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        orbRotationY += deltaX * 0.5;
        orbRotationX -= deltaY * 0.5;
        
        orb.style.transform = `rotateX(${orbRotationX}deg) rotateY(${orbRotationY}deg)`;
        
        orbInteractions++;
        
        if (orbInteractions > 20 && orbName.classList.contains('hidden')) {
            orbName.classList.remove('hidden');
            orbName.classList.add('visible');
            if (soundEnabled) {
                console.log('Play reveal sound');
            }
        }
    }
    
    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

// Touch support for mobile
orb.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    
    function onTouchMove(e) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        
        orbRotationY += deltaX * 0.5;
        orbRotationX -= deltaY * 0.5;
        
        orb.style.transform = `rotateX(${orbRotationX}deg) rotateY(${orbRotationY}deg)`;
        
        orbInteractions++;
        
        if (orbInteractions > 20 && orbName.classList.contains('hidden')) {
            orbName.classList.remove('hidden');
            orbName.classList.add('visible');
        }
    }
    
    function onTouchEnd() {
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
    }
    
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
});

// Earth Info Button
const earthInfoBtn = document.getElementById('earthInfoBtn');
const earthInfo = document.getElementById('earthInfo');
const earthImg = document.querySelector('.earth-img');

earthInfoBtn.addEventListener('click', () => {
    earthInfo.classList.toggle('visible');
    earthImg.classList.toggle('rotated');
});

// Rotating Circles
const rotatingCircles = document.querySelectorAll('.rotating-circle');

rotatingCircles.forEach(circle => {
    circle.addEventListener('click', () => {
        let currentRotation = parseInt(circle.dataset.rotation) || 0;
        currentRotation += 90;
        circle.dataset.rotation = currentRotation;
        circle.style.transform = `rotate(${currentRotation}deg)`;
    });
});

// Theme Toggle
const themeButtons = document.querySelectorAll('.theme-btn');

themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        document.body.className = `${theme}-theme`;
        
        // Update particle colors
        particles.forEach(particle => {
            particle.color = getComputedStyle(document.body).getPropertyValue('--accent-gold').trim();
        });
        
        if (soundEnabled) {
            console.log('Play theme change sound');
        }
    });
});

// Scroll Animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

const fadeElements = document.querySelectorAll('.fade-in-scroll');
fadeElements.forEach(el => observer.observe(el));

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !infoPopup.classList.contains('hidden')) {
        infoPopup.classList.add('hidden');
    }
});

// Performance: Throttle particle creation on slower devices
let lastParticleTime = 0;
const particleThrottle = 16; // ~60fps

document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastParticleTime < particleThrottle) return;
    lastParticleTime = now;
});

console.log('Cosmogonía Muisca - Interactive Experience Loaded');