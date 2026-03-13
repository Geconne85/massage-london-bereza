// Bulk update script — fixes hours, adds areas, updates footers
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, resolve } from 'path';

const root = resolve('.');

// 1. Replace "8am-8pm" with "10am-8pm" across all HTML files
function findHtmlFiles(dir) {
    let results = [];
    const items = readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const full = join(dir, item.name);
        if (item.name === 'node_modules' || item.name === 'dist' || item.name === '.git' || item.name === 'admin') continue;
        if (item.isDirectory()) {
            results = results.concat(findHtmlFiles(full));
        } else if (item.name.endsWith('.html')) {
            results.push(full);
        }
    }
    return results;
}

const htmlFiles = findHtmlFiles(root);
let updated = 0;

for (const file of htmlFiles) {
    let content = readFileSync(file, 'utf-8');
    let changed = false;

    // Fix hours
    if (content.includes('8am-8pm') || content.includes('8am–8pm') || content.includes('8am to 8pm')) {
        content = content.replace(/8am[-–]8pm/g, '10am-8pm');
        content = content.replace(/8am to 8pm/g, '10am to 8pm');
        changed = true;
    }

    // Add Shoreditch & Marylebone to footer area links if not already there
    if (content.includes('massage-therapist-soho') && !content.includes('massage-therapist-shoreditch')) {
        content = content.replace(
            /<li><a href="\/areas\/massage-therapist-soho\/">/g,
            '<li><a href="/areas/massage-therapist-soho/">'
        );
        // Add after the last area link in footer
        const footerAreaEnd = '</ul></div></div>';
        if (content.includes('massage-therapist-soho') && !content.includes('massage-therapist-shoreditch')) {
            content = content.replace(
                /<li><a href="\/areas\/massage-therapist-soho\/">Soho<\/a><\/li><\/ul>/g,
                '<li><a href="/areas/massage-therapist-soho/">Soho</a></li><li><a href="/areas/massage-therapist-shoreditch/">Shoreditch</a></li><li><a href="/areas/massage-therapist-marylebone/">Marylebone</a></li></ul>'
            );
            changed = true;
        }
    }

    // Update "No Travel Fees" trust bar
    if (content.includes('No Travel Fees</div>') && !content.includes('No Travel Fees (Local Areas)')) {
        content = content.replace(/No Travel Fees<\/div>/g, 'No Travel Fees (Local Areas)</div>');
        changed = true;
    }

    if (changed) {
        writeFileSync(file, content);
        updated++;
        console.log(`✅ Updated: ${file.replace(root, '')}`);
    }
}

console.log(`\n✅ Updated ${updated} HTML files`);

// 2. Create Shoreditch area page
const areaTemplate = (name, slug, postcode, nearby) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mobile Massage Therapist ${name} ${postcode} | The Bereza Method</title>
  <meta name="description" content="Mobile massage therapist in ${name} ${postcode}. Deep tissue from £90/hr, all massages from £120/hr. Same-day home visits 10am-8pm. Iryna Bereza. No travel fee.">
  <link rel="canonical" href="https://massage-london-bereza.vercel.app/areas/${slug}/">
  <link rel="stylesheet" href="/css/global.css">
</head>
<body>
  <header class="header" id="header"><div class="header__inner"><a href="/" class="header__logo">The Bereza <span>Method</span></a><button class="nav-toggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button><nav class="nav" id="nav"><a href="/about/" class="nav__link">About</a><a href="/services/" class="nav__link">Services</a><a href="/pricing/" class="nav__link">Pricing</a><a href="/areas/massage-therapist-kensington/" class="nav__link">Areas</a><a href="/blog/" class="nav__link">Blog</a><a href="/contact/" class="nav__link">Contact</a><a href="/book/" class="nav__cta">Book Now</a></nav></div></header>
  
  <section class="page-hero"><div class="container"><p class="subtitle">${name} ${postcode}</p><h1>Mobile Massage Therapist in ${name}</h1><p>Premium mobile massage therapy delivered to your home or hotel in ${name} and surrounding areas. Same-day availability 10am-8pm.</p></div></section>
  <div class="trust-bar"><div class="trust-bar__inner"><div class="trust-bar__item"><span>✓</span> 10+ Years Experience</div><div class="trust-bar__item"><span>✓</span> Same-Day Available</div><div class="trust-bar__item"><span>✓</span> 10am-8pm Daily</div><div class="trust-bar__item"><span>✓</span> No Travel Fees (Local Areas)</div></div></div>
  <section class="section section--white"><div class="container"><div class="grid grid--2" style="align-items:center;gap:var(--space-4xl);"><div class="fade-in-left"><p class="subtitle">Your ${name} Massage Therapist</p><h2>Iryna Bereza — Mobile Massage in ${name}</h2><p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);">With 10+ years of clinical experience, Iryna Bereza brings professional-grade massage therapy directly to your ${name} home, office, or hotel room. ${name} is one of our local areas — no travel fee applies.</p><ul style="list-style:none;margin-top:var(--space-xl);"><li style="padding:var(--space-xs) 0;">✦ Deep Tissue Massage — from £90/hr</li><li style="padding:var(--space-xs) 0;">✦ Swedish, Hot Stone, Aromatherapy — from £120/hr</li><li style="padding:var(--space-xs) 0;">✦ Sports, Sensual, Couples, Lymphatic — from £120/hr</li><li style="padding:var(--space-xs) 0;">✦ Divine Alignment — £200</li><li style="padding:var(--space-xs) 0;">✦ Minimum booking: 1 hour</li></ul><p style="margin-top:var(--space-lg);font-style:italic;color:var(--color-muted);">Also serving nearby: ${nearby}</p></div><div class="fade-in-right"><img src="/images/iryna-working.jpg" alt="Mobile massage therapist ${name} London" style="width:100%;border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);"></div></div></div></section>
  <section class="section section--cream"><div class="container"><div class="section-header fade-in"><p class="subtitle">Important Info</p><h2>Before You Book</h2></div><div class="grid grid--3" style="max-width:900px;margin:0 auto;"><div class="card fade-in" style="text-align:center;"><h4>🕐 Hours</h4><p>10am – 8pm<br>7 days a week</p></div><div class="card fade-in" style="text-align:center;"><h4>📍 Local Area</h4><p>${name} is a local area.<br>No travel fee.</p></div><div class="card fade-in" style="text-align:center;"><h4>🛏️ Your Surface</h4><p>We don't bring a table.<br>Bed, sofa, or floor mat.</p></div></div></div></section>
  <section class="cta-section"><div class="container"><p class="subtitle">Book Today</p><h2>Same-Day Massage in ${name}</h2><p>Available 10am-8pm, 7 days a week.</p><div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;"><a href="/book/" class="btn btn--primary btn--lg">Book Now</a><a href="tel:+447704503507" class="btn btn--outline btn--lg" style="border-color:var(--color-cream);color:var(--color-cream);">Call +44 7704 503507</a></div></div></section>
  <footer class="footer"><div class="container"><div class="footer__grid"><div><div class="footer__brand-name">The Bereza <span>Method</span></div><p class="footer__desc">London's premier mobile massage therapy service.</p><p style="margin-top:var(--space-md);"><a href="tel:+447704503507" style="color:var(--color-gold);">+44 7704 503507</a><br><a href="mailto:Runyruny@ukr.net" style="color:var(--color-gold);">Runyruny@ukr.net</a></p></div><div><h4 class="footer__heading">Services</h4><ul class="footer__links"><li><a href="/services/deep-tissue-massage-london/">Deep Tissue</a></li><li><a href="/services/swedish-massage-london/">Swedish</a></li><li><a href="/services/hot-stone-massage-london/">Hot Stone</a></li><li><a href="/services/aromatherapy-massage-london/">Aromatherapy</a></li><li><a href="/services/sensual-massage-london/">Sensual</a></li><li><a href="/services/divine-alignment-massage-london/">Divine Alignment</a></li><li><a href="/services/sports-massage-london/">Sports</a></li><li><a href="/services/couples-massage-london/">Couples</a></li><li><a href="/services/lymphatic-drainage-london/">Lymphatic</a></li></ul></div><div><h4 class="footer__heading">Quick Links</h4><ul class="footer__links"><li><a href="/about/">About</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/book/">Book Online</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/reviews/">Reviews</a></li><li><a href="/gift-vouchers/">Gift Vouchers</a></li><li><a href="/quiz/">Free Quiz</a></li></ul></div><div><h4 class="footer__heading">Areas</h4><ul class="footer__links"><li><a href="/areas/massage-therapist-kensington/">Kensington</a></li><li><a href="/areas/massage-therapist-chelsea/">Chelsea</a></li><li><a href="/areas/massage-therapist-mayfair/">Mayfair</a></li><li><a href="/areas/massage-therapist-paddington/">Paddington</a></li><li><a href="/areas/massage-therapist-canary-wharf/">Canary Wharf</a></li><li><a href="/areas/massage-therapist-knightsbridge/">Knightsbridge</a></li><li><a href="/areas/massage-therapist-notting-hill/">Notting Hill</a></li><li><a href="/areas/massage-therapist-soho/">Soho</a></li><li><a href="/areas/massage-therapist-shoreditch/">Shoreditch</a></li><li><a href="/areas/massage-therapist-marylebone/">Marylebone</a></li></ul></div></div><div class="footer__bottom"><p>&copy; 2026 The Bereza Method. All rights reserved. <a href="/terms/">Terms</a> · <a href="/privacy/">Privacy</a></p></div></div></footer>
  <script src="/js/main.js"></script>
<a href="https://wa.me/447704503507?text=Hi%20Iryna!%20I'd%20like%20to%20book%20a%20massage%20session." target="_blank" rel="noopener" class="whatsapp-float" aria-label="Chat on WhatsApp"><svg viewBox="0 0 32 32" width="32" height="32" fill="#fff"><path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.744 3.06 9.372L1.06 31.14l5.964-1.964A15.91 15.91 0 0016.004 32C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.31 22.602c-.388 1.094-2.278 2.094-3.14 2.168-.786.066-1.746.094-2.82-.178a25.86 25.86 0 01-2.554-.944c-4.494-1.94-7.428-6.47-7.654-6.774-.218-.304-1.788-2.38-1.788-4.538s1.132-3.22 1.534-3.66c.402-.44.876-.55 1.168-.55.146 0 .276.008.394.014.402.018.604.042.87.672.33.786 1.142 2.78 1.242 2.98.1.2.166.432.032.694-.126.27-.19.432-.38.666-.19.234-.4.52-.57.696-.19.196-.39.408-.166.802.224.394.992 1.636 2.13 2.652 1.464 1.306 2.696 1.71 3.078 1.902.382.192.604.16.826-.098.228-.258.974-1.134 1.232-1.524.258-.39.516-.324.87-.194.358.13 2.268 1.068 2.656 1.264.388.196.648.294.744.458.094.16.094.944-.294 2.038z"/></svg></a>
</body>
</html>`;

// Create Shoreditch page
const shoreditchDir = join(root, 'areas', 'massage-therapist-shoreditch');
if (!existsSync(shoreditchDir)) mkdirSync(shoreditchDir, { recursive: true });
writeFileSync(join(shoreditchDir, 'index.html'), areaTemplate('Shoreditch', 'massage-therapist-shoreditch', 'E1/EC2', 'City of London, Canary Wharf, Soho'));
console.log('✅ Created Shoreditch area page');

// Create Marylebone page
const maryleboneDir = join(root, 'areas', 'massage-therapist-marylebone');
if (!existsSync(maryleboneDir)) mkdirSync(maryleboneDir, { recursive: true });
writeFileSync(join(maryleboneDir, 'index.html'), areaTemplate('Marylebone', 'massage-therapist-marylebone', 'W1/NW1', 'Paddington, Mayfair, Soho'));
console.log('✅ Created Marylebone area page');

// 3. Update Divine Alignment page pricing to £200 fixed
const daFile = join(root, 'services', 'divine-alignment-massage-london', 'index.html');
if (existsSync(daFile)) {
    let daContent = readFileSync(daFile, 'utf-8');
    // Update pricing cards to show single £200 price
    daContent = daContent.replace(
        /<div class="divine-pricing-cards">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
        `<div class="divine-pricing-cards" style="max-width:400px;">
        <div class="divine-price-card fade-in">
          <h4>DIVINE ALIGNMENT</h4>
          <div class="price">£200</div>
          <div class="note">No fixed time · Your body leads</div>
          <a href="/book/" class="btn btn--primary" style="width:100%;">Book Session</a>
        </div>
      </div>
    </div>
  </div>`
    );
    // Update hours
    daContent = daContent.replace(/8am[-–]8pm/g, '10am-8pm');
    daContent = daContent.replace(/8am to 8pm/g, '10am to 8pm');
    // Update schema price
    daContent = daContent.replace(/"price":"150"/, '"price":"200"');
    writeFileSync(daFile, daContent);
    console.log('✅ Updated Divine Alignment page to £200');
}

// 4. Update sitemap to include new area pages
const sitemapFile = join(root, 'public', 'sitemap.xml');
if (existsSync(sitemapFile)) {
    let sitemap = readFileSync(sitemapFile, 'utf-8');
    if (!sitemap.includes('massage-therapist-shoreditch')) {
        sitemap = sitemap.replace('</urlset>',
            `  <url><loc>https://massage-london-bereza.vercel.app/areas/massage-therapist-shoreditch/</loc></url>\n  <url><loc>https://massage-london-bereza.vercel.app/areas/massage-therapist-marylebone/</loc></url>\n</urlset>`);
        writeFileSync(sitemapFile, sitemap);
        console.log('✅ Updated sitemap.xml');
    }
}

console.log('\n🎉 All updates complete!');
