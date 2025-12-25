# Sunny Pavel Artist Page

This project is a custom-built promotional website for musician Sunny Pavel. The site serves as a central hub for showcasing music, sharing background information, and providing clear contact pathways, all within a visually driven, minimalist design. The site is fully static and intentionally lightweight, with styling and interaction handled through handcrafted HTML, CSS, and JavaScript.

This was the second website I've ever developed, and I approached it as an opportunity to go deeper into the stylistic side of front-end development. Rather than focusing on accessibility tooling or backend systems, this project was an exercise in layout control, visual hierarchy, typography, and subtle interaction design.

All HTML, CSS, and JavaScript was written manually without frameworks.

---

## Project Approach

Unlike my first site, which prioritized data flow and admin control, this project was built from the outside in. The primary goal was to explore how far expressive design could be pushed using only core web technologies, while still maintaining a clean and navigable structure.

JavaScript is used sparingly and intentionally, not to manage data, but to enforce visual behaviors, synchronize UI elements, and support custom interactions that CSS alone could not easily achieve.

---

## HTML Development

The site’s HTML is organized as a set of clearly separated pages (index.html, about.html, music.html, contact.html, and merch.html), each following a consistent structural pattern. Markup is intentionally kept minimal and semantic, allowing styling and JavaScript-driven behavior to define most of the user experience rather than heavy DOM structure.

On the homepage, the HTML introduces a layered layout built around a full-viewport hero section. The hero uses a fixed, full-screen image as a visual anchor, with the primary navigation and title overlaid on top. This hero remains visually dominant as the user begins to scroll, creating the feeling of a static entry point rather than a traditional top-of-page layout.

As the user scrolls, the page transitions into a second full-height section that acts like a transparent “second page.” This section overlays the hero image with a semi-opaque background and hosts a promotional video, allowing the content to feel connected to the landing experience rather than segmented into a new page. Structurally, this behavior is achieved by stacking sections vertically and allowing CSS to control how they interact during scroll.

Navigation and layout remain simple at the markup level, with predictable containers and IDs that allow styling and interaction logic to stay flexible. This consistency made it easier to experiment with layered scrolling, full-screen sections, and visual transitions without rewriting the core HTML structure.

#### from `index.html`:

```html
<section class="hero" aria-hidden="true">
  <img src="images/bg.jpg" alt="" class="fullscreen-image hero-image" />
</section>

<div class="overlay-content">
  <h1 class="site-title accent-font">sunny pavel</h1>

  <nav class="site-nav">
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
  </div>
</section>
```

This structure allowed the homepage to behave more like a continuous visual experience than a traditional scrollable document, while keeping the underlying HTML straightforward and easy to reason about.

---

## CSS Development

Styling is centralized in a single styles.css file and organized by page context using body-level classes (for example: .about-body, .music-body, and .contact-body). This structure allows each page to maintain a distinct visual identity while still sharing global typography rules, spacing conventions, and reusable components.

A significant portion of the design exploration focused on layered layouts and scroll-based visual behavior. On the homepage, CSS is used to control how the hero image, overlaid navigation, and the semi-opaque “second page” interact as the user scrolls. Rather than introducing new routes or hard transitions, opacity, positioning, and stacking order are used to create the feeling of moving through multiple visual states within a single page.

A custom scroll indicator replaces the native browser scrollbar, reinforcing the site’s minimal aesthetic and visually tying scroll progress into the overall design language, with its interaction logic handled separately in JavaScript.

Visual experimentation throughout the site emphasized:

	•	Full-viewport sections and fixed-position elements
	•	Layered content using opacity and z-index
	•	Strong typographic contrast through custom fonts and letter spacing
	•	Page-specific color palettes that shift mood between sections
	•	Smooth hover states and subtle transitions

Custom fonts are self-hosted and imported directly into the stylesheet, allowing tighter control over loading behavior and typography consistency across pages. Colors are defined as CSS variables, making it easy to iterate on palettes while keeping contrast and visual balance consistent.

Rather than relying on a CSS framework, all layout decisions were handled manually. This reinforced an understanding of modern CSS concepts such as positioning, stacking contexts, scroll behavior, and responsive scaling, while keeping the design flexible enough to support ongoing visual iteration.

#### from `styles.css` (layered scroll styling):

```css
.hero {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}

.hero-cover {
  height: 100vh;
  background-color: rgba(11, 28, 45, 0.9);
  position: relative;
  z-index: 3;
}
```

This approach allowed visual transitions to emerge naturally from layout and scroll behavior, rather than being driven by explicit animation scripts.

---

## Javascript Development

JavaScript is used to reinforce the site’s visual language rather than drive application state. The most prominent example is the custom scrollbar, which replaces the browser’s native scrollbar with a stylized, draggable indicator that spans the full height of the viewport.

The scrollbar logic tracks document scroll position, maps it to a visual thumb position, and supports both dragging and click-to-jump behavior. This served as an experiment in translating page state into a custom visual control, rather than relying on default browser UI. The logic adapts dynamically to different page lengths, ensuring consistent behavior across pages with varying amounts of content.

JavaScript is also used to keep UI elements synchronized with scroll position and to conditionally enable interactions only when the relevant DOM elements are present. All interaction logic lives in a single script.js file and runs defensively so pages without certain components are unaffected.

### from `script.js` (scroll syncing):

```js
window.addEventListener("scroll", () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const y = (window.scrollY / maxScroll) * maxThumbTop;
  thumb.style.transform = `translateY(${y}px)`;
});
```
This approach allowed me to explore advanced visual behavior while keeping the overall codebase simple and maintainable.

--- 

## Contact Form Workflow

The contact page uses a controlled submission flow that sends structured messages directly to email while keeping the experience simple and predictable for the user. All input handling and validation happens on the client side, which allows the form to respond immediately without requiring a page reload or exposing any underlying implementation details.

Phone number handling was designed to account for the many ways users enter or autofill contact information. Input is normalized in real time by removing non-numeric characters, accounting for optional country codes, and reformatting the value into a consistent and readable structure before submission. This ensures the data that reaches email remains clean and usable regardless of how it was entered.

#### from `contact.html`:

```js
phoneInput.addEventListener("input", (e) => {
  let digits = e.target.value.replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 10);

  let formatted = "";
  if (digits.length > 0) formatted = "(" + digits.slice(0, 3);
  if (digits.length >= 4) formatted += ") " + digits.slice(3, 6);
  if (digits.length >= 7) formatted += "-" + digits.slice(6, 10);

  e.target.value = formatted;
});
```

After a successful submission, the form is replaced in place with a confirmation message rather than navigating away from the page. This allowed me to explore how JavaScript can manage user feedback and interface state changes in a lightweight way while keeping the interaction uninterrupted.

#### from `contact.html`:

```js
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  sendBtn.disabled = true;
  sendBtn.style.opacity = "0.6";

  const formData = new FormData(form);

  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error("Submission failed");

    rightColumn.innerHTML = `
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
```

This approach ensures consistent formatting at the point of entry and prevents malformed data from being submitted, while keeping the logic simple and easy to maintain.

---

## tl;dr

This site is a custom-built artist website developed as a second major web project, with an emphasis on visual design and interaction rather than accessibility constraints. Built using vanilla HTML, CSS, and JavaScript, it explores layered layouts, scroll-based visual behavior, and custom UI elements such as a stylized scrollbar. JavaScript is used to support these visual experiments while also handling practical workflows like controlled form submission and user feedback. The project served as an opportunity to deepen my understanding of front-end structure, styling systems, and interaction-driven design.








