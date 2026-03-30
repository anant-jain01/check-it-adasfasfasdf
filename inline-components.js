/**
 * inline-components.js
 * Run with Node.js to inline header, footer, stats-bar into all HTML pages.
 * Usage: node inline-components.js
 */

const fs = require('fs');
const path = require('path');

const dir = __dirname;

// Read component files
const headerHtml = fs.readFileSync(path.join(dir, 'header.html'), 'utf8').trim();
const footerHtml = fs.readFileSync(path.join(dir, 'footer.html'), 'utf8').trim();
const statsHtml  = fs.readFileSync(path.join(dir, 'stats-bar.html'), 'utf8').trim();

const pages = [
  'index.html', 'about.html', 'services.html',
  'products.html', 'insights.html', 'contact.html'
];

pages.forEach(page => {
  const filePath = path.join(dir, page);
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace header placeholder
  html = html.replace(
    /<!-- HEADER \(loaded by components\.js\) -->\s*<div id="site-header"><\/div>/,
    `<!-- HEADER -->\n<div id="site-header">\n${headerHtml}\n</div>`
  );

  // Replace footer placeholder
  html = html.replace(
    /<!-- FOOTER \(loaded by components\.js\) -->\s*<div id="site-footer"><\/div>/,
    `<!-- FOOTER -->\n<div id="site-footer">\n${footerHtml}\n</div>`
  );

  // Replace stats-bar placeholder (if present)
  html = html.replace(
    /<!-- STATS BAR \(loaded by components\.js\) -->\s*<div id="site-stats-bar"><\/div>/,
    `<!-- STATS BAR -->\n<div id="site-stats-bar">\n${statsHtml}\n</div>`
  );

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ Inlined components into ${page}`);
});

console.log('\nDone! All pages now have inlined header, footer, and stats-bar.');
