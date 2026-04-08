// Master update script - updates all pages from data/content.json
import { writeFileSync, mkdirSync, readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const DATA_FILE = resolve(ROOT, 'data', 'content.json');

// Load dynamic content
let content = {};
try {
    content = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
} catch (e) {
    console.error('Error loading content.json:', e);
    process.exit(1);
}

const s = content.settings || {};
const d = content.design || { colors: {}, fonts: {} };

// Helper to escape HTML
const esc = (str) => (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Global Styles Injection (Colors & Fonts)
const themeStyles = `
<style>
  :root {
    --color-gold: ${d.colors?.gold || '#c6a96c'};
    --color-gold-dark: ${d.colors?.gold2 || '#a88b50'};
    --color-bg: ${d.colors?.bg || '#09070f'};
    --color-text: ${d.colors?.text || '#faf6f0'};
    --font-heading: ${d.fonts?.heading || "'Playfair Display', serif"};
    --font-body: ${d.fonts?.body || "'Inter', sans-serif"};
  }
  body { font-family: var(--font-body); background-color: var(--color-bg); color: var(--color-text); }
  h1, h2, h3, h4, .subtitle { font-family: var(--font-heading); }
  .btn--primary { background: linear-gradient(135deg, var(--color-gold), var(--color-gold-dark)); color: var(--color-bg); }
</style>`;

// Shared components
const header = `<header class="header" id="header"><div class="header__inner"><a href="/" class="header__logo">${s.siteName?.split(' ')[0] || 'The'} <span>${s.siteName?.split(' ')[1] || 'Bereza'}</span></a><button class="nav-toggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button><nav class="nav" id="nav"><a href="/about/" class="nav__link">About</a><a href="/services/" class="nav__link">Services</a><a href="/pricing/" class="nav__link">Pricing</a><a href="/areas/massage-therapist-kensington/" class="nav__link">Areas</a><a href="/blog/" class="nav__link">Blog</a><a href="/contact/" class="nav__link">Contact</a><a href="/book/" class="nav__cta">Book Now</a></nav></div></header>`;

const footerContent = content.footer || { desc: "London's premier mobile massage therapy service." };
const footer = `<footer class="footer"><div class="container"><div class="footer__grid"><div><div class="footer__brand-name">${s.siteName?.split(' ')[0] || 'The'} <span>${s.siteName?.split(' ')[1] || 'Bereza'}</span></div><p class="footer__desc">${esc(footerContent.desc)}</p><p style="margin-top:var(--space-md);"><a href="tel:${s.whatsapp}" style="color:var(--color-gold);">${s.phone}</a><br><a href="mailto:${s.email}" style="color:var(--color-gold);">${s.email}</a></p></div><div><h4 class="footer__heading">Services</h4><ul class="footer__links">
    ${(content.services || []).map(svc => `<li><a href="/services/${svc.slug}/">${svc.name.replace('✦ ','')}</a></li>`).join('')}
</ul></div><div><h4 class="footer__heading">Quick Links</h4><ul class="footer__links"><li><a href="/about/">About</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/book/">Book Online</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/reviews/">Reviews</a></li><li><a href="/gift-vouchers/">Gift Vouchers</a></li><li><a href="/quiz/">Free Quiz</a></li><li><a href="/contact/">Contact</a></li></ul></div><div><h4 class="footer__heading">Areas</h4><ul class="footer__links"><li><a href="/areas/massage-therapist-kensington/">Kensington</a></li><li><a href="/areas/massage-therapist-chelsea/">Chelsea</a></li><li><a href="/areas/massage-therapist-mayfair/">Mayfair</a></li><li><a href="/areas/massage-therapist-paddington/">Paddington</a></li><li><a href="/areas/massage-therapist-canary-wharf/">Canary Wharf</a></li><li><a href="/areas/massage-therapist-knightsbridge/">Knightsbridge</a></li><li><a href="/areas/massage-therapist-notting-hill/">Notting Hill</a></li><li><a href="/areas/massage-therapist-soho/">Soho</a></li></ul></div></div><div class="footer__bottom"><p>&copy; 2026 ${s.siteName}. All rights reserved. <a href="/terms/">Terms</a> · <a href="/privacy/">Privacy</a></p><p><a href="tel:${s.whatsapp}">${s.phone}</a> · <a href="mailto:${s.email}">${s.email}</a></p></div></div></footer>`;

const trustItems = content.trustbar?.items || ["10+ Years Experience", "Clinical Background", "Same-Day Available", "Licensed & Insured"];
const trustBar = `<div class="trust-bar"><div class="trust-bar__inner">
    ${trustItems.map(item => `<div class="trust-bar__item"><span>✓</span> ${esc(item)}</div>`).join('')}
</div></div>`;

function page(title, desc, canonical, body, schema = '') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="https://massage-london-bereza.vercel.app${canonical}">
  <link rel="stylesheet" href="/css/global.css">
  ${themeStyles}
  ${schema}
</head>
<body>
  ${header}
  ${body}
  ${footer}

  <!-- Dynamic Popup -->
  ${content.popup ? `
  <div id="promo-popup" style="display:none;position:fixed;bottom:20px;right:20px;width:300px;background:linear-gradient(145deg,var(--color-bg),#1a1425);border:1px solid var(--color-gold);border-radius:15px;padding:1.5rem;box-shadow:0 10px 40px rgba(0,0,0,0.8);z-index:10000;color:var(--color-text);">
    <button onclick="closePopup()" style="position:absolute;top:10px;right:10px;background:none;border:none;color:var(--color-gold);cursor:pointer;font-size:1.2rem;">&times;</button>
    <div style="background:rgba(198,169,108,0.1);color:var(--color-gold);padding:4px 10px;border-radius:20px;font-size:0.65rem;display:inline-block;letter-spacing:0.1em;border:1px solid rgba(198,169,108,0.3);margin-bottom:1rem;">${esc(content.popup.badge)}</div>
    <h3 style="margin:0 0 0.5rem 0;font-size:1.1rem;color:var(--color-text);">${esc(content.popup.title)}</h3>
    <p style="font-size:0.8rem;opacity:0.8;line-height:1.5;margin-bottom:1rem;">${esc(content.popup.text)}</p>
    <a href="${content.popup.link}" class="btn btn--primary" style="display:block;text-align:center;padding:10px;font-size:0.85rem;text-decoration:none;border-radius:6px;font-weight:700;">${esc(content.popup.cta)}</a>
  </div>
  <script>
    function closePopup() {
        document.getElementById('promo-popup').style.display = 'none';
        setTimeout(() => {
            document.getElementById('promo-popup').style.display = 'block';
        }, ${content.popup.reappearAfter * 1000});
    }
    setTimeout(() => {
        document.getElementById('promo-popup').style.display = 'block';
    }, ${content.popup.showAfter * 1000});
  </script>
  ` : ''}

  <script src="/js/main.js"></script>
</body>
</html>`;
}

// ============ HOMEPAGE ============
console.log('Building homepage...');
const hp = content.homepage || {};
const homepageBody = `
  <section class="hero" style="background-image: linear-gradient(rgba(9,7,15,0.65), rgba(9,7,15,0.65)), url('${hp.heroImage}'); background-size: cover; background-position: center;">
    <div class="container">
      <p class="subtitle">✦ ${esc(hp.heroSubtitle)}</p>
      <h1>${hp.heroTitle}</h1>
      <p class="hero__desc">${esc(hp.heroDesc)}</p>
      <div class="hero__cta">
        <a href="/book/" class="btn btn--primary btn--lg">Book Session</a>
        <a href="/services/" class="btn btn--outline btn--lg">Explore Services</a>
      </div>
      <p style="margin-top:var(--space-lg);opacity:0.7;font-size:var(--fs-small);">Or WhatsApp: <a href="https://wa.me/${s.whatsapp}" style="color:var(--color-gold);">${s.phone}</a></p>
    </div>
  </section>

  <div class="trust-bar"><div class="trust-bar__inner">
    ${(hp.stats || []).map(st => `
    <div class="trust-bar__item"><div class="trust-bar__number">${esc(st.number)}</div><div class="trust-bar__label">${esc(st.label)}</div></div>
    `).join('')}
  </div></div>

  <section class="section section--white">
    <div class="container">
      <div class="section-header fade-in"><p class="subtitle">Our Services</p><h2>Specialist Treatments</h2><p>Personalised therapeutic massage delivered to your door.</p></div>
      <div class="grid grid--3">
        ${(content.services || []).map(svc => `
        <a href="/services/${svc.slug}/" class="card fade-in">
            <img src="${svc.image}" alt="${esc(svc.name)}" class="card__image">
            <h3 class="card__title">${svc.name.replace('\u2726 ','')}</h3>
            <p class="card__text">${esc(svc.shortDesc)}</p>
        </a>`).join('')}
      </div>
    </div>
  </section>

  <!-- 3D Professional Massage Showcase -->
  <section class="section section--cream" style="padding:0;">
    <div style="position:relative;width:100%;max-height:520px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
      <img src="/images/hero-massage-3d.png" alt="Professional body massage therapy by Iryna Bereza London" style="width:100%;max-height:520px;object-fit:cover;object-position:center;">
      <div style="position:absolute;inset:0;background:linear-gradient(to right,rgba(9,7,15,0.8) 0%,rgba(9,7,15,0.4) 55%,rgba(9,7,15,0) 100%);display:flex;align-items:center;">
        <div class="container">
          <p class="subtitle" style="color:var(--color-gold);">✦ Clinical-Grade Therapy</p>
          <h2 style="max-width:500px;font-size:clamp(1.6rem,4vw,2.5rem);">Professional Body Massage, Delivered to Your Door</h2>
          <p style="max-width:420px;opacity:0.85;margin-top:1rem;">10+ years of clinical experience. Same-day availability across Shoreditch, Marylebone, Canary Wharf, Kensington, Chelsea, Mayfair &amp; all Central London areas.</p>
          <a href="/book/" class="btn btn--primary btn--lg" style="margin-top:1.5rem;display:inline-block;">Book Your Session</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--cream">
    <div class="container">
      <div class="section-header fade-in"><p class="subtitle">How It Works</p><h2>Your Session in 4 Steps</h2></div>
      <div class="grid grid--4">
        <div class="card fade-in" style="text-align:center;"><div class="card__icon">📱</div><h4 class="card__title">1. Book</h4><p class="card__text">WhatsApp ${s.phone} or book online.</p></div>
        <div class="card fade-in" style="text-align:center;"><div class="card__icon">🏠</div><h4 class="card__title">2. We Arrive</h4><p class="card__text">Iryna arrives with organic oils & linens.</p></div>
        <div class="card fade-in" style="text-align:center;"><div class="card__icon">💆</div><h4 class="card__title">3. Treatment</h4><p class="card__text">Focus on your specific tension areas.</p></div>
        <div class="card fade-in" style="text-align:center;"><div class="card__icon">✨</div><h4 class="card__title">4. Relief</h4><p class="card__text">Feel immediate physical and mental reset.</p></div>
      </div>
    </div>
  </section>

  <section class="section section--white">
    <div class="container">
      <div class="section-header fade-in"><p class="subtitle">Testimonials</p><h2>Client Experiences</h2></div>
      <div class="grid grid--3">
        ${(content.reviews || []).slice(0, 3).map(rev => `
        <div class="testimonial fade-in"><div class="testimonial__stars">★★★★★</div><p class="testimonial__text">"${esc(rev.text)}"</p><div class="testimonial__author"><div class="testimonial__avatar">${rev.name.substring(0,1)}</div><div><div class="testimonial__name">${esc(rev.name)}</div><div class="testimonial__location">${esc(rev.location)}</div></div></div></div>
        `).join('')}
      </div>
    </div>
  </section>

  <section class="cta-section">
    <div class="container">
      <p class="subtitle">Ready to Begin?</p>
      <h2>Book Your Session Today</h2>
      <p>Mobile clinical massage in Central London. Open ${s.hours}.</p>
      <div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;">
        <a href="/book/" class="btn btn--primary btn--lg">Book Now</a>
        <a href="tel:${s.whatsapp}" class="btn btn--outline btn--lg" style="border-color:var(--color-cream);color:var(--color-cream);">Call ${s.phone}</a>
      </div>
    </div>
  </section>`;

writeFileSync('index.html', page(
    `${s.siteName} | Mobile Massage London`,
    `${esc(hp.heroSubtitle)} in Central London. ${esc(hp.heroDesc)}`,
    '/', homepageBody
));
console.log('✓ Homepage');

// ============ ABOUT ============
const a = content.about || {};
writeFileSync('about/index.html', page(
    `About | ${s.siteName}`,
    `Meet the founder of ${s.siteName}. ${esc(a.bio?.substring(0,150))}`,
    '/about/', `
  <section class="page-hero"><div class="container"><p class="subtitle">About</p><h1>${esc(a.title)}</h1></div></section>
  <section class="section section--white"><div class="container"><div class="grid grid--2" style="align-items:center;gap:var(--space-4xl);"><div class="fade-in-left"><img src="${a.portraitImage}" alt="${esc(a.title)}" style="width:100%;border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);"></div><div class="fade-in-right"><p class="subtitle">The Founder</p><h2>Iryna Bereza</h2><p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);">${esc(a.bio)}</p><p>${esc(a.bio2)}</p><h3 style="margin-top:var(--space-xl);">Qualifications</h3><ul style="list-style:none;">
    ${(a.credentials || []).map(c => `<li style="padding:var(--space-xs) 0;">✦ ${esc(c)}</li>`).join('')}
  </ul></div></div></div></section>`
));
console.log('✓ About');

// ============ SERVICES OVERVIEW ============
mkdirSync('services', { recursive: true });
writeFileSync('services/index.html', page(
    `Massage Services | ${s.siteName}`,
    `Explore our range of clinical and holistic massage treatments in London.`,
    '/services/', `
  <section class="page-hero"><div class="container"><p class="subtitle">Our Services</p><h1>Specialist Treatments</h1></div></section>
  ${trustBar}
  <section class="section section--white"><div class="container"><div class="grid grid--3">
    ${(content.services || []).map(svc => `
    <a href="/services/${svc.slug}/" class="card fade-in">
        <img src="${svc.image}" alt="${esc(svc.name)}" class="card__image">
        <h3 class="card__title">${svc.name.replace('✦ ','')}</h3>
        <p class="card__text">${esc(svc.shortDesc)}</p>
        <span class="card__link">Book Now →</span>
    </a>`).join('')}
  </div></div></section>`
));
console.log('✓ Services Overview');

// Generate individual service pages
(content.services || []).forEach(svc => {
    const dir = resolve(ROOT, 'services', svc.slug);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(resolve(dir, 'index.html'), page(
        `${svc.name} | ${s.siteName}`,
        `${esc(svc.shortDesc)}`,
        `/services/${svc.slug}/`,
        `<section class="page-hero"><div class="container"><p class="subtitle">Massage Service</p><h1>${svc.name}</h1><p>${esc(svc.shortDesc)}</p></div></section>
        <section class="section section--white"><div class="container"><div class="grid grid--2" style="align-items:center;"><div class="fade-in-left"><img src="${svc.image}" alt="${esc(svc.name)}" style="width:100%;border-radius:var(--radius-lg);"></div><div class="fade-in-right"><h2>Treatment Details</h2><p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);">${esc(svc.longDesc || svc.shortDesc)}</p><div style="background:var(--color-bg);padding:1.5rem;border-radius:12px;border:1px solid var(--color-gold);margin-top:2rem;"><h3 style="color:var(--color-gold);margin-top:0;">Pricing</h3><p>${svc.fixedPrice ? `✦ Fixed Price: <b>${svc.fixedPrice}</b><br><span style="font-size:0.9em;opacity:0.8;">Immersive relaxation session — No fixed time limit.<br>Duration guided by your body's needs.</span>` : (svc.price60 === '—' ? `✦ Price: <b>${svc.price120}</b><br><span style="font-size:0.9em;opacity:0.8;">No fixed time limit — your body leads.</span>` : `✦ 1 Hour: <b>${svc.price60}</b><br>✦ 1.5 Hours: <b>${svc.price90 || svc.price120}</b><br>✦ 2 Hours: <b>${svc.price120}</b>`)}</p><a href="/book/" class="btn btn--primary" style="margin-top:1rem;display:inline-block;">Book This Session</a></div></div></div></div></section>`
    ));
});

console.log('✓ Individual Services');

// ============ SITEMAP GENERATION ============
console.log('Generating sitemap.xml...');
function getHtmlRoutes(dir, base = '') {
    let routes = [];
    const EXCLUDE = ['node_modules', 'admin', 'dist', '.git', '.vite', 'public'];
    try {
        const items = readdirSync(dir);
        for (const item of items) {
            if (EXCLUDE.includes(item)) continue;
            const fullPath = resolve(dir, item);
            const relPath = base ? `${base}/${item}` : item;
            if (statSync(fullPath).isDirectory()) {
                routes = routes.concat(getHtmlRoutes(fullPath, relPath));
            } else if (item === 'index.html') {
                routes.push(base ? `/${base}/` : '/');
            } else if (item.endsWith('.html')) {
                routes.push(`/${relPath.replace(/\.html$/, '')}/`);
            }
        }
    } catch (e) { }
    return routes;
}

const allRoutes = getHtmlRoutes(ROOT);

if (allRoutes.length === 0) {
    console.error('ERROR: No HTML routes found! Sitemap generation aborted to prevent empty XML.');
    process.exit(1);
}

if (!existsSync(resolve(ROOT, 'public'))) {
    mkdirSync(resolve(ROOT, 'public'), { recursive: true });
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>https://massage-london-bereza.vercel.app${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`.trim();

writeFileSync(resolve(ROOT, 'public', 'sitemap.xml'), sitemapXml);
console.log('✓ Sitemap generated at public/sitemap.xml');

console.log('Build complete - site updated from content.json');

