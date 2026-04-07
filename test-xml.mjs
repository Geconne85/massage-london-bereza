import https from 'https';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

https.get('https://massage-london-bereza.vercel.app/sitemap.xml', res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        console.log('--- LIVE XML VALIDATION ---');
        console.log('HTTP Content-Type:', res.headers['content-type']);
        
        const isValid = XMLValidator.validate(data);
        console.log('Is Structurally Valid XML?', isValid === true ? 'YES' : 'NO (Error: ' + isValid.err.msg + ')');
        
        const parser = new XMLParser({ ignoreAttributes: false });
        const result = parser.parse(data);
        
        const urlset = result.urlset;
        console.log('Contains <urlset>?', !!urlset);
        console.log('xmlns attribute:', urlset && urlset['@_xmlns']);
        console.log('Total <url> elements:', urlset && urlset.url && urlset.url.length);
        
        if (urlset && urlset.url) {
            console.log('First <url> <loc>:', urlset.url[0].loc);
        }
        
        console.log('\\n--- EXACT FIRST 10 LINES ---');
        console.log(data.split('\\n').slice(0, 10).join('\\n'));
    });
});
