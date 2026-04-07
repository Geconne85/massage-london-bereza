import fs from 'fs';
import path from 'path';

const BASE = 'C:/Users/diyan/Downloads/calypso-heaven-santorini (1)';

// Fix Canary Wharf area page - has old wrong prices in service cards
const cwPath = path.join(BASE, 'areas/massage-therapist-canary-wharf/index.html');
let cw = fs.readFileSync(cwPath, 'utf8');

// Fix individual service card prices
cw = cw.replace('Chronic pain relief. From £65.', 'Targeted relief for chronic tension. From £90/hr.');
cw = cw.replace('Stress relief. From £55.', 'Full-body stress relief. From £120/hr.');
cw = cw.replace('Deep relaxation. From £120.', 'Deep relaxation. Fixed price: £200.');
cw = cw.replace('Energy healing. From £80.', 'Holistic bodywork journey. £200 — No Fixed Time.');
cw = cw.replace('Two therapists. From £110.', 'Shared luxury experience. From £120/hr.');
cw = cw.replace('Athletic recovery. From £65.', 'Athletic recovery. From £120/hr.');

// Add office visit note for Canary Wharf
cw = cw.replace(
  '<p><strong>Also serving:</strong> City of London, Shoreditch</p>',
  '<p><strong>Also serving:</strong> City of London, Shoreditch</p><p style="margin-top:var(--space-sm);background:rgba(198,169,108,0.1);border:1px solid var(--color-gold);border-radius:8px;padding:1rem;">📍 <strong>Canary Wharf office visits available</strong> — Come to us! In-person sessions at our Canary Wharf location. No travel fee for Canary Wharf.</p>'
);

fs.writeFileSync(cwPath, cw, 'utf8');
console.log('Updated: Canary Wharf area page');

// Now check and verify the pricing table Sensual Massage row
const pricingPath = path.join(BASE, 'pricing/index.html');
let pricing = fs.readFileSync(pricingPath, 'utf8');

if (pricing.includes('Sensual Massage</td>\n              <td style="padding:var(--space-md);font-weight:600;color:var(--color-gold);" colspan="3">£200')) {
  console.log('✅ Pricing page: Sensual Massage already updated to £200');
} else {
  // Fix it
  pricing = pricing.replace(
    /<tr style="border-bottom:1px solid var\(--color-light-gray\);">\s*<td style="padding:var\(--space-md\);font-weight:600;">Sensual Massage<\/td>\s*<td style="padding:var\(--space-md\);">£120<\/td>\s*<td style="padding:var\(--space-md\);">£180<\/td>\s*<td style="padding:var\(--space-md\);">£240<\/td>\s*<\/tr>/,
    `<tr style="border-bottom:1px solid var(--color-light-gray);">
              <td style="padding:var(--space-md);font-weight:600;">Sensual Massage</td>
              <td style="padding:var(--space-md);font-weight:600;color:var(--color-gold);" colspan="3">£200 — Fixed Price (No Fixed Time)</td>
            </tr>`
  );
  fs.writeFileSync(pricingPath, pricing, 'utf8');
  console.log('Updated: Pricing page Sensual row');
}

// Verify booking form
const bookPath = path.join(BASE, 'book/index.html');
let book = fs.readFileSync(bookPath, 'utf8');
if (book.includes('Sensual Massage (£200')) {
  console.log('✅ Booking form: Sensual already updated to £200');
} else {
  console.log('❌ Booking form needs update!');
}

// Check the home page hero
const homePath = path.join(BASE, 'index.html');
let home = fs.readFileSync(homePath, 'utf8');
if (home.includes('hero-massage-3d.png')) {
  console.log('✅ Home page: 3D hero image in place');
} else {
  console.log('❌ Home page hero needs update!');
}

// Verify sensual service card on home
if (home.includes('Fixed price: £200') || home.includes('From £200')) {
  console.log('✅ Home page: Sensual card price updated');
} else {
  console.log('❌ Home page sensual card needs update!');
}

console.log('\nDone!');
