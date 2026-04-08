import fs from 'fs';
import path from 'path';

const BASE = 'C:/Users/diyan/Downloads/calypso-heaven-santorini (1)';

function readFile(p) { return fs.readFileSync(p, 'utf8'); }
function writeFile(p, c) { fs.writeFileSync(p, c, 'utf8'); console.log('Updated:', p.replace(BASE, '')); }

// =============================================
// 1. UPDATE PRICING PAGE — Deep Tissue & Sensual
// =============================================
const pricingPath = path.join(BASE, 'pricing/index.html');
let pricing = readFile(pricingPath);

// Fix Deep Tissue row to £120/£180/£240
pricing = pricing.replace(
  /<tr[^>]*>\s*<td[^>]*>Deep Tissue Massage<\/td>\s*<td[^>]*>£90<\/td>\s*<td[^>]*>£135<\/td>\s*<td[^>]*>£180<\/td>\s*<\/tr>/,
  `<tr style="border-bottom:1px solid var(--color-light-gray);">
              <td style="padding:var(--space-md);font-weight:600;">Deep Tissue Massage</td>
              <td style="padding:var(--space-md);">£120</td>
              <td style="padding:var(--space-md);">£180</td>
              <td style="padding:var(--space-md);">£240</td>
            </tr>`
);

// Fix Sensual Massage row to £200/—/£400 (tiered, no fixed time for 90min)
pricing = pricing.replace(
  /<tr[^>]*>\s*<td[^>]*>Sensual Massage<\/td>\s*<td[^>]*?(?:colspan="3")?[^>]*>£200[^<]*<\/td>[^<]*(?:<td[^>]*>[^<]*<\/td>)*\s*<\/tr>/,
  `<tr style="border-bottom:1px solid var(--color-light-gray);">
              <td style="padding:var(--space-md);font-weight:600;">Sensual Massage</td>
              <td style="padding:var(--space-md);font-weight:600;color:var(--color-gold);">£200</td>
              <td style="padding:var(--space-md);color:var(--color-muted);">—</td>
              <td style="padding:var(--space-md);font-weight:600;color:var(--color-gold);">£400</td>
            </tr>`
);

// Update heading and meta
pricing = pricing.replace('Massage Therapy Prices London | From £90 | No Hidden Fees', 'Massage Therapy Prices London | From £120 | No Hidden Fees');
pricing = pricing.replace('Deep Tissue from £90/hr.', 'All massages from £120/hr.');
pricing = pricing.replace('From £90 — Everything Included', 'All Treatments From £120 — No Hidden Fees');
pricing = pricing.replace('Deep tissue from £90/hr, all other massages from £120/hr.', 'All massages from £120 per hour.');

writeFile(pricingPath, pricing);

// =============================================
// 2. UPDATE BOOKING FORM — Deep Tissue & Sensual
// =============================================
const bookPath = path.join(BASE, 'book/index.html');
let book = readFile(bookPath);

book = book.replace(
  '<option value="Deep Tissue Massage">Deep Tissue Massage (from £90/hr)</option>',
  '<option value="Deep Tissue Massage">Deep Tissue Massage (from £120/hr)</option>'
);

book = book.replace(
  '<option value="Sensual Massage">Sensual Massage (£200 — Fixed Price)</option>',
  '<option value="Sensual Massage">Sensual Massage (£200/1hr · £400/2hrs)</option>'
);

writeFile(bookPath, book);

// =============================================
// 3. UPDATE SENSUAL SERVICE PAGE pricing display
// =============================================
const sensualPath = path.join(BASE, 'services/sensual-massage-london/index.html');
let sensual = readFile(sensualPath);

// Replace the whole pricing content
sensual = sensual.replace(
  /✦ Fixed Price: <b>£200 — Fixed Price \(No Fixed Time\)<\/b><br><span[^<]*>[^<]*<br>[^<]*<\/span>/,
  '✦ 1 Hour: <b>£200</b><br>✦ 2 Hours: <b>£400</b><br><span style="font-size:0.9em;opacity:0.8;">90-min sessions not available for this treatment.</span>'
);

// Also fix shortDesc
sensual = sensual.replace(
  'Deep relaxation, body awareness, emotional connection. Fixed price: £200.',
  'Deep relaxation, body awareness, emotional connection. From £200 (1hr) · £400 (2hrs).'
);

writeFile(sensualPath, sensual);

// =============================================
// 4. UPDATE DEEP TISSUE SERVICE PAGE pricing
// =============================================
const deepPath = path.join(BASE, 'services/deep-tissue-massage-london/index.html');
let deep = readFile(deepPath);

// Fix pricing from old values
deep = deep.replace(
  /✦ 1 Hour: <b>£90<\/b><br>✦ 1\.5 Hours: <b>£135<\/b><br>✦ 2 Hours: <b>£180<\/b>/,
  '✦ 1 Hour: <b>£120</b><br>✦ 1.5 Hours: <b>£180</b><br>✦ 2 Hours: <b>£240</b>'
);

// Also fix shortDesc
deep = deep.replace('Targeted body-part relief. Neck, back &amp; shoulder tension from desk work. From £90/hr.', 'Targeted body-part relief. Neck, back &amp; shoulder tension from desk work. From £120/hr.');
deep = deep.replace('Targeted body-part relief. Neck, back & shoulder tension from desk work. From £90/hr.', 'Targeted body-part relief. Neck, back & shoulder tension from desk work. From £120/hr.');

writeFile(deepPath, deep);

// =============================================
// 5. UPDATE ALL AREA PAGES — Deep Tissue price
// =============================================
const areas = [
  'massage-therapist-kensington', 'massage-therapist-chelsea', 'massage-therapist-city-of-london',
  'massage-therapist-mayfair', 'massage-therapist-paddington', 'massage-therapist-canary-wharf',
  'massage-therapist-knightsbridge', 'massage-therapist-notting-hill', 'massage-therapist-soho',
  'massage-therapist-shoreditch', 'massage-therapist-marylebone', 'massage-therapist-south-kensington',
];

for (const area of areas) {
  const areaPath = path.join(BASE, 'areas', area, 'index.html');
  if (!fs.existsSync(areaPath)) continue;
  let content = readFile(areaPath);
  
  // Fix Deep Tissue price in area page price lists
  content = content.replace(/✦ Deep Tissue Massage — from £90\/hr/g, '✦ Deep Tissue Massage — from £120/hr');
  content = content.replace(/Deep tissue from £90\/hr/g, 'All massages from £120/hr');
  content = content.replace(/Deep tissue from £90/g, 'All massages from £120');
  
  // Fix Sensual price mentions  
  content = content.replace(/Sensual Massage — £200 fixed price/g, 'Sensual Massage — £200/hr (£400 2hrs)');
  content = content.replace(/Sensual Massage \(£200[^)]*\)/g, 'Sensual Massage (£200/1hr · £400/2hrs)');
  
  // Fix old Canary Wharf card price if present
  content = content.replace('Deep relaxation. Fixed price: £200.', 'Deep relaxation. £200/1hr · £400/2hrs');

  writeFile(areaPath, content);
}

// =============================================
// 6. UPDATE HOME PAGE hero to use new animated image + CSS animation
// =============================================
const homePath = path.join(BASE, 'index.html');
let home = readFile(homePath);

// Change hero background to new animated image (3D cinematic)  
home = home.replace(
  /background-image: linear-gradient\(rgba\(9,7,15,[^)]+\), rgba\(9,7,15,[^)]+\)\), url\('[^']+'\);[^""]*/,
  "background-image: linear-gradient(rgba(9,7,15,0.55), rgba(9,7,15,0.55)), url('/images/hero-massage-animated.png'); background-size: cover; background-position: center; animation: heroPan 20s ease-in-out infinite alternate;"
);

// Add hero pan keyframe animation in the page style tag
if (!home.includes('heroPan')) {
  home = home.replace(
    '  .btn--primary { background: linear-gradient(135deg, var(--color-gold), var(--color-gold-dark)); color: var(--color-bg); }',
    `  .btn--primary { background: linear-gradient(135deg, var(--color-gold), var(--color-gold-dark)); color: var(--color-bg); }
  @keyframes heroPan {
    0%   { background-position: 30% 40%; background-size: 115%; }
    25%  { background-position: 60% 30%; background-size: 110%; }
    50%  { background-position: 70% 60%; background-size: 120%; }
    75%  { background-position: 40% 70%; background-size: 112%; }
    100% { background-position: 30% 40%; background-size: 115%; }
  }
  .hero { transition: background-position 0.5s ease; }`
  );
}

// Fix Sensual card text on home page
home = home.replace(
  'Deep relaxation, body awareness, emotional connection. Fixed price: £200.',
  'Deep relaxation, body awareness, emotional connection. £200/1hr · £400/2hrs.'
);

// Fix Deep Tissue card text
home = home.replace(
  'Targeted body-part relief. Neck, back &amp; shoulder tension from desk work. From £90/hr.',
  'Targeted body-part relief. Neck, back &amp; shoulder tension from desk work. From £120/hr.'
);

// Update the 3D showcase section image too
home = home.replace('/images/hero-massage-3d.png', '/images/hero-massage-animated.png');

writeFile(homePath, home);

// =============================================
// 7. Also update meta description on pricing page
// =============================================
let pricing2 = readFile(pricingPath);
pricing2 = pricing2.replace(
  'Deep Tissue from £90/hr. All other massages from £120/hr. Divine Alignment £200.',
  'All massages from £120/hr. Sensual Massage £200/1hr or £400/2hrs. Divine Alignment £200.'
);
writeFile(pricingPath, pricing2);

console.log('\n✅ All price and hero updates complete!');
