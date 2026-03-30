const fs = require('fs');

function updateFile(path) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');

    // 1. Change all fonts to Lora
    content = content.replace(/font-family:\s*'Inter',\s*sans-serif/g, "font-family: 'Lora', serif");
    content = content.replace(/font-family:\s*'Noto Serif',\s*serif/g, "font-family: 'Lora', serif");

    // 2. Add Buttons to index.html hero
    if (path.includes('index.html')) {
        const targetP = `<p style="font-size:1.05rem;font-family:'Lora',serif;line-height:1.8;font-style:italic;opacity:.85;animation:fadeInUp 1s .6s both;color:#EDE8E0;">Disciplined portfolio structuring and strategic asset allocation designed for multi-generational wealth preservation. We serve families with an institutional mindset built for India's evolving financial aspirations.\n      </p>`;
        const buttons = `\n      <div style="display:flex;gap:1.5rem;margin-top:2.5rem;animation:fadeInUp 1s .8s both;">
        <a href="services.html" class="btn-primary" style="background:var(--gold);padding:1.1rem 2.8rem;">
          <span style="color:#1B3022;">View Our Approach</span>
        </a>
        <a href="contact.html" class="btn-outline" style="border-color:#EDE8E0;color:#EDE8E0;">
          <span>Contact Us</span>
        </a>
      </div>`;
        if (content.includes(targetP) && !content.includes('View Our Approach')) {
            content = content.replace(targetP, targetP + buttons);
        }
    }

    // 3. Header logic in CSS
    if (path.includes('style.css')) {
        // Center the header content using space-between
        content = content.replace(
            /(\.header-inner\s*\{[^}]+)justify-content:\s*center;/, 
            '$1justify-content: space-between;'
        );
        content = content.replace('.header-inner {\n  display: flex;', '.header-inner {\n  position: relative;\n  display: flex;');

        // Logo absolute centered and its visual effects
        content = content.replace('.logo-area {\n  display: flex;', '.logo-area {\n  position: absolute;\n  left: 50%;\n  transform: translateX(-50%);\n  display: flex;');
        content = content.replace(/margin-right:\s*auto;\s*\/\*\s*push\s*nav\s*\+\s*CTA\s*to\s*the\s*right\s*\*\//g, 'margin: 0; /* Updated for center logo */');
        content = content.replace('.logo-area:hover {\n  transform: translateY(-2px);\n}', '.logo-area:hover {\n  transform: translateX(-50%) translateY(-2px);\n}');

        // Nav Links placed backwards in flex container (or left space)
        content = content.replace('.nav-links {\n  display: flex;', '.nav-links {\n  display: flex;\n  order: -1;');
        content = content.replace(/margin:\s*0\s*auto;/g, 'margin: 0;');

        // Logo height + 15%
        content = content.replace('.logo-area img {\n  height: 72px;', '.logo-area img {\n  height: 83px;');
        content = content.replace('.main-header.scrolled .logo-area img {\n  height: 42px;', '.main-header.scrolled .logo-area img {\n  height: 48px;');

        // On scroll the header gets a background remove it
        // We look for .main-header.scrolled { block and strip background, boxshadow, borders, etc
        content = content.replace(
            /\.main-header\.scrolled\s*\{[\s\S]*?padding:\s*0\.45rem\s*1\.5rem;\n\}/m,
            `.main-header.scrolled {
  background: transparent;
  padding: 0.45rem 1.5rem;
}`
        );
    }
    
    fs.writeFileSync(path, content, 'utf8');
}

updateFile('style.css');
updateFile('index.html');
console.log("update.js executed successfully.");
