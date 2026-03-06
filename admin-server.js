// Admin Panel Server — The Bereza Method CMS
import express from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

// ===== Config =====
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'bereza2026';
const SESSION_SECRET = crypto.randomBytes(32).toString('hex');
const sessions = new Map();

// ===== Middleware =====
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve admin static files
app.use('/admin', express.static(join(__dirname, 'admin')));

// Serve uploaded images
app.use('/images', express.static(join(__dirname, 'public/images')));

// Image upload config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, join(__dirname, 'public/images')),
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        const name = req.body.imageName || `upload-${Date.now()}`;
        cb(null, `${name}.${ext}`);
    }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ===== Auth =====
function createSession(user) {
    const token = crypto.randomBytes(48).toString('hex');
    sessions.set(token, { user, created: Date.now() });
    return token;
}

function authMiddleware(req, res, next) {
    const token = req.cookies?.session || req.headers.authorization?.replace('Bearer ', '');
    if (!token || !sessions.has(token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = sessions.get(token).user;
    next();
}

// ===== Auth Routes =====
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = createSession(username);
        res.cookie('session', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.post('/api/logout', (req, res) => {
    const token = req.cookies?.session;
    if (token) sessions.delete(token);
    res.clearCookie('session');
    res.json({ success: true });
});

app.get('/api/check-auth', authMiddleware, (req, res) => {
    res.json({ authenticated: true, user: req.user });
});

// ===== Content Routes =====
const contentPath = join(__dirname, 'data/content.json');

app.get('/api/content', authMiddleware, (req, res) => {
    try {
        const content = JSON.parse(readFileSync(contentPath, 'utf-8'));
        res.json(content);
    } catch (e) {
        res.status(500).json({ error: 'Failed to read content' });
    }
});

app.post('/api/content', authMiddleware, (req, res) => {
    try {
        writeFileSync(contentPath, JSON.stringify(req.body, null, 2));
        res.json({ success: true, message: 'Content saved (draft)' });
    } catch (e) {
        res.status(500).json({ error: 'Failed to save content' });
    }
});

// ===== Image Routes =====
app.get('/api/images', authMiddleware, (req, res) => {
    const imgDir = join(__dirname, 'public/images');
    try {
        const files = readdirSync(imgDir).filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f));
        res.json(files.map(f => ({ name: f, url: `/images/${f}` })));
    } catch (e) {
        res.json([]);
    }
});

app.post('/api/upload', authMiddleware, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ success: true, filename: req.file.filename, url: `/images/${req.file.filename}` });
});

app.delete('/api/images/:filename', authMiddleware, (req, res) => {
    const filePath = join(__dirname, 'public/images', req.params.filename);
    try {
        if (existsSync(filePath)) unlinkSync(filePath);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

// ===== PUBLISH — Rebuild all HTML pages =====
app.post('/api/publish', authMiddleware, (req, res) => {
    try {
        const content = JSON.parse(readFileSync(contentPath, 'utf-8'));
        const s = content.settings;
        const PL = s.phoneLink;
        const EL = `mailto:${s.email}`;
        const WA_URL = `https://wa.me/${s.whatsapp}?text=${encodeURIComponent(s.whatsappMessage)}`;

        const H = `<header class="header" id="header"><div class="header__inner"><a href="/" class="header__logo">The Bereza <span>Method</span></a><button class="nav-toggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button><nav class="nav" id="nav"><a href="/about/" class="nav__link">About</a><a href="/services/" class="nav__link">Services</a><a href="/pricing/" class="nav__link">Pricing</a><a href="/areas/massage-therapist-kensington/" class="nav__link">Areas</a><a href="/blog/" class="nav__link">Blog</a><a href="/contact/" class="nav__link">Contact</a><a href="/book/" class="nav__cta">Book Now</a></nav></div></header>`;

        const WA = `<a href="${WA_URL}" target="_blank" rel="noopener" class="whatsapp-float" aria-label="Chat on WhatsApp"><svg viewBox="0 0 32 32" width="32" height="32" fill="#fff"><path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.744 3.06 9.372L1.06 31.14l5.964-1.964A15.91 15.91 0 0016.004 32C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.31 22.602c-.388 1.094-2.278 2.094-3.14 2.168-.786.066-1.746.094-2.82-.178a25.86 25.86 0 01-2.554-.944c-4.494-1.94-7.428-6.47-7.654-6.774-.218-.304-1.788-2.38-1.788-4.538s1.132-3.22 1.534-3.66c.402-.44.876-.55 1.168-.55.146 0 .276.008.394.014.402.018.604.042.87.672.33.786 1.142 2.78 1.242 2.98.1.2.166.432.032.694-.126.27-.19.432-.38.666-.19.234-.4.52-.57.696-.19.196-.39.408-.166.802.224.394.992 1.636 2.13 2.652 1.464 1.306 2.696 1.71 3.078 1.902.382.192.604.16.826-.098.228-.258.974-1.134 1.232-1.524.258-.39.516-.324.87-.194.358.13 2.268 1.068 2.656 1.264.388.196.648.294.744.458.094.16.094.944-.294 2.038z"/></svg></a>`;

        const F = `<footer class="footer"><div class="container"><div class="footer__grid"><div><div class="footer__brand-name">The Bereza <span>Method</span></div><p class="footer__desc">London's premier mobile massage therapy service.</p><p style="margin-top:var(--space-md);"><a href="${PL}" style="color:var(--color-gold);">${s.phone}</a><br><a href="${EL}" style="color:var(--color-gold);">${s.email}</a></p></div><div><h4 class="footer__heading">Services</h4><ul class="footer__links">${content.services.slice(0, 6).map(sv => `<li><a href="/services/${sv.slug}/">${sv.name.replace(/ Massage| Recovery/g, '')}</a></li>`).join('')}</ul></div><div><h4 class="footer__heading">Quick Links</h4><ul class="footer__links"><li><a href="/about/">About</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/book/">Book Online</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/reviews/">Reviews</a></li><li><a href="/quiz/">Free Quiz</a></li></ul></div><div><h4 class="footer__heading">Areas</h4><ul class="footer__links">${content.areas.slice(0, 5).map(a => `<li><a href="/areas/${a.slug}/">${a.name}</a></li>`).join('')}</ul></div></div><div class="footer__bottom"><p>&copy; 2026 The Bereza Method. <a href="/terms/">Terms</a> · <a href="/privacy/">Privacy</a></p></div></div></footer>`;

        const TB = `<div class="trust-bar"><div class="trust-bar__inner"><div class="trust-bar__item"><span>✓</span> 10+ Years Experience</div><div class="trust-bar__item"><span>✓</span> Same-Day Available</div><div class="trust-bar__item"><span>✓</span> 8am-8pm Daily</div><div class="trust-bar__item"><span>✓</span> No Travel Fees</div></div></div>`;

        function pg(t, d, c, b, extra = '') { return `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">\n<title>${t}</title><meta name="description" content="${d}"><link rel="canonical" href="https://${s.domain}${c}"><link rel="stylesheet" href="/css/global.css">${extra}\n</head>\n<body>${H}${b}${F}${WA}<script src="/js/main.js"></script></body></html>`; }

        // === HOMEPAGE ===
        const hp = content.homepage;
        writeFileSync(join(__dirname, 'index.html'), pg(
            `The Bereza Method | Mobile Massage London | Iryna Bereza`,
            `Premium mobile massage London by Iryna Bereza. 10 years experience. Deep tissue, Swedish, sensual, divine alignment. Same-day 8am-8pm. Book: ${s.phone}`,
            '/',
            `<section class="hero"><div class="hero__bg" style="background-image:url('${hp.heroImage}');"></div><div class="hero__overlay"></div><div class="container"><div class="hero__content"><div class="hero__badge">✦ ${hp.heroSubtitle}</div><h1>${hp.heroTitle}</h1><p class="hero__desc">${hp.heroDesc}</p><div class="hero__actions"><a href="/book/" class="btn btn--primary btn--lg">Book Same-Day Session</a><a href="/services/" class="btn btn--outline btn--lg">Explore Services</a></div><p style="margin-top:var(--space-md);color:rgba(250,246,240,0.5);font-size:var(--fs-small);">Or call: <a href="${PL}" style="color:var(--color-gold);">${s.phone}</a></p><div class="hero__stats">${(hp.stats || []).map(st => `<div><div class="hero__stat-number">${st.number}</div><div class="hero__stat-label">${st.label}</div></div>`).join('')}</div></div></div></section>${TB}
            <section class="section section--white"><div class="container"><div class="section-header fade-in"><p class="subtitle">Our Services</p><h2>9 Specialist Massage Treatments</h2></div><div class="grid grid--3">${content.services.map(sv => `<a href="/services/${sv.slug}/" class="card fade-in"><img src="${sv.image}" alt="${sv.name}" class="card__image" loading="lazy"><h3 class="card__title">${sv.name}</h3><p class="card__text">${sv.shortDesc} From ${sv.price60}.</p><span class="card__link">Learn More →</span></a>`).join('')}</div></div></section>
            <section class="section section--cream"><div class="container"><div class="grid grid--2" style="align-items:center;gap:var(--space-4xl);"><div class="fade-in-left"><p class="subtitle">About Iryna</p><h2>Meet Your Therapist</h2><p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);">${content.about.bio}</p><a href="/about/" class="btn btn--primary" style="margin-top:var(--space-lg);">Learn More</a></div><div class="fade-in-right"><img src="${content.about.portraitImage}" alt="Iryna Bereza" style="width:100%;border-radius:var(--radius-lg);"></div></div></div></section>
            <section class="cta-section"><div class="container"><p class="subtitle">Ready?</p><h2>Book Your Session Today</h2><p>Same-day availability. ${s.hours}</p><div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;"><a href="/book/" class="btn btn--primary btn--lg">Book Now</a><a href="${PL}" class="btn btn--outline btn--lg" style="border-color:var(--color-cream);color:var(--color-cream);">${s.phone}</a></div></div></section>`
        ));

        // === ABOUT ===
        const ab = content.about;
        writeFileSync(join(__dirname, 'about/index.html'), pg(
            'About Iryna Bereza | 10 Years Massage Therapy London',
            `Meet Iryna Bereza — founder of The Bereza Method. 10+ years clinical experience across Kensington, Mayfair, Paddington & Central London.`,
            '/about/',
            `<section class="page-hero"><div class="container"><p class="subtitle">About</p><h1>${ab.title}</h1><p>${ab.subtitle}</p></div></section>${TB}
            <section class="section section--white"><div class="container"><div class="grid grid--2" style="align-items:center;gap:var(--space-4xl);"><div class="fade-in-left"><img src="${ab.portraitImage}" alt="Iryna Bereza" style="width:100%;border-radius:var(--radius-lg);"></div><div class="fade-in-right"><p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);">${ab.bio}</p><p style="line-height:var(--lh-relaxed);">${ab.bio2 || ''}</p><ul style="margin-top:var(--space-xl);list-style:none;">${(ab.credentials || []).map(c => `<li style="padding:var(--space-sm) 0;display:flex;align-items:center;gap:var(--space-sm);"><span style="color:var(--color-gold);">✓</span> ${c}</li>`).join('')}</ul></div></div></div></section>
            <section class="section section--cream"><div class="container"><div class="grid grid--2" style="align-items:center;gap:var(--space-4xl);"><div class="fade-in-left"><h2>The Bereza Difference</h2><p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);">Every treatment is personalised based on a thorough consultation. No two sessions are the same because no two bodies are the same.</p></div><div class="fade-in-right"><img src="${ab.fullImage || ab.portraitImage}" alt="Iryna Bereza - Full Portrait" style="width:100%;border-radius:var(--radius-lg);"></div></div></div></section>
            <section class="cta-section"><div class="container"><p class="subtitle">Ready?</p><h2>Experience The Bereza Method</h2><p>Same-day availability across Central London.</p><a href="/book/" class="btn btn--primary btn--lg">Book Now</a></div></section>`
        ));

        // === SERVICES OVERVIEW ===
        writeFileSync(join(__dirname, 'services/index.html'), pg(
            '9 Massage Treatments London | The Bereza Method',
            'Deep tissue, Swedish, hot stone, aromatherapy, sensual, divine alignment, sports, lymphatic, couples massage. Mobile London. From £55.',
            '/services/',
            `<section class="page-hero"><div class="container"><p class="subtitle">Our Services</p><h1>9 Specialist Massage Treatments</h1><p>From clinical deep tissue to divine alignment — every treatment personalised to you. From £55.</p></div></section>${TB}
            <section class="section section--white"><div class="container"><div class="grid grid--3">${content.services.map(sv => `<a href="/services/${sv.slug}/" class="card fade-in"><img src="${sv.image}" alt="${sv.name}" class="card__image" loading="lazy"><h3 class="card__title">${sv.name}</h3><p class="card__text">${sv.shortDesc} From ${sv.price60}.</p><span class="card__link">Learn More →</span></a>`).join('')}</div></div></section>
            <section class="cta-section"><div class="container"><p class="subtitle">Ready?</p><h2>Book Your Session</h2><a href="/book/" class="btn btn--primary btn--lg">Book Now</a></div></section>`
        ));

        // === PRICING ===
        writeFileSync(join(__dirname, 'pricing/index.html'), pg(
            'Massage Therapy Prices London | The Bereza Method',
            `Mobile massage therapy prices London. From £35. All prices include travel. ${s.phone}.`,
            '/pricing/',
            `<section class="page-hero"><div class="container"><p class="subtitle">Pricing</p><h1>Transparent Pricing</h1><p>All prices include travel within Central London, premium organic oils, and all equipment. No hidden fees.</p></div></section>${TB}
            <section class="section section--white"><div class="container"><div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:var(--fs-body);"><thead><tr style="border-bottom:2px solid var(--color-gold);"><th style="text-align:left;padding:var(--space-md);font-family:var(--font-heading);">Treatment</th><th style="padding:var(--space-md);">30 min</th><th style="padding:var(--space-md);">60 min</th><th style="padding:var(--space-md);">90 min</th><th style="padding:var(--space-md);">120 min</th></tr></thead><tbody>${content.services.map(sv => `<tr style="border-bottom:1px solid var(--color-light-gray);"><td style="padding:var(--space-md);font-weight:var(--fw-semibold);"><a href="/services/${sv.slug}/" style="color:var(--color-charcoal);">${sv.name}</a></td><td style="padding:var(--space-md);text-align:center;">${sv.price30}</td><td style="padding:var(--space-md);text-align:center;color:var(--color-gold);font-weight:var(--fw-semibold);">${sv.price60}</td><td style="padding:var(--space-md);text-align:center;">${sv.price90}</td><td style="padding:var(--space-md);text-align:center;">${sv.price120}</td></tr>`).join('')}</tbody></table></div><p style="text-align:center;margin-top:var(--space-2xl);"><a href="/book/" class="btn btn--primary btn--lg">Book Now</a> <a href="${PL}" class="btn btn--outline btn--lg" style="margin-left:var(--space-md);">${s.phone}</a></p></div></section>`
        ));

        // === FAQ ===
        const faqSchema = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": content.faq.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) })}</script>`;
        writeFileSync(join(__dirname, 'faq/index.html'), pg(
            'Mobile Massage FAQ London | The Bereza Method',
            `FAQ about mobile massage therapy London. Safety, pricing, what to expect. ${s.phone}`,
            '/faq/',
            `<section class="page-hero"><div class="container"><p class="subtitle">FAQ</p><h1>Frequently Asked Questions</h1><p>Everything you need to know about mobile massage therapy in London.</p></div></section>
            <section class="section section--white"><div class="container container--narrow">${content.faq.map(f => `<div class="faq-item fade-in"><button class="faq-question"><span>${f.q}</span><span class="faq-icon">+</span></button><div class="faq-answer"><p>${f.a}</p></div></div>`).join('')}</div></section>
            <section class="cta-section"><div class="container"><p class="subtitle">Still Have Questions?</p><h2>Get in Touch</h2><p>Call <a href="${PL}" style="color:var(--color-gold);">${s.phone}</a> or email <a href="${EL}" style="color:var(--color-gold);">${s.email}</a></p><a href="/book/" class="btn btn--primary btn--lg">Book Now</a></div></section>`,
            faqSchema
        ));

        // === CONTACT ===
        writeFileSync(join(__dirname, 'contact/index.html'), pg(
            'Contact The Bereza Method | Mobile Massage London',
            `Contact Iryna Bereza. Phone: ${s.phone}. Email: ${s.email}. ${s.hours}. Central London.`,
            '/contact/',
            `<section class="page-hero"><div class="container"><p class="subtitle">Contact</p><h1>Get in Touch</h1></div></section>
            <section class="section section--white"><div class="container"><div class="grid grid--2" style="gap:var(--space-4xl);"><div class="fade-in-left"><h2>Contact Details</h2><div style="margin:var(--space-xl) 0;"><div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-lg);"><div style="width:50px;height:50px;border-radius:var(--radius-full);background:var(--gradient-gold);display:flex;align-items:center;justify-content:center;font-size:1.2rem;">📞</div><div><strong>Phone</strong><br><a href="${PL}" style="color:var(--color-gold);">${s.phone}</a></div></div><div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-lg);"><div style="width:50px;height:50px;border-radius:var(--radius-full);background:var(--gradient-gold);display:flex;align-items:center;justify-content:center;font-size:1.2rem;">✉️</div><div><strong>Email</strong><br><a href="${EL}" style="color:var(--color-gold);">${s.email}</a></div></div><div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-lg);"><div style="width:50px;height:50px;border-radius:var(--radius-full);background:var(--gradient-gold);display:flex;align-items:center;justify-content:center;font-size:1.2rem;">💬</div><div><strong>WhatsApp</strong><br><a href="${WA_URL}" style="color:var(--color-gold);" target="_blank">Message on WhatsApp</a></div></div><div style="display:flex;align-items:center;gap:var(--space-md);"><div style="width:50px;height:50px;border-radius:var(--radius-full);background:var(--gradient-gold);display:flex;align-items:center;justify-content:center;font-size:1.2rem;">🕐</div><div><strong>Hours</strong><br>${s.hours}</div></div></div></div><div class="fade-in-right"><img src="${content.about.portraitImage}" alt="Iryna Bereza" style="width:100%;border-radius:var(--radius-lg);"></div></div></div></section>`
        ));

        // === REVIEWS ===
        writeFileSync(join(__dirname, 'reviews/index.html'), pg(
            'Client Reviews | The Bereza Method Massage London',
            'Read reviews from Central London clients. Deep tissue, Swedish, sensual, divine alignment massage by Iryna Bereza.',
            '/reviews/',
            `<section class="page-hero"><div class="container"><p class="subtitle">Reviews</p><h1>What Our Clients Say</h1><p>200+ five-star reviews from Central London clients.</p></div></section>
            <section class="section section--white"><div class="container"><div class="grid grid--3">${content.reviews.map(r => `<div class="testimonial fade-in"><div class="testimonial__stars">★★★★★</div><p class="testimonial__text">"${r.text}"</p><div class="testimonial__author"><div class="testimonial__avatar">${r.name[0]}${r.name.split(' ')[1]?.[0] || ''}</div><div><div class="testimonial__name">${r.name}</div><div class="testimonial__location">${r.location}</div></div></div></div>`).join('')}</div></div></section>
            <section class="cta-section"><div class="container"><p class="subtitle">Join 200+ Happy Clients</p><h2>Book Your Session</h2><a href="/book/" class="btn btn--primary btn--lg">Book Now</a></div></section>`
        ));

        // === AREA PAGES ===
        content.areas.forEach(a => {
            mkdirSync(join(__dirname, `areas/${a.slug}`), { recursive: true });
            writeFileSync(join(__dirname, `areas/${a.slug}/index.html`), pg(
                `Mobile Massage ${a.name} ${a.postcode} | The Bereza Method`,
                `Same-day mobile massage ${a.name} ${a.postcode}. Deep tissue, Swedish, sensual, couples by Iryna Bereza. 8am-8pm. ${s.phone}`,
                `/areas/${a.slug}/`,
                `<section class="page-hero"><div class="container"><p class="subtitle">${a.name} ${a.postcode}</p><h1>Mobile Massage in ${a.name}</h1><p>Same-day mobile massage therapy delivered to your ${a.name} home, hotel or office.</p></div></section>${TB}
                <section class="section section--white"><div class="container"><div class="grid grid--2" style="align-items:center;gap:var(--space-4xl);"><div class="fade-in-left"><h2>Expert Massage at Your Door</h2><p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);">The Bereza Method delivers 9 specialist treatments directly to your door in ${a.name}, ${a.postcode}. No travel required.</p><p><strong>Also serving:</strong> ${a.nearby}</p><p style="margin-top:var(--space-lg);"><a href="/book/" class="btn btn--primary">Book Now</a> <a href="${PL}" class="btn btn--outline" style="margin-left:var(--space-sm);">${s.phone}</a></p></div><div class="fade-in-right"><img src="${content.about.portraitImage}" alt="Iryna Bereza - ${a.name}" style="width:100%;border-radius:var(--radius-lg);"></div></div></div></section>
                <section class="section section--cream"><div class="container"><div class="section-header fade-in"><h2>Treatments in ${a.name}</h2></div><div class="grid grid--3">${content.services.slice(0, 6).map(sv => `<a href="/services/${sv.slug}/" class="card fade-in"><h3 class="card__title">${sv.name}</h3><p class="card__text">${sv.shortDesc} From ${sv.price60}.</p></a>`).join('')}</div></div></section>
                <section class="cta-section"><div class="container"><h2>Book in ${a.name}</h2><p>8am-8pm, 7 days. No travel fees.</p><div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;"><a href="/book/" class="btn btn--primary btn--lg">Book Now</a><a href="${PL}" class="btn btn--outline btn--lg" style="border-color:var(--color-cream);color:var(--color-cream);">${s.phone}</a></div></div></section>`
            ));
        });

        // === SERVICE PAGES ===
        content.services.forEach(sv => {
            mkdirSync(join(__dirname, `services/${sv.slug}`), { recursive: true });
            writeFileSync(join(__dirname, `services/${sv.slug}/index.html`), pg(
                `${sv.name} London | Same-Day Home Visits | The Bereza Method`,
                `${sv.name} London. From ${sv.price60}. Same-day home visits by Iryna Bereza. 10+ years experience. ${s.phone}`,
                `/services/${sv.slug}/`,
                `<section class="page-hero"><div class="container"><p class="subtitle">${sv.name}</p><h1>${sv.name} London</h1><p>${sv.shortDesc}</p></div></section>${TB}
                <section class="section section--white"><div class="container"><div class="grid grid--2" style="align-items:center;gap:var(--space-4xl);"><div class="fade-in-left"><h2>About ${sv.name}</h2><p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);">${sv.shortDesc} Delivered to your door by Iryna Bereza — 10+ years of clinical experience.</p><div style="margin:var(--space-xl) 0;"><div style="display:flex;gap:var(--space-xl);flex-wrap:wrap;"><div><div style="font-family:var(--font-heading);font-size:var(--fs-h3);color:var(--color-gold);">${sv.price60}</div><div style="font-size:var(--fs-small);color:var(--color-muted);">60 minutes</div></div><div><div style="font-family:var(--font-heading);font-size:var(--fs-h3);color:var(--color-gold);">${sv.price90}</div><div style="font-size:var(--fs-small);color:var(--color-muted);">90 minutes</div></div><div><div style="font-family:var(--font-heading);font-size:var(--fs-h3);color:var(--color-gold);">${sv.price120}</div><div style="font-size:var(--fs-small);color:var(--color-muted);">120 minutes</div></div></div></div><a href="/book/" class="btn btn--primary btn--lg">Book ${sv.name}</a></div><div class="fade-in-right"><img src="${sv.image}" alt="${sv.name}" style="width:100%;border-radius:var(--radius-lg);"></div></div></div></section>
                <section class="cta-section"><div class="container"><h2>Book ${sv.name}</h2><p>Same-day available. ${s.hours}</p><div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;"><a href="/book/" class="btn btn--primary btn--lg">Book Now</a><a href="${PL}" class="btn btn--outline btn--lg" style="border-color:var(--color-cream);color:var(--color-cream);">${s.phone}</a></div></div></section>`
            ));
        });

        // === BOOKING ===
        writeFileSync(join(__dirname, 'book/index.html'), pg(
            'Book Mobile Massage London | The Bereza Method',
            `Book mobile massage London. Same-day availability 8am-8pm. ${s.phone}. ${s.email}.`,
            '/book/',
            `<section class="page-hero"><div class="container"><p class="subtitle">Book Online</p><h1>Book Your Mobile Massage</h1><p>Same-day availability. ${s.hours} across Central London.</p></div></section>${TB}
            <section class="section section--white"><div class="container container--narrow"><form class="form fade-in" id="bookingForm"><div class="form__group"><label class="form__label" for="bName">Full Name *</label><input class="form__input" type="text" id="bName" placeholder="Your full name" required></div><div class="form__group"><label class="form__label" for="bEmail">Email *</label><input class="form__input" type="email" id="bEmail" placeholder="your@email.com" required></div><div class="form__group"><label class="form__label" for="bPhone">Phone *</label><input class="form__input" type="tel" id="bPhone" placeholder="Your phone number" required></div><div class="form__group"><label class="form__label" for="bTreatment">Treatment *</label><select class="form__input" id="bTreatment" required><option value="">— Choose Treatment —</option>${content.services.map(sv => `<option value="${sv.name}">${sv.name}</option>`).join('')}</select></div><div class="form__group"><label class="form__label" for="bDuration">Duration *</label><select class="form__input" id="bDuration" required><option value="">— Choose Duration —</option><option>30 minutes</option><option>60 minutes</option><option>90 minutes</option><option>120 minutes</option></select></div><div class="form__group"><label class="form__label" for="bDate">Preferred Date *</label><input class="form__input" type="date" id="bDate" required></div><div class="form__group"><label class="form__label" for="bTime">Preferred Time *</label><select class="form__input" id="bTime" required><option value="">— Choose Time —</option><option>8:00 AM</option><option>9:00 AM</option><option>10:00 AM</option><option>11:00 AM</option><option>12:00 PM</option><option>1:00 PM</option><option>2:00 PM</option><option>3:00 PM</option><option>4:00 PM</option><option>5:00 PM</option><option>6:00 PM</option><option>7:00 PM</option><option>8:00 PM</option></select></div><div class="form__group"><label class="form__label" for="bAddress">Address (Postcode) *</label><input class="form__input" type="text" id="bAddress" placeholder="e.g. W8 5SA" required></div><div class="form__group"><label class="form__label" for="bNotes">Additional Notes</label><textarea class="form__input" id="bNotes" rows="3" placeholder="Any health conditions, allergies, or special requests..."></textarea></div><button type="submit" class="btn btn--primary btn--lg" style="width:100%;">Send Booking Request</button></form><p style="text-align:center;margin-top:var(--space-xl);color:var(--color-muted);">Or call directly: <a href="${PL}" style="color:var(--color-gold);font-weight:var(--fw-semibold);">${s.phone}</a></p><script>document.getElementById('bookingForm').addEventListener('submit',function(e){e.preventDefault();var d=['Name: '+document.getElementById('bName').value,'Email: '+document.getElementById('bEmail').value,'Phone: '+document.getElementById('bPhone').value,'Treatment: '+document.getElementById('bTreatment').value,'Duration: '+document.getElementById('bDuration').value,'Date: '+document.getElementById('bDate').value,'Time: '+document.getElementById('bTime').value,'Address: '+document.getElementById('bAddress').value,'Notes: '+document.getElementById('bNotes').value].join('\\n');window.location.href='mailto:${s.email}?subject=Booking Request — The Bereza Method&body='+encodeURIComponent(d);});</script></div></section>`
        ));

        res.json({ success: true, message: 'All pages published successfully!' });
    } catch (e) {
        console.error('Publish error:', e);
        res.status(500).json({ error: 'Publish failed: ' + e.message });
    }
});

// ===== Start =====
app.listen(PORT, () => {
    console.log(`\n✨ Admin Panel running at http://localhost:${PORT}/admin/`);
    console.log(`   Login: ${ADMIN_USER} / ${ADMIN_PASS}\n`);
});
