// Fix ALL prices on every HTML page
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const root = resolve('.');

function findHtmlFiles(dir) {
    let results = [];
    try {
        const items = readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            const full = join(dir, item.name);
            if (['node_modules', 'dist', '.git', 'admin'].includes(item.name)) continue;
            if (item.isDirectory()) results = results.concat(findHtmlFiles(full));
            else if (item.name.endsWith('.html')) results.push(full);
        }
    } catch (e) { }
    return results;
}

// Price mapping for each service type
// Deep Tissue: £90 / £135 / £180
// All others: £120 / £180 / £240
// Divine Alignment: £200 fixed

const htmlFiles = findHtmlFiles(root);
let totalFixed = 0;

for (const file of htmlFiles) {
    let content = readFileSync(file, 'utf-8');
    let changed = false;
    const relPath = file.replace(root, '');

    // ===== DEEP TISSUE SERVICE PAGE =====
    if (relPath.includes('deep-tissue-massage-london')) {
        // Fix meta description
        content = content.replace(/From £65\./g, 'From £90.');
        content = content.replace(/From £45\./g, 'From £90.');
        // Fix pricing cards
        content = content.replace(
            /From £65<\/div>([\s\S]*?)From £95<\/div>([\s\S]*?)From £130<\/div>/,
            'From £90</div>$1From £135</div>$2From £180</div>'
        );
        content = content.replace(
            /From £65<\/div>([\s\S]*?)From £90<\/div>([\s\S]*?)From £90<\/div>/,
            'From £90</div>$1From £135</div>$2From £180</div>'
        );
        changed = true;
    }

    // ===== SWEDISH SERVICE PAGE =====
    if (relPath.includes('swedish-massage-london')) {
        content = content.replace(/From £55\./g, 'From £120.');
        content = content.replace(/From £35\./g, 'From £120.');
        content = content.replace(
            /From £55<\/div>([\s\S]*?)From £85<\/div>([\s\S]*?)From £115<\/div>/,
            'From £120</div>$1From £180</div>$2From £240</div>'
        );
        content = content.replace(
            /From £55<\/div>([\s\S]*?)From £75<\/div>([\s\S]*?)From £100<\/div>/,
            'From £120</div>$1From £180</div>$2From £240</div>'
        );
        changed = true;
    }

    // ===== HOT STONE SERVICE PAGE =====
    if (relPath.includes('hot-stone-massage-london')) {
        content = content.replace(/From £70\./g, 'From £120.');
        content = content.replace(/From £50\./g, 'From £120.');
        content = content.replace(
            /From £70<\/div>([\s\S]*?)From £105<\/div>([\s\S]*?)From £140<\/div>/,
            'From £120</div>$1From £180</div>$2From £240</div>'
        );
        content = content.replace(
            /From £70<\/div>([\s\S]*?)From £95<\/div>([\s\S]*?)From £125<\/div>/,
            'From £120</div>$1From £180</div>$2From £240</div>'
        );
        changed = true;
    }

    // ===== AROMATHERAPY SERVICE PAGE =====
    if (relPath.includes('aromatherapy-massage-london')) {
        content = content.replace(/From £65\./g, 'From £120.');
        content = content.replace(/From £45\./g, 'From £120.');
        content = content.replace(
            /From £65<\/div>([\s\S]*?)From £95<\/div>([\s\S]*?)From £130<\/div>/,
            'From £120</div>$1From £180</div>$2From £240</div>'
        );
        content = content.replace(
            /From £65<\/div>([\s\S]*?)From £90<\/div>([\s\S]*?)From £120<\/div>/,
            'From £120</div>$1From £180</div>$2From £240</div>'
        );
        changed = true;
    }

    // ===== SPORTS SERVICE PAGE =====
    if (relPath.includes('sports-massage-london')) {
        content = content.replace(/From £65\./g, 'From £120.');
        content = content.replace(/From £45\./g, 'From £120.');
        content = content.replace(
            /From £65<\/div>([\s\S]*?)From £95<\/div>([\s\S]*?)From £130<\/div>/,
            'From £120</div>$1From £180</div>$2From £240</div>'
        );
        content = content.replace(
            /From £65<\/div>([\s\S]*?)From £90<\/div>([\s\S]*?)From £120<\/div>/,
            'From £120</div>$1From £180</div>$2From £240</div>'
        );
        changed = true;
    }

    // ===== LYMPHATIC SERVICE PAGE =====
    if (relPath.includes('lymphatic-drainage-london')) {
        content = content.replace(/From £65\./g, 'From £120.');
        content = content.replace(/From £55\./g, 'From £120.');
        content = content.replace(/From £40\./g, 'From £120.');
        content = content.replace(
            /From £65<\/div>([\s\S]*?)From £95<\/div>([\s\S]*?)From £130<\/div>/,
            'From £120</div>$1From £180</div>$2From £240</div>'
        );
        content = content.replace(
            /From £55<\/div>([\s\S]*?)From £80<\/div>([\s\S]*?)From £110<\/div>/,
            'From £120</div>$1From £180</div>$2From £240</div>'
        );
        changed = true;
    }

    // ===== SENSUAL SERVICE PAGE =====
    if (relPath.includes('sensual-massage-london')) {
        content = content.replace(/From £120\.<\/div>([\s\S]*?)From £160<\/div>([\s\S]*?)From £200<\/div>/,
            'From £120</div>$1From £180</div>$2From £240</div>'
        );
        content = content.replace(
            /From £120<\/div>([\s\S]*?)From £180<\/div>([\s\S]*?)From £240<\/div>/,
            'From £120</div>$1From £180</div>$2From £240</div>'
        );
        changed = true;
    }

    // ===== COUPLES SERVICE PAGE =====
    if (relPath.includes('couples-massage-london')) {
        content = content.replace(/From £110\./g, 'From £120.');
        content = content.replace(
            /From £110<\/div>([\s\S]*?)From £165<\/div>([\s\S]*?)From £220<\/div>/,
            'From £120</div>$1From £180</div>$2From £240</div>'
        );
        content = content.replace(
            /From £110<\/div>([\s\S]*?)From £160<\/div>([\s\S]*?)From £220<\/div>/,
            'From £120</div>$1From £180</div>$2From £240</div>'
        );
        changed = true;
    }

    // ===== SERVICES INDEX PAGE =====
    if (relPath === '\\services\\index.html' || relPath === '/services/index.html') {
        // Fix "From £55" meta and text
        content = content.replace(/From £55\./g, 'From £90.');
        content = content.replace(/From £55<\/p>/g, 'From £90</p>');
        // Fix individual service card prices
        content = content.replace(/From £65\./g, 'From £120.');
        content = content.replace(/From £70\./g, 'From £120.');
        // Deep tissue on index should be £90
        content = content.replace(
            /Chronic pain relief\. Targets neck, back & shoulder tension from desk work\. From £120\./,
            'Targeted body-part relief. Neck, back & shoulder tension from desk work. From £90.'
        );
        changed = true;
    }

    // ===== HOMEPAGE =====  
    if (relPath === '\\index.html' || relPath === '/index.html') {
        content = content.replace(/From £55/g, 'From £90');
        content = content.replace(/from £55/g, 'from £90');
        changed = true;
    }

    // ===== BOOK PAGE =====
    if (relPath.includes('\\book\\') || relPath.includes('/book/')) {
        content = content.replace(/From £55/g, 'From £90');
        content = content.replace(/from £55/g, 'from £90');
        content = content.replace(/From £65/g, 'From £120');
        content = content.replace(/from £65/g, 'from £120');
        content = content.replace(/From £70/g, 'From £120');
        changed = true;
    }

    // ===== ALL PAGES: fix "massage table" references =====
    if (content.includes('professional massage table') && !content.includes('do not provide')) {
        content = content.replace(
            /arrives with a professional massage table, premium organic oils/g,
            'arrives with premium organic oils'
        );
        changed = true;
    }

    if (changed) {
        writeFileSync(file, content);
        totalFixed++;
        console.log(`✅ Fixed prices: ${relPath}`);
    }
}

// Also check the homepage, contact page for old hour references
const homePage = join(root, 'index.html');
if (existsSync(homePage)) {
    let h = readFileSync(homePage, 'utf-8');
    if (h.includes('From £55') || h.includes('from £55')) {
        h = h.replace(/From £55/g, 'From £90');
        h = h.replace(/from £55/g, 'from £90');
        writeFileSync(homePage, h);
        console.log('✅ Fixed homepage prices');
    }
}

console.log(`\n🎉 Fixed prices on ${totalFixed} files total`);
