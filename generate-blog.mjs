// Generate blog pages
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const header = `<header class="header" id="header"><div class="header__inner"><a href="/" class="header__logo">The Bereza <span>Method</span></a><button class="nav-toggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button><nav class="nav" id="nav"><a href="/about/" class="nav__link">About</a><a href="/services/deep-tissue-massage-london/" class="nav__link">Services</a><a href="/pricing/" class="nav__link">Pricing</a><a href="/areas/massage-therapist-soho/" class="nav__link">Areas</a><a href="/blog/" class="nav__link">Blog</a><a href="/contact/" class="nav__link">Contact</a><a href="/book/" class="nav__cta">Book Now</a></nav></div></header>`;
const footer = `<footer class="footer"><div class="container"><div class="footer__grid"><div><div class="footer__brand-name">The Bereza <span>Method</span></div><p class="footer__desc">London's premier mobile massage therapy service.</p></div><div><h4 class="footer__heading">Services</h4><ul class="footer__links"><li><a href="/services/deep-tissue-massage-london/">Deep Tissue</a></li><li><a href="/services/swedish-massage-london/">Swedish</a></li><li><a href="/services/hot-stone-massage-london/">Hot Stone</a></li><li><a href="/services/aromatherapy-massage-london/">Aromatherapy</a></li><li><a href="/services/sports-massage-london/">Sports</a></li><li><a href="/services/couples-massage-london/">Couples</a></li></ul></div><div><h4 class="footer__heading">Quick Links</h4><ul class="footer__links"><li><a href="/about/">About</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/book/">Book Online</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/reviews/">Reviews</a></li></ul></div><div><h4 class="footer__heading">Areas</h4><ul class="footer__links"><li><a href="/areas/massage-therapist-soho/">Soho</a></li><li><a href="/areas/massage-therapist-mayfair/">Mayfair</a></li><li><a href="/areas/massage-therapist-city-of-london/">City of London</a></li></ul></div></div><div class="footer__bottom"><p>&copy; 2026 The Bereza Method. All rights reserved.</p><p>hello@massage-london-bereza.vercel.app</p></div></div></footer>`;

const posts = [
    {
        slug: 'deep-tissue-massage-for-london-desk-workers',
        title: 'Deep Tissue Massage for London Desk Workers: The Complete Guide (2026)',
        metaDesc: 'How deep tissue massage treats chronic neck, shoulder & back pain caused by desk work. A clinical guide by Iryna Bereza — 10+ years experience treating City of London professionals.',
        tag: 'Deep Tissue',
        icon: '💆',
        excerpt: 'If you spend 8+ hours a day at a desk in the City, Canary Wharf, or Shoreditch, your body is accumulating postural damage that simple stretching cannot fix.',
        date: 'March 1, 2026',
        readTime: '10 min read',
        content: `
      <p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);margin-bottom:var(--space-xl);">If you spend 8+ hours a day at a desk in the City, Canary Wharf, or Shoreditch, your body is accumulating postural damage that simple stretching cannot fix. Deep tissue massage is the most effective clinical treatment for the chronic pain patterns that desk work creates.</p>

      <h2>The Desk Worker's Body: What's Happening</h2>
      <p>When you sit at a desk for extended periods, your body adapts to this unnatural position in ways that create cascading problems:</p>
      <ul style="list-style:disc;padding-left:var(--space-xl);margin-bottom:var(--space-xl);">
        <li style="margin-bottom:var(--space-sm);"><strong>Upper Crossed Syndrome:</strong> Your chest muscles shorten while your upper back muscles weaken, pulling your shoulders forward.</li>
        <li style="margin-bottom:var(--space-sm);"><strong>Forward Head Posture:</strong> For every inch your head sits forward, it adds approximately 10 pounds of additional stress on your cervical spine.</li>
        <li style="margin-bottom:var(--space-sm);"><strong>Lower Back Compression:</strong> Sitting compresses your lumbar discs by up to 40% more than standing.</li>
        <li style="margin-bottom:var(--space-sm);"><strong>Hip Flexor Tightening:</strong> Chronic sitting shortens your hip flexors, creating an anterior pelvic tilt that increases lower back pain.</li>
      </ul>

      <h2>How Deep Tissue Massage Helps</h2>
      <p>Deep tissue massage specifically targets the muscle layers and connective tissue (fascia) affected by desk work. Unlike Swedish massage, which focuses on relaxation, deep tissue work applies slow, firm pressure to:</p>
      <ul style="list-style:disc;padding-left:var(--space-xl);margin-bottom:var(--space-xl);">
        <li style="margin-bottom:var(--space-sm);">Break up adhesions (muscle knots) formed by repetitive stress</li>
        <li style="margin-bottom:var(--space-sm);">Release chronically shortened muscles in the chest, neck and hip flexors</li>
        <li style="margin-bottom:var(--space-sm);">Improve blood flow to oxygen-deprived tissues</li>
        <li style="margin-bottom:var(--space-sm);">Reduce inflammation and swelling around compressed joints</li>
        <li style="margin-bottom:var(--space-sm);">Reset pain signalling in the nervous system</li>
      </ul>

      <h2>The Bereza Method Approach</h2>
      <p>At The Bereza Method, Iryna begins every deep tissue session with a proprietary Tension Assessment that maps your specific pain patterns. For desk workers, this typically reveals:</p>
      <ul style="list-style:disc;padding-left:var(--space-xl);margin-bottom:var(--space-xl);">
        <li style="margin-bottom:var(--space-sm);">Trigger points in the upper trapezius and levator scapulae</li>
        <li style="margin-bottom:var(--space-sm);">Fascial restrictions across the pectoralis major</li>
        <li style="margin-bottom:var(--space-sm);">Compression patterns in the lumbar erector spinae</li>
        <li style="margin-bottom:var(--space-sm);">Shortened psoas and iliacus muscles</li>
      </ul>

      <h2>Recommended Frequency for Desk Workers</h2>
      <p>Research published in the <em>Journal of Clinical Nursing</em> shows that regular massage therapy significantly reduces musculoskeletal pain in office workers. Based on 10+ years of clinical experience, Iryna recommends:</p>
      <ul style="list-style:disc;padding-left:var(--space-xl);margin-bottom:var(--space-xl);">
        <li style="margin-bottom:var(--space-sm);"><strong>Acute Pain Phase:</strong> Weekly sessions for 4-6 weeks</li>
        <li style="margin-bottom:var(--space-sm);"><strong>Maintenance Phase:</strong> Fortnightly sessions</li>
        <li style="margin-bottom:var(--space-sm);"><strong>Prevention:</strong> Monthly sessions to prevent recurrence</li>
      </ul>

      <h2>Quick Desk Stretches Between Sessions</h2>
      <p>Iryna recommends these stretches every 90 minutes during your work day:</p>
      <ol style="list-style:decimal;padding-left:var(--space-xl);margin-bottom:var(--space-xl);">
        <li style="margin-bottom:var(--space-sm);"><strong>Doorway Chest Stretch:</strong> 30 seconds each side — opens the pectoralis muscles</li>
        <li style="margin-bottom:var(--space-sm);"><strong>Chin Tucks:</strong> 10 repetitions — counteracts forward head posture</li>
        <li style="margin-bottom:var(--space-sm);"><strong>Seated Spinal Twist:</strong> 20 seconds each side — mobilises the thoracic spine</li>
        <li style="margin-bottom:var(--space-sm);"><strong>Standing Hip Flexor Stretch:</strong> 30 seconds each side — lengthens the psoas</li>
      </ol>

      <h2>Book Your Deep Tissue Session</h2>
      <p>Ready to undo the damage of desk work? Iryna Bereza delivers clinical-grade deep tissue massage directly to your London home or office — same-day availability across the City, Canary Wharf, Shoreditch, and all Central London.</p>
      <p><a href="/book/" style="color:var(--color-gold);font-weight:600;">Book your session now →</a></p>`
    },
    {
        slug: 'london-marathon-recovery-guide',
        title: 'London Marathon 2026 Recovery Guide: Pre & Post-Race Massage Protocols',
        metaDesc: 'How sports massage accelerates marathon recovery. Pre-race & post-race protocols by Iryna Bereza — 10+ years treating London runners. Mobile sports massage delivered to your home.',
        tag: 'Sports Recovery',
        icon: '🏃',
        excerpt: 'Whether you\'re running your first London Marathon or chasing a PB, the right massage protocol can make the difference between a smooth recovery and weeks of pain.',
        date: 'February 20, 2026',
        readTime: '12 min read',
        content: `
      <p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);margin-bottom:var(--space-xl);">Whether you're running your first London Marathon or chasing a PB, the right massage protocol can make the difference between a smooth recovery and weeks of pain. This guide covers exactly how to use sports massage before, during, and after marathon training.</p>

      <h2>Pre-Race Massage Protocol</h2>
      <p>The weeks before the London Marathon are critical. Here's how sports massage fits into your taper:</p>
      <h3 style="margin-top:var(--space-lg);">4 Weeks Before Race Day</h3>
      <p>This is your last opportunity for deep, intensive sports massage work. Iryna focuses on releasing accumulated tension from training blocks, particularly in the calves, hamstrings, IT band, and hip flexors.</p>
      <h3 style="margin-top:var(--space-lg);">2 Weeks Before Race Day</h3>
      <p>A moderate-pressure session focused on flushing metabolic waste from muscles while maintaining tissue quality. No deep tissue work — the goal is recovery, not treatment.</p>
      <h3 style="margin-top:var(--space-lg);">3-5 Days Before Race Day</h3>
      <p>A light, stimulating massage to promote blood flow and nervous system readiness. Short, targeted work on any remaining tight spots. This session should leave you feeling energised, not depleted.</p>

      <h2>Post-Marathon Recovery Timeline</h2>
      <h3 style="margin-top:var(--space-lg);">0-24 Hours After</h3>
      <p><strong>Do NOT get a deep massage.</strong> Your muscles are in an inflammatory healing state. Light walking, hydration, and nutrition are your priorities.</p>
      <h3 style="margin-top:var(--space-lg);">48-72 Hours After</h3>
      <p>A gentle, circulatory massage is now appropriate. Iryna uses light effleurage strokes to promote lymphatic drainage and reduce delayed onset muscle soreness (DOMS). No deep pressure.</p>
      <h3 style="margin-top:var(--space-lg);">1-2 Weeks After</h3>
      <p>Now your muscles are ready for moderate sports massage. Iryna can address specific areas of tightness or pain that have emerged post-race.</p>
      <h3 style="margin-top:var(--space-lg);">3-4 Weeks After</h3>
      <p>Full deep tissue sports massage is safe and effective. This session clears remaining adhesions and prepares your body for return to training.</p>

      <h2>Common Marathon Injuries Treated</h2>
      <ul style="list-style:disc;padding-left:var(--space-xl);margin-bottom:var(--space-xl);">
        <li style="margin-bottom:var(--space-sm);"><strong>IT Band Syndrome:</strong> Myofascial release along the lateral thigh</li>
        <li style="margin-bottom:var(--space-sm);"><strong>Plantar Fasciitis:</strong> Deep work on the calf complex and foot fascia</li>
        <li style="margin-bottom:var(--space-sm);"><strong>Runner's Knee:</strong> Quadriceps and patellar tendon work</li>
        <li style="margin-bottom:var(--space-sm);"><strong>Achilles Tendinopathy:</strong> Eccentric loading support with calf massage</li>
      </ul>

      <h2>Book Your Marathon Recovery</h2>
      <p>Iryna Bereza delivers sports massage to runners across Central London — from Greenwich to Blackheath start lines, to your home anywhere in the city.</p>
      <p><a href="/book/" style="color:var(--color-gold);font-weight:600;">Book your sports massage →</a></p>`
    },
    {
        slug: 'massage-for-anxiety-and-stress-relief',
        title: 'Massage for Anxiety & Stress Relief: What the Science Says (2026)',
        metaDesc: 'Clinical evidence for massage therapy as anxiety treatment. How Swedish & aromatherapy massage reduce cortisol & improve sleep. By Iryna Bereza — The Bereza Method, London.',
        tag: 'Wellness',
        icon: '🧘',
        excerpt: 'Anxiety affects 1 in 4 people in the UK. Research increasingly shows that massage therapy is one of the most effective complementary treatments for anxiety and chronic stress.',
        date: 'February 10, 2026',
        readTime: '9 min read',
        content: `
      <p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);margin-bottom:var(--space-xl);">Anxiety affects 1 in 4 people in the UK. Research increasingly shows that massage therapy is one of the most effective complementary treatments for anxiety and chronic stress — and London professionals are turning to it in record numbers.</p>

      <h2>The Science: How Massage Reduces Anxiety</h2>
      <p>Multiple peer-reviewed studies demonstrate measurable physiological changes during and after massage therapy:</p>
      <ul style="list-style:disc;padding-left:var(--space-xl);margin-bottom:var(--space-xl);">
        <li style="margin-bottom:var(--space-sm);"><strong>Cortisol Reduction:</strong> A meta-analysis published in the <em>Journal of Clinical Psychiatry</em> found that massage therapy reduces cortisol (the stress hormone) by an average of 31%.</li>
        <li style="margin-bottom:var(--space-sm);"><strong>Serotonin Increase:</strong> The same research showed a 28% increase in serotonin following massage, boosting mood and emotional regulation.</li>
        <li style="margin-bottom:var(--space-sm);"><strong>Dopamine Boost:</strong> Dopamine levels increased by 31%, improving motivation and feelings of reward.</li>
        <li style="margin-bottom:var(--space-sm);"><strong>Parasympathetic Activation:</strong> Touch therapy activates the vagus nerve, shifting the nervous system from "fight or flight" to "rest and digest."</li>
      </ul>

      <h2>Best Massage Types for Anxiety</h2>
      <h3 style="margin-top:var(--space-lg);">Swedish Massage</h3>
      <p>The gold standard for anxiety relief. Long, flowing strokes activate the parasympathetic nervous system and promote deep relaxation. Research shows 60 minutes of Swedish massage produces changes in anxiety biomarkers that persist for up to 48 hours.</p>
      <h3 style="margin-top:var(--space-lg);">Aromatherapy Massage</h3>
      <p>Combines Swedish technique with essential oils clinically proven to reduce anxiety. Lavender, bergamot, and chamomile are particularly effective. A 2019 study found aromatherapy massage reduced anxiety scores by 36% more than massage alone.</p>

      <h2>The Bereza Method: Mindfulness Integration</h2>
      <p>At The Bereza Method, Iryna combines therapeutic massage with guided breathing and mindfulness techniques for a complete nervous system reset. This approach addresses anxiety at both the physical and psychological level.</p>

      <h2>How Often Should You Book?</h2>
      <p>For chronic anxiety and stress, Iryna recommends:</p>
      <ul style="list-style:disc;padding-left:var(--space-xl);margin-bottom:var(--space-xl);">
        <li style="margin-bottom:var(--space-sm);"><strong>High Stress Period:</strong> Weekly sessions for the first month</li>
        <li style="margin-bottom:var(--space-sm);"><strong>Moderate Anxiety:</strong> Fortnightly sessions</li>
        <li style="margin-bottom:var(--space-sm);"><strong>Ongoing Maintenance:</strong> Monthly sessions</li>
      </ul>

      <p><a href="/book/" style="color:var(--color-gold);font-weight:600;">Book your anxiety-relief session →</a></p>`
    },
    {
        slug: 'how-often-should-you-get-a-massage',
        title: 'How Often Should You Get a Massage? A Clinical Therapist\'s Guide',
        metaDesc: 'Expert guidance on massage frequency for pain relief, stress management & athletic recovery. By Iryna Bereza — 10+ years clinical experience. The Bereza Method, London.',
        tag: 'Guide',
        icon: '📅',
        excerpt: 'One of the most common questions Iryna receives: "How often should I book?" The answer depends on your goals, your body, and your lifestyle.',
        date: 'January 28, 2026',
        readTime: '7 min read',
        content: `
      <p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);margin-bottom:var(--space-xl);">One of the most common questions Iryna Bereza receives: "How often should I book a massage?" The honest answer is: it depends on your goals, your body, and your lifestyle. Here's her clinical guide based on 10+ years of experience.</p>

      <h2>For Chronic Pain Management</h2>
      <p><strong>Recommended: Weekly → Fortnightly → Monthly</strong></p>
      <p>If you're dealing with chronic neck, back, or shoulder pain, the most effective approach is to start with weekly sessions for 4-6 weeks. This allows enough time to address deep adhesions and reset pain patterns. Once symptoms improve, move to fortnightly sessions, then monthly maintenance.</p>

      <h2>For Stress & Anxiety Relief</h2>
      <p><strong>Recommended: Fortnightly → Monthly</strong></p>
      <p>Research shows that the cortisol-reducing effects of massage therapy last approximately 48-72 hours. For ongoing stress management, fortnightly sessions maintain consistently lower stress levels. Monthly sessions work well for people with moderate stress levels.</p>

      <h2>For Athletic Performance & Recovery</h2>
      <p><strong>Recommended: Weekly (during training blocks)</strong></p>
      <p>Serious athletes benefit from weekly sports massage during heavy training periods. This reduces injury risk, speeds recovery, and maintains tissue quality. During off-season or lighter training, fortnightly sessions are sufficient.</p>

      <h2>For General Wellness</h2>
      <p><strong>Recommended: Monthly</strong></p>
      <p>If you're generally healthy and want to maintain good tissue quality, manage everyday stress, and prevent problems before they start — monthly massage is the gold standard.</p>

      <h2>Signs You Need to Increase Frequency</h2>
      <ul style="list-style:disc;padding-left:var(--space-xl);margin-bottom:var(--space-xl);">
        <li style="margin-bottom:var(--space-sm);">Your pain returns within days of your last session</li>
        <li style="margin-bottom:var(--space-sm);">You've increased your training volume significantly</li>
        <li style="margin-bottom:var(--space-sm);">You're going through a particularly stressful period</li>
        <li style="margin-bottom:var(--space-sm);">You're preparing for a specific event (marathon, wedding, etc.)</li>
        <li style="margin-bottom:var(--space-sm);">You've had a recent injury or surgery</li>
      </ul>

      <p><a href="/book/" style="color:var(--color-gold);font-weight:600;">Book your next session →</a></p>`
    },
    {
        slug: 'mobile-massage-vs-spa-massage-london',
        title: 'Mobile Massage vs Spa Massage: Why London Professionals Are Switching',
        metaDesc: 'Why busy London professionals choose mobile massage over traditional spas. Convenience, personalisation & clinical outcomes compared. By Iryna Bereza — The Bereza Method.',
        tag: 'Lifestyle',
        icon: '🏠',
        excerpt: 'The spa industry is being disrupted. Increasingly, London professionals are choosing mobile massage over traditional spas — and the reasons go far beyond convenience.',
        date: 'January 15, 2026',
        readTime: '6 min read',
        content: `
      <p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);margin-bottom:var(--space-xl);">The spa industry is being disrupted. Increasingly, London professionals are choosing mobile massage over traditional spas — and the reasons go far beyond convenience.</p>

      <h2>Time Savings</h2>
      <p>A typical spa visit in London takes 2-3 hours when you factor in travel, check-in, changing rooms, and waiting. A mobile massage takes exactly as long as your treatment — your therapist arrives, sets up in minutes, treats you, and packs up. Zero wasted time.</p>

      <h2>True Relaxation</h2>
      <p>Post-massage, your body is in a deeply relaxed state. In a spa, you then have to get dressed, navigate reception, find transport, and commute home. With mobile massage, you can walk straight to your sofa or bed. The relaxation continues.</p>

      <h2>Personalisation</h2>
      <p>In busy spas, therapists often follow standardised routines. A mobile therapist like Iryna Bereza tailors every session to your specific body. She knows your history, your pain points, and your preferences.</p>

      <h2>Clinical Quality</h2>
      <p>Many spa therapists are trained to Level 3 standard. Iryna holds a Level 4+ qualification — the highest UK standard. This means access to advanced therapeutic techniques like myofascial release and clinical deep tissue work.</p>

      <h2>Cost Comparison</h2>
      <p>A 90-minute massage at a premium London spa: £180-£300+. The Bereza Method 90-minute session: from £130 — including travel, equipment, and organic products. Premium quality at a fraction of the spa price.</p>

      <p><a href="/book/" style="color:var(--color-gold);font-weight:600;">Try mobile massage →</a></p>`
    },
    {
        slug: 'what-to-expect-first-massage',
        title: 'What to Expect at Your First Massage: A Complete Guide for Beginners',
        metaDesc: 'Everything first-time massage clients need to know. What happens, what to wear, how to prepare & how to choose the right treatment. By Iryna Bereza — The Bereza Method, London.',
        tag: 'Beginners',
        icon: '🌟',
        excerpt: 'Never had a professional massage before? Here\'s everything you need to know to feel confident and comfortable at your first session.',
        date: 'January 5, 2026',
        readTime: '8 min read',
        content: `
      <p style="font-size:var(--fs-body-lg);line-height:var(--lh-relaxed);margin-bottom:var(--space-xl);">Never had a professional massage before? You're not alone — many of Iryna's clients come to her as complete beginners. Here's everything you need to know to feel confident and comfortable at your first session.</p>

      <h2>Before Your Session</h2>
      <h3 style="margin-top:var(--space-lg);">What to Prepare</h3>
      <p>Almost nothing! Your therapist brings everything — professional massage table, organic oils, fresh linens, and towels. Simply ensure you have a quiet room with a clear floor space of approximately 2m x 3m.</p>
      <h3 style="margin-top:var(--space-lg);">What to Wear</h3>
      <p>You undress to your comfort level in private. Most clients undress to underwear, but you can keep on whatever makes you comfortable. You'll always be covered with fresh linens — only the area being worked on is exposed.</p>

      <h2>During Your Session</h2>
      <h3 style="margin-top:var(--space-lg);">The Consultation</h3>
      <p>Your session begins with a 5-10 minute consultation. Iryna will ask about your health history, current concerns, and goals for the session. This is your opportunity to mention any injuries, allergies, or areas to avoid.</p>
      <h3 style="margin-top:var(--space-lg);">The Tension Assessment</h3>
      <p>Iryna's proprietary assessment identifies your specific tension patterns before treatment begins. This ensures your session targets exactly what your body needs.</p>
      <h3 style="margin-top:var(--space-lg);">The Treatment</h3>
      <p>You'll lie on a professional massage table (face down first, then face up). Pressure is always negotiated — you can request more or less at any time. Communication is encouraged.</p>

      <h2>After Your Session</h2>
      <ul style="list-style:disc;padding-left:var(--space-xl);margin-bottom:var(--space-xl);">
        <li style="margin-bottom:var(--space-sm);">Drink plenty of water to help flush released toxins</li>
        <li style="margin-bottom:var(--space-sm);">You may feel sleepy — this is normal and healthy</li>
        <li style="margin-bottom:var(--space-sm);">Some soreness in treated areas for 24-48 hours is normal</li>
        <li style="margin-bottom:var(--space-sm);">Avoid intense exercise for 24 hours</li>
      </ul>

      <h2>Which Treatment Should Beginners Choose?</h2>
      <p>For your first massage, Iryna typically recommends a 90-minute Swedish massage. It's the most gentle and relaxing option, giving your body time to adjust to therapeutic touch.</p>

      <p><a href="/book/" style="color:var(--color-gold);font-weight:600;">Book your first massage →</a></p>`
    }
];

// Create blog index
const blogIndex = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Massage Therapy Blog London | The Bereza Method</title>
  <meta name="description" content="Expert massage therapy articles by Iryna Bereza. Guides on deep tissue massage, sports recovery, stress relief, and wellness for London professionals.">
  <link rel="canonical" href="https://massage-london-bereza.vercel.app/blog/">
  <link rel="stylesheet" href="/css/global.css">
</head>
<body>
  ${header}

  <section class="page-hero">
    <div class="container">
      <p class="subtitle">Blog</p>
      <h1>Massage Therapy Insights</h1>
      <p>Expert articles on massage therapy, wellness and recovery by Iryna Bereza.</p>
    </div>
  </section>

  <section class="section section--white">
    <div class="container">
      <div class="grid grid--3">
        ${posts.map(p => `
        <a href="/blog/${p.slug}/" class="blog-card fade-in">
          <div class="blog-card__image">${p.icon}</div>
          <div class="blog-card__body">
            <span class="blog-card__tag">${p.tag}</span>
            <h3 class="blog-card__title">${p.title}</h3>
            <p class="blog-card__excerpt">${p.excerpt}</p>
            <span class="blog-card__meta">${p.date} · ${p.readTime}</span>
          </div>
        </a>`).join('')}
      </div>
    </div>
  </section>

  <section class="cta-section">
    <div class="container">
      <p class="subtitle">Ready to Experience It?</p>
      <h2>Book Your Session Today</h2>
      <p>Same-day availability across Central London.</p>
      <a href="/book/" class="btn btn--primary btn--lg">Book Now</a>
    </div>
  </section>

  ${footer}
  <script src="/js/main.js"></script>
</body>
</html>`;

mkdirSync('blog', { recursive: true });
writeFileSync('blog/index.html', blogIndex);
console.log('Created blog index');

// Create individual blog posts
posts.forEach(p => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.title} | The Bereza Method</title>
  <meta name="description" content="${p.metaDesc}">
  <link rel="canonical" href="https://massage-london-bereza.vercel.app/blog/${p.slug}/">
  <link rel="stylesheet" href="/css/global.css">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BlogPosting","headline":"${p.title}","author":{"@type":"Person","name":"Iryna Bereza"},"publisher":{"@type":"Organization","name":"The Bereza Method"},"datePublished":"2026-${p.date.includes('March') ? '03' : p.date.includes('Feb') ? '02' : '01'}-01","description":"${p.metaDesc}"}
  </script>
</head>
<body>
  ${header}

  <section class="page-hero">
    <div class="container">
      <p class="subtitle">${p.tag} · ${p.readTime}</p>
      <h1 style="max-width:800px;margin:0 auto var(--space-md);">${p.title}</h1>
      <p>By <strong>Iryna Bereza</strong> · ${p.date}</p>
    </div>
  </section>

  <article class="section section--white">
    <div class="container container--narrow">
      ${p.content}
    </div>
  </article>

  <section class="section section--cream">
    <div class="container container--narrow">
      <div style="background:var(--color-white);border-radius:var(--radius-lg);padding:var(--space-2xl);border:1px solid var(--color-light-gray);display:flex;align-items:center;gap:var(--space-xl);flex-wrap:wrap;">
        <div style="width:80px;height:80px;border-radius:var(--radius-full);background:var(--gradient-gold);display:flex;align-items:center;justify-content:center;font-size:2rem;flex-shrink:0;">👩‍⚕️</div>
        <div style="flex:1;min-width:250px;">
          <h3 style="margin-bottom:var(--space-xs);">About the Author</h3>
          <p style="color:var(--color-muted);font-size:var(--fs-small);margin:0;">Iryna Bereza is the founder of The Bereza Method — London's premier mobile massage therapy service. With 10+ years of professional clinical experience, she specialises in deep tissue therapy, sports recovery, and stress relief.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="cta-section">
    <div class="container">
      <p class="subtitle">Experience The Bereza Method</p>
      <h2>Book Your Session</h2>
      <p>Same-day availability across Central London.</p>
      <a href="/book/" class="btn btn--primary btn--lg">Book Now</a>
    </div>
  </section>

  ${footer}
  <script src="/js/main.js"></script>
</body>
</html>`;

    const dir = `blog/${p.slug}`;
    mkdirSync(dir, { recursive: true });
    writeFileSync(`${dir}/index.html`, html);
    console.log(`Created: blog/${p.slug}/index.html`);
});

console.log('All blog pages created!');
