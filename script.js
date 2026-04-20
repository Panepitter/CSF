/* ============================================================
   CSF CONSULTING — INTERACTION ENGINE v2
   Premium Motion Design + Agent Integration
   ============================================================ */

(function () {
    'use strict';

    /* ----- Configuration ----- */
    var AGENT_API = '/api/agents';
    var AGENT_ID = 'agent_csf_consultant';

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
        setupAgentChat();
        handleHashScroll();

        /* --- Editorial layer (homepage only) --- */
        if (document.body.classList.contains('home')) {
            setupEditorialLayer();
        }

        /* --- Inner pages masterclass (all non-home pages with page-* class) --- */
        var isInnerPage = Array.prototype.some.call(document.body.classList, function (c) {
            return c.indexOf('page-') === 0;
        });
        if (isInnerPage) {
            var reduceIP = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            setupInnerCarouselDots(reduceIP);
            setupInnerAccordion();
        }
    }

    /* ----- Preloader ----- */
    function preloader() {
        var el = document.getElementById('preloader');
        if (!el) return;

        /* Hide preloader text until fonts are ready to avoid FOUT */
        var inner = el.querySelector('.preloader-inner');
        if (inner) inner.style.opacity = '0';

        document.fonts.ready.then(function () {
            if (inner) {
                inner.style.opacity = '1';
                inner.style.transition = 'opacity 0.2s ease';
            }
        });

        window.addEventListener('load', function () {
            document.fonts.ready.then(function () {
                setTimeout(function () {
                    el.classList.add('hidden');
                    document.body.classList.remove('loading');
                }, 800);
            });
        });

        setTimeout(function () {
            el.classList.add('hidden');
            document.body.classList.remove('loading');
        }, 3000);
    }

    /* ----- Navbar ----- */
    function setupNavbar() {
        var navbar = document.getElementById('navbar');
        if (!navbar) return;

        var lastScroll = 0;
        var ticking = false;

        window.addEventListener('scroll', function () {
            lastScroll = window.pageYOffset;
            if (!ticking) {
                requestAnimationFrame(function () {
                    if (lastScroll > 50) {
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

    /* ----- Mobile Menu ----- */
    function setupMobileMenu() {
        var toggle = document.getElementById('navToggle');
        var menu = document.getElementById('mobileMenu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', function () {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.classList.toggle('loading');
        });

        var links = menu.querySelectorAll('.mobile-link');
        links.forEach(function (link) {
            link.addEventListener('click', function () {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.classList.remove('loading');
            });
        });
    }

    /* ----- Hero Canvas — Particle Network ----- */
    function setupHeroCanvas() {
        var canvas = document.getElementById('heroCanvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var particles = [];
        var animationId;
        var mouse = { x: null, y: null, radius: 140 };

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        function getCount() {
            var w = window.innerWidth;
            if (w < 480) return 25;
            if (w < 768) return 38;
            if (w < 1024) return 55;
            return 75;
        }

        function createParticles() {
            particles = [];
            var count = getCount();
            /* beacon particles — larger, brighter focal points */
            var beaconCount = Math.max(2, Math.floor(count * 0.06));
            for (var b = 0; b < beaconCount; b++) {
                var isBlueB = b % 2 === 1;
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.15,
                    vy: (Math.random() - 0.5) * 0.15,
                    r: Math.random() * 2.2 + 2,
                    color: isBlueB ? '91, 148, 247' : '212, 173, 66',
                    alpha: Math.random() * 0.3 + 0.25,
                    pulse: Math.random() * Math.PI * 2,
                    ps: Math.random() * 0.005 + 0.002,
                    beacon: true
                });
            }
            for (var i = 0; i < count - beaconCount; i++) {
                var isBlue = Math.random() < 0.15;
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35,
                    r: Math.random() * 1.6 + 0.4,
                    color: isBlue ? '91, 148, 247' : '212, 173, 66',
                    alpha: Math.random() * 0.45 + 0.15,
                    pulse: Math.random() * Math.PI * 2,
                    ps: Math.random() * 0.008 + 0.003,
                    beacon: false
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            /* connection lines */
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    var maxDist = (particles[i].beacon || particles[j].beacon) ? 200 : 160;
                    if (dist < maxDist) {
                        var a = (1 - dist / maxDist) * 0.12;
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(212, 173, 66, ' + a + ')';
                        ctx.lineWidth = (particles[i].beacon || particles[j].beacon) ? 0.6 : 0.4;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            /* particles & glows */
            for (var k = 0; k < particles.length; k++) {
                var p = particles[k];
                p.pulse += p.ps;
                var a = p.alpha + Math.sin(p.pulse) * 0.12;

                if (p.beacon) {
                    /* outer soft glow */
                    var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 12);
                    grad.addColorStop(0, 'rgba(' + p.color + ', ' + (a * 0.12) + ')');
                    grad.addColorStop(0.5, 'rgba(' + p.color + ', ' + (a * 0.04) + ')');
                    grad.addColorStop(1, 'rgba(' + p.color + ', 0)');
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r * 12, 0, Math.PI * 2);
                    ctx.fillStyle = grad;
                    ctx.fill();

                    /* inner glow */
                    var grad2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
                    grad2.addColorStop(0, 'rgba(' + p.color + ', ' + (a * 0.35) + ')');
                    grad2.addColorStop(1, 'rgba(' + p.color + ', 0)');
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
                    ctx.fillStyle = grad2;
                    ctx.fill();
                }

                /* core dot */
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + p.color + ', ' + a + ')';
                ctx.fill();

                /* halo */
                if (!p.beacon) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(' + p.color + ', ' + (a * 0.06) + ')';
                    ctx.fill();
                }
            }
        }

        function update() {
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                if (mouse.x !== null) {
                    var dx = p.x - mouse.x;
                    var dy = p.y - mouse.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        var force = (mouse.radius - dist) / mouse.radius;
                        p.vx += (dx / dist) * force * 0.015;
                        p.vy += (dy / dist) * force * 0.015;
                    }
                }
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.998;
                p.vy *= 0.998;
                if (p.x < 0) { p.x = 0; p.vx *= -1; }
                if (p.x > canvas.width) { p.x = canvas.width; p.vx *= -1; }
                if (p.y < 0) { p.y = 0; p.vy *= -1; }
                if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -1; }
            }
        }

        function animate() {
            update();
            draw();
            animationId = requestAnimationFrame(animate);
        }

        canvas.addEventListener('mousemove', function (e) {
            var r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        });

        canvas.addEventListener('mouseleave', function () {
            mouse.x = null;
            mouse.y = null;
        });

        resize();
        createParticles();
        animate();

        var rt;
        window.addEventListener('resize', function () {
            clearTimeout(rt);
            rt = setTimeout(function () {
                cancelAnimationFrame(animationId);
                resize();
                createParticles();
                animate();
            }, 250);
        });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    }

    /* ----- Scroll Reveal ----- */
    function setupScrollReveal() {
        var selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
        var elements = document.querySelectorAll(selectors);

        if (!('IntersectionObserver' in window)) {
            elements.forEach(function (el) { el.classList.add('revealed'); });
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
            threshold: 0.08,
            rootMargin: '0px 0px -48px 0px'
        });

        elements.forEach(function (el) { observer.observe(el); });
    }

    /* ----- Counters ----- */
    function setupCounters() {
        var counters = document.querySelectorAll('.stat-number');
        if (counters.length === 0) return;

        var section = document.getElementById('stats');
        if (!section) return;

        if (!('IntersectionObserver' in window)) {
            counters.forEach(function (el) {
                el.textContent = el.getAttribute('data-target');
            });
            return;
        }

        var animated = false;
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting && !animated) {
                    animated = true;
                    animateCounters(counters);
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.3 });

        obs.observe(section);
    }

    function animateCounters(counters) {
        counters.forEach(function (c) {
            var target = parseInt(c.getAttribute('data-target'), 10);
            var dur = 2200;
            var start = null;

            function ease(t) { return 1 - Math.pow(1 - t, 4); }

            function step(ts) {
                if (!start) start = ts;
                var p = Math.min((ts - start) / dur, 1);
                c.textContent = Math.floor(ease(p) * target);
                if (p < 1) {
                    requestAnimationFrame(step);
                } else {
                    c.textContent = target;
                }
            }

            requestAnimationFrame(step);
        });
    }

    /* ----- Smooth Scroll ----- */
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var id = this.getAttribute('href');
                if (id === '#') return;
                var el = document.querySelector(id);
                if (!el) return;
                e.preventDefault();
                var top = el.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: top, behavior: 'smooth' });
            });
        });
    }

    /* ----- Hash Scroll (after cross-page navigation) ----- */
    function handleHashScroll() {
        var hash = window.location.hash;
        if (!hash) return;
        /* Wait for preloader to finish, then scroll to section */
        window.addEventListener('load', function () {
            setTimeout(function () {
                var el = document.querySelector(hash);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    el.style.outline = '2px solid rgba(212, 173, 66, 0.3)';
                    el.style.outlineOffset = '8px';
                    el.style.transition = 'outline 0.5s, outline-offset 0.5s';
                    setTimeout(function () { el.style.outline = 'none'; }, 3000);
                }
            }, 1200);
        });
    }

    /* ----- Contact Form ----- */
    function setupContactForm() {
        var form = document.getElementById('contactForm') || document.getElementById('mainContactForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('.btn-submit');
            var span = btn.querySelector('span');
            var orig = span.textContent;

            btn.classList.add('sending');
            span.textContent = 'Invio in corso...';

            setTimeout(function () {
                btn.classList.remove('sending');
                btn.classList.add('sent');
                span.textContent = 'Messaggio Inviato!';

                setTimeout(function () {
                    btn.classList.remove('sent');
                    span.textContent = orig;
                    form.reset();
                }, 3000);
            }, 1500);
        });
    }

    /* ----- Custom Cursor ----- */
    function setupCustomCursor() {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        var dot = document.querySelector('.cursor-dot');
        var outline = document.querySelector('.cursor-outline');
        if (!dot || !outline) return;

        var cx = 0, cy = 0, ox = 0, oy = 0;

        document.addEventListener('mousemove', function (e) {
            cx = e.clientX;
            cy = e.clientY;
            dot.style.left = cx + 'px';
            dot.style.top = cy + 'px';
        });

        function animateOutline() {
            ox += (cx - ox) * 0.1;
            oy += (cy - oy) * 0.1;
            outline.style.left = ox + 'px';
            outline.style.top = oy + 'px';
            requestAnimationFrame(animateOutline);
        }
        animateOutline();

        var targets = document.querySelectorAll('a, button, .service-card-inner, .path-card, .monolith, input, textarea, select, .agent-suggestion');
        targets.forEach(function (el) {
            el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
            el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
        });
    }

    /* ----- Tech Canvas (Innova page) ----- */
    function initTechCanvas() {
        var canvas = document.getElementById('tech-canvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var particles = [];
        var count = 70;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function P() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r = Math.random() * 1.8;

            this.update = function () {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            };
            this.draw = function () {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(91, 148, 247, 0.45)';
                ctx.fill();
            };
        }

        function start() {
            resize();
            for (var i = 0; i < count; i++) particles.push(new P());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(function (p, i) {
                p.update();
                p.draw();
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = p.x - particles[j].x;
                    var dy = p.y - particles[j].y;
                    var d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 140) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(91, 148, 247, ' + (0.18 * (1 - d / 140)) + ')';
                        ctx.lineWidth = 0.4;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        start();
        animate();
    }

    initTechCanvas();

    /* ============================================================
       AGENT CHAT WIDGET
       ============================================================ */
    function setupAgentChat() {
        /* --- Build DOM --- */
        var trigger = document.createElement('button');
        trigger.className = 'agent-trigger';
        trigger.setAttribute('aria-label', 'Apri assistente AI');
        trigger.innerHTML = '<span class="agent-trigger-pulse"></span>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

        var panel = document.createElement('div');
        panel.className = 'agent-panel';
        panel.innerHTML =
            '<div class="agent-panel-header">' +
                '<div class="agent-panel-title">' +
                    '<div class="agent-avatar">AI</div>' +
                    '<div><span>CSF Consulente AI</span><small>Sempre disponibile</small></div>' +
                '</div>' +
                '<div class="agent-header-actions">' +
                    '<button class="agent-minimize" aria-label="Minimizza">' +
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
                    '</button>' +
                    '<button class="agent-close" aria-label="Chiudi">' +
                        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<div class="agent-messages" id="agentMessages">' +
                '<div class="agent-welcome">' +
                    '<h4>Benvenuto in CSF</h4>' +
                    '<p>Sono il consulente AI di CSF Consulting. Posso aiutarti a esplorare i nostri servizi, guidarti verso il percorso giusto o rispondere alle tue domande.</p>' +
                    '<div class="agent-suggestions">' +
                        '<button class="agent-suggestion" data-msg="Quali servizi offrite?">Quali servizi offrite?</button>' +
                        '<button class="agent-suggestion" data-msg="Vorrei avviare una startup, potete aiutarmi?">Vorrei avviare una startup</button>' +
                        '<button class="agent-suggestion" data-msg="Come posso trasformare la mia azienda con la tecnologia?">Trasformazione digitale</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="agent-input-area">' +
                '<input class="agent-input" id="agentInput" type="text" placeholder="Scrivi un messaggio..." autocomplete="off">' +
                '<button class="agent-send" id="agentSend" aria-label="Invia">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                    '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
                '</button>' +
            '</div>';

        document.body.appendChild(trigger);
        document.body.appendChild(panel);

        /* --- State --- */
        var isOpen = false;
        var sessionId = null;
        var isStreaming = false;

        /* --- Detect reload vs link navigation --- */
        var isReload = false;
        try {
            var navEntry = performance.getEntriesByType('navigation')[0];
            if (navEntry && navEntry.type === 'reload') isReload = true;
        } catch (e) { /* old browser fallback */ }

        /* --- Page-specific behaviour --- */
        var currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
        var isPercorsi = currentPage === 'percorsi.html';

        /* --- Restore chat from sessionStorage (persists across link clicks, resets on reload) --- */
        (function restoreChat() {
            var saved = sessionStorage.getItem('csf_chat');
            if (isReload || !saved) {
                sessionStorage.removeItem('csf_chat');
                return;
            }
            try {
                var state = JSON.parse(saved);
                sessionId = state.sessionId || null;
                if (state.messagesHtml) {
                    var msgs = document.getElementById('agentMessages');
                    msgs.innerHTML = state.messagesHtml;
                }
                if (state.isOpen) {
                    if (isPercorsi && !state.agentNav) {
                        /* On percorsi (non-agent nav): keep chat closed */
                    } else if (isPercorsi && state.agentNav) {
                        /* Agent nav to percorsi: open first, then close fully after delay */
                        isOpen = true;
                        trigger.classList.add('hidden');
                        panel.style.transition = 'none';
                        panel.classList.add('open');
                        panel.offsetHeight;
                        panel.style.transition = '';
                        var percDelay = isMobile() ? 2000 : 1500;
                        setTimeout(function () {
                            if (isOpen && panel.classList.contains('open')) {
                                isOpen = false;
                                panel.classList.remove('open');
                                panel.classList.remove('minimized');
                                trigger.classList.remove('hidden');
                            }
                        }, percDelay);
                    } else if (state.agentNav) {
                        /* Agent navigation: open fully, then minimize after delay */
                        isOpen = true;
                        trigger.classList.add('hidden');
                        panel.style.transition = 'none';
                        panel.classList.add('open');
                        panel.offsetHeight;
                        panel.style.transition = '';
                        var navDelay = isMobile() ? 3500 : 2000;
                        setTimeout(function () {
                            if (isOpen && panel.classList.contains('open') && !panel.classList.contains('minimized')) {
                                panel.classList.add('minimized');
                            }
                        }, navDelay);
                    } else {
                        isOpen = true;
                        trigger.classList.add('hidden');
                        if (state.isMinimized) {
                            panel.style.transition = 'none';
                            panel.classList.add('open');
                            panel.classList.add('minimized');
                            panel.offsetHeight;
                            panel.style.transition = '';
                        } else {
                            panel.classList.add('open');
                        }
                    }
                }
            } catch (e) { /* ignore */ }
        })();

        /* --- Save chat before every page unload (link clicks, agent nav) --- */
        var agentNavPending = false;
        window.addEventListener('beforeunload', function () {
            /* Don't overwrite if an agent-navigation saveChat(true) already wrote */
            if (agentNavPending) return;
            saveChat();
        });

        /* --- Mobile detection helper --- */
        function isMobile() { return window.innerWidth <= 640; }

        /* --- Toggle --- */
        trigger.addEventListener('click', function () {
            isOpen = !isOpen;
            panel.classList.toggle('open', isOpen);
            trigger.classList.toggle('hidden', isOpen);
            if (isOpen && !isMobile()) {
                setTimeout(function () {
                    document.getElementById('agentInput').focus();
                }, 400);
            }
        });

        panel.querySelector('.agent-close').addEventListener('click', function () {
            isOpen = false;
            panel.classList.remove('open');
            panel.classList.remove('minimized');
            trigger.classList.remove('hidden');
        });

        /* --- Minimize --- */
        panel.querySelector('.agent-minimize').addEventListener('click', function () {
            panel.classList.add('minimized');
        });

        /* --- Expand from minimized (click anywhere on minimized bar) --- */
        panel.querySelector('.agent-panel-header').addEventListener('click', function (e) {
            if (!panel.classList.contains('minimized')) return;
            /* Don't trigger on close/minimize button clicks */
            if (e.target.closest('.agent-close') || e.target.closest('.agent-minimize')) return;
            panel.classList.remove('minimized');
        });

        /* --- Auto-minimize helper (called when agent triggers UI action) --- */
        function minimizeChat() {
            if (isOpen && panel.classList.contains('open')) {
                setTimeout(function () {
                    /* Re-check state — user may have closed in the meantime */
                    if (isOpen && panel.classList.contains('open') && !panel.classList.contains('minimized')) {
                        panel.classList.add('minimized');
                    }
                }, 1800);
            }
        }

        /* --- Suggestions --- */
        panel.querySelectorAll('.agent-suggestion').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var msg = this.getAttribute('data-msg');
                sendMessage(msg);
            });
        });

        /* --- Input --- */
        var input = document.getElementById('agentInput');
        var sendBtn = document.getElementById('agentSend');

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input.value.trim());
            }
        });

        sendBtn.addEventListener('click', function () {
            sendMessage(input.value.trim());
        });

        /* --- Send Message --- */
        function sendMessage(text) {
            if (!text || isStreaming) return;

            var messages = document.getElementById('agentMessages');

            /* Remove welcome */
            var welcome = messages.querySelector('.agent-welcome');
            if (welcome) welcome.remove();

            /* User bubble */
            var userMsg = document.createElement('div');
            userMsg.className = 'agent-msg agent-msg-user';
            userMsg.textContent = text;
            messages.appendChild(userMsg);

            input.value = '';
            scrollChat();

            /* Typing indicator */
            var typing = document.createElement('div');
            typing.className = 'agent-typing';
            typing.innerHTML = '<span></span><span></span><span></span>';
            messages.appendChild(typing);
            scrollChat();

            isStreaming = true;
            sendBtn.disabled = true;

            /* --- SSE Fetch --- */
            var currentPage = window.location.pathname.split('/').pop() || 'index.html';
            var contextPrefix = '[Pagina corrente: ' + currentPage + '] ';

            fetch(AGENT_API + '/' + AGENT_ID + '/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                    'X-Agent-API-Key': 'csf_public_2026'
                },
                body: JSON.stringify({
                    message: contextPrefix + text,
                    session_id: sessionId
                })
            }).then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);

                /* Remove typing */
                if (typing.parentNode) typing.remove();

                /* Create assistant bubble */
                var assistantMsg = document.createElement('div');
                assistantMsg.className = 'agent-msg agent-msg-assistant';
                messages.appendChild(assistantMsg);

                var content = '';
                var reader = res.body.getReader();
                var decoder = new TextDecoder();
                var buffer = '';

                function processStream() {
                    return reader.read().then(function (result) {
                        if (result.done) {
                            finishStream();
                            return;
                        }

                        buffer += decoder.decode(result.value, { stream: true });
                        var lines = buffer.split('\n');
                        buffer = lines.pop() || '';

                        for (var i = 0; i < lines.length; i++) {
                            var line = lines[i].trim();
                            if (!line.startsWith('data: ')) continue;
                            var raw = line.slice(6);
                            if (raw === '[DONE]') { finishStream(); return; }

                            try {
                                var data = JSON.parse(raw);
                                handleEvent(data, assistantMsg, messages);
                            } catch (e) { /* skip */ }
                        }

                        scrollChat();
                        return processStream();
                    });
                }

                return processStream();
            }).catch(function (err) {
                if (typing.parentNode) typing.remove();
                var errMsg = document.createElement('div');
                errMsg.className = 'agent-msg agent-msg-assistant';
                errMsg.textContent = 'Mi scuso, al momento non sono disponibile. Riprova tra poco oppure contattaci direttamente a info@csfconsulting.it';
                messages.appendChild(errMsg);
                finishStream();
            });

            function finishStream() {
                isStreaming = false;
                sendBtn.disabled = false;
                scrollChat();
            }
        }

        /* --- Handle SSE Events --- */
        function handleEvent(data, bubble, container) {
            switch (data.type) {
                case 'token':
                    bubble.innerHTML = formatMarkdown(bubble.textContent + (data.content || ''));
                    break;

                case 'tool_call':
                    var toolCard = document.createElement('div');
                    toolCard.className = 'agent-msg agent-msg-tool';
                    toolCard.innerHTML = '<svg class="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>' +
                        '<span>' + (data.name || 'Tool') + '</span>';
                    container.appendChild(toolCard);
                    break;

                case 'tool_result':
                    handleToolResult(data);
                    break;

                case 'done':
                    if (data.content) {
                        bubble.innerHTML = formatMarkdown(data.content);
                    }
                    if (data.session_id) {
                        sessionId = data.session_id;
                    }
                    break;

                case 'error':
                    bubble.textContent = data.error || 'Errore di connessione.';
                    break;
            }
        }

        /* --- Persist chat to sessionStorage --- */
        function saveChat(agentNav) {
            if (agentNav) agentNavPending = true;
            var msgs = document.getElementById('agentMessages');
            var isMinimized = panel.classList.contains('minimized');
            try {
                sessionStorage.setItem('csf_chat', JSON.stringify({
                    sessionId: sessionId,
                    messagesHtml: msgs ? msgs.innerHTML : '',
                    isOpen: isOpen,
                    isMinimized: isMinimized,
                    agentNav: !!agentNav
                }));
            } catch (e) { /* quota exceeded etc */ }
        }

        /* --- Handle Tool Results (UI Actions) --- */
        function handleToolResult(data) {
            var result;
            try {
                result = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
            } catch (e) { return; }

            if (!result || !result.ui_action) return;

            switch (result.ui_action) {
                case 'navigate':
                    var target = result.target;
                    if (target && target.startsWith('#')) {
                        var el = document.querySelector(target);
                        if (el) {
                            minimizeChat();
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            el.style.outline = '2px solid rgba(212, 173, 66, 0.3)';
                            el.style.outlineOffset = '8px';
                            el.style.transition = 'outline 0.5s, outline-offset 0.5s';
                            setTimeout(function () {
                                el.style.outline = 'none';
                            }, 3000);
                        } else {
                            /* Section not on current page — go to index.html + hash */
                            saveChat(true);
                            window.location.href = 'index.html' + target;
                        }
                    } else if (target) {
                        saveChat(true);
                        window.location.href = target;
                    }
                    break;

                case 'highlight_service':
                    var idx = result.index;
                    var monoliths = document.querySelectorAll('.monolith');
                    if (monoliths[idx]) {
                        minimizeChat();
                        var servicesSection = document.getElementById('services');
                        if (servicesSection) {
                            servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } else {
                            monoliths[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    } else {
                        /* Not on home page — redirect there */
                        saveChat(true);
                        window.location.href = 'index.html#services';
                    }
                    break;

                case 'open_contact':
                    var contactSection = document.getElementById('contact');
                    if (contactSection) {
                        minimizeChat();
                        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        saveChat(true);
                        window.location.href = 'contatti.html';
                    }
                    break;

                case 'show_widget':
                    /* Display rich content card in chat */
                    var messages = document.getElementById('agentMessages');
                    var widget = document.createElement('div');
                    widget.className = 'agent-msg agent-msg-assistant';
                    widget.innerHTML = formatMarkdown(result.content || '');
                    messages.appendChild(widget);
                    break;
            }
        }

        /* --- Simple Markdown --- */
        function formatMarkdown(text) {
            /* Process lists: lines starting with * or - become <ul> */
            var lines = text.split('\n');
            var html = [];
            var inList = false;
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                var listMatch = line.match(/^\s*[\*\-]\s+(.+)/);
                if (listMatch) {
                    if (!inList) { html.push('<ul>'); inList = true; }
                    html.push('<li>' + inlineFormat(listMatch[1]) + '</li>');
                } else {
                    if (inList) { html.push('</ul>'); inList = false; }
                    html.push(inlineFormat(line));
                    if (i < lines.length - 1) html.push('<br>');
                }
            }
            if (inList) html.push('</ul>');
            return html.join('');
        }

        function inlineFormat(s) {
            return s
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>');
        }

        /* --- Scroll Chat --- */
        function scrollChat() {
            var el = document.getElementById('agentMessages');
            if (el) el.scrollTop = el.scrollHeight;
        }
    }

    /* ============================================================
       EDITORIAL LAYER — homepage only
       .rise / .line-mask reveal, data-breathe word-by-word,
       data-type typing, data-year auto, is-loaded trigger.
       ============================================================ */
    function setupEditorialLayer() {
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        /* ---- IS-LOADED trigger (hero slide-up) ---- */
        /* Fire as soon as fonts are ready (prevents FOUT jump), fallback after 800ms */
        var markLoaded = function () {
            document.body.classList.add('is-loaded');
        };
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () {
                requestAnimationFrame(markLoaded);
            });
        } else {
            requestAnimationFrame(markLoaded);
        }
        /* Safety net */
        setTimeout(markLoaded, 1200);

        /* ---- RISE / LINE-MASK reveal ---- */
        var riseTargets = document.querySelectorAll('.rise, .line-mask');
        if (riseTargets.length && 'IntersectionObserver' in window) {
            var ioRise = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-in');
                        ioRise.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
            riseTargets.forEach(function (t) { ioRise.observe(t); });
        } else {
            riseTargets.forEach(function (t) { t.classList.add('is-in'); });
        }

        /* ---- BREATHE: split into words, illuminate on scroll ---- */
        var breatheBlocks = document.querySelectorAll('[data-breathe]');
        breatheBlocks.forEach(function (el) {
            /* Split innerHTML by whitespace, preserving nested tags (em, etc.) */
            /* Use a DOM walker approach to only wrap text nodes */
            wrapTextWords(el);
        });
        if (breatheBlocks.length && !reduce) {
            var updateBreathe = function () {
                var vh = window.innerHeight;
                breatheBlocks.forEach(function (b) {
                    var r = b.getBoundingClientRect();
                    var p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (vh * 0.6)));
                    var words = b.querySelectorAll('.word');
                    var count = Math.round(p * words.length);
                    words.forEach(function (w, i) {
                        if (i < count) w.classList.add('is-lit');
                        else w.classList.remove('is-lit');
                    });
                });
            };
            window.addEventListener('scroll', updateBreathe, { passive: true });
            window.addEventListener('resize', updateBreathe, { passive: true });
            updateBreathe();
        } else if (reduce) {
            /* reduced motion: show all words immediately */
            document.querySelectorAll('[data-breathe] .word').forEach(function (w) {
                w.classList.add('is-lit');
            });
        }

        /* ---- TYPING ---- */
        document.querySelectorAll('[data-type]').forEach(function (el) {
            if (reduce) {
                try {
                    var arr = JSON.parse(el.getAttribute('data-type'));
                    el.textContent = arr && arr.length ? arr[0] : '';
                } catch (e) { el.textContent = el.getAttribute('data-type') || ''; }
                return;
            }
            var phrases;
            try { phrases = JSON.parse(el.getAttribute('data-type')); }
            catch (e) { phrases = [el.getAttribute('data-type')]; }
            if (!phrases || !phrases.length) return;
            var pi = 0, ci = 0, del = false;
            var speed = 48, hold = 1800, gap = 280;
            var step = function () {
                var w = phrases[pi];
                if (!del) {
                    ci++; el.textContent = w.slice(0, ci);
                    if (ci === w.length) { del = true; return setTimeout(step, hold); }
                } else {
                    ci--; el.textContent = w.slice(0, ci);
                    if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; return setTimeout(step, gap); }
                }
                setTimeout(step, del ? speed * 0.55 : speed);
            };
            setTimeout(step, 700);
        });

        /* ---- YEAR auto ---- */
        document.querySelectorAll('[data-year]').forEach(function (el) {
            el.textContent = new Date().getFullYear();
        });

        /* ---- DATA-COUNT counters (editorial stats) ---- */
        var dataCounters = document.querySelectorAll('[data-count]');
        if (dataCounters.length && 'IntersectionObserver' in window) {
            var dcObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    if (!e.isIntersecting) return;
                    var el = e.target;
                    var target = parseFloat(el.getAttribute('data-count'));
                    if (isNaN(target)) return;
                    var suf = el.getAttribute('data-suffix') || '';
                    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
                    var dur = 1700;
                    var start = performance.now();
                    var tick = function (now) {
                        var p = Math.min(1, (now - start) / dur);
                        var eased = 1 - Math.pow(1 - p, 3);
                        el.textContent = (target * eased).toFixed(dec) + suf;
                        if (p < 1) requestAnimationFrame(tick);
                        else el.textContent = target.toFixed(dec) + suf;
                    };
                    requestAnimationFrame(tick);
                    dcObs.unobserve(el);
                });
            }, { threshold: 0.4 });
            dataCounters.forEach(function (c) { dcObs.observe(c); });
        }

        /* ---- LENIS smooth scroll (homepage only) ---- */
        /* Loaded via <script> tag in index.html; init conditionally */
        if (typeof Lenis !== 'undefined' && !reduce) {
            try {
                var htmlEl = document.documentElement;
                htmlEl.classList.add('lenis', 'lenis-smooth');

                var lenis = new Lenis({
                    lerp: 0.085,
                    smoothWheel: true,
                    wheelMultiplier: 1,
                    touchMultiplier: 1.5,
                    gestureOrientation: 'vertical',
                    normalizeWheel: true
                });
                window.__lenis = lenis;

                function lenisRaf(time) { lenis.raf(time); requestAnimationFrame(lenisRaf); }
                requestAnimationFrame(lenisRaf);

                /* Keyboard scroll support (arrows, PageUp/Down, Space, Home, End) */
                var kbStep = function () { return Math.round(window.innerHeight * 0.12); };
                var kbPage = function () { return Math.round(window.innerHeight * 0.9); };
                window.addEventListener('keydown', function (e) {
                    if (e.defaultPrevented) return;
                    var t = e.target;
                    if (t && (t.isContentEditable ||
                              /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
                    var target = null;
                    switch (e.key) {
                        case 'ArrowDown': target = lenis.scroll + kbStep(); break;
                        case 'ArrowUp':   target = lenis.scroll - kbStep(); break;
                        case 'PageDown':  target = lenis.scroll + kbPage(); break;
                        case 'PageUp':    target = lenis.scroll - kbPage(); break;
                        case ' ':         target = lenis.scroll + (e.shiftKey ? -kbPage() : kbPage()); break;
                        case 'Home':      target = 0; break;
                        case 'End':       target = document.documentElement.scrollHeight; break;
                        default: return;
                    }
                    e.preventDefault();
                    lenis.scrollTo(target, { duration: 0.8 });
                }, { passive: false });
            } catch (e) { /* ignore */ }
        }

        /* ---- MOBILE INTERACTIONS (accordion · tabs · carousel) ---- */
        setupMobileInteractions(reduce);
    }

    /* ============================================================
       MOBILE INTERACTIONS — Applica la ricerca "Layout Web Design per Mobile":
         · Manifesto  → Accordion (disclosure progressiva)
         · Percorsi   → Tabs (Genesi / Evoluzione)
         · Servizi    → Carousel progress dots
       ============================================================ */
    function setupMobileInteractions(reduce) {

        /* ----- (1) MANIFESTO ACCORDION -----
           Trasforma ogni .manifesto__cell in un disclosure a11y-first.
           HTML resta semantico anche su desktop (il trigger è display:none
           sopra i 768px; il folio originale resta visibile). */
        var manifestoCells = document.querySelectorAll('.manifesto__cell');
        manifestoCells.forEach(function (cell, idx) {
            var folio = cell.querySelector(':scope > .folio');
            var body = cell.querySelector('.manifesto__cell-body');
            if (!folio || !body || cell.querySelector('.manifesto__trigger')) return;

            var triggerId = 'manifesto-trigger-' + idx;
            var panelId   = 'manifesto-panel-' + idx;
            var label = folio.textContent.replace(/^\s*§\s*/, '').trim();

            var trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.id = triggerId;
            trigger.className = 'manifesto__trigger';
            trigger.setAttribute('aria-expanded', idx === 0 ? 'true' : 'false');
            trigger.setAttribute('aria-controls', panelId);
            trigger.innerHTML =
                '<span class="manifesto__trigger-label">' + label + '</span>' +
                '<span class="manifesto__chevron" aria-hidden="true"></span>';

            var panel = document.createElement('div');
            panel.className = 'manifesto__panel';
            panel.id = panelId;
            panel.setAttribute('role', 'region');
            panel.setAttribute('aria-labelledby', triggerId);

            body.parentNode.insertBefore(trigger, body);
            body.parentNode.insertBefore(panel, body);
            panel.appendChild(body);

            if (idx === 0) cell.classList.add('is-open');

            trigger.addEventListener('click', function () {
                var nowOpen = !cell.classList.contains('is-open');
                cell.classList.toggle('is-open', nowOpen);
                trigger.setAttribute('aria-expanded', String(nowOpen));
            });
        });

        /* ----- (2) PERCORSI TABS -----
           Inietta nav tab sopra la pair; mobile mostra solo l'articolo attivo. */
        var percorsiPair = document.querySelector('.percorsi__pair');
        if (percorsiPair && !document.querySelector('.percorsi__tabs')) {
            var percorsi = percorsiPair.querySelectorAll('.percorso');
            if (percorsi.length >= 2) {
                var tabsNav = document.createElement('div');
                tabsNav.className = 'percorsi__tabs';
                tabsNav.setAttribute('role', 'tablist');
                tabsNav.setAttribute('aria-label', 'Scegli il percorso');

                var labels = [
                    { idx: 'I',  short: 'Genesi',     long: 'Startup' },
                    { idx: 'II', short: 'Evoluzione', long: 'Transform' }
                ];

                percorsi.forEach(function (article, i) {
                    var tabId   = 'percorso-tab-' + i;
                    var panelId = 'percorso-panel-' + i;
                    article.id = panelId;
                    article.setAttribute('role', 'tabpanel');
                    article.setAttribute('aria-labelledby', tabId);
                    article.setAttribute('tabindex', '0');
                    if (i === 0) article.classList.add('is-active');

                    var l = labels[i] || { idx: String(i+1), short: 'Percorso', long: '' };
                    var btn = document.createElement('button');
                    btn.type = 'button';
                    btn.id = tabId;
                    btn.className = 'percorsi__tab';
                    btn.setAttribute('role', 'tab');
                    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
                    btn.setAttribute('aria-controls', panelId);
                    btn.setAttribute('tabindex', i === 0 ? '0' : '-1');
                    btn.dataset.idx = String(i);
                    btn.innerHTML =
                        '<span class="percorsi__tab-index">Percorso ' + l.idx + '</span>' +
                        '<span>' + l.short + ' — ' + l.long + '</span>';
                    tabsNav.appendChild(btn);
                });

                percorsiPair.parentNode.insertBefore(tabsNav, percorsiPair);

                var switchTab = function (idx) {
                    tabsNav.querySelectorAll('.percorsi__tab').forEach(function (t) {
                        var active = parseInt(t.dataset.idx, 10) === idx;
                        t.setAttribute('aria-selected', active ? 'true' : 'false');
                        t.setAttribute('tabindex', active ? '0' : '-1');
                    });
                    percorsi.forEach(function (p, i) {
                        p.classList.toggle('is-active', i === idx);
                    });
                };

                tabsNav.addEventListener('click', function (e) {
                    var tab = e.target.closest('.percorsi__tab');
                    if (!tab) return;
                    switchTab(parseInt(tab.dataset.idx, 10));
                });

                /* Keyboard: ← → ciclare tra tab (ARIA best practice) */
                tabsNav.addEventListener('keydown', function (e) {
                    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' &&
                        e.key !== 'Home' && e.key !== 'End') return;
                    var all = Array.prototype.slice.call(
                        tabsNav.querySelectorAll('.percorsi__tab')
                    );
                    var current = all.indexOf(document.activeElement);
                    if (current < 0) return;
                    var next;
                    if (e.key === 'ArrowRight')      next = (current + 1) % all.length;
                    else if (e.key === 'ArrowLeft')  next = (current - 1 + all.length) % all.length;
                    else if (e.key === 'Home')       next = 0;
                    else                             next = all.length - 1;
                    switchTab(parseInt(all[next].dataset.idx, 10));
                    all[next].focus();
                    e.preventDefault();
                });
            }
        }

        /* ----- (3) SERVICES CAROUSEL → PROGRESS DOTS -----
           Aggiorna il dot attivo seguendo lo scroll orizzontale. */
        var carousel = document.querySelector('#services .monumental-grid');
        var progress = document.querySelector('#services .carousel-progress');
        if (carousel && progress) {
            var dots = progress.querySelectorAll('.dot');
            var items = carousel.querySelectorAll('.monolith');
            if (dots.length && items.length) {
                var updateDot = function () {
                    var first = items[0];
                    if (!first) return;
                    var gap = 14;
                    var itemW = first.offsetWidth + gap;
                    if (itemW <= 0) return;
                    var idx = Math.round(carousel.scrollLeft / itemW);
                    idx = Math.max(0, Math.min(dots.length - 1, idx));
                    dots.forEach(function (d, i) {
                        d.classList.toggle('is-active', i === idx);
                    });
                };
                carousel.addEventListener('scroll', updateDot, { passive: true });
                window.addEventListener('resize', updateDot, { passive: true });

                /* Tap dot → scroll a quell'item */
                dots.forEach(function (d, i) {
                    d.style.cursor = 'pointer';
                    d.addEventListener('click', function () {
                        var first = items[0];
                        if (!first) return;
                        var itemW = first.offsetWidth + 14;
                        carousel.scrollTo({
                            left: itemW * i,
                            behavior: reduce ? 'auto' : 'smooth'
                        });
                    });
                });
                /* init */
                updateDot();
            }
        }

        /* ---- INNER PAGES: generic carousel progress dots ----
           Looks for any .inner-carousel-progress element, auto-discovers
           the nearest scrollable carousel sibling, and wires dots. */
        setupInnerCarouselDots(reduce);

        /* ---- INNER PAGES: generic accordion ----
           Wires click handlers on any .inner-accordion-trigger. */
        setupInnerAccordion();
    }

    function setupInnerAccordion() {
        var triggers = document.querySelectorAll('.inner-accordion-trigger');
        triggers.forEach(function (trigger) {
            if (trigger.dataset.wired) return;
            trigger.dataset.wired = '1';
            trigger.addEventListener('click', function () {
                var item = trigger.closest('.inner-accordion-item');
                if (!item) return;
                var isOpen = item.classList.toggle('is-open');
                trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });
        });
    }

    function setupInnerCarouselDots(reduce) {
        var progresses = document.querySelectorAll('.inner-carousel-progress');
        progresses.forEach(function (progress) {
            // Find scrollable track: look at previous siblings up the tree
            var track = null;
            var target = progress.getAttribute('data-progress');
            if (target) {
                track = document.getElementById(target) || document.querySelector('.' + target);
            }
            if (!track) {
                // Auto-discover: previous sibling or previous sibling's descendants
                var prev = progress.previousElementSibling;
                while (prev && !track) {
                    if (prev.scrollWidth > prev.clientWidth) {
                        track = prev;
                    } else {
                        track = prev.querySelector && prev.querySelector('[class*="carousel"], [class*="grid"]');
                        if (track && track.scrollWidth <= track.clientWidth) track = null;
                    }
                    prev = prev.previousElementSibling;
                }
            }
            if (!track) return;

            var dots = Array.prototype.slice.call(progress.querySelectorAll('.dot'));
            if (!dots.length) return;

            function updateActive() {
                var items = track.children;
                if (!items.length) return;
                var first = items[0];
                var step = first.offsetWidth + 14; // assumed gap
                var idx = Math.round(track.scrollLeft / step);
                idx = Math.max(0, Math.min(dots.length - 1, idx));
                dots.forEach(function (d, i) {
                    d.classList.toggle('is-active', i === idx);
                });
            }

            track.addEventListener('scroll', updateActive, { passive: true });

            dots.forEach(function (d, i) {
                d.addEventListener('click', function () {
                    var items = track.children;
                    if (!items[i]) return;
                    var step = items[0].offsetWidth + 14;
                    track.scrollTo({
                        left: step * i,
                        behavior: reduce ? 'auto' : 'smooth',
                    });
                });
            });

            updateActive();
        });
    }

    /* ---- helper: wrap words in text nodes (preserving inline tags like <em>) ---- */
    function wrapTextWords(root) {
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        var nodes = [];
        var n;
        while ((n = walker.nextNode())) nodes.push(n);
        nodes.forEach(function (node) {
            var text = node.nodeValue;
            if (!text || !/\S/.test(text)) return;
            var parts = text.split(/(\s+)/);
            var frag = document.createDocumentFragment();
            parts.forEach(function (part) {
                if (!part) return;
                if (/^\s+$/.test(part)) {
                    frag.appendChild(document.createTextNode(part));
                } else {
                    var span = document.createElement('span');
                    span.className = 'word';
                    span.textContent = part;
                    frag.appendChild(span);
                }
            });
            node.parentNode.replaceChild(frag, node);
        });
    }

})();
