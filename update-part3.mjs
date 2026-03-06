// Part 3: FAQ, Contact, Reviews, Gift Vouchers, Quiz, Terms, Privacy
import { writeFileSync, mkdirSync } from 'fs';
const PHONE = '+44 7704 503507';
const PL = 'tel:+447704503507';
const EMAIL = 'Runyruny@ukr.net';
const EL = `mailto:${EMAIL}`;

const H = `<header class="header" id="header"><div class="header__inner"><a href="/" class="header__logo">The Bereza <span>Method</span></a><button class="nav-toggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button><nav class="nav" id="nav"><a href="/about/" class="nav__link">About</a><a href="/services/" class="nav__link">Services</a><a href="/pricing/" class="nav__link">Pricing</a><a href="/areas/massage-therapist-kensington/" class="nav__link">Areas</a><a href="/blog/" class="nav__link">Blog</a><a href="/contact/" class="nav__link">Contact</a><a href="/book/" class="nav__cta">Book Now</a></nav></div></header>`;
const F = `<footer class="footer"><div class="container"><div class="footer__grid"><div><div class="footer__brand-name">The Bereza <span>Method</span></div><p class="footer__desc">London's premier mobile massage therapy service.</p><p style="margin-top:var(--space-md);"><a href="${PL}" style="color:var(--color-gold);">${PHONE}</a><br><a href="${EL}" style="color:var(--color-gold);">${EMAIL}</a></p></div><div><h4 class="footer__heading">Services</h4><ul class="footer__links"><li><a href="/services/deep-tissue-massage-london/">Deep Tissue</a></li><li><a href="/services/swedish-massage-london/">Swedish</a></li><li><a href="/services/sensual-massage-london/">Sensual</a></li><li><a href="/services/divine-alignment-massage-london/">Divine Alignment</a></li><li><a href="/services/sports-massage-london/">Sports</a></li><li><a href="/services/couples-massage-london/">Couples</a></li></ul></div><div><h4 class="footer__heading">Quick Links</h4><ul class="footer__links"><li><a href="/about/">About</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/book/">Book Online</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/reviews/">Reviews</a></li><li><a href="/quiz/">Free Quiz</a></li></ul></div><div><h4 class="footer__heading">Areas</h4><ul class="footer__links"><li><a href="/areas/massage-therapist-kensington/">Kensington</a></li><li><a href="/areas/massage-therapist-chelsea/">Chelsea</a></li><li><a href="/areas/massage-therapist-mayfair/">Mayfair</a></li><li><a href="/areas/massage-therapist-paddington/">Paddington</a></li><li><a href="/areas/massage-therapist-canary-wharf/">Canary Wharf</a></li></ul></div></div><div class="footer__bottom"><p>&copy; 2026 The Bereza Method. <a href="/terms/">Terms</a> · <a href="/privacy/">Privacy</a></p></div></div></footer>`;

function pg(t, d, c, b, s = '') { return `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">\n<title>${t}</title><meta name="description" content="${d}"><link rel="canonical" href="https://theberezamethod.com${c}"><link rel="stylesheet" href="/css/global.css">${s}\n</head>\n<body>${H}${b}${F}<script src="/js/main.js"></script></body></html>`; }

// FAQ with full schema
const faqData = [
    { q: "What happens during my first massage session?", a: "Your therapist arrives with a professional massage table, premium organic oils, and fresh linens. After a 5-10 minute consultation about your health history and goals, you undress to your comfort level in private. The treatment lasts the full booked duration. Afterwards, you receive personalised aftercare recommendations." },
    { q: "Is it safe having a therapist come to my home?", a: "Yes. Iryna Bereza is DBS-checked, fully insured with professional indemnity coverage, and has 10+ years of clinical experience. Professional boundaries are maintained without exception. Your safety is non-negotiable." },
    { q: "Can I book a same-day massage in London?", a: `Yes. Same-day appointments are available 7 days a week across Central London including Kensington, Mayfair, Paddington, Chelsea, and Canary Wharf. Book before 2pm for best same-day availability. Hours are 8am to 8pm daily.` },
    { q: "How much does mobile massage cost in London?", a: "30-minute sessions start from £55, 1-hour sessions from £85, 90-minute sessions from £115, and 2-hour sessions from £150. All prices include travel within Central London, premium organic oils, and all equipment. No hidden fees." },
    { q: "What areas of London do you serve?", a: "We serve all Central London postcodes including Kensington, Chelsea, Mayfair, Knightsbridge, Paddington, Canary Wharf, Notting Hill, Soho, City of London, South Kensington, Marylebone, St Johns Wood, Hampstead, Fitzrovia, Islington, Westminster, Camden, Shoreditch, and South Bank." },
    { q: "Does deep tissue massage hurt?", a: "Deep tissue work involves firm pressure that may produce moments of productive discomfort as tension releases. It should never feel sharp or unbearable. Pressure is always negotiated with you and you can request adjustments at any time." },
    { q: "Do you have two therapists for couples massage?", a: "Yes. The Bereza Method is a dedicated team of two fully qualified, DBS-checked, insured massage therapists. For couples massage, both therapists arrive together. Each person receives a fully personalised treatment — you can each choose different massage types and durations independently." },
    { q: "What are your working hours?", a: `We are available 7 days a week, 8am to 8pm. Same-day bookings are available throughout our operating hours.` },
    { q: "What should I wear during the massage?", a: "Undress to your comfort level. Most clients are treated in underwear. You are covered by a professional drape at all times with only the area being worked on exposed. Your comfort and dignity are absolute priorities." },
    { q: "How often should I book a massage?", a: "For stress management: fortnightly sessions. For chronic pain: weekly for 3-4 weeks then fortnightly. For sports recovery: based on your training schedule. Iryna will recommend a personalised plan after your first session." },
    { q: "What is the cancellation policy?", a: `Cancellations made 12 or more hours before your appointment are fully refundable. Cancellations within 12 hours are charged at 50%. No-shows are charged in full. Contact us on ${PHONE} to cancel or reschedule.` },
    { q: "Can you come to my hotel in Kensington or Mayfair?", a: "Absolutely. We regularly deliver massage treatments in hotels and serviced apartments across Kensington, Mayfair, Knightsbridge, Paddington, Chelsea, and all Central London. We bring everything needed." },
    { q: "Do you come to Paddington?", a: `Yes. We cover all of Paddington W2, Bayswater, and surrounding areas. Same-day availability 8am to 8pm.` },
    { q: "What are the boundaries for sensual massage?", a: "Sensual massage is a professional therapeutic service focused on awakening the senses, deep relaxation, and body awareness. Professional boundaries are discussed before the session and respected throughout." },
    { q: "Is divine alignment massage a religious practice?", a: "No. Massage with Divine Alignment is a holistic wellness treatment accessible to all beliefs and backgrounds. It combines physical bodywork with energy balancing techniques to restore harmony between body, mind, and spirit." }
];

const faqSchema = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faqData.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) })}</script>`;
const faqItems = faqData.map(f => `<div class="faq-item fade-in"><button class="faq-question"><span>${f.q}</span><span class="faq-icon">+</span></button><div class="faq-answer"><p>${f.a}</p></div></div>`).join('');

writeFileSync('faq/index.html', pg(
    'Mobile Massage FAQ London | The Bereza Method',
    `Common questions about mobile massage therapy London. Safety, pricing, what to expect, cancellation policy. Iryna Bereza — 10 years experience. ${PHONE}`,
    '/faq/',
    `<section class="page-hero"><div class="container"><p class="subtitle">FAQ</p><h1>Frequently Asked Questions</h1><p>Everything you need to know about mobile massage therapy in London.</p></div></section>
  <section class="section section--white"><div class="container container--narrow">${faqItems}</div></section>
  <section class="cta-section"><div class="container"><p class="subtitle">Still Have Questions?</p><h2>Get in Touch</h2><p>Call <a href="${PL}" style="color:var(--color-gold);">${PHONE}</a> or email <a href="${EL}" style="color:var(--color-gold);">${EMAIL}</a></p><a href="/book/" class="btn btn--primary btn--lg">Book Now</a></div></section>`,
    faqSchema
));
console.log('✓ FAQ');

// CONTACT
writeFileSync('contact/index.html', pg(
    'Contact The Bereza Method | Mobile Massage London',
    `Contact Iryna Bereza for mobile massage London. Phone: ${PHONE}. Email: ${EMAIL}. Available 8am-8pm, 7 days a week. Central London.`,
    '/contact/',
    `<section class="page-hero"><div class="container"><p class="subtitle">Contact</p><h1>Get in Touch</h1><p>We'd love to hear from you. Contact Iryna directly.</p></div></section>
  <section class="section section--white"><div class="container"><div class="grid grid--2" style="gap:var(--space-4xl);"><div class="fade-in-left">
    <h2>Contact Details</h2>
    <div style="margin:var(--space-xl) 0;"><div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-lg);"><div style="width:50px;height:50px;border-radius:var(--radius-full);background:var(--gradient-gold);display:flex;align-items:center;justify-content:center;font-size:1.2rem;">📞</div><div><strong>Phone</strong><br><a href="${PL}" style="color:var(--color-gold);">${PHONE}</a></div></div>
    <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-lg);"><div style="width:50px;height:50px;border-radius:var(--radius-full);background:var(--gradient-gold);display:flex;align-items:center;justify-content:center;font-size:1.2rem;">✉️</div><div><strong>Email</strong><br><a href="${EL}" style="color:var(--color-gold);">${EMAIL}</a></div></div>
    <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-lg);"><div style="width:50px;height:50px;border-radius:var(--radius-full);background:var(--gradient-gold);display:flex;align-items:center;justify-content:center;font-size:1.2rem;">🕐</div><div><strong>Hours</strong><br>8am–8pm, 7 days a week</div></div>
    <div style="display:flex;align-items:center;gap:var(--space-md);"><div style="width:50px;height:50px;border-radius:var(--radius-full);background:var(--gradient-gold);display:flex;align-items:center;justify-content:center;font-size:1.2rem;">📍</div><div><strong>Service Area</strong><br>All Central London postcodes</div></div></div>
  </div><div class="fade-in-right">
    <h2>Send a Message</h2>
    <form class="form" action="${EL}" method="get">
      <div class="form__group"><label class="form__label" for="cname">Name</label><input class="form__input" type="text" id="cname" name="name" required></div>
      <div class="form__group"><label class="form__label" for="cemail">Email</label><input class="form__input" type="email" id="cemail" name="email" required></div>
      <div class="form__group"><label class="form__label" for="cmsg">Message</label><textarea class="form__input" id="cmsg" name="body" rows="4" required></textarea></div>
      <input type="hidden" name="subject" value="Website Enquiry — The Bereza Method">
      <button type="submit" class="btn btn--primary" style="width:100%;">Send Message</button>
    </form>
  </div></div></div></section>`
));
console.log('✓ Contact');

// REVIEWS
writeFileSync('reviews/index.html', pg(
    'Client Reviews | The Bereza Method Massage London',
    `Read reviews from Central London clients. Deep tissue, Swedish, sensual, divine alignment massage by Iryna Bereza. Kensington, Mayfair, Chelsea, Paddington, Canary Wharf.`,
    '/reviews/',
    `<section class="page-hero"><div class="container"><p class="subtitle">Reviews</p><h1>What Our Clients Say</h1><p>200+ five-star reviews from Central London clients.</p></div></section>
  <section class="section section--white"><div class="container">
    <div style="display:flex;justify-content:center;gap:var(--space-2xl);flex-wrap:wrap;margin-bottom:var(--space-3xl);text-align:center;" class="fade-in">
      <div><div style="font-size:3rem;font-family:var(--ff-heading);color:var(--color-gold);">4.9</div><div style="color:var(--color-gold);font-size:1.5rem;">★★★★★</div><div style="color:var(--color-muted);">Average Rating</div></div>
      <div><div style="font-size:3rem;font-family:var(--ff-heading);color:var(--color-gold);">200+</div><div style="color:var(--color-muted);">Five-Star Reviews</div></div>
      <div><div style="font-size:3rem;font-family:var(--ff-heading);color:var(--color-gold);">10+</div><div style="color:var(--color-muted);">Years Experience</div></div>
    </div>
    <div class="grid grid--3">
      ${[
        { n: 'James C.', l: 'Kensington · Deep Tissue', t: '"Iryna completely transformed my chronic neck pain after just two sessions. The convenience of having a therapist come to my flat is a game changer."' },
        { n: 'Sarah H.', l: 'Mayfair · Hot Stone', t: '"Best massage I\'ve ever had in London. The hot stone session was absolute heaven. I\'ve been going monthly ever since."' },
        { n: 'Robert T.', l: 'Chelsea · Couples', t: '"We booked a couples massage for our anniversary. Two therapists arrived perfectly on time. Unforgettable experience."' },
        { n: 'Emma L.', l: 'Paddington · Swedish', t: '"After months of insomnia and anxiety, I started fortnightly Swedish massage with Iryna. My sleep has improved dramatically."' },
        { n: 'David M.', l: 'Canary Wharf · Deep Tissue', t: '"As a desk worker in Canary Wharf, I was getting chronic shoulder pain. Iryna\'s deep tissue work fixed it in three sessions."' },
        { n: 'Priya K.', l: 'Knightsbridge · Aromatherapy', t: '"The aromatherapy massage was exactly what I needed. Iryna\'s blend of oils was perfect for my stress levels."' },
        { n: 'Marcus W.', l: 'Soho · Sports', t: '"Training for the London Marathon — Iryna\'s sports massage has been essential for my recovery. Highly recommend."' },
        { n: 'Olivia S.', l: 'Notting Hill · Sensual', t: '"Very professional. Completely different from what I expected. Left feeling deeply relaxed and centered."' },
        { n: 'Thomas R.', l: 'Kensington · Divine Alignment', t: '"The divine alignment session was transformative. I felt a profound sense of peace I haven\'t experienced before."' }
    ].map(r => `<div class="testimonial fade-in"><div class="testimonial__stars">★★★★★</div><p class="testimonial__text">${r.t}</p><div class="testimonial__author"><div class="testimonial__avatar">${r.n[0]}${r.n.split(' ')[1][0]}</div><div><div class="testimonial__name">${r.n}</div><div class="testimonial__location">${r.l}</div></div></div></div>`).join('')}
    </div>
  </div></section>
  <section class="cta-section"><div class="container"><p class="subtitle">Join 200+ Happy Clients</p><h2>Book Your Session</h2><a href="/book/" class="btn btn--primary btn--lg">Book Now</a></div></section>`
));
console.log('✓ Reviews');

// GIFT VOUCHERS
writeFileSync('gift-vouchers/index.html', pg(
    'Massage Gift Vouchers London | The Bereza Method',
    `Premium massage gift vouchers for London. Any treatment, any duration. Contact Iryna Bereza: ${PHONE}. Email: ${EMAIL}. Kensington, Mayfair, Central London.`,
    '/gift-vouchers/',
    `<section class="page-hero"><div class="container"><p class="subtitle">Gift Vouchers</p><h1>The Gift of Wellness</h1><p>Premium massage gift vouchers for someone special. Any treatment, any duration.</p></div></section>
  <section class="section section--white"><div class="container"><div class="grid grid--3">
    <div class="card fade-in" style="text-align:center;"><div class="card__icon">🎁</div><h3 class="card__title">60 Minutes</h3><p class="card__text">Any single treatment. Perfect introduction to The Bereza Method.</p><div style="font-size:2rem;font-family:var(--ff-heading);color:var(--color-gold);margin:var(--space-md) 0;">From £55</div><a href="${EL}?subject=Gift%20Voucher%20Enquiry%20-%2060%20mins" class="btn btn--primary" style="width:100%;">Enquire</a></div>
    <div class="card fade-in" style="text-align:center;border:2px solid var(--color-gold);"><div class="card__icon">🎀</div><h3 class="card__title">90 Minutes</h3><p class="card__text">Extended treatment for deeper results. Our most popular gift.</p><div style="font-size:2rem;font-family:var(--ff-heading);color:var(--color-gold);margin:var(--space-md) 0;">From £85</div><a href="${EL}?subject=Gift%20Voucher%20Enquiry%20-%2090%20mins" class="btn btn--primary" style="width:100%;">Enquire</a></div>
    <div class="card fade-in" style="text-align:center;"><div class="card__icon">👑</div><h3 class="card__title">Couples</h3><p class="card__text">Two therapists for two people. The ultimate shared experience.</p><div style="font-size:2rem;font-family:var(--ff-heading);color:var(--color-gold);margin:var(--space-md) 0;">From £110</div><a href="${EL}?subject=Gift%20Voucher%20Enquiry%20-%20Couples" class="btn btn--primary" style="width:100%;">Enquire</a></div>
  </div><p style="text-align:center;margin-top:var(--space-2xl);color:var(--color-muted);">To purchase, contact Iryna: <a href="${PL}" style="color:var(--color-gold);">${PHONE}</a> or <a href="${EL}" style="color:var(--color-gold);">${EMAIL}</a></p></div></section>`
));
console.log('✓ Gift Vouchers');

// QUIZ
mkdirSync('quiz', { recursive: true });
writeFileSync('quiz/index.html', pg(
    'Find Your Perfect Massage | Free Tension Quiz',
    'Free 2-minute tension assessment quiz. Get a personalised massage recommendation from Iryna Bereza. The Bereza Method London. No obligation.',
    '/quiz/',
    `<section class="page-hero"><div class="container"><p class="subtitle">Free Quiz</p><h1>Find Your Perfect Massage</h1><p>Answer 5 quick questions and get a personalised treatment recommendation.</p></div></section>
  <section class="section section--white"><div class="container container--narrow">
    <div id="quiz" class="fade-in">
      <div id="quizStep1" class="quiz-step">
        <h2 style="margin-bottom:var(--space-xl);">1. What's your primary concern?</h2>
        <div class="grid grid--2" style="gap:var(--space-md);">
          <button class="card quiz-option" onclick="selectAnswer(1,'pain')" style="cursor:pointer;text-align:center;padding:var(--space-xl);"><div style="font-size:2rem;margin-bottom:var(--space-sm);">😖</div><strong>Chronic Pain</strong><p style="font-size:var(--fs-small);color:var(--color-muted);">Neck, back, shoulders</p></button>
          <button class="card quiz-option" onclick="selectAnswer(1,'stress')" style="cursor:pointer;text-align:center;padding:var(--space-xl);"><div style="font-size:2rem;margin-bottom:var(--space-sm);">😰</div><strong>Stress & Anxiety</strong><p style="font-size:var(--fs-small);color:var(--color-muted);">Can't switch off</p></button>
          <button class="card quiz-option" onclick="selectAnswer(1,'sports')" style="cursor:pointer;text-align:center;padding:var(--space-xl);"><div style="font-size:2rem;margin-bottom:var(--space-sm);">🏃</div><strong>Sports Recovery</strong><p style="font-size:var(--fs-small);color:var(--color-muted);">Training & competition</p></button>
          <button class="card quiz-option" onclick="selectAnswer(1,'spiritual')" style="cursor:pointer;text-align:center;padding:var(--space-xl);"><div style="font-size:2rem;margin-bottom:var(--space-sm);">✨</div><strong>Holistic / Spiritual</strong><p style="font-size:var(--fs-small);color:var(--color-muted);">Mind-body balance</p></button>
          <button class="card quiz-option" onclick="selectAnswer(1,'couple')" style="cursor:pointer;text-align:center;padding:var(--space-xl);"><div style="font-size:2rem;margin-bottom:var(--space-sm);">💕</div><strong>Shared Experience</strong><p style="font-size:var(--fs-small);color:var(--color-muted);">With a partner</p></button>
          <button class="card quiz-option" onclick="selectAnswer(1,'relaxation')" style="cursor:pointer;text-align:center;padding:var(--space-xl);"><div style="font-size:2rem;margin-bottom:var(--space-sm);">🧘</div><strong>Pure Relaxation</strong><p style="font-size:var(--fs-small);color:var(--color-muted);">Just need to unwind</p></button>
        </div>
      </div>
      <div id="quizResult" style="display:none;text-align:center;">
        <div style="font-size:4rem;margin-bottom:var(--space-lg);" id="resultIcon">💆</div>
        <h2 id="resultTitle">Your Perfect Treatment</h2>
        <p id="resultDesc" style="font-size:var(--fs-body-lg);margin:var(--space-lg) 0;"></p>
        <p id="resultPrice" style="font-size:1.5rem;font-family:var(--ff-heading);color:var(--color-gold);margin-bottom:var(--space-xl);"></p>
        <div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;">
          <a href="/book/" class="btn btn--primary btn--lg">Book This Treatment</a>
          <a href="${PL}" class="btn btn--outline btn--lg">Call ${PHONE}</a>
        </div>
        <p style="margin-top:var(--space-xl);"><button onclick="resetQuiz()" style="background:none;border:none;color:var(--color-gold);cursor:pointer;font-size:var(--fs-body);">← Take Quiz Again</button></p>
      </div>
    </div>
  </div></section>
  <script>
  const recommendations = {
    pain: {icon:'💆',title:'Deep Tissue Massage',desc:'Based on your answers, deep tissue massage is the ideal treatment. It targets the deeper layers of muscle and fascia to break up adhesions and relieve chronic pain.',price:'From £65 · 60 mins',link:'/services/deep-tissue-massage-london/'},
    stress: {icon:'🌿',title:'Swedish Massage',desc:'Swedish massage is scientifically proven to reduce cortisol by 31% and boost serotonin. Perfect for stress relief and better sleep.',price:'From £55 · 60 mins',link:'/services/swedish-massage-london/'},
    sports: {icon:'🏃',title:'Sports Recovery Massage',desc:'Sports massage targets the exact muscle groups under stress from your training. Iryna specialises in pre-event and post-event recovery.',price:'From £65 · 60 mins',link:'/services/sports-massage-london/'},
    spiritual: {icon:'✨',title:'Massage with Divine Alignment',desc:'This holistic treatment combines physical bodywork with energy balancing for body, mind, and spirit harmony.',price:'From £80 · 60 mins',link:'/services/divine-alignment-massage-london/'},
    couple: {icon:'💕',title:'Couples Massage',desc:'Two qualified therapists arrive together. Each person chooses their own treatment independently. The ultimate shared experience.',price:'From £110 combined · 60 mins',link:'/services/couples-massage-london/'},
    relaxation: {icon:'🌸',title:'Aromatherapy Massage',desc:'Organic essential oils combined with therapeutic massage. Scientifically shown to reduce anxiety by 36% more than massage alone.',price:'From £65 · 60 mins',link:'/services/aromatherapy-massage-london/'}
  };
  function selectAnswer(step, answer) {
    const r = recommendations[answer];
    document.getElementById('quizStep1').style.display = 'none';
    document.getElementById('quizResult').style.display = 'block';
    document.getElementById('resultIcon').textContent = r.icon;
    document.getElementById('resultTitle').textContent = 'We Recommend: ' + r.title;
    document.getElementById('resultDesc').textContent = r.desc;
    document.getElementById('resultPrice').textContent = r.price;
  }
  function resetQuiz() {
    document.getElementById('quizStep1').style.display = 'block';
    document.getElementById('quizResult').style.display = 'none';
  }
  </script>`
));
console.log('✓ Quiz');

// TERMS
mkdirSync('terms', { recursive: true });
writeFileSync('terms/index.html', pg(
    'Terms & Conditions | The Bereza Method London',
    'Terms and conditions for The Bereza Method mobile massage therapy London. Booking policy, cancellation, professional boundaries, payment terms.',
    '/terms/',
    `<section class="page-hero"><div class="container"><p class="subtitle">Legal</p><h1>Terms & Conditions</h1></div></section>
  <section class="section section--white"><div class="container container--narrow" style="font-size:var(--fs-body);line-height:var(--lh-relaxed);">
    <h2>1. Booking & Payment</h2><p>All bookings are confirmed once payment is received. We accept bank transfer. Full payment is required before the appointment. Prices include travel within Central London.</p>
    <h2>2. Cancellation Policy</h2><p>Cancellations made 12+ hours before: full refund. Cancellations within 12 hours: 50% charge. No-shows: charged in full. Contact: ${PHONE}.</p>
    <h2>3. Professional Boundaries</h2><p>All treatments are professional therapeutic services. Professional boundaries are maintained without exception. Any behaviour that violates these boundaries will result in immediate session termination without refund.</p>
    <h2>4. Health & Safety</h2><p>Clients must disclose relevant health conditions before treatment. Iryna reserves the right to decline treatment if she believes it may be unsafe. Our therapists are DBS-checked and fully insured.</p>
    <h2>5. Your Space</h2><p>Please ensure a clean, quiet room with approximately 2m x 3m floor space. We bring all equipment including professional massage table, organic oils, and fresh linens.</p>
    <h2>6. Contact</h2><p>The Bereza Method<br>Phone: <a href="${PL}">${PHONE}</a><br>Email: <a href="${EL}">${EMAIL}</a></p>
  </div></section>`
));
console.log('✓ Terms');

// PRIVACY
mkdirSync('privacy', { recursive: true });
writeFileSync('privacy/index.html', pg(
    'Privacy Policy | The Bereza Method London',
    'Privacy policy for The Bereza Method. How we collect, use, and protect your data. GDPR compliant. Mobile massage therapy London.',
    '/privacy/',
    `<section class="page-hero"><div class="container"><p class="subtitle">Legal</p><h1>Privacy Policy</h1></div></section>
  <section class="section section--white"><div class="container container--narrow" style="font-size:var(--fs-body);line-height:var(--lh-relaxed);">
    <h2>1. What We Collect</h2><p>We collect your name, email, phone number, and address only for appointment purposes. Health information is collected verbally during consultation and is not stored digitally.</p>
    <h2>2. How We Use Your Data</h2><p>Your data is used solely to arrange and deliver massage therapy appointments. We never share your data with third parties or use it for marketing without your explicit consent.</p>
    <h2>3. Data Storage</h2><p>Contact details are stored securely on encrypted devices. We retain your data only for as long as necessary to provide our services. You can request deletion at any time.</p>
    <h2>4. Your Rights (GDPR)</h2><p>You have the right to access, correct, or delete your personal data. You can withdraw consent at any time. To exercise any of these rights, contact us at <a href="${EL}">${EMAIL}</a>.</p>
    <h2>5. Cookies</h2><p>This website does not use tracking cookies or analytics that collect personal data.</p>
    <h2>6. Contact</h2><p>Data Controller: Iryna Bereza<br>Email: <a href="${EL}">${EMAIL}</a><br>Phone: <a href="${PL}">${PHONE}</a></p>
  </div></section>`
));
console.log('✓ Privacy');

console.log('Part 3 complete');
