// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
});

// ===== MOBILE MENU =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const srElements = document.querySelectorAll('.sr, .sr-left, .sr-right, .sr-scale');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('sr-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    srElements.forEach(el => observer.observe(el));
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ===== MAGNETIC BUTTONS =====
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ===== 3D TILT ON PHONE =====
function initPhoneTilt() {
    const phone = document.querySelector('.phone-mockup');
    if (!phone) return;
    
    const wrapper = phone.closest('.phone-wrapper');
    
    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        phone.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-10px)`;
    });
    
    wrapper.addEventListener('mouseleave', () => {
        phone.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
    });
}

// ===== RIPPLE EFFECT ON BUTTONS =====
function initRipple() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${e.clientX - rect.left - size/2}px;
                top: ${e.clientY - rect.top - size/2}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to { transform: scale(2); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ===== PDF TOOL ANIMATION =====
function initPdfToolAnimation() {
    const toolBtns = document.querySelectorAll('.pdf-tool-btn');
    let currentIndex = 0;
    
    setInterval(() => {
        toolBtns.forEach(btn => btn.classList.remove('active'));
        toolBtns[currentIndex].classList.add('active');
        currentIndex = (currentIndex + 1) % toolBtns.length;
    }, 2000);
}

// ===== PDF LINE ANIMATION =====
function initPdfLineAnimation() {
    const pdfLines = document.querySelectorAll('.pdf-line');
    
    pdfLines.forEach((line, index) => {
        line.style.animation = `pdfLinePulse 3s ease-in-out ${index * 0.2}s infinite`;
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pdfLinePulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.7; }
        }
    `;
    document.head.appendChild(style);
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initMagneticButtons();
    initPhoneTilt();
    initRipple();
    initPdfToolAnimation();
    initPdfLineAnimation();
});
