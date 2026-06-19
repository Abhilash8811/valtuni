document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('particles');
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouseX = 0, mouseY = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function Particle() {
        this.reset();
    }

    Particle.prototype.reset = function() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.5 ? '0, 200, 83' : '0, 230, 118';
    };

    Particle.prototype.update = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        var dx = mouseX - this.x;
        var dy = mouseY - this.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
            this.x -= dx * 0.002;
            this.y -= dy * 0.002;
            this.opacity = Math.min(this.opacity + 0.02, 0.6);
        } else {
            this.opacity = Math.max(this.opacity - 0.008, 0.08);
        }
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    };

    Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + this.color + ', ' + this.opacity + ')';
        ctx.fill();
    };

    function initParticles() {
        var isMobile = window.innerWidth < 768;
        var count = isMobile ? 25 : 50;
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
                if (dist < 100) {
                    var opacity = (1 - dist / 100) * 0.12;
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(0, 200, 83, ' + opacity + ')';
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

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // ===== MOBILE MENU =====
    var menuToggle = document.getElementById('menuToggle');
    var navLinks = document.getElementById('navLinks');

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    var navItems = document.querySelectorAll('.nav-links a');
    for (var i = 0; i < navItems.length; i++) {
        navItems[i].addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    }

    // ===== NAVBAR SCROLL =====
    var navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== SMOOTH SCROLL =====
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', function(e) {
            e.preventDefault();
            var href = this.getAttribute('href');
            var target = document.querySelector(href);
            if (target) {
                var navHeight = navbar.offsetHeight;
                var targetPosition = target.offsetTop - navHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    }

    // ===== SCROLL REVEAL =====
    var srElements = document.querySelectorAll('.sr, .sr-left, .sr-right, .sr-scale');

    function checkReveal() {
        var windowHeight = window.innerHeight;
        for (var i = 0; i < srElements.length; i++) {
            var el = srElements[i];
            if (el.classList.contains('sr-visible')) continue;
            var rect = el.getBoundingClientRect();
            var triggerPoint = windowHeight * 0.88;
            if (rect.top < triggerPoint) {
                el.classList.add('sr-visible');
            }
        }
    }

    checkReveal();
    window.addEventListener('scroll', checkReveal, { passive: true });
    window.addEventListener('resize', checkReveal, { passive: true });

    // ===== COUNTERS =====
    var statNumbers = document.querySelectorAll('.stat-number');
    var countersAnimated = {};

    function checkCounters() {
        var windowHeight = window.innerHeight;
        for (var i = 0; i < statNumbers.length; i++) {
            var el = statNumbers[i];
            var id = el.dataset.target;
            if (countersAnimated[id]) continue;
            var rect = el.getBoundingClientRect();
            if (rect.top < windowHeight * 0.85) {
                countersAnimated[id] = true;
                animateCounter(el);
            }
        }
    }

    checkCounters();
    window.addEventListener('scroll', checkCounters, { passive: true });

    function animateCounter(element) {
        var target = parseFloat(element.dataset.target);
        var isDecimal = element.dataset.decimal === 'true';
        var duration = 2000;
        var startTime = performance.now();

        function update(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = target * eased;

            if (isDecimal) {
                element.textContent = current.toFixed(1);
            } else if (target >= 10000) {
                element.textContent = Math.floor(current).toLocaleString() + '+';
            } else if (target === 1) {
                element.textContent = Math.floor(current);
            } else {
                element.textContent = Math.floor(current) + '+';
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isDecimal) {
                    element.textContent = target.toFixed(1);
                } else if (target >= 10000) {
                    element.textContent = target.toLocaleString() + '+';
                } else if (target === 1) {
                    element.textContent = target;
                } else {
                    element.textContent = target + '+';
                }
            }
        }

        requestAnimationFrame(update);
    }

    // ===== STATUS SAVE ANIMATION =====
    var statusCards = document.querySelectorAll('.status-card-preview');

    setInterval(function() {
        if (statusCards.length === 0) return;
        var idx = Math.floor(Math.random() * statusCards.length);
        var btn = statusCards[idx].querySelector('.status-save-btn');
        if (!btn) return;
        btn.classList.add('saved');
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>';
        setTimeout(function() {
            btn.classList.remove('saved');
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19,9H15V3H9V9H5L12,16L19,9M5,18V20H19V18H5Z"/></svg>';
        }, 2000);
    }, 3000);

    // ===== PHONE TOOL CYCLE =====
    var phoneScreen = document.querySelector('.phone-screen');
    if (phoneScreen) {
        var toolCards = phoneScreen.querySelectorAll('.app-tool-card');
        var activeTool = 0;

        setInterval(function() {
            for (var i = 0; i < toolCards.length; i++) {
                toolCards[i].style.borderColor = i === activeTool ? 'rgba(0, 200, 83, 0.5)' : 'rgba(255, 255, 255, 0.03)';
                toolCards[i].style.background = i === activeTool ? 'rgba(0, 200, 83, 0.08)' : '';
            }
            activeTool = (activeTool + 1) % toolCards.length;
        }, 2000);
    }

    // ===== TILT ON FEATURE CARDS =====
    if (window.innerWidth > 768) {
        var featureCards = document.querySelectorAll('.feature-card');
        for (var i = 0; i < featureCards.length; i++) {
            (function(card) {
                card.addEventListener('mousemove', function(e) {
                    var rect = card.getBoundingClientRect();
                    var x = e.clientX - rect.left;
                    var y = e.clientY - rect.top;
                    var centerX = rect.width / 2;
                    var centerY = rect.height / 2;
                    var rotateX = (y - centerY) / 25;
                    var rotateY = (centerX - x) / 25;
                    card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
                });
                card.addEventListener('mouseleave', function() {
                    card.style.transform = '';
                });
            })(featureCards[i]);
        }
    }

    // ===== TYPING EFFECT =====
    var tagline = document.querySelector('.tagline');
    if (tagline) {
        var text = tagline.textContent;
        tagline.textContent = '';
        var charIndex = 0;

        setTimeout(function typeWriter() {
            if (charIndex < text.length) {
                tagline.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 40);
            }
        }, 600);
    }

    // ===== PARALLAX SHAPES =====
    var shapes = document.querySelectorAll('.shape');
    window.addEventListener('scroll', function() {
        var scrollY = window.pageYOffset;
        for (var i = 0; i < shapes.length; i++) {
            var speed = (i + 1) * 0.08;
            shapes[i].style.transform = 'translateY(' + (scrollY * speed) + 'px)';
        }
    }, { passive: true });

    // ===== MAGNETIC BUTTONS =====
    if (window.innerWidth > 768) {
        var magneticBtns = document.querySelectorAll('.btn-glow');
        for (var i = 0; i < magneticBtns.length; i++) {
            (function(btn) {
                btn.addEventListener('mousemove', function(e) {
                    var rect = btn.getBoundingClientRect();
                    var x = e.clientX - rect.left - rect.width / 2;
                    var y = e.clientY - rect.top - rect.height / 2;
                    btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px) translateY(-3px)';
                });
                btn.addEventListener('mouseleave', function() {
                    btn.style.transform = '';
                });
            })(magneticBtns[i]);
        }
    }

    // ===== RIPPLE ON FEATURE CARDS =====
    var rippleCards = document.querySelectorAll('.feature-card');
    for (var i = 0; i < rippleCards.length; i++) {
        (function(card) {
            card.addEventListener('click', function(e) {
                var rect = card.getBoundingClientRect();
                var ripple = document.createElement('span');
                ripple.style.cssText = 'position:absolute;border-radius:50%;background:rgba(0,200,83,0.15);transform:scale(0);animation:rippleAnim 0.6s ease-out;pointer-events:none;width:100px;height:100px;left:' + (e.clientX - rect.left - 50) + 'px;top:' + (e.clientY - rect.top - 50) + 'px;';
                card.appendChild(ripple);
                setTimeout(function() { ripple.remove(); }, 600);
            });
        })(rippleCards[i]);
    }

    // ===== BRAND BLOCK WORD CYCLE =====
    var brandWords = document.querySelectorAll('.brand-word');
    if (brandWords.length > 0) {
        var highlightIndex = 0;
        setInterval(function() {
            for (var i = 0; i < brandWords.length; i++) {
                brandWords[i].style.opacity = i === highlightIndex ? '1' : '0.4';
                brandWords[i].style.borderColor = i === highlightIndex ? 'rgba(0, 200, 83, 0.3)' : 'rgba(255, 255, 255, 0.04)';
                brandWords[i].style.color = i === highlightIndex ? 'var(--primary)' : 'var(--text-muted)';
            }
            highlightIndex = (highlightIndex + 1) % brandWords.length;
        }, 2500);
    }
});
