document.addEventListener('DOMContentLoaded', function () {

    // CURSOR
    var cursor = document.getElementById('cursor');
    var cursorRing = document.getElementById('cursor-ring');
    var cX = -100, cY = -100, rX = -100, rY = -100;

    document.addEventListener('mousemove', function (e) {
        cX = e.clientX; cY = e.clientY;
        cursor.style.left = cX + 'px'; cursor.style.top = cY + 'px';
    });
    function animRing() { rX += (cX - rX) * 0.15; rY += (cY - rY) * 0.15; cursorRing.style.left = rX + 'px'; cursorRing.style.top = rY + 'px'; requestAnimationFrame(animRing); }
    animRing();

    var hoverEls = document.querySelectorAll('a, button, .feature-card, .contact-card, .app-tool-card, .extra-card, .value-card');
    for (var i = 0; i < hoverEls.length; i++) {
        (function (el) {
            el.addEventListener('mouseenter', function () { document.body.classList.add('hovering'); });
            el.addEventListener('mouseleave', function () { document.body.classList.remove('hovering'); });
        })(hoverEls[i]);
    }

    // PARTICLES
    var canvas = document.getElementById('particles');
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mX = 0, mY = 0;
    var COLORS = ['200,255,0','255,45,120','0,245,255','155,0,255','255,107,0'];

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);

    function Particle() { this.reset(); }
    Particle.prototype.reset = function () { this.x = Math.random()*canvas.width; this.y = Math.random()*canvas.height; this.size = Math.random()*1.8+0.4; this.speedX = (Math.random()-0.5)*0.5; this.speedY = (Math.random()-0.5)*0.5; this.opacity = Math.random()*0.3+0.05; this.base = this.opacity; this.color = COLORS[Math.floor(Math.random()*COLORS.length)]; };
    Particle.prototype.update = function () { this.x += this.speedX; this.y += this.speedY; var dx=mX-this.x, dy=mY-this.y, d=Math.sqrt(dx*dx+dy*dy); if(d<150){var f=(150-d)/150; this.x-=dx*0.004*f; this.y-=dy*0.004*f; this.opacity=Math.min(this.base+f*0.5,0.8);} else {this.opacity+=(this.base-this.opacity)*0.05;} if(this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height) this.reset(); };
    Particle.prototype.draw = function () { ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fillStyle='rgba('+this.color+','+this.opacity+')'; ctx.fill(); };

    function init() { var n = window.innerWidth < 768 ? 28 : 60; particles=[]; for(var i=0;i<n;i++) particles.push(new Particle()); }
    function connect() { for(var i=0;i<particles.length;i++) for(var j=i+1;j<particles.length;j++){var dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,d=Math.sqrt(dx*dx+dy*dy); if(d<80){ctx.beginPath();ctx.strokeStyle='rgba(200,255,0,'+(1-d/80)*0.07+')';ctx.lineWidth=0.5;ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.stroke();}} }
    function anim() { ctx.clearRect(0,0,canvas.width,canvas.height); for(var i=0;i<particles.length;i++){particles[i].update();particles[i].draw();} connect(); requestAnimationFrame(anim); }
    init(); anim();
    document.addEventListener('mousemove', function (e) { mX=e.clientX; mY=e.clientY; });

    // NAVBAR
    var navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function () { navbar.classList.toggle('scrolled', window.scrollY > 50); });

    // MOBILE MENU
    var menuToggle = document.getElementById('menuToggle');
    var navLinks = document.getElementById('navLinks');
    if (menuToggle) {
        menuToggle.addEventListener('click', function () { navLinks.classList.toggle('active'); menuToggle.classList.toggle('active'); });
    }
    document.querySelectorAll('.nav-links a').forEach(function (a) { a.addEventListener('click', function () { navLinks.classList.remove('active'); menuToggle.classList.remove('active'); }); });

    // SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            var t = document.querySelector(href);
            if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - navbar.offsetHeight - 20, behavior: 'smooth' });
        });
    });

    // SCROLL REVEAL
    var srEls = document.querySelectorAll('.sr, .sr-left, .sr-right, .sr-scale');
    function reveal() { var wh = window.innerHeight; srEls.forEach(function (el) { if (!el.classList.contains('sr-visible') && el.getBoundingClientRect().top < wh * 0.9) el.classList.add('sr-visible'); }); }
    reveal(); window.addEventListener('scroll', reveal, { passive: true }); window.addEventListener('resize', reveal, { passive: true });

    // BLOB PARALLAX
    var blobs = document.querySelectorAll('.hero-blob');
    window.addEventListener('scroll', function () { var s = window.pageYOffset; blobs.forEach(function (b, i) { b.style.transform = 'translateY(' + s * (i + 1) * 0.06 + 'px)'; }); }, { passive: true });

    // TOOL CARD CYCLE
    var toolCards = document.querySelectorAll('.app-tool-card');
    var activeTool = 0;
    if (toolCards.length > 0) { setInterval(function () { toolCards.forEach(function (c, i) { c.style.borderColor = i === activeTool ? 'rgba(200,255,0,0.4)' : ''; c.style.background = i === activeTool ? 'rgba(200,255,0,0.06)' : ''; }); activeTool = (activeTool + 1) % toolCards.length; }, 1600); }

    // STATUS SAVE ANIMATION
    var saveBtns = [document.getElementById('sBtn1'), document.getElementById('sBtn3')];
    setInterval(function () {
        var btn = saveBtns[Math.floor(Math.random() * saveBtns.length)];
        if (!btn) return;
        btn.classList.add('saved');
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>';
        setTimeout(function () { btn.classList.remove('saved'); btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19,9H15V3H9V9H5L12,16L19,9M5,18V20H19V18H5Z"/></svg>'; }, 2000);
    }, 3000);

    // MAGNETIC BUTTONS
    if (window.innerWidth > 768) {
        document.querySelectorAll('.btn-glow').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) { var r = btn.getBoundingClientRect(); var x = e.clientX - r.left - r.width/2; var y = e.clientY - r.top - r.height/2; btn.style.transform = 'translate('+x*0.2+'px,'+( y*0.2-2)+'px)'; });
            btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
        });
    }

    // TILT CARDS
    if (window.innerWidth > 768) {
        document.querySelectorAll('.contact-card, .feature-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) { var r = card.getBoundingClientRect(); var rx = ((e.clientY-r.top)/r.height-0.5)*10; var ry = ((r.left+r.width/2-e.clientX)/r.width)*10; card.style.transform = 'perspective(800px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-4px)'; });
            card.addEventListener('mouseleave', function () { card.style.transform = ''; });
        });
    }

    // CLICK BURST
    document.addEventListener('click', function (e) {
        var b = document.createElement('div');
        b.style.cssText = 'position:fixed;left:'+e.clientX+'px;top:'+e.clientY+'px;width:6px;height:6px;border-radius:50%;background:#C8FF00;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);animation:burstAnim 0.5s ease-out forwards';
        document.body.appendChild(b); setTimeout(function () { b.remove(); }, 500);
    });
    var bs = document.createElement('style');
    bs.textContent = '@keyframes burstAnim{0%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(-50%,-50%) scale(8);opacity:0}}';
    document.head.appendChild(bs);

    // BG TEXT PARALLAX
    var bgText = document.querySelector('.hero-bg-text');
    if (bgText) { window.addEventListener('scroll', function () { bgText.style.transform = 'translate(-50%,calc(-50%+'+window.pageYOffset*0.3+'px))'; }, { passive: true }); }

    // TYPE EFFECT
    var desc = document.getElementById('heroDesc');
    if (desc) { var t = desc.textContent; desc.textContent = ''; var ci = 0; setTimeout(function go() { if(ci<t.length){desc.textContent+=t[ci];ci++;setTimeout(go,16);} }, 800); }

});
