# 3K Investment Partners – Website Architecture & Developer Guide

Welcome to the codebase for the **3K Investment Partners** website. This document provides a comprehensive, A-to-Z explanation of how the website is structured, how the components work together, and where to find specific pieces of code.

---

## 🏗️ 1. High-Level Architecture

The website is a **static frontend application** built with standard HTML5, CSS3, and Vanilla JavaScript. It does not require a complex build framework (like React or Next.js), making it incredibly fast, highly optimized for SEO, and easy to host on any standard web server (Apache, Nginx, GitHub Pages, Vercel, etc.).

**Key Features:**
*   **Fully Responsive:** Uses CSS Grid, Flexbox, and `clamp()` fluid typography to adapt from large 4K monitors down to small mobile screens.
*   **Component-Based Workflow:** While it's a static site, the Header, Footer, and Stats Bar are managed as separate component files to follow the "Don't Repeat Yourself" (DRY) principle.
*   **SEO & SMO Optimized:** Pre-configured with Open Graph meta tags, Twitter Cards, Canonical URLs, and Google JSON-LD structured data.

---

## 📂 2. Directory & File Structure

Here is a breakdown of the core files in the root directory:

### 📄 Main Pages (The Views)
There are six primary HTML pages that users interact with:
*   `index.html` - The Home page. Contains the hero banner, core competencies, and high-level company overview.
*   `about.html` - The "Our Story" page detailing the firm's history, mission, vision, and founders.
*   `services.html` - Detailed breakdown of service offerings (Wealth Management, Tax Planning, Insurance, etc.).
*   `products.html` - A catalog of financial products offered (Mutual Funds, Equity, SIF, AIF, etc.).
*   `insights.html` - A space for market research, blogs, and financial education.
*   `contact.html` - Contact information, a contact form, and Google Maps integration.

### 🧩 Component Snippets (The Partials)
Instead of copying and pasting the header and footer into every single HTML file, they are maintained here:
*   `header.html` - Contains the logo, desktop navigation links, and the slide-in mobile navigation menu HTML.
*   `footer.html` - Contains the footer links, copyright, and the **SEBI/AMFI regulatory disclaimers**.
*   `stats-bar.html` - The animated counter banner (e.g., "25+ Years Experience", "800+ Clients").

### 🎨 Styling
*   `style.css` - The single, unified stylesheet for the entire website. (More details below).

### ⚙️ Logic (JavaScript)
*   `script.js` - The main interactive frontend logic (Scroll animations, mobile menu toggling, etc.).
*   `components.js` - A progressive-enhancement script for dynamically fetching components (used only if running on an HTTP server).
*   `inline-components.js` - A Node.js build script used to physically inject the components into the HTML pages for local viewing.

---

## 🛠️ 3. How the Component System Works (Crucial)

To make maintaining the site easy, we use a component injection system. If you need to add a new link to the navbar or update the SEBI disclaimer in the footer, you **only edit `header.html` or `footer.html`**. 

However, because browsers block local files (`file://`) from fetching other local files due to strict CORS security policies, we handle components in two ways:

**A. The Local Build Method (Node.js)**
1. You edit `header.html` or `footer.html`.
2. Open your terminal in the project folder and run: `node inline-components.js`
3. This script reads your HTML pages (`index.html`, `about.html`, etc.), finds the placeholder tags (e.g., `<!-- HEADER --> <div id="site-header">`), and **physically pastes** the contents of `header.html` into those pages. 
4. This guarantees the site works perfectly when you double-click the `.html` files on your desktop.

**B. The Live Server Fallback (`components.js`)**
If the site is hosted on a real web server (e.g., `https://3kip.in`), `components.js` will detect that it is running on a server. If, for some reason, the components weren't inlined during deployment, this script acts as a fallback. It uses `XMLHttpRequest` to silently load `header.html` and inject it into the page as the user browses.

---

## 💅 4. CSS Architecture (`style.css`)

The entire visual identity ("Parchment & Forest" theme) is controlled centrally in `style.css`. 

**1. CSS Variables (`:root`)**
At the very top of `style.css`, you will find CSS Custom Properties. These define the firm's brand colors:
*   `--forest`: Deep green (#1B3022) used for text and primary buttons.
*   `--heritage`: Darker green/black (#112016) used for sharp contrasts.
*   `--gold`: The primary accent color (#C5A059).
*   `--parchment` & `--cream`: The textured off-white background colors.
*If the brand colors ever change, simply update these 5 variables, and the entire site updates instantly.*

**2. Fluid Typography (`clamp()`)**
Instead of writing dozens of media queries for font sizes, the site heavily utilizes CSS `clamp()`. 
Example: `font-size: clamp(2rem, 5vw, 3rem);` 
This means the text will smoothly scale based on the user's screen width, never dropping below `2rem` on mobiles and never exceeding `3rem` on desktops.

**3. Responsive Breakpoints**
The layout collapses gracefully for different devices using `@media` queries located at the bottom of the stylesheet:
*   `max-width: 1200px` (Tablet Landscape/Small Laptops)
*   `max-width: 992px` (Tablet Portrait - *This is where the desktop nav hides and the Hamburger menu appears*)
*   `max-width: 768px` (Mobile Phones)
*   `max-width: 576px` (Small Mobile Phones)

**4. Animations**
Look for `@keyframes` in the CSS. Animations like `fadeInUp`, `slideRight`, and `scaleIn` are defined here and are triggered by the JavaScript when elements scroll into view.

---

## ⚡ 5. JavaScript Interactivity (`script.js`)

`script.js` handles all the "moving parts" of the user interface. 

*   **`setActiveNav()`**: Looks at the current URL (e.g., `/services.html`) and adds an `.active` class to the "Services" link in the header so it highlights in gold.
*   **`initMobileMenu()`**: Hooks up the Hamburger button (`#hamburger`). When clicked, it adds an `.open` class to the `#mobilePanel` and the translucent `#mobileOverlay`, causing the mobile menu to smoothly slide in from the right edge of the screen.
*   **`initScrollEffects()`**: Listens to the window scrolling. When scrolling down, it adds a `.scrolled` class to the header, making it shrink slightly and apply a blurred backdrop filter. If you scroll down fast, it hides the header (`.header-hidden`); if you scroll up, it reveals the header.
*   **`initCounters()`**: Uses `IntersectionObserver` to detect when the Stats Bar (e.g., "800+ Clients") enters the user's screen. Once visible, it runs a loop to animate the numbers counting up from 0.
*   **`initScrollReveal()`**: Looks for any HTML element with the classes `.reveal`, `.reveal-left`, or `.reveal-up`. When the user scrolls down and these elements enter the viewport, it adds an `.active` class to them, triggering CSS transitions that make them fade and slide into place.

---

## 🔍 6. SEO & SMO (Search Engine & Social Media Optimization)

To ensure high visibility on Google and professional previews on WhatsApp, LinkedIn, and Twitter:

**Meta Tags (Added to the `<head>` of all 6 pages):**
*   **Title & Description:** Highly optimized, keyword-rich descriptions explicitly stating AMFI registration, Delhi location, and specific services (SIP, Tax, Wealth Management).
*   **Keywords & Robots:** Instructs Google crawlers to index and follow links.
*   **Open Graph (`og:`) tags:** Dictates exactly what title, description, and image should appear when you share a link to the site in a message.
*   **Canonical Links:** Prevents Google from penalizing the site for duplicate content if it's accessed via `www.3kip.in` vs `3kip.in`.

**JSON-LD Structured Data:**
*   At the bottom of `index.html` and `contact.html`, there are `<script type="application/ld+json">` blocks. This is code written specifically for Google's robots.
*   It explicitly categorizes 3K Investment Partners as a `FinancialService` and `LocalBusiness` in New Delhi, mapping the logo URL, physical address, and phone number directly into Google's Knowledge Graph, drastically improving local search rankings.

---

## 📝 7. How to Make Daily Updates

*   **Updating text/images on a specific page:** Open that page (e.g., `about.html`) and edit the HTML. 
*   **Updating colors/fonts/spacing:** Open `style.css`.
*   **Updating the Header Menu:** Edit `header.html`, then run `node inline-components.js` in your terminal.
*   **Updating the Footer/SEBI Disclaimer:** Edit `footer.html`, then run `node inline-components.js` in your terminal.

This architecture ensures the site remains lightning-fast, highly secure, and extremely friendly to search engines, while maintaining an institutional, premium aesthetic.
