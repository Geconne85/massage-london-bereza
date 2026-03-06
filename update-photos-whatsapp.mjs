// Update all pages with: Iryna's real photos + WhatsApp floating button
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const WA_NUMBER = '447704503507';
const WA_MSG = encodeURIComponent("Hi Iryna! I'd like to book a massage session.");
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

// WhatsApp floating button HTML (added before </body>)
const WA_BUTTON = `
<!-- WhatsApp Float -->
<a href="${WA_URL}" target="_blank" rel="noopener" class="whatsapp-float" aria-label="Chat on WhatsApp">
<svg viewBox="0 0 32 32" width="32" height="32" fill="#fff"><path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.744 3.06 9.372L1.06 31.14l5.964-1.964A15.91 15.91 0 0016.004 32C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.31 22.602c-.388 1.094-2.278 2.094-3.14 2.168-.786.066-1.746.094-2.82-.178a25.86 25.86 0 01-2.554-.944c-4.494-1.94-7.428-6.47-7.654-6.774-.218-.304-1.788-2.38-1.788-4.538s1.132-3.22 1.534-3.66c.402-.44.876-.55 1.168-.55.146 0 .276.008.394.014.402.018.604.042.87.672.33.786 1.142 2.78 1.242 2.98.1.2.166.432.032.694-.126.27-.19.432-.38.666-.19.234-.4.52-.57.696-.19.196-.39.408-.166.802.224.394.992 1.636 2.13 2.652 1.464 1.306 2.696 1.71 3.078 1.902.382.192.604.16.826-.098.228-.258.974-1.134 1.232-1.524.258-.39.516-.324.87-.194.358.13 2.268 1.068 2.656 1.264.388.196.648.294.744.458.094.16.094.944-.294 2.038z"/></svg>
</a>`;

// WhatsApp CSS to add to global.css
const WA_CSS = `
/* ===== WHATSAPP FLOAT ===== */
.whatsapp-float {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 60px;
    height: 60px;
    background: #25D366;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4);
    z-index: 9999;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    animation: wa-pulse 2s infinite;
}

.whatsapp-float:hover {
    transform: scale(1.1) translateY(-3px);
    box-shadow: 0 6px 24px rgba(37, 211, 102, 0.6);
}

@keyframes wa-pulse {
    0%, 100% { box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4); }
    50% { box-shadow: 0 4px 24px rgba(37, 211, 102, 0.7), 0 0 0 12px rgba(37, 211, 102, 0.1); }
}

@media (max-width: 768px) {
    .whatsapp-float {
        bottom: 16px;
        right: 16px;
        width: 52px;
        height: 52px;
    }
}
`;

// Add WhatsApp CSS to global.css
let css = readFileSync('css/global.css', 'utf-8');
if (!css.includes('whatsapp-float')) {
    css += WA_CSS;
    writeFileSync('css/global.css', css);
    console.log('✓ WhatsApp CSS added to global.css');
}

// Find all HTML files recursively
function findHtmlFiles(dir) {
    let files = [];
    for (const item of readdirSync(dir)) {
        const full = join(dir, item);
        if (item === 'node_modules' || item === 'admin') continue;
        try {
            const stat = statSync(full);
            if (stat.isDirectory()) files.push(...findHtmlFiles(full));
            else if (item.endsWith('.html')) files.push(full);
        } catch (e) { }
    }
    return files;
}

const htmlFiles = findHtmlFiles('.');
console.log(`Found ${htmlFiles.length} HTML files`);

for (const file of htmlFiles) {
    let html = readFileSync(file, 'utf-8');
    let changed = false;

    // Add WhatsApp button before </body> if not present
    if (!html.includes('whatsapp-float')) {
        html = html.replace('</body>', WA_BUTTON + '\n</body>');
        changed = true;
    }

    // Replace generated image references with real photos
    // On homepage - use iryna-working.jpg in hero
    if (file.includes('index.html') && !file.includes('services') && !file.includes('areas') && !file.includes('about') && !file.includes('blog') && !file.includes('book') && !file.includes('faq') && !file.includes('contact') && !file.includes('pricing') && !file.includes('reviews') && !file.includes('gift') && !file.includes('quiz') && !file.includes('terms') && !file.includes('privacy')) {
        // Homepage hero background
        if (html.includes('hero-bg.png')) {
            html = html.replace(/hero-bg\.png/g, 'iryna-working.jpg');
            changed = true;
        }
        // Replace generated portrait reference
        if (html.includes('iryna-portrait.jpg')) {
            html = html.replace(/iryna-portrait\.jpg/g, 'iryna-portrait-closeup.jpg');
            changed = true;
        }
    }

    // About page - use real portrait photos
    if (file.includes('about')) {
        if (html.includes('iryna-portrait.jpg')) {
            html = html.replace(/iryna-portrait\.jpg/g, 'iryna-portrait-closeup.jpg');
            changed = true;
        }
    }

    if (changed) {
        writeFileSync(file, html);
        console.log(`✓ Updated: ${file}`);
    }
}

console.log('\\n✓ Photos + WhatsApp complete!');
