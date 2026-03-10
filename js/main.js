// ===== THE BEREZA METHOD — Main JS =====

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileNav();
    initScrollAnimations();
    initFaqAccordion();
    initSmoothScroll();
    initDivinePopup();
});

// Header scroll effect
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    const onScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// Mobile navigation toggle
function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close nav on link click
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Scroll animations (Intersection Observer)
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

// FAQ Accordion
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question, .faq-question');
        if (!question) return;
        question.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            // Close all
            faqItems.forEach(i => i.classList.remove('active'));
            // Toggle current
            if (!wasActive) item.classList.add('active');
        });
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ✦ Divine Alignment Premium Popup
function initDivinePopup() {
    // Don't show on the Divine Alignment page itself
    if (window.location.pathname.includes('divine-alignment')) return;

    // Create popup HTML
    const popup = document.createElement('div');
    popup.className = 'divine-popup';
    popup.innerHTML = `
        <div class="divine-popup__inner">
            <button class="divine-popup__close" aria-label="Close">&times;</button>
            <div class="divine-popup__glow"></div>
            <div class="divine-popup__badge">✦ SIGNATURE EXPERIENCE</div>
            <h3 class="divine-popup__title">Massage with<br>Divine Alignment</h3>
            <p class="divine-popup__text">A unique, holistic treatment that works with your physical body and energetic field to restore harmony between body, mind, and spirit. Through therapeutic touch and intuitive energy work, we release physical tension and emotional blocks.</p>
            <p class="divine-popup__subtext">Grounding & centering ritual · Energy balancing · £200</p>
            <a href="/book/" class="divine-popup__cta">Book Divine Alignment — £200 →</a>
        </div>
    `;
    document.body.appendChild(popup);

    // Close ONLY with X button — popup stays until user clicks X
    popup.querySelector('.divine-popup__close').addEventListener('click', () => {
        popup.classList.remove('show');
        // Reappear after 2 minutes (120 seconds)
        setTimeout(() => {
            popup.classList.add('show');
        }, 120000);
    });

    // First show after 20 seconds — then stays until user closes
    setTimeout(() => {
        popup.classList.add('show');
    }, 20000);
}
