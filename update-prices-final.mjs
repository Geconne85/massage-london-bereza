import fs from 'fs';
import path from 'path';

const BASE = 'C:/Users/diyan/Downloads/calypso-heaven-santorini (1)';

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated:', filePath.replace(BASE, ''));
}

// =============================================
// 1. UPDATE HOME PAGE (index.html)
// – Change hero background to new 3D image
// – Add 3D massage image section
// – Fix Sensual Massage card text to show £200
// =============================================

let homePath = path.join(BASE, 'index.html');
let home = readFile(homePath);

// Change hero background image
home = home.replace(
  "background-image: linear-gradient(rgba(9,7,15,0.7), rgba(9,7,15,0.7)), url('/images/iryna-working.jpg');",
  "background-image: linear-gradient(rgba(9,7,15,0.65), rgba(9,7,15,0.65)), url('/images/hero-massage-3d.png'); background-size: cover; background-position: center;"
);

// Fix Sensual Massage card text on home page
home = home.replace(
  'Deep relaxation, body awareness, emotional connection. From £120.',
  'Deep relaxation, body awareness, emotional connection. From £200.'
);

// Add 3D professional massage section after the services section (before how it works)
const massageSection = `
  <!-- 3D Professional Massage Showcase -->
  <section class="section section--cream" style="padding-top:0;padding-bottom:0;">
    <div style="position:relative;width:100%;max-height:520px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
      <img src="/images/hero-massage-3d.png" alt="Professional body massage therapy by Iryna Bereza London" style="width:100%;max-height:520px;object-fit:cover;object-position:center top;">
      <div style="position:absolute;inset:0;background:linear-gradient(to right,rgba(9,7,15,0.7) 0%,rgba(9,7,15,0.1) 50%,rgba(9,7,15,0) 100%);display:flex;align-items:center;">
        <div class="container">
          <p class="subtitle" style="color:var(--color-gold);">✦ Clinical-Grade Therapy</p>
          <h2 style="max-width:500px;font-size:clamp(1.6rem,4vw,2.5rem);">Professional Body Massage, Delivered to Your Door</h2>
          <p style="max-width:420px;opacity:0.85;">10+ years of clinical experience. Same-day availability across Shoreditch, Marylebone, Kensington, Chelsea, Mayfair & all Central London areas.</p>
          <a href="/book/" class="btn btn--primary btn--lg" style="margin-top:1.5rem;">Book Your Session</a>
        </div>
      </div>
    </div>
  </section>
`;

home = home.replace(
  `  <section class="section section--cream">
    <div class="container">
      <div class="section-header fade-in"><p class="subtitle">How It Works</p><h2>Your Session in 4 Steps</h2></div>`,
  massageSection + `  <section class="section section--cream">
    <div class="container">
      <div class="section-header fade-in"><p class="subtitle">How It Works</p><h2>Your Session in 4 Steps</h2></div>`
);

writeFile(homePath, home);

// =============================================
// 2. UPDATE SENSUAL MASSAGE SERVICE PAGE
// – Change price from £120/£180/£240 to £200 flat
// =============================================

let sensualPath = path.join(BASE, 'services/sensual-massage-london/index.html');
let sensual = readFile(sensualPath);

sensual = sensual.replace(
  '✦ 1 Hour: <b>£120</b><br>✦ 1.5 Hours: <b>£180</b><br>✦ 2 Hours: <b>£240</b>',
  '✦ Fixed Price: <b>£200</b><br><span style="font-size:0.9em;opacity:0.8;">Immersive relaxation session — No fixed time limit.<br>Duration guided by your body\'s needs.</span>'
);

writeFile(sensualPath, sensual);

// =============================================
// 3. UPDATE BOOKING FORM
// – Fix Sensual Massage option to show £200
// =============================================

let bookPath = path.join(BASE, 'book/index.html');
let book = readFile(bookPath);

book = book.replace(
  '<option value="Sensual Massage">Sensual Massage (from £120/hr)</option>',
  '<option value="Sensual Massage">Sensual Massage (£200 — Fixed Price)</option>'
);

writeFile(bookPath, book);

// =============================================
// 4. UPDATE PRICING PAGE  
// – Fix Sensual Massage row to show £200
// – Clarify local areas (Shoreditch, Marylebone + Canary Wharf note)
// =============================================

let pricingPath = path.join(BASE, 'pricing/index.html');
let pricing = readFile(pricingPath);

// Update Sensual Massage row
pricing = pricing.replace(
  `            <tr style="border-bottom:1px solid var(--color-light-gray);">
              <td style="padding:var(--space-md);font-weight:600;">Sensual Massage</td>
              <td style="padding:var(--space-md);">£120</td>
              <td style="padding:var(--space-md);">£180</td>
              <td style="padding:var(--space-md);">£240</td>
            </tr>`,
  `            <tr style="border-bottom:1px solid var(--color-light-gray);">
              <td style="padding:var(--space-md);font-weight:600;">Sensual Massage</td>
              <td style="padding:var(--space-md);font-weight:600;color:var(--color-gold);" colspan="3">£200 — Fixed Price (No Fixed Time)</td>
            </tr>`
);

// Update the local areas note 
pricing = pricing.replace(
  `      <p style="text-align:center;margin-top:var(--space-xl);color:var(--color-muted);">All prices include travel within
        our local areas No Transport fees only(Shoreditch, Marylebone). Rest: Kensington, Chelsea, Mayfair, Knightsbridge, Paddington, Canary Wharf, Notting Hill, Soho, City
        of London, South Kensington. Transport fee applies.
      </p>`,
  `      <p style="text-align:center;margin-top:var(--space-xl);color:var(--color-muted);">📍 <strong>Local areas — No travel fee:</strong> Shoreditch &amp; Marylebone (you can also visit our office in person).<br>
        🚗 <strong>Travel fee applies to:</strong> Kensington, Chelsea, Mayfair, Paddington, Canary Wharf, Knightsbridge, Notting Hill, Soho, City of London &amp; South Kensington.
      </p>
      <p style="text-align:center;margin-top:var(--space-sm);color:var(--color-muted);"><strong>Office visits available in:</strong> Shoreditch &amp; Marylebone — Canary Wharf (in-office sessions also available).</p>`
);

// Update the heading
pricing = pricing.replace(
  '<h2>From £90 — Everything Included</h2>',
  '<h2>Transparent Pricing — Everything Included</h2>'
);

writeFile(pricingPath, pricing);

// =============================================
// 5. UPDATE ALL AREA PAGES
// – Update price lists to show correct Sensual price
// – Add Shoreditch/Marylebone/Canary Wharf office note where relevant
// =============================================

const areas = [
  'massage-therapist-kensington',
  'massage-therapist-chelsea',
  'massage-therapist-mayfair',
  'massage-therapist-paddington',
  'massage-therapist-canary-wharf',
  'massage-therapist-knightsbridge',
  'massage-therapist-notting-hill',
  'massage-therapist-soho',
  'massage-therapist-shoreditch',
  'massage-therapist-marylebone',
  'massage-therapist-city-of-london',
  'massage-therapist-south-kensington',
];

const LOCAL_AREAS = ['massage-therapist-shoreditch', 'massage-therapist-marylebone', 'massage-therapist-canary-wharf'];

for (const area of areas) {
  const areaPath = path.join(BASE, 'areas', area, 'index.html');
  if (!fs.existsSync(areaPath)) {
    console.log('Skipping (not found):', area);
    continue;
  }
  let content = readFile(areaPath);

  // Fix price list in all area pages - update Sensual from £120 to £200
  content = content.replace(
    '✦ Sports, Sensual, Couples, Lymphatic — from £120/hr',
    '✦ Sports, Couples, Lymphatic — from £120/hr<br>✦ Sensual Massage — £200 fixed price'
  );

  // For local areas, add office visit note
  if (LOCAL_AREAS.includes(area)) {
    const areaName = area.replace('massage-therapist-', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    content = content.replace(
      '✦ Minimum booking: 1 hour',
      `✦ Minimum booking: 1 hour<br>✦ ${areaName} is a LOCAL area — No travel fee<br>✦ Office visits available — you can come to us!`
    );
  }

  writeFile(areaPath, content);
}

// =============================================
// 6. UPDATE DEEP TISSUE SERVICE PAGE card text on home
// =============================================

// Fix home page deep tissue card text
let home2 = readFile(homePath);
home2 = home2.replace(
  'Targeted body-part relief. Neck, back &amp; shoulder tension from desk work. £90/hour. From £95.',
  'Targeted body-part relief. Neck, back &amp; shoulder tension from desk work. From £90/hr.'
);
writeFile(homePath, home2);

console.log('\n✅ All updates complete!');
