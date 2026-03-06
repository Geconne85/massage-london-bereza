// Generate area landing pages
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';

const areas = [
    { slug: 'massage-therapist-soho', name: 'Soho', postcode: 'W1', title: 'Mobile Massage Therapist Soho W1 | Same-Day | The Bereza Method', desc: 'Same-day mobile massage therapy in Soho, W1. Deep tissue, Swedish & aromatherapy delivered to your Soho home, hotel or office by Iryna Bereza. 10+ years experience. Book now.', audience: 'Soho professionals, creatives and residents', nearby: 'Fitzrovia, Marylebone, Mayfair' },
    { slug: 'massage-therapist-mayfair', name: 'Mayfair', postcode: 'W1', title: 'Mobile Massage Therapist Mayfair W1 | Home & Hotel | The Bereza Method', desc: 'Premium mobile massage in Mayfair, W1. Deep tissue, hot stone & couples massage delivered to your Mayfair home or hotel by Iryna Bereza. 10+ years experience. Same-day availability.', audience: 'Mayfair residents, hotel guests and luxury clients', nearby: 'Soho, Kensington, Marylebone' },
    { slug: 'massage-therapist-city-of-london', name: 'City of London', postcode: 'EC1–EC4', title: 'Mobile Massage City of London EC1-EC4 | Same-Day | The Bereza Method', desc: 'Same-day mobile massage therapy in the City of London (EC1, EC2, EC3, EC4). Deep tissue for desk pain, Swedish for stress relief. By Iryna Bereza — 10+ years clinical experience.', audience: 'City workers, financial professionals and commuters', nearby: 'Shoreditch, South Bank, Canary Wharf' },
    { slug: 'massage-therapist-canary-wharf', name: 'Canary Wharf', postcode: 'E14', title: 'Mobile Massage Canary Wharf E14 | The Bereza Method', desc: 'Mobile massage therapy in Canary Wharf, E14. Deep tissue for desk workers, sports recovery for athletes. Delivered to your home or office by Iryna Bereza. Same-day booking available.', audience: 'Canary Wharf professionals and Docklands residents', nearby: 'City of London, Shoreditch, South Bank' },
    { slug: 'massage-therapist-kensington', name: 'Kensington', postcode: 'W8', title: 'Mobile Massage Therapist Kensington W8 | The Bereza Method', desc: 'Premium mobile massage in Kensington, W8. Swedish, hot stone, aromatherapy & couples massage delivered to your Kensington home by Iryna Bereza. 10+ years experience. Book same-day.', audience: 'Kensington families, professionals and residents', nearby: 'Chelsea, Mayfair, Notting Hill' },
    { slug: 'massage-therapist-chelsea', name: 'Chelsea', postcode: 'SW3', title: 'Mobile Massage Therapist Chelsea SW3 | The Bereza Method', desc: 'Mobile massage therapy in Chelsea, SW3. Deep tissue, Swedish & aromatherapy delivered to your Chelsea home by Iryna Bereza. Organic oils. 10+ years experience. Same-day availability.', audience: 'Chelsea residents and South West London families', nearby: 'Kensington, South Bank, Mayfair' },
    { slug: 'massage-therapist-shoreditch', name: 'Shoreditch', postcode: 'EC2', title: 'Mobile Massage Therapist Shoreditch EC2 | The Bereza Method', desc: 'Same-day mobile massage in Shoreditch, EC2. Deep tissue for tech workers, sports recovery & stress relief. Delivered to your home or office by Iryna Bereza. Book online.', audience: 'Shoreditch tech workers, creatives and residents', nearby: 'City of London, Islington, Canary Wharf' },
    { slug: 'massage-therapist-marylebone', name: 'Marylebone', postcode: 'W1', title: 'Mobile Massage Therapist Marylebone W1 | The Bereza Method', desc: 'Premium mobile massage in Marylebone, W1. Swedish, deep tissue & aromatherapy delivered to your Marylebone home by Iryna Bereza. 10+ years clinical experience. Same-day booking.', audience: 'Marylebone residents, Harley Street professionals and visitors', nearby: 'Soho, Mayfair, Fitzrovia' },
    { slug: 'massage-therapist-islington', name: 'Islington', postcode: 'N1', title: 'Mobile Massage Therapist Islington N1 | The Bereza Method', desc: 'Mobile massage therapy in Islington, N1. Deep tissue, Swedish & hot stone massage delivered to your Islington home by Iryna Bereza. 10+ years experience. Same-day availability.', audience: 'Islington families, professionals and Angel residents', nearby: 'Shoreditch, City of London, Camden' },
    { slug: 'massage-therapist-south-bank', name: 'South Bank', postcode: 'SE1', title: 'Mobile Massage Therapist South Bank SE1 | The Bereza Method', desc: 'Mobile massage therapy on the South Bank, SE1. Deep tissue, Swedish & aromatherapy delivered to your home or hotel by Iryna Bereza. 10+ years experience. Book same-day.', audience: 'South Bank residents, Southwark professionals and hotel guests', nearby: 'City of London, Chelsea, Westminster' },
];

const header = `<header class="header" id="header"><div class="header__inner"><a href="/" class="header__logo">The Bereza <span>Method</span></a><button class="nav-toggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button><nav class="nav" id="nav"><a href="/about/" class="nav__link">About</a><a href="/services/deep-tissue-massage-london/" class="nav__link">Services</a><a href="/pricing/" class="nav__link">Pricing</a><a href="/areas/massage-therapist-soho/" class="nav__link">Areas</a><a href="/blog/" class="nav__link">Blog</a><a href="/contact/" class="nav__link">Contact</a><a href="/book/" class="nav__cta">Book Now</a></nav></div></header>`;

const footer = `<footer class="footer"><div class="container"><div class="footer__grid"><div><div class="footer__brand-name">The Bereza <span>Method</span></div><p class="footer__desc">London's premier mobile massage therapy service.</p></div><div><h4 class="footer__heading">Services</h4><ul class="footer__links"><li><a href="/services/deep-tissue-massage-london/">Deep Tissue</a></li><li><a href="/services/swedish-massage-london/">Swedish</a></li><li><a href="/services/hot-stone-massage-london/">Hot Stone</a></li><li><a href="/services/aromatherapy-massage-london/">Aromatherapy</a></li><li><a href="/services/sports-massage-london/">Sports</a></li><li><a href="/services/couples-massage-london/">Couples</a></li></ul></div><div><h4 class="footer__heading">Quick Links</h4><ul class="footer__links"><li><a href="/about/">About</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/book/">Book Online</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/reviews/">Reviews</a></li></ul></div><div><h4 class="footer__heading">Areas</h4><ul class="footer__links"><li><a href="/areas/massage-therapist-soho/">Soho</a></li><li><a href="/areas/massage-therapist-mayfair/">Mayfair</a></li><li><a href="/areas/massage-therapist-city-of-london/">City of London</a></li><li><a href="/areas/massage-therapist-canary-wharf/">Canary Wharf</a></li><li><a href="/areas/massage-therapist-kensington/">Kensington</a></li></ul></div></div><div class="footer__bottom"><p>&copy; 2026 The Bereza Method. All rights reserved.</p><p>hello@theberezamethod.com</p></div></div></footer>`;

areas.forEach(area => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${area.title}</title>
  <meta name="description" content="${area.desc}">
  <link rel="canonical" href="https://theberezamethod.com/areas/${area.slug}/">
  <link rel="stylesheet" href="/css/global.css">
</head>
<body>
  ${header}

  <section class="page-hero">
    <div class="container">
      <p class="subtitle">${area.name} ${area.postcode}</p>
      <h1>Mobile Massage Therapist in ${area.name}</h1>
      <p>Same-day mobile massage therapy delivered to your ${area.name} home, hotel or office by Iryna Bereza.</p>
    </div>
  </section>

  <div class="trust-bar"><div class="trust-bar__inner"><div class="trust-bar__item"><span>✓</span> 10+ Years Experience</div><div class="trust-bar__item"><span>✓</span> Same-Day in ${area.name}</div><div class="trust-bar__item"><span>✓</span> No Travel Fees</div><div class="trust-bar__item"><span>✓</span> DBS Checked & Insured</div></div></div>

  <section class="section section--white">
    <div class="container">
      <div class="grid grid--2" style="align-items:center;gap:var(--space-4xl);">
        <div class="fade-in-left">
          <p class="subtitle">Mobile Massage in ${area.name}</p>
          <h2>Expert Massage Therapy at Your ${area.name} Door</h2>
          <p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);">Looking for a mobile massage therapist in ${area.name}, ${area.postcode}? The Bereza Method delivers clinical-grade massage therapy directly to ${area.audience}. No travel required — Iryna Bereza brings 10+ years of professional experience to your door.</p>
          <p>Whether you need deep tissue therapy for chronic pain, Swedish massage for stress relief, or sports recovery after training, we provide the same premium service in ${area.name} that has earned us 200+ five-star reviews across Central London.</p>
          <p><strong>Also serving nearby:</strong> ${area.nearby}</p>
        </div>
        <div class="fade-in-right">
          <div style="background:var(--gradient-cream);border-radius:var(--radius-lg);height:400px;display:flex;align-items:center;justify-content:center;font-size:4rem;border:1px solid var(--color-light-gray);">📍</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--cream">
    <div class="container">
      <div class="section-header fade-in">
        <p class="subtitle">Available in ${area.name}</p>
        <h2>Treatments We Offer in ${area.name}</h2>
      </div>
      <div class="grid grid--3">
        <a href="/services/deep-tissue-massage-london/" class="card fade-in"><div class="card__icon">💆</div><h3 class="card__title">Deep Tissue</h3><p class="card__text">Clinical deep tissue therapy for chronic pain. From £105/60min.</p></a>
        <a href="/services/swedish-massage-london/" class="card fade-in"><div class="card__icon">🌿</div><h3 class="card__title">Swedish</h3><p class="card__text">Full-body stress relief and relaxation. From £95/60min.</p></a>
        <a href="/services/hot-stone-massage-london/" class="card fade-in"><div class="card__icon">🪨</div><h3 class="card__title">Hot Stone</h3><p class="card__text">Heated volcanic basalt stones for deep release. From £115/60min.</p></a>
        <a href="/services/aromatherapy-massage-london/" class="card fade-in"><div class="card__icon">🌸</div><h3 class="card__title">Aromatherapy</h3><p class="card__text">Essential oil therapy for anxiety & stress. From £105/60min.</p></a>
        <a href="/services/sports-massage-london/" class="card fade-in"><div class="card__icon">🏃</div><h3 class="card__title">Sports Massage</h3><p class="card__text">Athletic recovery and performance. From £105/60min.</p></a>
        <a href="/services/couples-massage-london/" class="card fade-in"><div class="card__icon">💕</div><h3 class="card__title">Couples</h3><p class="card__text">Side-by-side massage for two. From £200/60min.</p></a>
      </div>
    </div>
  </section>

  <section class="section section--white">
    <div class="container container--narrow">
      <div class="section-header fade-in">
        <p class="subtitle">Testimonial</p>
        <h2>What ${area.name} Clients Say</h2>
      </div>
      <div class="testimonial fade-in" style="max-width:600px;margin:0 auto;">
        <div class="testimonial__stars">★★★★★</div>
        <p class="testimonial__text">"Iryna came to my home in ${area.name} and gave me the best massage I've had in London. So professional, so convenient. I've been booking monthly ever since."</p>
        <div class="testimonial__author">
          <div class="testimonial__avatar">★</div>
          <div>
            <div class="testimonial__name">Verified Client</div>
            <div class="testimonial__location">${area.name}, London</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="cta-section">
    <div class="container">
      <p class="subtitle">Book in ${area.name}</p>
      <h2>Same-Day Massage in ${area.name}</h2>
      <p>Book before 2pm for same-day service. No travel fees in ${area.name}.</p>
      <a href="/book/" class="btn btn--primary btn--lg">Book Now — ${area.name}</a>
    </div>
  </section>

  ${footer}
  <script src="/js/main.js"></script>
</body>
</html>`;

    const dir = resolve(`areas/${area.slug}`);
    mkdirSync(dir, { recursive: true });
    writeFileSync(resolve(dir, 'index.html'), html);
    console.log(`Created: areas/${area.slug}/index.html`);
});

console.log('All 10 area pages created!');
