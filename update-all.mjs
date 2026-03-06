// Master update script - updates all pages with correct SEO, phone, email, images
import { writeFileSync, mkdirSync, readFileSync, readdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const PHONE = '+44 7704 503507';
const PHONE_LINK = 'tel:+447704503507';
const EMAIL = 'Runyruny@ukr.net';
const EMAIL_LINK = 'mailto:Runyruny@ukr.net';

// Shared components
const header = `<header class="header" id="header"><div class="header__inner"><a href="/" class="header__logo">The Bereza <span>Method</span></a><button class="nav-toggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button><nav class="nav" id="nav"><a href="/about/" class="nav__link">About</a><a href="/services/" class="nav__link">Services</a><a href="/pricing/" class="nav__link">Pricing</a><a href="/areas/massage-therapist-kensington/" class="nav__link">Areas</a><a href="/blog/" class="nav__link">Blog</a><a href="/contact/" class="nav__link">Contact</a><a href="/book/" class="nav__cta">Book Now</a></nav></div></header>`;

const footer = `<footer class="footer"><div class="container"><div class="footer__grid"><div><div class="footer__brand-name">The Bereza <span>Method</span></div><p class="footer__desc">London's premier mobile massage therapy service. Founded by Iryna Bereza — 10+ years clinical experience.</p><p style="margin-top:var(--space-md);"><a href="${PHONE_LINK}" style="color:var(--color-gold);">${PHONE}</a><br><a href="${EMAIL_LINK}" style="color:var(--color-gold);">${EMAIL}</a></p></div><div><h4 class="footer__heading">Services</h4><ul class="footer__links"><li><a href="/services/deep-tissue-massage-london/">Deep Tissue</a></li><li><a href="/services/swedish-massage-london/">Swedish</a></li><li><a href="/services/hot-stone-massage-london/">Hot Stone</a></li><li><a href="/services/aromatherapy-massage-london/">Aromatherapy</a></li><li><a href="/services/sports-massage-london/">Sports</a></li><li><a href="/services/couples-massage-london/">Couples</a></li><li><a href="/services/sensual-massage-london/">Sensual</a></li><li><a href="/services/divine-alignment-massage-london/">Divine Alignment</a></li><li><a href="/services/lymphatic-drainage-london/">Lymphatic</a></li></ul></div><div><h4 class="footer__heading">Quick Links</h4><ul class="footer__links"><li><a href="/about/">About</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/book/">Book Online</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/reviews/">Reviews</a></li><li><a href="/gift-vouchers/">Gift Vouchers</a></li><li><a href="/quiz/">Free Quiz</a></li><li><a href="/contact/">Contact</a></li></ul></div><div><h4 class="footer__heading">Areas</h4><ul class="footer__links"><li><a href="/areas/massage-therapist-kensington/">Kensington</a></li><li><a href="/areas/massage-therapist-chelsea/">Chelsea</a></li><li><a href="/areas/massage-therapist-mayfair/">Mayfair</a></li><li><a href="/areas/massage-therapist-paddington/">Paddington</a></li><li><a href="/areas/massage-therapist-canary-wharf/">Canary Wharf</a></li><li><a href="/areas/massage-therapist-knightsbridge/">Knightsbridge</a></li><li><a href="/areas/massage-therapist-notting-hill/">Notting Hill</a></li><li><a href="/areas/massage-therapist-soho/">Soho</a></li></ul></div></div><div class="footer__bottom"><p>&copy; 2026 The Bereza Method. All rights reserved. <a href="/terms/">Terms</a> · <a href="/privacy/">Privacy</a></p><p><a href="${PHONE_LINK}">${PHONE}</a> · <a href="${EMAIL_LINK}">${EMAIL}</a></p></div></div></footer>`;

const trustBar = `<div class="trust-bar"><div class="trust-bar__inner"><div class="trust-bar__item"><span>✓</span> 10+ Years Experience</div><div class="trust-bar__item"><span>✓</span> Same-Day Available</div><div class="trust-bar__item"><span>✓</span> 8am-8pm Daily</div><div class="trust-bar__item"><span>✓</span> No Travel Fees</div></div></div>`;

function page(title, desc, canonical, body, schema = '') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="https://theberezamethod.com${canonical}">
  <link rel="stylesheet" href="/css/global.css">
  ${schema}
</head>
<body>
  ${header}
  ${body}
  ${footer}
  <script src="/js/main.js"></script>
</body>
</html>`;
}

// ============ HOMEPAGE ============
console.log('Building homepage...');
const homepageSchema = `<script type="application/ld+json">
  ${JSON.stringify({
    "@context": "https://schema.org", "@type": "MassageTherapy", "name": "The Bereza Method",
    "description": "Premium mobile massage therapy in London by Iryna Bereza. 10 years clinical experience. Same-day home, hotel, and office visits across Central London.",
    "url": "https://theberezamethod.com", "telephone": "+447704503507", "email": "Runyruny@ukr.net",
    "founder": { "@type": "Person", "name": "Iryna Bereza", "jobTitle": "Clinical Massage Therapist & Founder" },
    "areaServed": { "@type": "City", "name": "London" }, "priceRange": "£55 - £640",
    "openingHoursSpecification": { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], "opens": "08:00", "closes": "20:00" },
    "hasOfferCatalog": {
        "@type": "OfferCatalog", "name": "Massage Therapy Services", "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Deep Tissue Massage" }, "price": "105", "priceCurrency": "GBP" },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Swedish Therapeutic Massage" }, "price": "95", "priceCurrency": "GBP" },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hot Stone Massage" }, "price": "115", "priceCurrency": "GBP" },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Aromatherapy Massage" }, "price": "110", "priceCurrency": "GBP" },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Couples Massage" }, "price": "110", "priceCurrency": "GBP" },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sports Recovery Massage" }, "price": "105", "priceCurrency": "GBP" },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Lymphatic Drainage Massage" }, "price": "110", "priceCurrency": "GBP" },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sensual Massage" }, "price": "200", "priceCurrency": "GBP" },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Massage with Divine Alignment" }, "price": "130", "priceCurrency": "GBP" }
        ]
    }
})}
  </script>`;

const homepageBody = `
  <section class="hero">
    <div class="container">
      <p class="subtitle">✦ London's Premier Mobile Massage</p>
      <h1>Clinical Massage Therapy, <em>Delivered</em> to Your Door</h1>
      <p class="hero__desc">Outcome-driven deep tissue, Swedish, hot stone, aromatherapy, sensual & sports massage by Iryna Bereza — 10+ years of clinical experience. Same-day availability across Central London.</p>
      <div class="hero__cta">
        <a href="/book/" class="btn btn--primary btn--lg">Book Same-Day Session</a>
        <a href="/services/" class="btn btn--outline btn--lg">Explore Services</a>
      </div>
      <p style="margin-top:var(--space-lg);opacity:0.7;font-size:var(--fs-small);">Or call: <a href="${PHONE_LINK}" style="color:var(--color-gold);">${PHONE}</a></p>
    </div>
  </section>

  <div class="trust-bar"><div class="trust-bar__inner">
    <div class="trust-bar__item"><div class="trust-bar__number">10+</div><div class="trust-bar__label">Years Experience</div></div>
    <div class="trust-bar__item"><div class="trust-bar__number">200+</div><div class="trust-bar__label">5-Star Reviews</div></div>
    <div class="trust-bar__item"><div class="trust-bar__number">9</div><div class="trust-bar__label">Specialist Treatments</div></div>
    <div class="trust-bar__item"><div class="trust-bar__number">8am-8pm</div><div class="trust-bar__label">7 Days a Week</div></div>
  </div></div>

  <section class="section section--white">
    <div class="container">
      <div class="section-header fade-in"><p class="subtitle">Our Services</p><h2>9 Specialist Treatments</h2><p>From clinical deep tissue to divine alignment — every treatment personalised to you.</p></div>
      <div class="grid grid--3">
        <a href="/services/deep-tissue-massage-london/" class="card fade-in"><img src="/images/deep-tissue.png" alt="Deep tissue massage therapy London by Iryna Bereza targeting chronic back pain" class="card__image"><h3 class="card__title">Deep Tissue Massage</h3><p class="card__text">Chronic neck, back & shoulder pain relief. From £65.</p></a>
        <a href="/services/swedish-massage-london/" class="card fade-in"><img src="/images/swedish.png" alt="Swedish therapeutic massage London full body stress relief" class="card__image"><h3 class="card__title">Swedish Massage</h3><p class="card__text">Full-body stress relief & nervous system reset. From £55.</p></a>
        <a href="/services/hot-stone-massage-london/" class="card fade-in"><img src="/images/hot-stone.png" alt="Hot stone massage London heated volcanic basalt stones" class="card__image"><h3 class="card__title">Hot Stone Massage</h3><p class="card__text">Heated volcanic basalt stones for deep release. From £70.</p></a>
        <a href="/services/aromatherapy-massage-london/" class="card fade-in"><img src="/images/aromatherapy.jpg" alt="Aromatherapy massage London organic essential oils" class="card__image"><h3 class="card__title">Aromatherapy Massage</h3><p class="card__text">Essential oil therapy for anxiety & stress. From £65.</p></a>
        <a href="/services/sensual-massage-london/" class="card fade-in"><img src="/images/sensual.png" alt="Professional sensual massage London deep relaxation" class="card__image"><h3 class="card__title">Sensual Massage</h3><p class="card__text">Deep relaxation & body awareness. From £120.</p></a>
        <a href="/services/divine-alignment-massage-london/" class="card fade-in"><img src="/images/divine-alignment.png" alt="Divine alignment massage London energy healing" class="card__image"><h3 class="card__title">Divine Alignment</h3><p class="card__text">Body, mind & spirit harmony. From £80.</p></a>
        <a href="/services/sports-massage-london/" class="card fade-in"><img src="/images/sports.jpg" alt="Sports recovery massage London for athlete" class="card__image"><h3 class="card__title">Sports Massage</h3><p class="card__text">Athletic recovery & performance. From £65.</p></a>
        <a href="/services/couples-massage-london/" class="card fade-in"><img src="/images/couples.jpg" alt="Couples massage London two therapists side by side" class="card__image"><h3 class="card__title">Couples Massage</h3><p class="card__text">Two therapists, two treatments. From £110.</p></a>
        <a href="/services/lymphatic-drainage-london/" class="card fade-in"><img src="/images/lymphatic.png" alt="Lymphatic drainage massage London gentle technique" class="card__image"><h3 class="card__title">Lymphatic Drainage</h3><p class="card__text">Reduce swelling & boost immunity. From £65.</p></a>
      </div>
    </div>
  </section>

  <section class="section section--cream">
    <div class="container">
      <div class="section-header fade-in"><p class="subtitle">How It Works</p><h2>Your Session in 4 Steps</h2></div>
      <div class="grid grid--4">
        <div class="card fade-in" style="text-align:center;"><div class="card__icon">📱</div><h4 class="card__title">1. Book</h4><p class="card__text">Call ${PHONE} or book online. Same-day available.</p></div>
        <div class="card fade-in" style="text-align:center;"><div class="card__icon">🏠</div><h4 class="card__title">2. We Arrive</h4><p class="card__text">Your therapist arrives with table, oils & linens.</p></div>
        <div class="card fade-in" style="text-align:center;"><div class="card__icon">💆</div><h4 class="card__title">3. Treatment</h4><p class="card__text">Personalised session based on your tension assessment.</p></div>
        <div class="card fade-in" style="text-align:center;"><div class="card__icon">✨</div><h4 class="card__title">4. Aftercare</h4><p class="card__text">Personalised aftercare plan for lasting results.</p></div>
      </div>
    </div>
  </section>

  <section class="section section--white">
    <div class="container">
      <div class="section-header fade-in"><p class="subtitle">Testimonials</p><h2>What London Says</h2></div>
      <div class="grid grid--3">
        <div class="testimonial fade-in"><div class="testimonial__stars">★★★★★</div><p class="testimonial__text">"Iryna completely transformed my chronic neck pain after just two sessions. Life-changing."</p><div class="testimonial__author"><div class="testimonial__avatar">JC</div><div><div class="testimonial__name">James C.</div><div class="testimonial__location">Kensington · Deep Tissue</div></div></div></div>
        <div class="testimonial fade-in"><div class="testimonial__stars">★★★★★</div><p class="testimonial__text">"Best massage I've ever had in London. The hot stone session was absolute heaven."</p><div class="testimonial__author"><div class="testimonial__avatar">SH</div><div><div class="testimonial__name">Sarah H.</div><div class="testimonial__location">Mayfair · Hot Stone</div></div></div></div>
        <div class="testimonial fade-in"><div class="testimonial__stars">★★★★★</div><p class="testimonial__text">"We booked a couples massage for our anniversary. Two therapists arrived perfectly on time. Unforgettable."</p><div class="testimonial__author"><div class="testimonial__avatar">RT</div><div><div class="testimonial__name">Robert T.</div><div class="testimonial__location">Chelsea · Couples</div></div></div></div>
      </div>
    </div>
  </section>

  <section class="section section--cream">
    <div class="container">
      <div class="section-header fade-in"><p class="subtitle">Areas We Serve</p><h2>Central London Coverage</h2></div>
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-sm);justify-content:center;" class="fade-in">
        <a href="/areas/massage-therapist-kensington/" class="area-tag">Kensington W8</a>
        <a href="/areas/massage-therapist-chelsea/" class="area-tag">Chelsea SW3</a>
        <a href="/areas/massage-therapist-mayfair/" class="area-tag">Mayfair W1</a>
        <a href="/areas/massage-therapist-paddington/" class="area-tag">Paddington W2</a>
        <a href="/areas/massage-therapist-canary-wharf/" class="area-tag">Canary Wharf E14</a>
        <a href="/areas/massage-therapist-knightsbridge/" class="area-tag">Knightsbridge SW1</a>
        <a href="/areas/massage-therapist-notting-hill/" class="area-tag">Notting Hill W11</a>
        <a href="/areas/massage-therapist-soho/" class="area-tag">Soho W1</a>
        <a href="/areas/massage-therapist-city-of-london/" class="area-tag">City of London</a>
        <a href="/areas/massage-therapist-south-kensington/" class="area-tag">South Kensington</a>
      </div>
    </div>
  </section>

  <section class="cta-section">
    <div class="container">
      <p class="subtitle">Ready to Feel the Difference?</p>
      <h2>Book Your Same-Day Session</h2>
      <p>9 specialist treatments delivered to your door. 8am-8pm, 7 days a week.</p>
      <div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;">
        <a href="/book/" class="btn btn--primary btn--lg">Book Now — Same-Day Available</a>
        <a href="${PHONE_LINK}" class="btn btn--outline btn--lg" style="border-color:var(--color-cream);color:var(--color-cream);">Call ${PHONE}</a>
      </div>
    </div>
  </section>`;

writeFileSync('index.html', page(
    'The Bereza Method | Mobile Massage London | Iryna Bereza',
    `Premium mobile massage London by Iryna Bereza. 10 years experience. Deep tissue, Swedish, sensual, divine alignment. Kensington, Mayfair, Paddington, Chelsea, Canary Wharf. Same-day 8am-8pm. Book: ${PHONE}`,
    '/', homepageBody, homepageSchema
));
console.log('✓ Homepage');

// ============ ABOUT ============
const aboutSchema = `<script type="application/ld+json">
  ${JSON.stringify({ "@context": "https://schema.org", "@type": "Person", "name": "Iryna Bereza", "jobTitle": "Clinical Massage Therapist & Founder", "worksFor": { "@type": "MassageTherapy", "name": "The Bereza Method" }, "description": "Iryna Bereza is the founder of The Bereza Method — London's premium mobile massage therapy service. With 10+ years of professional clinical experience.", "knowsAbout": ["Deep Tissue Massage", "Swedish Massage", "Sports Massage", "Aromatherapy Massage", "Hot Stone Massage", "Lymphatic Drainage", "Sensual Massage", "Massage with Divine Alignment", "Myofascial Release"], "url": "https://theberezamethod.com/about", "telephone": "+447704503507", "email": "Runyruny@ukr.net" })}
  </script>`;

writeFileSync('about/index.html', page(
    'About Iryna Bereza | 10 Years Massage Therapy London',
    'Meet Iryna Bereza — founder of The Bereza Method. Team of two qualified therapists. 10+ years clinical experience across Kensington, Mayfair, Paddington & Central London.',
    '/about/', `
  <section class="page-hero"><div class="container"><p class="subtitle">About</p><h1>About Iryna Bereza</h1><p>Founder of The Bereza Method — 10+ years of clinical massage therapy across Central London.</p></div></section>
  <section class="section section--white"><div class="container"><div class="grid grid--2" style="align-items:center;gap:var(--space-4xl);"><div class="fade-in-left"><img src="/images/iryna-portrait.jpg" alt="Iryna Bereza founder of The Bereza Method mobile massage therapist London" style="width:100%;border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);"></div><div class="fade-in-right"><p class="subtitle">The Founder</p><h2>Iryna Bereza</h2><p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);">With over 10 years of clinical experience, Iryna founded The Bereza Method to bring premium, outcome-driven massage therapy directly to London's most discerning clients.</p><p>Specialising in deep tissue therapy, Swedish massage, sensual massage, massage with divine alignment, sports recovery, and aromatherapy — Iryna treats the root cause, not just the symptoms.</p><h3 style="margin-top:var(--space-xl);">Qualifications</h3><ul style="list-style:none;"><li style="padding:var(--space-xs) 0;">✦ Level 4+ Qualified Clinical Massage Therapist</li><li style="padding:var(--space-xs) 0;">✦ DBS Checked & Fully Insured</li><li style="padding:var(--space-xs) 0;">✦ 10+ Years Professional Experience</li><li style="padding:var(--space-xs) 0;">✦ Advanced Myofascial Release Training</li><li style="padding:var(--space-xs) 0;">✦ Sports Massage Specialist</li></ul><h3 style="margin-top:var(--space-xl);">Our Team</h3><p>The Bereza Method is a dedicated team of two fully qualified, DBS-checked, insured massage therapists. For couples massage, both therapists arrive together — each person receives a fully personalised treatment.</p><p style="margin-top:var(--space-lg);"><a href="/book/" class="btn btn--primary">Book a Session</a> <a href="${PHONE_LINK}" class="btn btn--outline" style="margin-left:var(--space-sm);">Call ${PHONE}</a></p></div></div></div></section>
  <section class="cta-section"><div class="container"><p class="subtitle">Ready?</p><h2>Experience The Bereza Method</h2><p>Same-day availability. 8am-8pm, 7 days a week.</p><a href="/book/" class="btn btn--primary btn--lg">Book Now</a></div></section>`,
    aboutSchema
));
console.log('✓ About');

// ============ SERVICES OVERVIEW ============
mkdirSync('services', { recursive: true });
writeFileSync('services/index.html', page(
    '9 Massage Treatments London | The Bereza Method',
    'Deep tissue, Swedish, hot stone, aromatherapy, sensual, divine alignment, sports, lymphatic, couples massage. Mobile London. From £55. Iryna Bereza. Same-day home visits.',
    '/services/', `
  <section class="page-hero"><div class="container"><p class="subtitle">Our Services</p><h1>9 Specialist Massage Treatments</h1><p>From clinical deep tissue to divine alignment — every treatment personalised to you. From £55.</p></div></section>
  ${trustBar}
  <section class="section section--white"><div class="container"><div class="grid grid--3">
    <a href="/services/deep-tissue-massage-london/" class="card fade-in"><img src="/images/deep-tissue.png" alt="Deep tissue massage therapy London" class="card__image"><h3 class="card__title">Deep Tissue Massage</h3><p class="card__text">Chronic pain relief. Targets neck, back & shoulder tension from desk work. From £65.</p><span class="card__link">Learn More →</span></a>
    <a href="/services/swedish-massage-london/" class="card fade-in"><img src="/images/swedish.png" alt="Swedish massage London" class="card__image"><h3 class="card__title">Swedish Massage</h3><p class="card__text">Full-body stress relief, nervous system reset. Better sleep. From £55.</p><span class="card__link">Learn More →</span></a>
    <a href="/services/hot-stone-massage-london/" class="card fade-in"><img src="/images/hot-stone.png" alt="Hot stone massage London" class="card__image"><h3 class="card__title">Hot Stone Massage</h3><p class="card__text">Heated volcanic basalt stones. Deep warmth & muscle release. From £70.</p><span class="card__link">Learn More →</span></a>
    <a href="/services/aromatherapy-massage-london/" class="card fade-in"><img src="/images/aromatherapy.jpg" alt="Aromatherapy massage London" class="card__image"><h3 class="card__title">Aromatherapy Massage</h3><p class="card__text">Organic essential oils. Anxiety, burnout & emotional fatigue. From £65.</p><span class="card__link">Learn More →</span></a>
    <a href="/services/sensual-massage-london/" class="card fade-in"><img src="/images/sensual.png" alt="Sensual massage London" class="card__image"><h3 class="card__title">Sensual Massage</h3><p class="card__text">Deep relaxation, body awareness, emotional connection. From £120.</p><span class="card__link">Learn More →</span></a>
    <a href="/services/divine-alignment-massage-london/" class="card fade-in"><img src="/images/divine-alignment.png" alt="Divine alignment massage London" class="card__image"><h3 class="card__title">Massage with Divine Alignment</h3><p class="card__text">Body, mind & spirit harmony. Energy balancing & grounding. From £80.</p><span class="card__link">Learn More →</span></a>
    <a href="/services/sports-massage-london/" class="card fade-in"><img src="/images/sports.jpg" alt="Sports massage London" class="card__image"><h3 class="card__title">Sports Recovery</h3><p class="card__text">Pre-event, post-event for runners & athletes. From £65.</p><span class="card__link">Learn More →</span></a>
    <a href="/services/couples-massage-london/" class="card fade-in"><img src="/images/couples.jpg" alt="Couples massage London" class="card__image"><h3 class="card__title">Couples Massage</h3><p class="card__text">Two therapists arrive together. Each person chooses own treatment. From £110.</p><span class="card__link">Learn More →</span></a>
    <a href="/services/lymphatic-drainage-london/" class="card fade-in"><img src="/images/lymphatic.png" alt="Lymphatic drainage London" class="card__image"><h3 class="card__title">Lymphatic Drainage</h3><p class="card__text">Reduce swelling, boost immunity, post-surgery support. From £65.</p><span class="card__link">Learn More →</span></a>
  </div></div></section>
  <section class="cta-section"><div class="container"><p class="subtitle">Not Sure Which Treatment?</p><h2>Take Our Free Tension Quiz</h2><p>Get a personalised massage recommendation in 2 minutes.</p><div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;"><a href="/quiz/" class="btn btn--primary btn--lg">Take the Quiz</a><a href="${PHONE_LINK}" class="btn btn--outline btn--lg" style="border-color:var(--color-cream);color:var(--color-cream);">Call ${PHONE}</a></div></div></section>`
));
console.log('✓ Services Overview');

console.log('Part 1 complete - core pages updated');
