/* ============================================================
   CSF CONSULTING — INTERACTION & ANIMATION ENGINE
   ============================================================ */

(function () {
    'use strict';

    /* --------------------------
       DOM Ready
       -------------------------- */
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        document.body.classList.add('loading');
        preloader();
        setupNavbar();
        setupMobileMenu();
        setupHeroCanvas();
        setupScrollReveal();
        setupCounters();
        setupSmoothScroll();
        setupContactForm();
        setupCustomCursor();
    }

    /* --------------------------
       Preloader
       -------------------------- */
    function preloader() {
        const el = document.getElementById('preloader');
        if (!el) return;

        window.addEventListener('load', function () {
            setTimeout(function () {
                el.classList.add('hidden');
                document.body.classList.remove('loading');
            }, 1800);
        });

        // Safety fallback
        setTimeout(function () {
            el.classList.add('hidden');
            document.body.classList.remove('loading');
        }, 4000);
    }

    /* --------------------------
       Navbar
       -------------------------- */
    function setupNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        var lastScroll = 0;
        var ticking = false;

        window.addEventListener('scroll', function () {
            lastScroll = window.pageYOffset;
            if (!ticking) {
                requestAnimationFrame(function () {
                    if (lastScroll > 60) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /* --------------------------
       Mobile Menu
       -------------------------- */
    function setupMobileMenu() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('mobileMenu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', function () {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.classList.toggle('loading');
        });

        // Close on link click
        var links = menu.querySelectorAll('.mobile-link');
        links.forEach(function (link) {
            link.addEventListener('click', function () {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.classList.remove('loading');
            });
        });
    }

    /* --------------------------
       Hero Canvas — Particle Network
       -------------------------- */
    function setupHeroCanvas() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        var particles = [];
        var animationId;
        var mouse = { x: null, y: null, radius: 120 };

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        function getParticleCount() {
            var w = window.innerWidth;
            if (w < 480) return 25;
            if (w < 768) return 35;
            if (w < 1024) return 50;
            return 70;
        }

        function createParticles() {
            particles = [];
            var count = getParticleCount();
            for (var i = 0; i < count; i++) {
                var isElectric = Math.random() < 0.15;
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    radius: Math.random() * 1.8 + 0.5,
                    color: isElectric ? 'rgba(59, 130, 246,' : 'rgba(201, 168, 76,',
                    baseAlpha: Math.random() * 0.5 + 0.2,
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.01 + 0.005
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    var maxDist = 150;

                    if (dist < maxDist) {
                        var alpha = (1 - dist / maxDist) * 0.12;
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(201, 168, 76, ' + alpha + ')';
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            for (var k = 0; k < particles.length; k++) {
                var p = particles[k];
                p.pulse += p.pulseSpeed;
                var alpha = p.baseAlpha + Math.sin(p.pulse) * 0.15;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color + alpha + ')';
                ctx.fill();

                // Subtle glow
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = p.color + (alpha * 0.1) + ')';
                ctx.fill();
            }
        }

        function updateParticles() {
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];

                // Mouse interaction
                if (mouse.x !== null) {
                    var dx = p.x - mouse.x;
                    var dy = p.y - mouse.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        var force = (mouse.radius - dist) / mouse.radius;
                        p.vx += (dx / dist) * force * 0.02;
                        p.vy += (dy / dist) * force * 0.02;
                    }
                }

                p.x += p.vx;
                p.y += p.vy;

                // Damping
                p.vx *= 0.999;
                p.vy *= 0.999;

                // Bounds
                if (p.x < 0) { p.x = 0; p.vx *= -1; }
                if (p.x > canvas.width) { p.x = canvas.width; p.vx *= -1; }
                if (p.y < 0) { p.y = 0; p.vy *= -1; }
                if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -1; }
            }
        }

        function animate() {
            updateParticles();
            drawParticles();
            animationId = requestAnimationFrame(animate);
        }

        // Mouse tracking
        canvas.addEventListener('mousemove', function (e) {
            var rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', function () {
            mouse.x = null;
            mouse.y = null;
        });

        // Initialize
        resize();
        createParticles();
        animate();

        // Resize handling
        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                cancelAnimationFrame(animationId);
                resize();
                createParticles();
                animate();
            }, 250);
        });

        // Pause when not visible
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    }

    /* --------------------------
       Scroll Reveal (Intersection Observer)
       -------------------------- */
    function setupScrollReveal() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: show everything
            document.querySelectorAll('.reveal').forEach(function (el) {
                el.classList.add('revealed');
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        document.querySelectorAll('.reveal').forEach(function (el) {
            observer.observe(el);
        });

        // Stagger service cards
        var serviceCards = document.querySelectorAll('.service-card');
        var cardObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var cards = entry.target.parentElement.querySelectorAll('.service-card');
                    cards.forEach(function (card, i) {
                        setTimeout(function () {
                            card.classList.add('revealed');
                        }, i * 120);
                    });
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        if (serviceCards.length > 0) {
            cardObserver.observe(serviceCards[0]);
        }
    }

    /* --------------------------
       Counter Animation
       -------------------------- */
    function setupCounters() {
        var counters = document.querySelectorAll('.stat-number');
        if (counters.length === 0) return;

        var statsSection = document.getElementById('stats');
        if (!statsSection) return;

        if (!('IntersectionObserver' in window)) {
            counters.forEach(function (el) {
                el.textContent = el.getAttribute('data-target');
            });
            return;
        }

        var animated = false;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    animateCounters(counters);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(document.getElementById('stats'));
    }

    function animateCounters(counters) {
        counters.forEach(function (counter) {
            var target = parseInt(counter.getAttribute('data-target'), 10);
            var duration = 2000;
            var start = 0;
            var startTime = null;

            // Use easeOutQuart for smooth deceleration
            function easeOutQuart(t) {
                return 1 - Math.pow(1 - t, 4);
            }

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var easedProgress = easeOutQuart(progress);
                var current = Math.floor(easedProgress * (target - start) + start);
                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(step);
        });
    }

    /* --------------------------
       Smooth Scroll
       -------------------------- */
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var targetEl = document.querySelector(targetId);
                if (!targetEl) return;

                e.preventDefault();
                var offset = 80;
                var top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            });
        });
    }

    /* --------------------------
       Contact Form
       -------------------------- */
    function setupContactForm() {
        var form = document.getElementById('contactForm') || document.getElementById('mainContactForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var btn = form.querySelector('.btn-submit');
            var originalText = btn.querySelector('span').textContent;

            btn.classList.add('sending');
            btn.querySelector('span').textContent = 'Invio in corso...';

            // Simulate form submission (replace with actual endpoint)
            setTimeout(function () {
                btn.classList.remove('sending');
                btn.classList.add('sent');
                btn.querySelector('span').textContent = 'Messaggio Inviato!';

                setTimeout(function () {
                    btn.classList.remove('sent');
                    btn.querySelector('span').textContent = originalText;
                    form.reset();
                }, 3000);
            }, 1500);
        });
    }

    /* --------------------------
       Custom Cursor
       -------------------------- */
    function setupCustomCursor() {
        // Only on devices with fine pointer (mouse)
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        var dot = document.querySelector('.cursor-dot');
        var outline = document.querySelector('.cursor-outline');
        if (!dot || !outline) return;

        var cursorX = 0, cursorY = 0;
        var outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', function (e) {
            cursorX = e.clientX;
            cursorY = e.clientY;
            dot.style.left = cursorX + 'px';
            dot.style.top = cursorY + 'px';
        });

        // Smooth follow for outline
        function animateOutline() {
            outlineX += (cursorX - outlineX) * 0.12;
            outlineY += (cursorY - outlineY) * 0.12;
            outline.style.left = outlineX + 'px';
            outline.style.top = outlineY + 'px';
            requestAnimationFrame(animateOutline);
        }
        animateOutline();

        // Hover effect on interactive elements
        var hoverTargets = document.querySelectorAll('a, button, .service-card-inner, .path-card, input, textarea, select');
        hoverTargets.forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', function () {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    /* --------------------------
       Innovation Canvas (Neural Network Effect)
       -------------------------- */
    function initTechCanvas() {
        var canvas = document.getElementById('tech-canvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var particles = [];
        var particleCount = 80;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function Particle() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2;
            
            this.update = function() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            };
            this.draw = function() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
                ctx.fill();
            };
        }

        function init() {
            resize();
            for (var i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(function(p, i) {
                p.update();
                p.draw();
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = p.x - particles[j].x;
                    var dy = p.y - particles[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(59, 130, 246, ' + (0.2 * (1 - dist / 150)) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        init();
        animate();
    }

    initTechCanvas();

})();

