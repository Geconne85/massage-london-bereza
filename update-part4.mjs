// Part 4: Area pages + Blog update + Sitemap
import { writeFileSync, mkdirSync, rmSync } from 'fs';
const PHONE = '+44 7704 503507';
const PL = 'tel:+447704503507';
const EMAIL = 'Runyruny@ukr.net';
const EL = `mailto:${EMAIL}`;

const H = `<header class="header" id="header"><div class="header__inner"><a href="/" class="header__logo">The Bereza <span>Method</span></a><button class="nav-toggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button><nav class="nav" id="nav"><a href="/about/" class="nav__link">About</a><a href="/services/" class="nav__link">Services</a><a href="/pricing/" class="nav__link">Pricing</a><a href="/areas/massage-therapist-kensington/" class="nav__link">Areas</a><a href="/blog/" class="nav__link">Blog</a><a href="/contact/" class="nav__link">Contact</a><a href="/book/" class="nav__cta">Book Now</a></nav></div></header>`;
const F = `<footer class="footer"><div class="container"><div class="footer__grid"><div><div class="footer__brand-name">The Bereza <span>Method</span></div><p class="footer__desc">London's premier mobile massage therapy service.</p><p style="margin-top:var(--space-md);"><a href="${PL}" style="color:var(--color-gold);">${PHONE}</a><br><a href="${EL}" style="color:var(--color-gold);">${EMAIL}</a></p></div><div><h4 class="footer__heading">Services</h4><ul class="footer__links"><li><a href="/services/deep-tissue-massage-london/">Deep Tissue</a></li><li><a href="/services/swedish-massage-london/">Swedish</a></li><li><a href="/services/sensual-massage-london/">Sensual</a></li><li><a href="/services/divine-alignment-massage-london/">Divine Alignment</a></li><li><a href="/services/sports-massage-london/">Sports</a></li><li><a href="/services/couples-massage-london/">Couples</a></li></ul></div><div><h4 class="footer__heading">Quick Links</h4><ul class="footer__links"><li><a href="/about/">About</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/book/">Book Online</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/reviews/">Reviews</a></li><li><a href="/quiz/">Free Quiz</a></li></ul></div><div><h4 class="footer__heading">Areas</h4><ul class="footer__links"><li><a href="/areas/massage-therapist-kensington/">Kensington</a></li><li><a href="/areas/massage-therapist-chelsea/">Chelsea</a></li><li><a href="/areas/massage-therapist-mayfair/">Mayfair</a></li><li><a href="/areas/massage-therapist-paddington/">Paddington</a></li><li><a href="/areas/massage-therapist-canary-wharf/">Canary Wharf</a></li></ul></div></div><div class="footer__bottom"><p>&copy; 2026 The Bereza Method. <a href="/terms/">Terms</a> · <a href="/privacy/">Privacy</a></p></div></div></footer>`;
const TB = `<div class="trust-bar"><div class="trust-bar__inner"><div class="trust-bar__item"><span>✓</span> 10+ Years Experience</div><div class="trust-bar__item"><span>✓</span> Same-Day Available</div><div class="trust-bar__item"><span>✓</span> 8am-8pm Daily</div><div class="trust-bar__item"><span>✓</span> No Travel Fees</div></div></div>`;

function pg(t, d, c, b, s = '') { return `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">\n<title>${t}</title><meta name="description" content="${d}"><link rel="canonical" href="https://massage-london-bereza.vercel.app${c}"><link rel="stylesheet" href="/css/global.css">${s}\n</head>\n<body>${H}${b}${F}<script src="/js/main.js"></script></body></html>`; }

// Remove old area directories
try { rmSync('areas', { recursive: true, force: true }); } catch (e) { }

const areas = [
    { slug: 'massage-therapist-kensington', name: 'Kensington', pc: 'W8', title: 'Mobile Massage Therapist Kensington W8 | Same-Day', desc: `Same-day mobile massage Kensington W8. Deep tissue, Swedish, sensual, couples. Two therapists available. Iryna Bereza 10 years experience. 8am-8pm. ${PHONE}`, nearby: 'Chelsea, Knightsbridge, Notting Hill' },
    { slug: 'massage-therapist-chelsea', name: 'Chelsea', pc: 'SW3', title: 'Mobile Massage Therapist Chelsea SW3 | Home Visits', desc: `Mobile massage Chelsea SW3 SW10. Deep tissue, aromatherapy, sensual, couples by Iryna Bereza. Same-day home visits. 8am-8pm daily. ${PHONE}`, nearby: 'Kensington, Knightsbridge, South Kensington' },
    { slug: 'massage-therapist-mayfair', name: 'Mayfair', pc: 'W1', title: 'Mobile Massage Therapist Mayfair W1 | Hotel & Home', desc: `Premium mobile massage Mayfair W1. Deep tissue, hot stone, sensual, couples. Hotel and home visits by Iryna Bereza. Same-day available. ${PHONE}`, nearby: 'Soho, Paddington, Knightsbridge' },
    { slug: 'massage-therapist-paddington', name: 'Paddington', pc: 'W2', title: 'Mobile Massage Therapist Paddington W2 | Same-Day', desc: `Same-day mobile massage Paddington W2 Bayswater. Deep tissue, Swedish, sensual, couples by Iryna Bereza. 10 years experience. 8am-8pm. ${PHONE}`, nearby: 'Mayfair, Notting Hill, Marylebone' },
    { slug: 'massage-therapist-canary-wharf', name: 'Canary Wharf', pc: 'E14', title: 'Mobile Massage Canary Wharf E14 | Office & Home', desc: 'Mobile massage Canary Wharf E14 for desk workers. Deep tissue, sports recovery, stress relief by Iryna Bereza. Same-day office and home visits. 8am-8pm.', nearby: 'City of London, Shoreditch' },
    { slug: 'massage-therapist-knightsbridge', name: 'Knightsbridge', pc: 'SW1/SW7', title: 'Mobile Massage Knightsbridge SW1 SW7 | Premium', desc: `Premium mobile massage Knightsbridge. Hotel and home visits. Deep tissue, hot stone, sensual, couples by Iryna Bereza. Same-day available. ${PHONE}`, nearby: 'Kensington, Chelsea, Mayfair' },
    { slug: 'massage-therapist-notting-hill', name: 'Notting Hill', pc: 'W11', title: 'Mobile Massage Notting Hill W11 | Home Visits', desc: `Mobile massage Notting Hill W11 Holland Park. Deep tissue, aromatherapy, sensual, couples by Iryna Bereza. Same-day home visits. 8am-8pm. ${PHONE}`, nearby: 'Kensington, Paddington, Mayfair' },
    { slug: 'massage-therapist-soho', name: 'Soho', pc: 'W1', title: 'Mobile Massage Therapist Soho W1 | Same-Day', desc: `Same-day mobile massage Soho W1. Deep tissue, Swedish, sensual, divine alignment by Iryna Bereza. Hotel and home visits. 10 years experience. ${PHONE}`, nearby: 'Mayfair, Paddington, City of London' },
    { slug: 'massage-therapist-city-of-london', name: 'City of London', pc: 'EC1-EC4', title: 'Mobile Massage City of London EC1-EC4 | Office Visits', desc: 'Mobile massage City of London EC1 EC2 EC3 EC4. Deep tissue for desk pain, sports recovery. Same-day office visits by Iryna Bereza. 8am-8pm.', nearby: 'Soho, Canary Wharf, Shoreditch' },
    { slug: 'massage-therapist-south-kensington', name: 'South Kensington', pc: 'SW5/SW7', title: 'Mobile Massage South Kensington SW5 SW7', desc: `Mobile massage South Kensington SW5 SW7. Deep tissue, hot stone, aromatherapy, couples by Iryna Bereza. Same-day home visits. 8am-8pm. ${PHONE}`, nearby: 'Kensington, Chelsea, Knightsbridge' },
];

areas.forEach(a => {
    const dir = `areas/${a.slug}`;
    mkdirSync(dir, { recursive: true });
    writeFileSync(`${dir}/index.html`, pg(a.title, a.desc, `/areas/${a.slug}/`, `
  <section class="page-hero"><div class="container"><p class="subtitle">${a.name} ${a.pc}</p><h1>Mobile Massage Therapist in ${a.name}</h1><p>Same-day mobile massage therapy delivered to your ${a.name} home, hotel or office by Iryna Bereza.</p></div></section>
  ${TB}
  <section class="section section--white"><div class="container"><div class="grid grid--2" style="align-items:center;gap:var(--space-4xl);"><div class="fade-in-left"><p class="subtitle">Mobile Massage in ${a.name}</p><h2>Expert Massage at Your ${a.name} Door</h2><p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);">Looking for a mobile massage therapist in ${a.name}, ${a.pc}? The Bereza Method delivers 9 specialist treatments directly to your door. No travel required — Iryna brings 10+ years of experience to you.</p><p>Deep tissue, Swedish, hot stone, aromatherapy, sensual, divine alignment, sports, couples, and lymphatic drainage — all available same-day in ${a.name}.</p><p><strong>Also serving:</strong> ${a.nearby}</p><p style="margin-top:var(--space-lg);"><a href="/book/" class="btn btn--primary">Book Now</a> <a href="${PL}" class="btn btn--outline" style="margin-left:var(--space-sm);">${PHONE}</a></p></div><div class="fade-in-right"><div style="background:var(--gradient-cream);border-radius:var(--radius-lg);height:400px;display:flex;align-items:center;justify-content:center;font-size:4rem;border:1px solid var(--color-light-gray);">📍</div></div></div></div></section>
  <section class="section section--cream"><div class="container"><div class="section-header fade-in"><p class="subtitle">Available in ${a.name}</p><h2>Treatments in ${a.name}</h2></div><div class="grid grid--3">
    <a href="/services/deep-tissue-massage-london/" class="card fade-in"><div class="card__icon">💆</div><h3 class="card__title">Deep Tissue</h3><p class="card__text">Chronic pain relief. From £65.</p></a>
    <a href="/services/swedish-massage-london/" class="card fade-in"><div class="card__icon">🌿</div><h3 class="card__title">Swedish</h3><p class="card__text">Stress relief. From £55.</p></a>
    <a href="/services/sensual-massage-london/" class="card fade-in"><div class="card__icon">🌹</div><h3 class="card__title">Sensual</h3><p class="card__text">Deep relaxation. From £120.</p></a>
    <a href="/services/divine-alignment-massage-london/" class="card fade-in"><div class="card__icon">✨</div><h3 class="card__title">Divine Alignment</h3><p class="card__text">Energy healing. From £80.</p></a>
    <a href="/services/couples-massage-london/" class="card fade-in"><div class="card__icon">💕</div><h3 class="card__title">Couples</h3><p class="card__text">Two therapists. From £110.</p></a>
    <a href="/services/sports-massage-london/" class="card fade-in"><div class="card__icon">🏃</div><h3 class="card__title">Sports</h3><p class="card__text">Athletic recovery. From £65.</p></a>
  </div></div></section>
  <section class="cta-section"><div class="container"><p class="subtitle">Book in ${a.name}</p><h2>Same-Day Massage in ${a.name}</h2><p>8am-8pm, 7 days a week. No travel fees.</p><div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;"><a href="/book/" class="btn btn--primary btn--lg">Book Now</a><a href="${PL}" class="btn btn--outline btn--lg" style="border-color:var(--color-cream);color:var(--color-cream);">${PHONE}</a></div></div></section>`
    ));
    console.log(`✓ Area: ${a.name}`);
});

// Update blog index with new SEO
const blogPosts = [
    { slug: 'deep-tissue-massage-for-london-desk-workers', tag: 'Deep Tissue', icon: '💆', title: 'Deep Tissue Massage for London Desk Workers: The Complete Guide (2026)', excerpt: 'How deep tissue massage treats chronic neck, shoulder and back pain caused by desk work.', date: 'March 1, 2026', read: '10 min' },
    { slug: 'london-marathon-recovery-guide', tag: 'Sports', icon: '🏃', title: 'London Marathon 2026 Recovery Guide: Pre & Post-Race Massage', excerpt: 'Pre-race and post-race massage protocols for London runners.', date: 'February 20, 2026', read: '12 min' },
    { slug: 'massage-for-anxiety-and-stress-relief', tag: 'Wellness', icon: '🧘', title: 'Massage for Anxiety & Stress Relief: What the Science Says', excerpt: 'Clinical evidence for massage therapy as anxiety treatment.', date: 'February 10, 2026', read: '9 min' },
    { slug: 'how-often-should-you-get-a-massage', tag: 'Guide', icon: '📅', title: 'How Often Should You Get a Massage? A Therapist\'s Guide', excerpt: 'Expert guidance on massage frequency for different goals.', date: 'January 28, 2026', read: '7 min' },
    { slug: 'mobile-massage-vs-spa-massage-london', tag: 'Lifestyle', icon: '🏠', title: 'Mobile Massage vs Spa: Why London Professionals Switch', excerpt: 'Why busy London professionals choose mobile massage.', date: 'January 15, 2026', read: '6 min' },
    { slug: 'what-to-expect-first-massage', tag: 'Beginners', icon: '🌟', title: 'Your First Massage: Complete Guide for Beginners', excerpt: 'Everything first-time clients need to know.', date: 'January 5, 2026', read: '8 min' },
];

writeFileSync('blog/index.html', pg(
    'Massage Therapy Blog London | Expert Advice',
    'Expert massage therapy articles by Iryna Bereza. Pain relief, stress management, recovery tips for London professionals. The Bereza Method.',
    '/blog/',
    `<section class="page-hero"><div class="container"><p class="subtitle">Blog</p><h1>Massage Therapy Insights</h1><p>Expert articles by Iryna Bereza on massage therapy, wellness and recovery.</p></div></section>
  <section class="section section--white"><div class="container"><div class="grid grid--3">${blogPosts.map(p => `
    <a href="/blog/${p.slug}/" class="blog-card fade-in"><div class="blog-card__image">${p.icon}</div><div class="blog-card__body"><span class="blog-card__tag">${p.tag}</span><h3 class="blog-card__title">${p.title}</h3><p class="blog-card__excerpt">${p.excerpt}</p><span class="blog-card__meta">${p.date} · ${p.read}</span></div></a>`).join('')}
  </div></div></section>
  <section class="cta-section"><div class="container"><p class="subtitle">Ready?</p><h2>Book Your Session</h2><a href="/book/" class="btn btn--primary btn--lg">Book Now</a></div></section>`
));
console.log('✓ Blog index');

// Update blog post SEO titles
const blogSEO = {
    'deep-tissue-massage-for-london-desk-workers': { title: 'Deep Tissue Massage for London Desk Workers | Complete Guide', desc: 'How deep tissue massage treats chronic neck, shoulder and back pain caused by desk work. Clinical guide by Iryna Bereza — 10 years treating City of London professionals.' },
    'london-marathon-recovery-guide': { title: 'London Marathon Recovery Guide | Pre & Post-Race Massage', desc: 'How sports massage accelerates marathon recovery. Pre-race and post-race protocols by Iryna Bereza — 10 years treating London runners. Mobile home visits.' },
    'massage-for-anxiety-and-stress-relief': { title: 'Massage for Anxiety & Stress Relief | What Science Says', desc: 'Clinical evidence for massage therapy as anxiety treatment. How Swedish and aromatherapy massage reduce cortisol and improve sleep. By Iryna Bereza, London.' },
    'how-often-should-you-get-a-massage': { title: 'How Often Should You Get a Massage | Therapist Guide', desc: 'Expert guidance on massage frequency for pain relief, stress management and athletic recovery. By Iryna Bereza — 10 years clinical experience. The Bereza Method London.' },
    'mobile-massage-vs-spa-massage-london': { title: 'Mobile Massage vs Spa | Why London Professionals Switch', desc: 'Why busy London professionals choose mobile massage over traditional spas. Convenience, personalisation and clinical outcomes compared. By Iryna Bereza.' },
    'what-to-expect-first-massage': { title: 'Your First Massage | Complete Guide for Beginners', desc: 'Everything first-time massage clients need to know. What happens, what to wear, how to prepare and how to choose the right treatment. By Iryna Bereza, London.' },
};

// Update each blog post's head section
import { readFileSync } from 'fs';
for (const [slug, seo] of Object.entries(blogSEO)) {
    const filePath = `blog/${slug}/index.html`;
    try {
        let content = readFileSync(filePath, 'utf-8');
        content = content.replace(/<title>[^<]+<\/title>/, `<title>${seo.title} | The Bereza Method</title>`);
        content = content.replace(/<meta name="description" content="[^"]+">/, `<meta name="description" content="${seo.desc}">`);
        writeFileSync(filePath, content);
        console.log(`✓ Blog SEO: ${slug}`);
    } catch (e) { console.log(`⚠ Blog not found: ${slug}`); }
}

// SITEMAP
writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://massage-london-bereza.vercel.app/</loc><priority>1.0</priority><changefreq>weekly</changefreq></url>
  <url><loc>https://massage-london-bereza.vercel.app/about</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://massage-london-bereza.vercel.app/services</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>
  <url><loc>https://massage-london-bereza.vercel.app/services/deep-tissue-massage-london</loc><priority>0.9</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/services/swedish-massage-london</loc><priority>0.9</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/services/hot-stone-massage-london</loc><priority>0.9</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/services/aromatherapy-massage-london</loc><priority>0.9</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/services/couples-massage-london</loc><priority>0.9</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/services/sports-massage-london</loc><priority>0.9</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/services/lymphatic-drainage-london</loc><priority>0.8</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/services/sensual-massage-london</loc><priority>0.9</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/services/divine-alignment-massage-london</loc><priority>0.8</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/pricing</loc><priority>0.8</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/booking</loc><priority>0.9</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/faq</loc><priority>0.7</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/contact</loc><priority>0.7</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/reviews</loc><priority>0.7</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/quiz</loc><priority>0.7</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/blog</loc><priority>0.7</priority><changefreq>weekly</changefreq></url>
  <url><loc>https://massage-london-bereza.vercel.app/gift-vouchers</loc><priority>0.7</priority></url>
  ${areas.map(a => `<url><loc>https://massage-london-bereza.vercel.app/areas/${a.slug}</loc><priority>0.7</priority></url>`).join('\n  ')}
  <url><loc>https://massage-london-bereza.vercel.app/terms</loc><priority>0.3</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/privacy</loc><priority>0.3</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/blog/deep-tissue-massage-for-london-desk-workers</loc><priority>0.7</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/blog/london-marathon-recovery-guide</loc><priority>0.7</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/blog/massage-for-anxiety-and-stress-relief</loc><priority>0.7</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/blog/how-often-should-you-get-a-massage</loc><priority>0.7</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/blog/mobile-massage-vs-spa-massage-london</loc><priority>0.7</priority></url>
  <url><loc>https://massage-london-bereza.vercel.app/blog/what-to-expect-first-massage</loc><priority>0.7</priority></url>
</urlset>`);
console.log('✓ Sitemap');

// ROBOTS.TXT
writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://massage-london-bereza.vercel.app/sitemap.xml`);
console.log('✓ Robots.txt');

console.log('Part 4 complete!');
