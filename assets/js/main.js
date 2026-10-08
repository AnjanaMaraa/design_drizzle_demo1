/* DigiMaraa Design Studio — site interactions (vanilla JS, no dependencies) */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    /* ------------------------------------------------------------------
       WhatsApp — hydrate every [data-whatsapp] link from config
    ------------------------------------------------------------------ */
    document.querySelectorAll('[data-whatsapp]').forEach(function (el) {
        el.href = buildWhatsAppUrl(el.getAttribute('data-whatsapp'));
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
    });

    /* ------------------------------------------------------------------
       Contact info — populated from SITE_CONFIG
    ------------------------------------------------------------------ */
    function resolveConfig(path) {
        return path.split('.').reduce(function (obj, key) {
            return obj ? obj[key] : undefined;
        }, SITE_CONFIG);
    }

    document.querySelectorAll('[data-contact]').forEach(function (el) {
        var key = el.getAttribute('data-contact');

        if (key === 'year') {
            el.textContent = String(new Date().getFullYear());
            return;
        }

        if (key === 'address') {
            var address = SITE_CONFIG.address;
            el.innerHTML = Object.keys(address).map(function (line) {
                return '<span>' + address[line] + '</span>';
            }).join('');
            return;
        }

        var value = resolveConfig(key);
        if (!value) return;

        el.textContent = value;
        if (key === 'phone') {
            el.href = 'tel:' + value.replace(/\s+/g, '');
        } else if (key.indexOf('email.') === 0) {
            el.href = 'mailto:' + value;
        }
    });

    /* ------------------------------------------------------------------
       Header — appearance after scrolling
    ------------------------------------------------------------------ */
    var header = document.getElementById('siteHeader');
    var sentinel = document.getElementById('scrollSentinel');

    if (header && sentinel && 'IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
        }).observe(sentinel);
    }

    /* ------------------------------------------------------------------
       Active navigation link
    ------------------------------------------------------------------ */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    var watchedSections = navLinks
        .map(function (link) { return document.querySelector(link.getAttribute('href')); })
        .filter(Boolean);

    if (navLinks.length && 'IntersectionObserver' in window) {
        var navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (link) {
                    link.classList.toggle(
                        'is-active',
                        link.getAttribute('href') === '#' + entry.target.id
                    );
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

        watchedSections.forEach(function (section) { navObserver.observe(section); });
    }

    /* ------------------------------------------------------------------
       Focus trap helper
    ------------------------------------------------------------------ */
    function trapFocus(container, event) {
        if (event.key !== 'Tab') return;
        var nodes = Array.prototype.slice.call(container.querySelectorAll(FOCUSABLE))
            .filter(function (node) { return node.offsetParent !== null || node === document.activeElement; });
        if (!nodes.length) return;

        var first = nodes[0];
        var last = nodes[nodes.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    /* ------------------------------------------------------------------
       Mobile menu
    ------------------------------------------------------------------ */
    var menuToggle = document.getElementById('menuToggle');
    var mobileMenu = document.getElementById('mobileMenu');

    function isMenuOpen() {
        return mobileMenu && mobileMenu.classList.contains('is-open');
    }

    function openMenu() {
        if (!mobileMenu) return;
        mobileMenu.inert = false;
        mobileMenu.classList.add('is-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.querySelector('.visually-hidden').textContent = 'Close menu';
        document.body.classList.add('no-scroll');
        var firstLink = mobileMenu.querySelector('a');
        if (firstLink) firstLink.focus();
    }

    function closeMenu(returnFocus) {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('is-open');
        mobileMenu.inert = true;
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.querySelector('.visually-hidden').textContent = 'Open menu';
        document.body.classList.remove('no-scroll');
        if (returnFocus) menuToggle.focus();
    }

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function () {
            isMenuOpen() ? closeMenu(true) : openMenu();
        });

        mobileMenu.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeMenu(true);
                return;
            }
            trapFocus(mobileMenu, event);
        });

        /* Keep the close button reachable while the panel is open */
        menuToggle.addEventListener('keydown', function (event) {
            if (isMenuOpen()) trapFocus(document.querySelector('.header-inner'), event);
        });

        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () { closeMenu(false); });
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && isMenuOpen()) {
                event.preventDefault();
                closeMenu(true);
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 1080 && isMenuOpen()) closeMenu(false);
        });
    }

    /* ------------------------------------------------------------------
       Scroll reveal
    ------------------------------------------------------------------ */
    var revealItems = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && !reduceMotion) {
        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

        revealItems.forEach(function (item) { revealObserver.observe(item); });
    } else {
        revealItems.forEach(function (item) { item.classList.add('is-visible'); });
    }

    /* ------------------------------------------------------------------
       FAQ accordion
    ------------------------------------------------------------------ */
    document.querySelectorAll('.faq-q').forEach(function (button) {
        button.addEventListener('click', function () {
            var item = button.closest('.faq-item');
            var isOpen = item.classList.toggle('is-open');
            button.setAttribute('aria-expanded', String(isOpen));
        });
    });

    /* ------------------------------------------------------------------
       Portfolio filters
    ------------------------------------------------------------------ */
    var filters = Array.prototype.slice.call(document.querySelectorAll('.filter'));
    var works = Array.prototype.slice.call(document.querySelectorAll('.work'));
    var filterStatus = document.getElementById('filterStatus');

    filters.forEach(function (button) {
        button.addEventListener('click', function () {
            var category = button.getAttribute('data-filter');

            filters.forEach(function (other) {
                var active = other === button;
                other.classList.toggle('is-active', active);
                other.setAttribute('aria-pressed', String(active));
            });

            var count = 0;
            works.forEach(function (work) {
                var show = category === 'all' || work.getAttribute('data-cat') === category;
                work.hidden = !show;
                if (show) count += 1;
            });

            if (filterStatus) {
                filterStatus.textContent =
                    'Showing ' + count + ' project' + (count === 1 ? '' : 's');
            }
        });
    });

    /* ------------------------------------------------------------------
       Portfolio lightbox
    ------------------------------------------------------------------ */
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxClose = document.getElementById('lightboxClose');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');
    var lightboxList = [];
    var lightboxIndex = 0;
    var lastFocused = null;
    var closeTimer = null;

    function renderLightbox() {
        var work = lightboxList[lightboxIndex];
        if (!work) return;
        var img = work.querySelector('img');
        var title = work.querySelector('.work-title');
        var cat = work.querySelector('.work-cat');

        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.innerHTML =
            '<strong>' + (title ? title.textContent : '') + '</strong>' +
            (cat ? cat.textContent : '');
    }

    function openLightbox(work) {
        if (!lightbox) return;
        lightboxList = works.filter(function (item) { return !item.hidden; });
        lightboxIndex = lightboxList.indexOf(work);
        if (lightboxIndex < 0) return;

        lastFocused = document.activeElement;
        if (!lastFocused || lastFocused === document.body || lastFocused === lightbox) {
            lastFocused = work.querySelector('.work-open');
        }
        window.clearTimeout(closeTimer);
        lightbox.hidden = false;
        renderLightbox();
        document.body.classList.add('no-scroll');
        window.requestAnimationFrame(function () {
            lightbox.classList.add('is-open');
            lightboxClose.focus();
        });
    }

    function stepLightbox(direction) {
        lightboxIndex = (lightboxIndex + direction + lightboxList.length) % lightboxList.length;
        renderLightbox();
    }

    function closeLightbox() {
        if (!lightbox || lightbox.hidden) return;
        lightbox.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
        closeTimer = window.setTimeout(function () {
            lightbox.hidden = true;
            lightboxImg.src = '';
        }, reduceMotion ? 0 : 340);
        if (lastFocused) lastFocused.focus();
    }

    works.forEach(function (work) {
        var trigger = work.querySelector('.work-open');
        if (trigger) {
            trigger.addEventListener('click', function () { openLightbox(work); });
        }
    });

    if (lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', function () { stepLightbox(-1); });
        lightboxNext.addEventListener('click', function () { stepLightbox(1); });

        lightbox.addEventListener('click', function (event) {
            if (event.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', function (event) {
            if (lightbox.hidden) return;
            if (event.key === 'Escape') { event.preventDefault(); closeLightbox(); }
            else if (event.key === 'ArrowLeft') { stepLightbox(-1); }
            else if (event.key === 'ArrowRight') { stepLightbox(1); }
            else { trapFocus(lightbox, event); }
        });
    }

    /* ------------------------------------------------------------------
       Testimonials carousel
    ------------------------------------------------------------------ */
    var track = document.getElementById('testimonialTrack');
    var prevBtn = document.getElementById('testimonialPrev');
    var nextBtn = document.getElementById('testimonialNext');

    if (track && prevBtn && nextBtn) {
        var stepSize = function () {
            var card = track.querySelector('.testimonial');
            if (!card) return 320;
            var gap = parseFloat(window.getComputedStyle(track).columnGap) || 18;
            return card.getBoundingClientRect().width + gap;
        };

        var syncButtons = function () {
            var max = track.scrollWidth - track.clientWidth - 4;
            prevBtn.disabled = track.scrollLeft <= 4;
            nextBtn.disabled = track.scrollLeft >= max;
        };

        prevBtn.addEventListener('click', function () {
            track.scrollBy({ left: -stepSize(), behavior: reduceMotion ? 'auto' : 'smooth' });
        });
        nextBtn.addEventListener('click', function () {
            track.scrollBy({ left: stepSize(), behavior: reduceMotion ? 'auto' : 'smooth' });
        });

        track.addEventListener('scroll', syncButtons, { passive: true });
        window.addEventListener('resize', syncButtons);
        syncButtons();
    }
})();
