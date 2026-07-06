document.addEventListener('DOMContentLoaded', function () {

    // ===== CUSTOM CURSOR =====
    var cursor = document.getElementById('cursor');
    var cursorRing = document.getElementById('cursor-ring');
    var cursorX = -100, cursorY = -100;
    var ringX = -100, ringY = -100;
    var isHovering = false;

    document.addEventListener('mousemove', function (e) {
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
    });

    // Lag the ring
    function animateRing() {
        ringX += (cursorX - ringX) * 0.15;
        ringY += (cursorY - ringY) * 0.15;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effects
    var hoverTargets = document.querySelectorAll('a, button, .value-card, .contact-card, .app-tool-card, .btn');
    for (var i = 0; i < hoverTargets.length; i++) {
        (function (el) {
            el.addEventListener('mouseenter', function () {
                document.body.classList.add('hovering');
                cursor.style.background = '#C8FF00';
            });
            el.addEventListener('mouseleave', function () {
                document.body.classList.remove('hovering');
                cursor.style.background = '#C8FF00';
            });
        })(hoverTargets[i]);
    }

    // ===== PARTICLES (colourful, multi-colour) =====
    var canvas = document.getElementById('particles');
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mX = 0, mY = 0;

    var COLORS = [
        '200, 255, 0',
        '255, 45, 120',
        '0, 245, 255',
        '155, 0, 255',
        '255, 107, 0'
    ];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function Particle() { this.reset(); }

    Particle.prototype.reset = function () {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.35 + 0.05;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.baseOpacity = this.opacity;
    };

    Particle.prototype.update = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        var dx = mX - this.x;
        var dy = mY - this.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            var force = (150 - dist) / 150;
            this.x -= dx * 0.004 * force;
            this.y -= dy * 0.004 * force;
            this.opacity = Math.min(this.baseOpacity + force * 0.5, 0.8);
        } else {
            this.opacity += (this.baseOpacity - this.opacity) * 0.05;
        }
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    };

    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + this.color + ', ' + this.opacity + ')';
        ctx.fill();
    };

    function initParticles() {
        var isMobile = window.innerWidth < 768;
        var count = isMobile ? 30 : 70;
        particles = [];
        for (var i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 80) {
                    var alpha = (1 - dist / 80) * 0.08;
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(200, 255, 0, ' + alpha + ')';
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    document.addEventListener('mousemove', function (e) {
        mX = e.clientX;
        mY = e.clientY;
    });

    // ===== NAVBAR =====
    var navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== MOBILE MENU =====
    var menuToggle = document.getElementById('menuToggle');
    var navLinks = document.getElementById('navLinks');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    var navItems = document.querySelectorAll('.nav-links a');
    for (var i = 0; i < navItems.length; i++) {
        navItems[i].addEventListener('click', function () {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    }

    // ===== SMOOTH SCROLL =====
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                var offset = navbar.offsetHeight + 20;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    }

    // ===== SCROLL REVEAL =====
    var srEls = document.querySelectorAll('.sr, .sr-left, .sr-right, .sr-scale');

    function checkReveal() {
        var wh = window.innerHeight;
        for (var i = 0; i < srEls.length; i++) {
            var el = srEls[i];
            if (el.classList.contains('sr-visible')) continue;
            var rect = el.getBoundingClientRect();
            if (rect.top < wh * 0.9) {
                el.classList.add('sr-visible');
            }
        }
    }

    checkReveal();
    window.addEventListener('scroll', checkReveal, { passive: true });
    window.addEventListener('resize', checkReveal, { passive: true });

    // ===== PARALLAX BLOBS =====
    var blobs = document.querySelectorAll('.hero-blob');
    window.addEventListener('scroll', function () {
        var scrollY = window.pageYOffset;
        for (var i = 0; i < blobs.length; i++) {
            var speed = (i + 1) * 0.06;
            blobs[i].style.transform = 'translateY(' + (scrollY * speed) + 'px)';
        }
    }, { passive: true });

    // ===== CARD TAG CYCLE (hero) =====
    var cardTags = document.querySelectorAll('.card-tag');
    var activeTag = 0;
    if (cardTags.length > 0) {
        setInterval(function () {
            for (var i = 0; i < cardTags.length; i++) {
                if (i === activeTag) {
                    cardTags[i].style.color = '#C8FF00';
                    cardTags[i].style.borderColor = 'rgba(200,255,0,0.3)';
                    cardTags[i].style.background = 'rgba(200,255,0,0.08)';
                } else {
                    cardTags[i].style.color = '';
                    cardTags[i].style.borderColor = '';
                    cardTags[i].style.background = '';
                }
            }
            activeTag = (activeTag + 1) % cardTags.length;
        }, 1800);
    }

    // ===== PHONE TOOL CARD CYCLE =====
    var toolCards = document.querySelectorAll('.app-tool-card');
    var activeTool = 0;
    if (toolCards.length > 0) {
        setInterval(function () {
            for (var i = 0; i < toolCards.length; i++) {
                if (i === activeTool) {
                    toolCards[i].style.borderColor = 'rgba(200,255,0,0.4)';
                    toolCards[i].style.background = 'rgba(200,255,0,0.06)';
                } else {
                    toolCards[i].style.borderColor = '';
                    toolCards[i].style.background = '';
                }
            }
            activeTool = (activeTool + 1) % toolCards.length;
        }, 1600);
    }

    // ===== PDF TOOL ACTIVE CYCLE =====
    var pdfBtns = document.querySelectorAll('.pdf-tool-btn');
    var activePdf = 0;
    if (pdfBtns.length > 0) {
        setInterval(function () {
            for (var i = 0; i < pdfBtns.length; i++) {
                pdfBtns[i].classList.toggle('active', i === activePdf);
            }
            activePdf = (activePdf + 1) % pdfBtns.length;
        }, 1500);
    }

    // ===== MAGNETIC BUTTONS =====
    if (window.innerWidth > 768) {
        var magBtns = document.querySelectorAll('.btn-glow');
        for (var i = 0; i < magBtns.length; i++) {
            (function (btn) {
                btn.addEventListener('mousemove', function (e) {
                    var rect = btn.getBoundingClientRect();
                    var x = e.clientX - rect.left - rect.width / 2;
                    var y = e.clientY - rect.top - rect.height / 2;
                    btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2 - 2) + 'px)';
                });
                btn.addEventListener('mouseleave', function () {
                    btn.style.transform = '';
                });
            })(magBtns[i]);
        }
    }

    // ===== TEXT SCRAMBLE (hero heading letters) =====
    function scrambleText(el, finalText, duration) {
        var chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`';
        var frameDelay = 40;
        var frames = Math.floor(duration / frameDelay);
        var frame = 0;
        var interval = setInterval(function () {
            var progress = frame / frames;
            var result = '';
            for (var i = 0; i < finalText.length; i++) {
                if (finalText[i] === ' ') { result += ' '; continue; }
                if (i / finalText.length < progress) {
                    result += finalText[i];
                } else {
                    result += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            el.textContent = result;
            frame++;
            if (frame > frames) {
                el.textContent = finalText;
                clearInterval(interval);
            }
        }, frameDelay);
    }

    var heroWords = document.querySelectorAll('.hero-word-1, .hero-word-2, .hero-word-3');
    setTimeout(function () {
        heroWords[0] && scrambleText(heroWords[0], heroWords[0].textContent, 500);
    }, 200);
    setTimeout(function () {
        heroWords[1] && scrambleText(heroWords[1], heroWords[1].textContent, 500);
    }, 450);
    setTimeout(function () {
        heroWords[2] && scrambleText(heroWords[2], heroWords[2].textContent, 500);
    }, 700);

    // ===== TILT ON CONTACT CARDS =====
    if (window.innerWidth > 768) {
        var tiltCards = document.querySelectorAll('.contact-card, .value-card');
        for (var i = 0; i < tiltCards.length; i++) {
            (function (card) {
                card.addEventListener('mousemove', function (e) {
                    var rect = card.getBoundingClientRect();
                    var x = e.clientX - rect.left;
                    var y = e.clientY - rect.top;
                    var cx = rect.width / 2;
                    var cy = rect.height / 2;
                    var rx = ((y - cy) / cy) * 5;
                    var ry = ((cx - x) / cx) * 5;
                    card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
                });
                card.addEventListener('mouseleave', function () {
                    card.style.transform = '';
                });
            })(tiltCards[i]);
        }
    }

    // ===== CLICK BURST EFFECT =====
    document.addEventListener('click', function (e) {
        var burst = document.createElement('div');
        burst.style.cssText = [
            'position:fixed',
            'left:' + e.clientX + 'px',
            'top:' + e.clientY + 'px',
            'width:6px',
            'height:6px',
            'border-radius:50%',
            'background:#C8FF00',
            'pointer-events:none',
            'z-index:99999',
            'transform:translate(-50%,-50%)',
            'animation:burstAnim 0.5s ease-out forwards'
        ].join(';');
        document.body.appendChild(burst);
        setTimeout(function () { burst.remove(); }, 500);
    });

    // Inject burst keyframes once
    var burstStyle = document.createElement('style');
    burstStyle.textContent = '@keyframes burstAnim { 0%{transform:translate(-50%,-50%) scale(1);opacity:1} 100%{transform:translate(-50%,-50%) scale(8);opacity:0} }';
    document.head.appendChild(burstStyle);

    // ===== PARALLAX MOUSE on hero card =====
    var heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && window.innerWidth > 768) {
        document.addEventListener('mousemove', function (e) {
            var relX = (e.clientX / window.innerWidth - 0.5) * 20;
            var relY = (e.clientY / window.innerHeight - 0.5) * 20;
            heroVisual.style.transform = 'perspective(1200px) rotateY(' + relX * 0.4 + 'deg) rotateX(' + (-relY * 0.4) + 'deg)';
        });
    }

    // ===== TYPING EFFECT on tagline =====
    var tagline = document.querySelector('.hero-desc');
    if (tagline) {
        var originalText = tagline.textContent;
        tagline.textContent = '';
        var charIdx = 0;
        setTimeout(function typeIt() {
            if (charIdx < originalText.length) {
                tagline.textContent += originalText[charIdx];
                charIdx++;
                setTimeout(typeIt, 18);
            }
        }, 900);
    }

    // ===== COUNT-UP on hero stats =====
    function countUp(el, end, suffix, duration) {
        var start = 0;
        var step = end / (duration / 16);
        var current = start;
        var timer = setInterval(function () {
            current = Math.min(current + step, end);
            el.textContent = Math.round(current) + (suffix || '');
            if (current >= end) clearInterval(timer);
        }, 16);
    }

    var statApps = document.getElementById('statApps');
    if (statApps) {
        var observed = false;
        var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting && !observed) {
                observed = true;
                countUp(statApps, 2, '', 800);
            }
        });
        observer.observe(statApps);
    }

    // ===== HERO BG TEXT PARALLAX =====
    var heroBgText = document.querySelector('.hero-bg-text');
    if (heroBgText) {
        window.addEventListener('scroll', function () {
            heroBgText.style.transform = 'translate(-50%, calc(-50% + ' + (window.pageYOffset * 0.3) + 'px))';
        }, { passive: true });
    }

});