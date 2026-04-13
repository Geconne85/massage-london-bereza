// ============================================================
// THE BEREZA METHOD — Full CMS Admin Panel
// Access: http://localhost:3001/admin/
// Login: admin / bereza2026
// ============================================================
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data', 'content.json');
const IMG_DIR = path.join(ROOT, 'public', 'images');
const PORT = 3001;

// Ensure images folder exists
if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

const app = express();

// Multer config — store uploaded files in public/images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMG_DIR),
  filename: (req, file, cb) => {
    const name = req.body.saveas
      ? req.body.saveas.trim()
      : file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-');
    cb(null, name);
  }
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// Session store (lightweight)
const sessions = new Set();
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'bereza2026';

function genToken() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

function requireAuth(req, res, next) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/sid=([^;]+)/);
  if (match && sessions.has(match[1])) return next();
  if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'Not logged in' });
  res.redirect('/admin/');
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ---------- Serve images from public/images ----------
app.use('/admin/img', (req, res, next) => {
  res.set('Cache-Control', 'no-cache');
  next();
}, express.static(IMG_DIR));

// ---------- Login ----------
app.get('/admin/', (req, res) => {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/sid=([^;]+)/);
  if (match && sessions.has(match[1])) return res.send(adminHTML());
  res.send(loginHTML());
});

app.post('/admin/login', (req, res) => {
  const { user, pass } = req.body;
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    const token = genToken();
    sessions.add(token);
    res.setHeader('Set-Cookie', `sid=${token}; Path=/; HttpOnly`);
    return res.redirect('/admin/');
  }
  res.send(loginHTML('❌ Wrong username or password'));
});

app.get('/admin/logout', (req, res) => {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/sid=([^;]+)/);
  if (match) sessions.delete(match[1]);
  res.setHeader('Set-Cookie', 'sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  res.redirect('/admin/');
});

// ---------- API ----------
app.use('/admin/api', requireAuth);

// Get all content
app.get('/admin/api/content', (req, res) => {
  try { res.json(JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Save full content
app.post('/admin/api/content', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Patch a specific field: { path: "services.0.price", value: 120 }
app.post('/admin/api/patch', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const parts = req.body.path.split('.');
    let obj = data;
    for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
    obj[parts[parts.length - 1]] = req.body.value;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// List images
app.get('/admin/api/images', (req, res) => {
  try {
    const files = fs.readdirSync(IMG_DIR)
      .filter(f => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f))
      .map(f => {
        const stat = fs.statSync(path.join(IMG_DIR, f));
        return { name: f, size: Math.round(stat.size / 1024) + ' KB', modified: stat.mtime.toLocaleDateString() };
      });
    res.json(files);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Upload image(s)
app.post('/admin/api/upload', upload.array('images', 20), async (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
  let finalFiles = [];
  try {
    for (let f of req.files) {
      const isImg = /\.(jpg|jpeg|png|webp)$/i.test(f.filename);
      let finalName = f.filename;
      if (isImg) {
        finalName = f.filename.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        const tempPath = path.join(IMG_DIR, 'tmp-' + Math.random() + '.webp');
        await sharp(f.path).webp({ quality: 82 }).resize({ width: 1400, withoutEnlargement: true }).toFile(tempPath);
        fs.unlinkSync(f.path);
        fs.renameSync(tempPath, path.join(IMG_DIR, finalName));
      }
      finalFiles.push(finalName);
    }
  } catch(e) { console.error('Upload compress error:', e); finalFiles = req.files.map(f=>f.filename); }
  res.json({ ok: true, files: finalFiles });
});

// Replace specific image (keep same name)
app.post('/admin/api/replace/:name', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const targetPath = path.join(IMG_DIR, req.params.name);
  try {
    const isImg = /\.(jpg|jpeg|png|webp)$/i.test(req.params.name);
    if(isImg) {
      const tempPath = path.join(IMG_DIR, 'tmp-' + Math.random() + '.webp');
      await sharp(req.file.path).webp({ quality: 82 }).resize({ width: 1400, withoutEnlargement: true }).toFile(tempPath);
      fs.unlinkSync(req.file.path);
      if(fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
      fs.renameSync(tempPath, targetPath);
    } else {
      if(fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
      fs.renameSync(req.file.path, targetPath);
    }
  } catch (e) {
    if(fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
    fs.renameSync(req.file.path, targetPath);
  }
  res.json({ ok: true, filename: req.params.name });
});

// Delete image
app.delete('/admin/api/images/:name', (req, res) => {
  try {
    const p = path.join(IMG_DIR, req.params.name);
    if (!fs.existsSync(p)) return res.status(404).json({ error: 'Not found' });
    fs.unlinkSync(p);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// List pages
app.get('/admin/api/pages', (req, res) => {
  const pages = [];
  const scan = (dir, rel) => {
    try {
      for (const f of fs.readdirSync(dir)) {
        const fp = path.join(dir, f), rp = rel + '/' + f;
        if (fs.statSync(fp).isDirectory()) scan(fp, rp);
        else if (f === 'index.html') pages.push({ path: rp.replace(/^\//, ''), full: fp });
      }
    } catch {}
  };
  ['services', 'areas', 'pricing', 'book', 'about', 'contact', 'faq', 'reviews', 'blog', 'gift-vouchers', 'quiz', 'terms', 'privacy'].forEach(d => {
    const dp = path.join(ROOT, d);
    if (fs.existsSync(dp)) scan(dp, d);
  });
  pages.unshift({ path: 'index.html', full: path.join(ROOT, 'index.html') });
  res.json(pages.map(p => ({ path: p.path, full: p.full })));
});

// Get page HTML (use ?path=services/index.html)
app.get('/admin/api/page-html', (req, res) => {
  try {
    const p = path.join(ROOT, req.query.path || '');
    if (!fs.existsSync(p)) return res.status(404).json({ error: 'Not found' });
    res.json({ html: fs.readFileSync(p, 'utf-8') });
  } catch(e) { res.status(500).json({error:e.message}); }
});

// Save page HTML
app.post('/admin/api/page-html', (req, res) => {
  try {
    const p = path.join(ROOT, req.body.path || '');
    if (!p.startsWith(ROOT)) return res.status(403).json({error:'Forbidden'});
    fs.writeFileSync(p, req.body.html);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Publish — rebuild all static files and auto-deploy
app.post('/admin/api/publish', (req, res) => {
  try {
    execSync('npm run build && git add . && git commit -m "Auto-deploy via Admin Panel" && git push origin main', { cwd: ROOT, timeout: 120000, stdio: 'pipe' });
    res.json({ ok: true, message: 'Site rebuilt and deployed live successfully! Changes will appear in ~1 minute.' });
  } catch (e) {
    res.status(500).json({ error: e.stderr?.toString() || e.message });
  }
});

// Hot-stone photo endpoint: serve the uploaded hot stone image inline
app.get('/admin/', requireAuth, (req, res) => res.send(adminHTML()));

// ---------- HTML ----------
function loginHTML(error = '') {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin Login — The Bereza Method</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#09070f;min-height:100vh;display:flex;align-items:center;justify-content:center}
.box{background:linear-gradient(145deg,#1a1425,#12101a);border:1px solid #c6a96c30;border-radius:20px;padding:2.5rem 2rem;width:360px;box-shadow:0 20px 60px #00000080}
.logo{color:#c6a96c;font-size:1.4rem;text-align:center;margin-bottom:.3rem;letter-spacing:.05em}
.sub{color:#faf6f040;font-size:.8rem;text-align:center;margin-bottom:2rem}
.err{background:#e74c3c20;border:1px solid #e74c3c40;color:#e74c3c;padding:.7rem;border-radius:8px;font-size:.85rem;margin-bottom:1rem;text-align:center}
label{display:block;font-size:.7rem;color:#faf6f050;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.3rem}
input{width:100%;padding:.7rem 1rem;background:#09070f80;border:1px solid #c6a96c20;border-radius:8px;color:#faf6f0;font-size:.9rem;margin-bottom:1rem;outline:none}
input:focus{border-color:#c6a96c}
button{width:100%;padding:.8rem;background:linear-gradient(135deg,#c6a96c,#a88b50);color:#09070f;border:none;border-radius:8px;font-size:.95rem;font-weight:700;cursor:pointer;letter-spacing:.05em}
button:hover{box-shadow:0 4px 20px #c6a96c50;transform:translateY(-1px)}
</style></head><body>
<div class="box">
  <div class="logo">✦ The Bereza Method</div>
  <div class="sub">Admin Panel</div>
  ${error ? `<div class="err">${error}</div>` : ''}
  <form method="POST" action="/admin/login">
    <label>Username</label><input name="user" required autofocus placeholder="admin">
    <label>Password</label><input name="pass" type="password" required placeholder="••••••••">
    <button type="submit">Login →</button>
  </form>
</div></body></html>`;
}

function adminHTML() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin CMS — The Bereza Method</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--gold:#c6a96c;--gold2:#a88b50;--bg:#09070f;--bg2:#12101a;--bg3:#1a1425;--border:#c6a96c18;--text:#faf6f0;--muted:#faf6f060}
body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;flex-direction:column}
::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--gold2)40;border-radius:3px}

/* TOP BAR */
.topbar{display:flex;align-items:center;justify-content:space-between;padding:.7rem 1.5rem;background:var(--bg3);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:200}
.topbar .brand{color:var(--gold);font-size:1rem;font-weight:300;letter-spacing:.05em}.topbar .brand b{font-weight:700}
.topbar .acts{display:flex;gap:.6rem;align-items:center}
.btn{padding:.45rem 1rem;border:none;border-radius:6px;cursor:pointer;font-size:.78rem;font-weight:600;transition:all .2s;text-decoration:none;display:inline-flex;align-items:center;gap:.35rem;white-space:nowrap}
.btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--bg)}.btn-gold:hover{box-shadow:0 4px 15px #c6a96c50;transform:translateY(-1px)}
.btn-green{background:#27ae60;color:#fff}.btn-red{background:#e74c3c;color:#fff}.btn-blue{background:#2980b9;color:#fff}
.btn-outline{background:0 0;border:1px solid var(--gold)40;color:var(--gold)}.btn-outline:hover{border-color:var(--gold);background:var(--gold)10}
.btn-sm{padding:.3rem .7rem;font-size:.7rem}

/* LAYOUT */
.layout{display:flex;flex:1;min-height:0}

/* SIDEBAR */
.sidebar{width:200px;min-width:200px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;position:sticky;top:47px;max-height:calc(100vh - 47px);overflow-y:auto}
.sidebar-group{padding:.7rem 1rem .3rem;font-size:.6rem;color:var(--muted);text-transform:uppercase;letter-spacing:.15em;font-weight:700}
.nav-item{display:flex;align-items:center;gap:.5rem;padding:.55rem 1rem;cursor:pointer;border:none;background:0 0;color:var(--muted);font-size:.8rem;width:100%;text-align:left;transition:all .2s;border-left:2px solid transparent}
.nav-item.active,.nav-item:hover{color:var(--text);background:var(--gold)08}
.nav-item.active{color:var(--gold);border-left-color:var(--gold)}

/* MAIN */
.main{flex:1;overflow-y:auto;padding:1.5rem}
.panel{display:none}.panel.active{display:block}
.page-title{font-size:1.2rem;font-weight:300;margin-bottom:1.2rem;color:var(--text)}
.page-title span{color:var(--gold)}

/* STATUS BAR */
.statusbar{padding:.35rem 1.5rem;font-size:.72rem;font-weight:600;text-align:center;border-bottom:1px solid}
.statusbar.ok{background:#27ae6010;border-color:#27ae6025;color:#27ae60}
.statusbar.busy{background:var(--gold)10;border-color:var(--gold)25;color:var(--gold)}
.statusbar.err{background:#e74c3c10;border-color:#e74c3c25;color:#e74c3c}

/* CARDS */
.card{background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:1.2rem;margin-bottom:1rem}
.card-title{font-size:.85rem;font-weight:600;color:var(--gold);margin-bottom:.9rem;display:flex;align-items:center;gap:.5rem}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem}
@media(max-width:900px){.grid2,.grid3{grid-template-columns:1fr}.sidebar{width:160px;min-width:160px}}
@media(max-width:600px){.sidebar{display:none}}

/* FORM */
.field{margin-bottom:.8rem}
.field label{display:block;font-size:.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.25rem;font-weight:600}
.field input,.field textarea,.field select{width:100%;padding:.55rem .8rem;background:#09070f90;border:1px solid var(--gold)20;border-radius:7px;color:var(--text);font-size:.85rem;font-family:inherit;outline:none;resize:vertical}
.field input:focus,.field textarea:focus{border-color:var(--gold)}
.field input[type=number]{width:90px}

/* PHOTOS */
.upload-zone{border:2px dashed var(--gold)30;border-radius:10px;padding:2.5rem;text-align:center;cursor:pointer;transition:all .3s;margin-bottom:1.2rem}
.upload-zone:hover,.upload-zone.over{border-color:var(--gold);background:var(--gold)06}
.upload-zone svg{margin-bottom:.7rem;opacity:.5}
.img-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:.8rem}
.img-card{border:1px solid var(--border);border-radius:9px;overflow:hidden;transition:all .3s;background:var(--bg2)}
.img-card:hover{border-color:var(--gold)60;transform:translateY(-2px);box-shadow:0 6px 20px #0006}
.img-card .thumb{width:100%;height:140px;object-fit:cover;display:block;background:var(--bg)}
.img-card .img-name{padding:.4rem .6rem;font-size:.65rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.img-card .img-btns{display:flex;gap:.3rem;padding:.3rem .5rem .5rem}

/* SERVICES */
.svc-row{display:grid;grid-template-columns:70px 1fr 180px;gap:1rem;align-items:start;padding:1rem;background:var(--bg2);border:1px solid var(--border);border-radius:8px;margin-bottom:.6rem}
.svc-thumb{width:70px;height:70px;object-fit:cover;border-radius:7px;display:block;cursor:pointer}
.price-row{display:flex;align-items:center;gap:.5rem;margin-bottom:.3rem}
.price-row label{min-width:50px;font-size:.7rem;color:var(--muted);margin:0}

/* PAGES editor */
.page-list-item{display:flex;justify-content:space-between;align-items:center;padding:.5rem .8rem;border-bottom:1px solid var(--border);font-size:.82rem}
.page-list-item:hover{background:var(--gold)06}
#pageEditor{width:100%;height:400px;font-family:'Consolas','Monaco',monospace;font-size:.75rem;line-height:1.5;background:#050408;border:1px solid var(--gold)20;border-radius:8px;padding:.8rem;color:#c6a96c;resize:vertical;outline:none}

/* PREVIEW iframe */
#previewFrame{width:100%;height:calc(100vh - 120px);border:none;border-radius:8px;background:#fff}

/* TOAST */
.toast{position:fixed;bottom:1.5rem;right:1.5rem;padding:.75rem 1.4rem;border-radius:8px;font-weight:600;font-size:.82rem;color:#fff;transform:translateY(60px);opacity:0;transition:all .3s;z-index:999;pointer-events:none}
.toast.show{transform:translateY(0);opacity:1}
.toast.ok{background:#27ae60}.toast.err{background:#e74c3c}.toast.info{background:#2980b9}

/* MODAL */
.overlay{position:fixed;inset:0;background:#000b;display:none;align-items:center;justify-content:center;z-index:500}
.overlay.show{display:flex}
.modal{background:var(--bg3);border:1px solid var(--gold)30;border-radius:12px;padding:1.5rem;width:min(700px,92vw);max-height:85vh;overflow-y:auto}
.modal h3{color:var(--gold);margin-bottom:1rem}
</style></head><body>

<div class="topbar">
  <div class="brand">✦ <b>Bereza</b> CMS</div>
  <div class="acts">
    <button class="btn btn-outline btn-sm" onclick="switchPanel('preview')">👁 Preview</button>
    <button class="btn btn-gold" id="publishBtn" onclick="doPublish()">⚡ Publish Live</button>
    <a href="/admin/logout" class="btn btn-outline btn-sm">Sign Out</a>
  </div>
</div>

<div class="statusbar ok" id="status">✓ Ready — make changes, then click Publish Live to update your website</div>

<div class="layout">
  <nav class="sidebar">
    <div class="sidebar-group">Overview</div>
    <button class="nav-item active" data-panel="photos" onclick="nav(this)">📸 Photos</button>
    <button class="nav-item" data-panel="preview" onclick="nav(this)">👁 Preview</button>

    <div class="sidebar-group">Content</div>
    <button class="nav-item" data-panel="homepage" onclick="nav(this)">🏠 Homepage</button>
    <button class="nav-item" data-panel="sections" onclick="nav(this)">📰 Text Content</button>    
    <button class="nav-item" data-panel="services" onclick="nav(this)">💆 Services</button>
    <button class="nav-item" data-panel="pricing" onclick="nav(this)">💰 Pricing</button>
    <button class="nav-item" data-panel="reviews" onclick="nav(this)">⭐ Reviews</button>
    <button class="nav-item" data-panel="about" onclick="nav(this)">👤 About</button>
    <button class="nav-item" data-panel="faq" onclick="nav(this)">❓ FAQ</button>
    <button class="nav-item" data-panel="popup" onclick="nav(this)">💎 Popup</button>

    <div class="sidebar-group">Style & Global</div>
    <button class="nav-item" data-panel="design" onclick="nav(this)">🎨 Colors & Design</button>
    <button class="nav-item" data-panel="footer" onclick="nav(this)">🦶 Footer & Trust</button>

    <div class="sidebar-group">Advanced</div>
    <button class="nav-item" data-panel="pages" onclick="nav(this)">📄 Pages</button>
    <button class="nav-item" data-panel="deploy" onclick="nav(this)">🚀 Deploy</button>
  </nav>

  <main class="main">

    <!-- PHOTOS -->
    <div class="panel active" id="panel-photos">
      <div class="page-title">📸 Photo Manager <span>· upload, replace, delete</span></div>

      <div class="upload-zone" id="uploadZone" onclick="document.getElementById('fileIn').click()">
        <input type="file" id="fileIn" accept="image/*" multiple style="display:none">
        <svg width="40" height="40" fill="none" stroke="#c6a96c" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <p style="font-size:1rem;margin-bottom:.3rem">Click or drag & drop images here</p>
        <p style="color:var(--muted);font-size:.8rem">JPG · PNG · WebP · up to 20 MB each</p>
      </div>

      <div class="img-grid" id="imgGrid">
        <div style="color:var(--muted);font-size:.85rem;padding:2rem;text-align:center;grid-column:1/-1">Loading images…</div>
      </div>
    </div>

    <!-- PREVIEW -->
    <div class="panel" id="panel-preview">
      <div class="page-title">👁 Website Preview <span>· live site</span></div>
      <iframe id="previewFrame" src="http://localhost:5173/" title="Website Preview"></iframe>
    </div>

    <!-- HOMEPAGE -->
    <div class="panel" id="panel-homepage">
      <div class="page-title">🏠 Homepage Content</div>
      <div id="homepageFields">Loading…</div>
      <button class="btn btn-gold" onclick="saveSection('homepage')">💾 Save Homepage</button>
    </div>

    <!-- SERVICES -->
    <div class="panel" id="panel-services">
      <div class="page-title">💆 Services <span>· name, description, price, photo</span></div>
      <div id="servicesFields">Loading…</div>
    </div>

    <!-- PRICING -->
    <div class="panel" id="panel-pricing">
      <div class="page-title">💰 Pricing <span>· all massage prices</span></div>
      <div id="pricingFields">Loading…</div>
    </div>

    <!-- ABOUT -->
    <div class="panel" id="panel-about">
      <div class="page-title">👤 About / Contact</div>
      <div id="aboutFields">Loading…</div>
      <button class="btn btn-gold" onclick="saveSection('about')">💾 Save</button>
    </div>

    <!-- SECTIONS -->
    <div class="panel" id="panel-sections">
      <div class="page-title">📰 Text Content <span>· 3D showcase & other text blocks</span></div>
      <div id="sectionsFields">Loading…</div>
      <button class="btn btn-gold" onclick="saveSection('sections')">💾 Save Text Content</button>
    </div>

    <!-- REVIEWS -->
    <div class="panel" id="panel-reviews">
      <div class="page-title">⭐ Reviews <span>· edit client testimonials</span></div>
      <div id="reviewsFields">Loading…</div>
      <button class="btn btn-gold" onclick="saveSection('reviews')">💾 Save Reviews</button>
    </div>

    <!-- FAQ -->
    <div class="panel" id="panel-faq">
      <div class="page-title">❓ FAQ <span>· edit questions and answers</span></div>
      <div id="faqFields">Loading…</div>
      <button class="btn btn-gold" onclick="saveSection('faq')">💾 Save FAQ</button>
    </div>

    <!-- POPUP -->
    <div class="panel" id="panel-popup">
      <div class="page-title">💎 Popup <span>· edit dynamic popup</span></div>
      <div id="popupFields">Loading…</div>
      <button class="btn btn-gold" onclick="saveSection('popup')">💾 Save Popup</button>
    </div>

    <!-- DESIGN -->
    <div class="panel" id="panel-design">
      <div class="page-title">🎨 Theme Colors <span>· personalize your brand</span></div>
      <div id="designFields">Loading…</div>
      <button class="btn btn-gold" onclick="saveSection('design')">💾 Save Design</button>
    </div>

    <!-- FOOTER -->
    <div class="panel" id="panel-footer">
      <div class="page-title">🦶 Footer & Trust Bar <span>· global site info</span></div>
      <div id="footerFields">Loading…</div>
      <button class="btn btn-gold" onclick="saveSection('footer')">💾 Save Footer</button>
    </div>

    <!-- PAGES -->
    <div class="panel" id="panel-pages">
      <div class="page-title">📄 Raw Page Editor <span>· edit HTML directly</span></div>
      <div class="card">
        <div class="card-title">Select a Page</div>
        <div id="pageList">Loading…</div>
      </div>
      <div id="pageEditorCard" style="display:none">
        <div class="card-title" id="editingPath" style="color:var(--muted);font-size:.8rem;margin-bottom:.5rem"></div>
        <textarea id="pageEditor" spellcheck="false"></textarea>
        <div style="display:flex;gap:.6rem;margin-top:.8rem">
          <button class="btn btn-gold" onclick="savePage()">💾 Save Page</button>
          <button class="btn btn-outline" onclick="document.getElementById('pageEditorCard').style.display='none'">Cancel</button>
        </div>
      </div>
    </div>

    <!-- DEPLOY -->
    <div class="panel" id="panel-deploy">
      <div class="page-title">🚀 Deploy to Live Website</div>
      <div class="grid2">
        <div class="card">
          <div class="card-title">Step 1 — Auto Deploy</div>
          <p style="color:var(--muted);font-size:.82rem;line-height:1.7;margin-bottom:1rem">Click Publish Live to save your CMS changes, rebuild files, and deploy live directly to Vercel.</p>
          <button class="btn btn-green" onclick="doPublish()" style="width:100%">⚡ Publish Live</button>
        </div>
        <div class="card" style="grid-column:1/-1;">
          <div class="card-title">Step 2 — Vercel Processing</div>
          <p style="color:var(--muted);font-size:.85rem;line-height:1.7">
            Deployment takes care of itself automatically.<br><br>
            ⏳ Wait 1-2 minutes, then check your live site:<br>
            <a href="https://massage-london-bereza.vercel.app" target="_blank" style="color:#27ae60;font-weight:bold;text-decoration:none;font-size:1rem;">👉 View Live Website (massage-london-bereza.vercel.app)</a><br><br>
            Check deployment status here: <a href="https://vercel.com/geconne85s-projects/massage-london-bereza/" target="_blank" style="color:var(--gold)">Vercel Dashboard</a>
          </p>
        </div>
      </div>
    </div>

  </main>
</div>

<!-- MODAL -->
<div class="overlay" id="overlay">
  <div class="modal" id="modal">
    <h3 id="modalTitle">Title</h3>
    <div id="modalBody"></div>
    <div style="display:flex;gap:.6rem;margin-top:1rem">
      <button class="btn btn-gold" id="modalOk">OK</button>
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
// ---- State ----
let content = {};
let currentEditPage = null;

// ---- Init ----
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadContent();
    loadImages();
  } catch (e) {
    console.error(e);
    setStatus('❌ Error loading content. Please check content.json', 'err');
    document.body.innerHTML += \`<div style="position:fixed;inset:0;background:#000b;color:#fff;display:flex;align-items:center;justify-content:center;z-index:9999;padding:2rem;text-align:center">
      <div><h2>⚠️ Panel Error</h2><p>\${e.message}</p><br><button class="btn btn-gold" onclick="location.reload()">Retry</button></div>
    </div>\`;
  }
});

async function loadContent() {
  const r = await fetch('/admin/api/content');
  content = await r.json();
  
  // Wrapped in safe functions to prevent total crash
  safeRender(renderHomepage, 'homepage');
  safeRender(renderSections, 'sections');
  safeRender(renderServices, 'services');
  safeRender(renderPricing, 'pricing');
  safeRender(renderReviews, 'reviews');
  safeRender(renderAbout, 'about');
  safeRender(renderFaq, 'faq');
  safeRender(renderPopup, 'popup');
  safeRender(renderDesign, 'design');
  safeRender(renderFooter, 'footer');
  safeRender(loadPageList, 'pages');
}

function safeRender(fn, name) {
  try { fn(); } catch (e) {
    console.warn(\`Render error for \${name}:\`, e);
    const el = document.getElementById(name + 'Fields') || document.getElementById(name + 'List');
    if (el) el.innerHTML = \`<div class="err">Error rendering \${name}: \${e.message}</div>\`;
  }
}

// ---- Navigation ----
function nav(el) {
  document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(x => x.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('panel-' + el.dataset.panel).classList.add('active');
}
function switchPanel(name) {
  const btn = document.querySelector('[data-panel="' + name + '"]');
  if (btn) nav(btn);
}

// ---- Toast ----
function toast(msg, type = 'ok') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'toast show ' + type;
  setTimeout(() => t.className = 'toast', 3000);
}

// ---- Status bar ----
function setStatus(msg, cls = 'ok') {
  const s = document.getElementById('status');
  s.textContent = msg; s.className = 'statusbar ' + cls;
}

// ---- Save helpers ----
async function patch(path, value) {
  await fetch('/admin/api/patch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path, value }) });
}
async function saveFullContent() {
  await fetch('/admin/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) });
  toast('✅ Saved');
}

// ---- Images ----
async function loadImages() {
  try {
    const r = await fetch('/admin/api/images');
    const images = await r.json();
    const grid = document.getElementById('imgGrid');
    if (!images.length) { grid.innerHTML = '<p style="color:var(--muted);padding:2rem;text-align:center;grid-column:1/-1">No images yet — upload your first photo!</p>'; return; }
    grid.innerHTML = images.map(img => \`
      <div class="img-card" id="ic-\${CSS.escape(img.name)}">
        <img class="thumb" src="/admin/img/\${img.name}?t=\${Date.now()}" alt="\${img.name}" loading="lazy">
        <div class="img-name" title="\${img.name}">\${img.name}</div>
        <div style="padding:.2rem .5rem;color:var(--muted);font-size:.65rem">\${img.size} · \${img.modified}</div>
        <div class="img-btns">
          <label class="btn btn-blue btn-sm" style="cursor:pointer;flex:1;justify-content:center">
            Replace<input type="file" accept="image/*" style="display:none" onchange="replaceImg('\${img.name}', this)">
          </label>
          <button class="btn btn-red btn-sm" onclick="deleteImg('\${img.name}')">🗑</button>
        </div>
      </div>\`).join('');
  } catch (e) {
    document.getElementById('imgGrid').innerHTML = \`<div class="err">Failed to load images: \${e.message}</div>\`;
  }
}

// Upload
const zone = document.getElementById('uploadZone');
const fileIn = document.getElementById('fileIn');
['dragenter','dragover'].forEach(e => zone.addEventListener(e, ev => { ev.preventDefault(); zone.classList.add('over'); }));
['dragleave','drop'].forEach(e => zone.addEventListener(e, ev => { ev.preventDefault(); zone.classList.remove('over'); }));
zone.addEventListener('drop', ev => uploadFiles(ev.dataTransfer.files));
fileIn.addEventListener('change', () => { uploadFiles(fileIn.files); fileIn.value = ''; });

async function uploadFiles(files) {
  setStatus('📤 Uploading…', 'busy');
  const fd = new FormData();
  for (const f of files) fd.append('images', f);
  const r = await fetch('/admin/api/upload', { method: 'POST', body: fd });
  const d = await r.json();
  if (d.ok) { toast('✅ Uploaded: ' + d.files.join(', ')); await loadImages(); setStatus('✓ Images uploaded', 'ok'); }
  else { toast('❌ ' + d.error, 'err'); setStatus('❌ Upload failed', 'err'); }
}

async function replaceImg(name, input) {
  const fd = new FormData(); fd.append('image', input.files[0]);
  const r = await fetch('/admin/api/replace/' + encodeURIComponent(name), { method: 'POST', body: fd });
  const d = await r.json();
  if (d.ok) { toast('✅ Replaced: ' + name); const img = document.querySelector('#ic-' + CSS.escape(name) + ' .thumb'); if (img) img.src = '/admin/img/' + name + '?t=' + Date.now(); }
  else toast('❌ ' + d.error, 'err');
}

async function deleteImg(name) {
  if (!confirm('Delete ' + name + '? This cannot be undone.')) return;
  const r = await fetch('/admin/api/images/' + encodeURIComponent(name), { method: 'DELETE' });
  const d = await r.json();
  if (d.ok) { toast('🗑 Deleted'); const card = document.getElementById('ic-' + CSS.escape(name)); if (card) card.remove(); }
  else toast('❌ ' + d.error, 'err');
}

// ---- Homepage ----
function renderHomepage() {
  const hp = content.homepage || {};
  const s = content.settings || {};
  document.getElementById('homepageFields').innerHTML = \`
    <div class="grid2">
      <div class="card"><div class="card-title">Hero</div>
        <div class="field"><label>Subtitle</label><input id="hp_heroSubtitle" value="\${esc(hp.heroSubtitle||'')}"></div>
        <div class="field"><label>Main Title (HTML ok)</label><textarea id="hp_heroTitle" rows="2">\${esc(hp.heroTitle||'')}</textarea></div>
        <div class="field"><label>Description</label><textarea id="hp_heroDesc" rows="3">\${esc(hp.heroDesc||'')}</textarea></div>
        <div class="field"><label>Hero Image Path</label><input id="hp_heroImage" value="\${esc(hp.heroImage||'')}"></div>
      </div>
      <div class="card"><div class="card-title">Site Settings</div>
        <div class="field"><label>Phone</label><input id="set_phone" value="\${esc(s.phone||'')}"></div>
        <div class="field"><label>Email</label><input id="set_email" value="\${esc(s.email||'')}"></div>
        <div class="field"><label>Working Hours</label><input id="set_hours" value="\${esc(s.hours||'')}"></div>
        <div class="field"><label>WhatsApp Number</label><input id="set_whatsapp" value="\${esc(s.whatsapp||'')}"></div>
      </div>
    </div>\`;
}

// ---- Design ----
function renderDesign() {
  const d = content.design || { colors: { gold: '#c6a96c', bg: '#09070f', text: '#faf6f0' } };
  document.getElementById('designFields').innerHTML = \`
    <div class="grid2">
      <div class="card"><div class="card-title">Colors</div>
        <div class="field"><label>Primary Gold Color</label><input type="color" id="ds_gold" value="\${d.colors.gold || '#c6a96c'}"></div>
        <div class="field"><label>Dark Background</label><input type="color" id="ds_bg" value="\${d.colors.bg || '#09070f'}"></div>
        <div class="field"><label>Text Color</label><input type="color" id="ds_text" value="\${d.colors.text || '#faf6f0'}"></div>
      </div>
      <div class="card"><div class="card-title">Typography</div>
        <div class="field"><label>Heading Font</label><input id="ds_ffHeading" value="\${esc(d.fonts?.heading || "'Playfair Display', serif")}"></div>
        <div class="field"><label>Body Font</label><input id="ds_ffBody" value="\${esc(d.fonts?.body || "'Inter', sans-serif")}"></div>
      </div>
    </div>\`;
}

// ---- Footer ----
function renderFooter() {
  const f = content.footer || { desc: "London's premier mobile massage therapy service." };
  const tb = content.trustbar || { items: ["10+ Years Experience", "Same-Day Available", "10am-8pm Daily", "No Travel Fees"] };
  document.getElementById('footerFields').innerHTML = \`
    <div class="grid2">
      <div class="card"><div class="card-title">Footer</div>
        <div class="field"><label>Footer Description</label><textarea id="ft_desc" rows="3">\${esc(f.desc)}</textarea></div>
      </div>
      <div class="card"><div class="card-title">Trust Bar items</div>
        \${tb.items.map((item, i) => \`
          <div class="field"><input id="tb_\${i}" value="\${esc(item)}"></div>
        \`).join('')}
      </div>
    </div>\`;
}

function saveSection(sec) {
  if (sec === 'homepage') {
    content.homepage = content.homepage || {};
    content.settings = content.settings || {};
    content.homepage.heroSubtitle = document.getElementById('hp_heroSubtitle').value;
    content.homepage.heroTitle = document.getElementById('hp_heroTitle').value;
    content.homepage.heroDesc = document.getElementById('hp_heroDesc').value;
    content.homepage.heroImage = document.getElementById('hp_heroImage').value;
    content.settings.phone = document.getElementById('set_phone').value;
    content.settings.email = document.getElementById('set_email').value;
    content.settings.hours = document.getElementById('set_hours').value;
    content.settings.whatsapp = document.getElementById('set_whatsapp').value;
  }
  if (sec === 'about') {
    content.about = content.about || {};
    ['title','bio','bio2'].forEach(f => {
      const el = document.getElementById('ab_' + f);
      if (el) content.about[f] = el.value;
    });
  }
  if (sec === 'design') {
    content.design = { colors: {}, fonts: {} };
    content.design.colors.gold = document.getElementById('ds_gold').value;
    content.design.colors.bg = document.getElementById('ds_bg').value;
    content.design.colors.text = document.getElementById('ds_text').value;
    content.design.fonts.heading = document.getElementById('ds_ffHeading').value;
    content.design.fonts.body = document.getElementById('ds_ffBody').value;
  }
  if (sec === 'footer') {
    content.footer = { desc: document.getElementById('ft_desc').value };
    content.trustbar = { items: [] };
    for (let i = 0; i < 4; i++) {
        const el = document.getElementById('tb_' + i);
        if (el && el.value) content.trustbar.items.push(el.value);
    }
  }
  if (sec === 'sections') {
    content.sections = content.sections || {};
    ['3dsub','3dtitle','3ddesc','3dimg','hiwsub','hiwtitle','hiw1','hiw2','hiw3','hiw4','svcsub','svctitle','revsub','revtitle','ctasub','ctatitle'].forEach(f => {
      const el = document.getElementById('ts_' + f);
      if (el) content.sections[f] = el.value;
    });
  }
  saveFullContent();
}

// ---- Services ----
function renderServices() {
  const svcs = content.services || [];
  document.getElementById('servicesFields').innerHTML = svcs.map((s, i) => \`
    <div class="svc-row" id="svc\${i}">
      <div>
        <img class="svc-thumb" src="/admin/img/\${s.image?.replace('/images/','')||'hero-bg.png'}" alt="\${esc(s.name)}" onerror="this.src='/admin/img/hero-bg.png'">
        <label class="btn btn-blue btn-sm" style="cursor:pointer;margin-top:.3rem;display:block;text-align:center">
          Change Photo<input type="file" accept="image/*" style="display:none" onchange="uploadSvcImg(\${i}, this)">
        </label>
      </div>
      <div>
        <div class="field"><label>Name</label><input value="\${esc(s.name)}" onchange="updSvc(\${i},'name',this.value)"></div>
        <div class="field"><label>Short Description</label><input value="\${esc(s.shortDesc||'')}" onchange="updSvc(\${i},'shortDesc',this.value)"></div>
        <div class="field"><label>Full Description</label><textarea rows="2" onchange="updSvc(\${i},'longDesc',this.value)">\${esc(s.longDesc||'')}</textarea></div>
        <div class="field"><label>Image Filename</label><input value="\${esc(s.image||'')}" onchange="updSvc(\${i},'image',this.value)" placeholder="e.g. /images/hot-stone.jpg"></div>
      </div>
      <div>\${s.name&&s.name.includes('Divine') ? \`
        <div class="field"><label>Fixed Price £</label><input type="number" value="\${s.price120?.replace('£','')||200}" onchange="updSvc(\${i},'price120','£'+this.value)"></div>\` : \`
        <div class="price-row"><label>1 hr</label><input type="number" value="\${s.price60?.replace('£','')||''}" onchange="updSvc(\${i},'price60','£'+this.value)"></div>
        <div class="price-row"><label>1.5 hr</label><input type="number" value="\${s.price90?.replace('£','')||''}" onchange="updSvc(\${i},'price90','£'+this.value)"></div>
        <div class="price-row"><label>2 hr</label><input type="number" value="\${s.price120?.replace('£','')||''}" onchange="updSvc(\${i},'price120','£'+this.value)"></div>\`}
      </div>
    </div>\`).join('');
}

async function updSvc(i, field, val) {
  content.services[i][field] = val;
  await patch('services.' + i + '.' + field, val);
  toast('✅ Saved');
}
async function uploadSvcImg(i, input) {
  const fd = new FormData(); fd.append('images', input.files[0]);
  const r = await fetch('/admin/api/upload', { method: 'POST', body: fd });
  const d = await r.json();
  if (d.ok) {
    const fn = '/images/' + d.files[0];
    await updSvc(i, 'image', fn);
    document.querySelector('#svc' + i + ' .svc-thumb').src = '/admin/img/' + d.files[0] + '?t=' + Date.now();
    toast('✅ Service photo updated');
  }
}

// ---- Pricing ----
function renderPricing() {
  const svcs = content.services || [];
  document.getElementById('pricingFields').innerHTML = \`
    <div class="card">
      <div class="card-title">All Service Prices (£)</div>
      <div style="display:grid;grid-template-columns:1fr 80px 80px 80px;gap:.5rem;align-items:center;padding:.5rem 0;border-bottom:1px solid var(--border);font-size:.7rem;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.1em">
        <div>Service</div><div style="text-align:center">1 Hour</div><div style="text-align:center">1.5 Hr</div><div style="text-align:center">2 Hrs</div>
      </div>
      \${svcs.map((s, i) => \`
      <div style="display:grid;grid-template-columns:1fr 80px 80px 80px;gap:.5rem;align-items:center;padding:.6rem 0;border-bottom:1px solid var(--border)08">
        <div style="font-size:.85rem">\${esc(s.name)}</div>
        \${s.name&&s.name.includes('Divine') ? \`
          <div><input type="number" value="\${s.price120?.replace('£','')||200}" onchange="updSvc(\${i},'price120','£'+this.value)" style="width:70px;text-align:center"></div>
          <div style="color:var(--muted);font-size:.75rem;text-align:center">—</div>
          <div style="color:var(--muted);font-size:.75rem;text-align:center">—</div>
        \` : \`
          <div><input type="number" value="\${s.price60?.replace('£','')||''}" onchange="updSvc(\${i},'price60','£'+this.value)" style="width:70px;text-align:center"></div>
          <div><input type="number" value="\${s.price90?.replace('£','')||''}" onchange="updSvc(\${i},'price90','£'+this.value)" style="width:70px;text-align:center"></div>
          <div><input type="number" value="\${s.price120?.replace('£','')||''}" onchange="updSvc(\${i},'price120','£'+this.value)" style="width:70px;text-align:center"></div>
        \`}
      </div>\`).join('')}
    </div>\`;
}

// ---- About ----
function renderAbout() {
  const a = content.about || {};
  document.getElementById('aboutFields').innerHTML = \`
    <div class="grid2">
      <div class="card"><div class="card-title">About Iryna</div>
        <div class="field"><label>Title</label><input id="ab_title" value="\${esc(a.title||'')}"></div>
        <div class="field"><label>Bio (Para 1)</label><textarea id="ab_bio" rows="5">\${esc(a.bio||'')}</textarea></div>
        <div class="field"><label>Bio (Para 2)</label><textarea id="ab_bio2" rows="5">\${esc(a.bio2||'')}</textarea></div>
      </div>
    </div>\`;
}

// ---- Text Sections ----
function renderSections() {
  const ts = content.sections || {};
  document.getElementById('sectionsFields').innerHTML = \`
    <div class="grid2">
      <div class="card"><div class="card-title">3D Showcase</div>
        <div class="field"><label>Subtitle</label><input id="ts_3dsub" value="\${esc(ts.showcaseSubtitle||'✦ Clinical-Grade Therapy')}"></div>
        <div class="field"><label>Title</label><input id="ts_3dtitle" value="\${esc(ts.showcaseTitle||'Professional Body Massage, Delivered to Your Door')}"></div>
        <div class="field"><label>Description</label><textarea id="ts_3ddesc" rows="3">\${esc(ts.showcaseDesc||'10+ years of clinical experience. Same-day availability across Shoreditch, Marylebone, Canary Wharf, Kensington, Chelsea, Mayfair & all Central London areas.')}</textarea></div>
        <div class="field"><label>Image Path</label><input id="ts_3dimg" value="\${esc(ts.showcaseImg||'/images/hero-massage-3d.png')}"></div>
      </div>
      <div class="card"><div class="card-title">How It Works</div>
        <div class="field"><label>Subtitle</label><input id="ts_hiwsub" value="\${esc(ts.hiwSubtitle||'How It Works')}"></div>
        <div class="field"><label>Title</label><input id="ts_hiwtitle" value="\${esc(ts.hiwTitle||'Your Session in 4 Steps')}"></div>
        <div class="field"><label>Step 1 Text</label><input id="ts_hiw1" value="\${esc(ts.hiw1||'WhatsApp 447704503507 or book online.')}"></div>
        <div class="field"><label>Step 2 Text</label><input id="ts_hiw2" value="\${esc(ts.hiw2||'Iryna arrives with organic oils & linens.')}"></div>
        <div class="field"><label>Step 3 Text</label><input id="ts_hiw3" value="\${esc(ts.hiw3||'Focus on your specific tension areas.')}"></div>
        <div class="field"><label>Step 4 Text</label><input id="ts_hiw4" value="\${esc(ts.hiw4||'Feel immediate physical and mental reset.')}"></div>
      </div>
      <div class="card"><div class="card-title">Services & Testimonials Headers</div>
        <div class="field"><label>Services Subtitle</label><input id="ts_svcsub" value="\${esc(ts.svcSubtitle||'Our Services')}"></div>
        <div class="field"><label>Services Title</label><input id="ts_svctitle" value="\${esc(ts.svcTitle||'Specialist Treatments')}"></div>
        <div class="field"><label>Reviews Subtitle</label><input id="ts_revsub" value="\${esc(ts.revSubtitle||'Testimonials')}"></div>
        <div class="field"><label>Reviews Title</label><input id="ts_revtitle" value="\${esc(ts.revTitle||'Client Experiences')}"></div>
      </div>
      <div class="card"><div class="card-title">CTA Section</div>
        <div class="field"><label>Subtitle</label><input id="ts_ctasub" value="\${esc(ts.ctaSubtitle||'Ready to Begin?')}"></div>
        <div class="field"><label>Title</label><input id="ts_ctatitle" value="\${esc(ts.ctaTitle||'Book Your Session Today')}"></div>
      </div>
    </div>\`;
}

// ---- Reviews ----
function renderReviews() {
  const revs = content.reviews || [];
  document.getElementById('reviewsFields').innerHTML = \`
    <button class="btn btn-outline btn-sm" onclick="addRev()" style="margin-bottom:1rem">+ Add Review</button>
    \${revs.map((r, i) => \`
    <div class="card" id="rev\${i}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.8rem">
        <div class="card-title" style="margin:0">\${esc(r.name||'Client')}</div>
        <button class="btn btn-red btn-sm" onclick="delRev(\${i})">Delete</button>
      </div>
      <div class="field"><label>Name</label><input value="\${esc(r.name||'')}" onchange="updRev(\${i},'name',this.value)"></div>
      <div class="field"><label>Location/Service</label><input value="\${esc(r.location||'')}" onchange="updRev(\${i},'location',this.value)"></div>
      <div class="field"><label>Review Text</label><textarea rows="2" onchange="updRev(\${i},'text',this.value)">\${esc(r.text||'')}</textarea></div>
    </div>\`).join('')}\`;
}
async function updRev(i, field, val) {
  content.reviews[i][field] = val;
  await patch('reviews.' + i + '.' + field, val);
}
async function addRev() {
  if (!content.reviews) content.reviews = [];
  content.reviews.unshift({ name: 'New Client', location: 'London', text: 'Great massage!' });
  await saveFullContent();
  renderReviews();
}
async function delRev(i) {
  if (!confirm('Delete this review?')) return;
  content.reviews.splice(i, 1);
  await saveFullContent();
  renderReviews();
  toast('🗑 Deleted');
}

// ---- FAQ ----
function renderFaq() {
  const faqs = content.faq || [];
  document.getElementById('faqFields').innerHTML = \`
    <button class="btn btn-outline btn-sm" onclick="addFaq()" style="margin-bottom:1rem">+ Add Question</button>
    \${faqs.map((f, i) => \`
    <div class="card" id="faq\${i}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.8rem">
        <div class="card-title" style="margin:0">Q\${i+1}</div>
        <button class="btn btn-red btn-sm" onclick="delFaq(\${i})">Delete</button>
      </div>
      <div class="field"><label>Question</label><input value="\${esc(f.q||'')}" onchange="updFaq(\${i},'q',this.value)"></div>
      <div class="field"><label>Answer</label><textarea rows="3" onchange="updFaq(\${i},'a',this.value)">\${esc(f.a||'')}</textarea></div>
    </div>\`).join('')}\`;
}
async function updFaq(i, field, val) {
  content.faq[i][field] = val;
  await patch('faq.' + i + '.' + field, val);
}
async function addFaq() {
  if (!content.faq) content.faq = [];
  content.faq.push({ q: 'New Question', a: 'Answer here' });
  await saveFullContent();
  renderFaq();
}
async function delFaq(i) {
  if (!confirm('Delete this FAQ?')) return;
  content.faq.splice(i, 1);
  await saveFullContent();
  renderFaq();
  toast('🗑 Deleted');
}

// ---- Popup ----
function renderPopup() {
  const p = content.popup || {};
  document.getElementById('popupFields').innerHTML = \`
    <div class="grid2">
      <div class="card"><div class="card-title">Popup Text</div>
        <div class="field"><label>Badge</label><input id="pop_badge" value="\${esc(p.badge||'✦ SIGNATURE EXPERIENCE')}" onchange="updPopup('badge',this.value)"></div>
        <div class="field"><label>Title</label><input id="pop_title" value="\${esc(p.title||'Massage with Divine Alignment')}" onchange="updPopup('title',this.value)"></div>
        <div class="field"><label>Description</label><textarea rows="3" id="pop_text" onchange="updPopup('text',this.value)">\${esc(p.text||'')}</textarea></div>
        <div class="field"><label>Subtext</label><input id="pop_sub" value="\${esc(p.subtext||'')}" onchange="updPopup('subtext',this.value)"></div>
        <div class="field"><label>Button Text</label><input id="pop_cta" value="\${esc(p.cta||'Book Divine Alignment — £200 →')}" onchange="updPopup('cta',this.value)"></div>
        <div class="field"><label>Button Link</label><input id="pop_link" value="\${esc(p.link||'/book/')}" onchange="updPopup('link',this.value)"></div>
      </div>
      <div class="card"><div class="card-title">Timing</div>
        <div class="field"><label>Show after (seconds)</label><input type="number" id="pop_delay" value="\${p.showAfter||20}" onchange="updPopup('showAfter',parseInt(this.value))"></div>
        <div class="field"><label>Reappear after close (seconds)</label><input type="number" id="pop_reappear" value="\${p.reappearAfter||120}" onchange="updPopup('reappearAfter',parseInt(this.value))"></div>
        <div style="background:linear-gradient(145deg,#1a1425,#09070f);border:1px solid var(--gold)30;border-radius:12px;padding:1.5rem;text-align:center;margin-top:1rem">
          <div style="color:var(--gold);font-size:.65rem;letter-spacing:.2em;border:1px solid var(--gold)40;display:inline-block;padding:3px 10px;border-radius:20px">✦ SIGNATURE EXPERIENCE</div>
          <h3 style="font-size:1.2rem;color:#faf6f0;margin:.8rem 0;font-weight:300">Massage with<br><em style="color:var(--gold)">Divine Alignment</em></h3>
          <div style="background:linear-gradient(135deg,var(--gold),var(--gold2));padding:.5rem 1.2rem;border-radius:6px;color:#09070f;font-weight:700;display:inline-block;font-size:.82rem">Book — £200 →</div>
        </div>
      </div>
    </div>\`;
}
async function updPopup(field, val) {
  if (!content.popup) content.popup = {};
  content.popup[field] = val;
  await patch('popup.' + field, val);
  toast('✅ Saved');
}

// ---- Pages ----
async function loadPageList() {
  const r = await fetch('/admin/api/pages');
  const pages = await r.json();
  document.getElementById('pageList').innerHTML = pages.map(p => \`
    <div class="page-list-item">
      <span>📄 \${p.path}</span>
      <div style="display:flex;gap:.4rem">
        <a href="http://localhost:5173/\${p.path.replace('index.html','')}" target="_blank" class="btn btn-outline btn-sm">Preview ↗</a>
        <button class="btn btn-blue btn-sm" onclick="editPage('\${p.path}','\${p.full}')">Edit HTML</button>
      </div>
    </div>\`).join('');
}
async function editPage(relPath) {
  currentEditPage = relPath;
  document.getElementById('editingPath').textContent = 'Editing: ' + relPath;
  const r = await fetch('/admin/api/page-html?path=' + encodeURIComponent(relPath));
  const d = await r.json();
  document.getElementById('pageEditor').value = d.html || '';
  document.getElementById('pageEditorCard').style.display = 'block';
  document.getElementById('pageEditor').scrollIntoView({ behavior: 'smooth' });
}
async function savePage() {
  if (!currentEditPage) return;
  const html = document.getElementById('pageEditor').value;
  const r = await fetch('/admin/api/page-html', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: currentEditPage, html }) });
  const d = await r.json();
  if (d.ok) { toast('✅ Page saved'); document.getElementById('pageEditorCard').style.display = 'none'; }
  else toast('❌ ' + d.error, 'err');
}

// ---- Publish ----
async function doPublish() {
  const btn = document.getElementById('publishBtn');
  btn.textContent = '⏳ Building…'; btn.disabled = true;
  setStatus('⏳ Rebuilding site…', 'busy');
  try {
    const r = await fetch('/admin/api/publish', { method: 'POST' });
    const d = await r.json();
    if (d.ok) { toast('🎉 Published! Now push to GitHub.'); setStatus('✅ Published! Push to GitHub → Vercel auto-deploys.', 'ok'); }
    else { toast('❌ Build failed', 'err'); setStatus('❌ Build error — check terminal', 'err'); }
  } catch { toast('❌ Server error', 'err'); }
  btn.textContent = '⚡ Publish Live'; btn.disabled = false;
}

// ---- Utils ----
function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function closeModal() { document.getElementById('overlay').classList.remove('show'); }
</script>
</body></html>`;
}

app.listen(PORT, () => {
  console.log('\n✨ ================================');
  console.log('   THE BEREZA METHOD — Admin CMS');
  console.log('   URL:   http://localhost:' + PORT + '/admin/');
  console.log('   Login: admin / bereza2026');
  console.log('================================\n');
});
