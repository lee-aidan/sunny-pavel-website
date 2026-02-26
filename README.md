# Sunny Pavel Artist Page

Sunny Pavel Artist Page is a custom-built promotional website for musician Sunny Pavel. The site serves as a central hub for showcasing music, sharing background information, and providing direct contact pathways within a visually driven, minimalist interface.

The project is a fully static multi-page site with styling and interaction handled through handcrafted HTML, CSS, and JavaScript. The current iteration also includes performance and mobile refinements such as image loading hints, safe-area support for newer iPhones, gentle page-load transitions, and a custom scrollbar optimized for smoothness.

This was the second website I developed, and I used it to go deeper into layout control, visual hierarchy, typography, layered scroll behavior, and lightweight interaction design.

All HTML, CSS, and JavaScript was written manually without frameworks.

---

## Project Highlights

- Custom-designed static artist website with multi-page structure
- Layered homepage with sticky hero image + overlaid navigation
- Embedded YouTube performance section integrated into the landing flow
- Custom draggable scrollbar with click-to-jump support
- Smooth page-load transitions and subtle hover interactions
- Formspree-powered contact form with client-side formatting + async submission
- Mobile-safe layout refinements for newer iPhones (viewport-fit=cover, safe-area insets, dvh)
- Vanilla HTML/CSS/JavaScript (no framework)

---

## HTML Architecture

The site uses a simple multi-page HTML structure with consistent patterns across pages: title/header content, shared navigation behaviors, shared icon classes, and a single shared stylesheet/script. Markup stays intentionally minimal so layout, color, and motion can be controlled mostly through CSS.

The homepage is structured as a layered scroll experience rather than a standard top-to-bottom content stack:

- A full-viewport hero image acts as the visual anchor
- Title, nav links, and social icons sit on top of the hero
- A second full-height section overlays the hero with a semi-opaque panel and video content
- A custom scroll indicator sits outside the main flow as a separate UI layer

### Example: layered homepage structure (`index.html`)

```html
<body class="home-body">
  <main class="fullscreen home-wrap">
    <section class="hero" aria-hidden="true">
      <img
        src="images/bg.jpg"
        alt=""
        class="fullscreen-image hero-image"
        width="1545"
        height="1024"
        decoding="async"
        fetchpriority="high"
      />
    </section>

    <div class="overlay-content">
      <h1 class="site-title accent-font">sunny pavel</h1>

      <nav class="site-nav" aria-label="Main navigation">
        <a href="about.html">about</a>
        <a href="music.html">music</a>
        <a href="contact.html">contact</a>
      </nav>
    </div>

    <section class="hero-cover">
      <div class="home-navy-content">
        <h2 class="home-navy-title accent-font">
          a few songs to showcase my sound!
        </h2>

        <div class="home-video">
          <div class="home-video-placeholder">
            <iframe
              src="https://www.youtube.com/embed/B6aw87yWlFg?rel=0&modestbranding=1"
              title="Sunny Pavel – Live Performance"
              width="900"
              height="506"
              loading="lazy"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>

      <p class="site-credit accent-font">built by aidan lee</p>
    </section>
  </main>
</body>
```

This structure keeps the HTML readable while enabling layered scroll behavior and strong visual staging through CSS.

---

## CSS Approach

Styling is centralized in a single `styles.css` file and organized by page context using body classes. This allows each page to maintain a distinct visual identity while still sharing typography, icon behavior, spacing conventions, and reusable components.

### CSS design goals

- Minimal markup with expressive styling
- Layered scroll behavior on the homepage
- Strong typography + custom accent font
- Reusable icon and navigation patterns
- Subtle motion without heavy animation scripting
- Page-specific color palettes with shared visual rules
- Responsive behavior that preserves layout intent on phones

### Current iteration additions (CSS)

- Gentle load-in transitions (`@keyframes`)
- Hover micro-interactions on navigation and page headings
- `prefers-reduced-motion` fallback
- Mobile safe-area support (`env(safe-area-inset-*)`)
- `100dvh` support for more reliable mobile viewport sizing
- Condensed mobile video width so the embed is not edge-to-edge

### Example: homepage layered layout + mobile safe-area handling (`styles.css`)

```css
.hero {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  z-index: 1;
}

.overlay-content {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  padding-top: calc(0.01rem + env(safe-area-inset-top));
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;

  height: 100vh;
  height: 100dvh;
  justify-content: flex-start;
}

.hero-cover {
  height: 100vh;
  height: 100dvh;
  background-color: rgba(11, 28, 45, 0.9);
  position: relative;
  z-index: 3;
}

@media (max-width: 677px) {
  .overlay-content {
    padding-top: calc(1.4rem + env(safe-area-inset-top));
    padding-left: max(0.75rem, env(safe-area-inset-left));
    padding-right: max(0.75rem, env(safe-area-inset-right));
  }

  .home-video {
    width: min(92vw, 100%);
  }
}
```

This approach lets layout, stacking, and visual transitions do most of the work rather than relying on a framework or animation library.

---

## Motion & Interaction Design

The site uses subtle motion to reinforce the visual design without changing layout or introducing heavy effects. Motion is implemented in CSS and kept intentionally small:

- Page-load fade/rise transitions for major sections
- Hover lift/opacity changes for navigation links, icons, headings, and selected UI elements
- Reduced-motion support to disable transitions/animations when requested by the user

### Example: gentle load-in + hover behavior (`styles.css`)

```css
@keyframes gentle-rise-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.site-nav a {
  transition: transform 120ms ease, opacity 120ms ease;
}

.site-nav a:hover {
  transform: translateY(-1px);
  opacity: 0.9;
  text-decoration: underline;
  text-underline-offset: 6px;
}

.overlay-content > * {
  animation: gentle-rise-in 420ms ease both;
}
```

These interactions support polish and hierarchy without making the site feel animation-heavy.

--- 

## JavaScript Development

JavaScript is used sparingly and intentionally. The main shared script (`script.js`) powers the custom scrollbar, which visually replaces the browser scrollbar and supports both drag and click-to-jump interaction.

The current iteration of the scrollbar logic focuses on smoothness and low overhead:

- `requestAnimationFrame-based` thumb syncing
- Passive scroll listener
- Cached track bounds during dragging
- Drag-only pointermove listeners (attached only while dragging)
- Disabled/hid when page content is not scrollable
- Visibility-aware updates (skips work when tab is hidden)
- Touch-device behavior is limited, but the home page can still display the custom scrollbar on mobile

### Example: current scrollbar setup (`script.js`)

```js
const track = document.querySelector(".scroll-track");
const thumb = document.querySelector(".scroll-thumb");

if (track && thumb) {
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  const allowTouchScrollbar =
    document.body && document.body.classList.contains("home-body");

  if (!isFinePointer && !allowTouchScrollbar) {
    const indicator = document.querySelector(".scroll-indicator");
    if (indicator) indicator.style.display = "none";
  } else {
    const doc = document.documentElement;
    let rafId = 0;
    let maxScroll = 1;
    let maxThumbTop = 1;

    function renderThumb() {
      rafId = 0;
      if (document.visibilityState !== "visible") return;
      maxScroll = Math.max(1, doc.scrollHeight - doc.clientHeight);
      const y = ((window.pageYOffset || doc.scrollTop || 0) / maxScroll) * maxThumbTop;
      thumb.style.transform = `translateY(${y}px)`;
    }

    function scheduleThumbSync() {
      if (rafId) return;
      rafId = window.requestAnimationFrame(renderThumb);
    }

    window.addEventListener("scroll", scheduleThumbSync, { passive: true });
  }
}
```

This script keeps visual behavior synchronized with page state while remaining defensive and reusable across all pages.

--- 

### Contact Form Workflow

The contact page uses a lightweight client-side workflow for sending inquiries through Formspree. JavaScript handles formatting and submission behavior without reloading the page.

### Contact form goals

- Keep the form simple and readable
- Normalize phone numbers as users type
- Generate a useful email subject automatically
- Submit asynchronously
- Replace the form in place with a confirmation message on success

### Example: phone formatting (`contact.html`)

```html
<script>
  phoneInput.addEventListener("input", (e) => {
    let digits = e.target.value.replace(/\D/g, "");

    if (digits.length === 11 && digits.startsWith("1")) {
      digits = digits.slice(1);
    }

    digits = digits.slice(0, 10);

    let formatted = "";

    if (digits.length > 0) formatted = "(" + digits.slice(0, 3);
    if (digits.length >= 4) formatted += ") " + digits.slice(3, 6);
    if (digits.length >= 7) formatted += "-" + digits.slice(6);

    e.target.value = formatted;
  });
</script>
```
### Example: async submission + inline success state (`contact.html`)

```html
<script>
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    sendBtn.disabled = true;
    sendBtn.style.opacity = "0.6";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error("submit failed");

      rightCol.innerHTML = `
        <p class="contact-thanks accent-font">
          thanks, i'll do my best to respond promptly!
        </p>
      `;
    } catch (err) {
      sendBtn.disabled = false;
      sendBtn.style.opacity = "0.85";
      alert("Something went wrong. Please try again.");
    }
  });
</script>
```

This keeps the workflow fast and understandable while still giving the user immediate feedback.

---

## Performance & Mobile Optimization (Current Iteration)

The current repo iteration includes several optimizations to improve loading behavior, scrolling smoothness, and mobile presentation without changing the site’s visual style.

### Performance improvements

- Image dimension attributes added to reduce layout shift
- `decoding="async"` and `fetchpriority="high"` for the homepage hero image
- `loading="lazy"` on the YouTube iframe
- `defer` on shared script loading
- `preload` for the self-hosted accent font
- `preconnect` for YouTube and Formspree
- Custom scrollbar JS updated for smoother scroll sync and lower overhead
- Lossless JPEG optimization on large image assets

### Mobile / iPhone refinements

- `viewport-fit=cover` added to support full-screen layouts on iPhones
- Safe-area inset padding used for top/right/bottom spacing
- `100dvh` added alongside `100vh` for mobile browser UI changes
- Mobile YouTube embed width slightly condensed (`92vw`) rather than edge-to-edge
- Custom scrollbar remains visible on the home page on touch devices

### Example: mobile-safe viewport meta (`index.html`)

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, viewport-fit=cover"
/>
```

These changes preserve the original visual design while improving perceived polish and device compatibility.

---

## tl;dr

Sunny Pavel Artist Page is a custom-built static promotional website developed as a second major web project, with an emphasis on visual design, layered layout behavior, typography, and lightweight interaction design. Built with vanilla HTML, CSS, and JavaScript, the site uses a sticky hero homepage, a custom scrollbar, and a Formspree-powered contact flow, while the current iteration adds smoothness, subtle motion, and mobile-safe refinements for modern iPhones.




