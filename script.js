// grab the custom scrollbar elements
const track = document.querySelector(".scroll-track");
const thumb = document.querySelector(".scroll-thumb");

// only run this if the scrollbar exists on the page
if (track && thumb) {
  let isDragging = false;
  let dragOffsetY = 0;

  // keeps a value between a min and max
  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  // get current scroll position + max scrollable distance
  function getDocScrollInfo() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight;
    const clientHeight = doc.clientHeight;
    const maxScroll = Math.max(1, scrollHeight - clientHeight);
    return { scrollTop, maxScroll };
  }

  // fixed thumb height for consistent feel
  function setThumbSize() {
    thumb.style.height = "67px";
  }

  // move the thumb when the page scrolls
  function syncThumbToScroll() {
    const { scrollTop, maxScroll } = getDocScrollInfo();
    const trackH = track.clientHeight;
    const thumbH = thumb.offsetHeight;
    const maxThumbTop = Math.max(1, trackH - thumbH);

    const y = (scrollTop / maxScroll) * maxThumbTop;
    thumb.style.transform = `translateY(${y}px)`;
  }

  // scroll the page when dragging or clicking the track
  function scrollToThumbPosition(clientY) {
    const rect = track.getBoundingClientRect();
    const trackY = clientY - rect.top;

    const trackH = track.clientHeight;
    const thumbH = thumb.offsetHeight;
    const maxThumbTop = Math.max(1, trackH - thumbH);

    const thumbTop = clamp(trackY - dragOffsetY, 0, maxThumbTop);
    const { maxScroll } = getDocScrollInfo();

    const scrollTop = (thumbTop / maxThumbTop) * maxScroll;
    window.scrollTo({ top: scrollTop, behavior: "auto" });
  }

  // clicking the track jumps the thumb
  track.addEventListener("pointerdown", (e) => {
    if (e.target === thumb) return;
    dragOffsetY = thumb.offsetHeight / 2;
    scrollToThumbPosition(e.clientY);
    e.preventDefault();
  });

  // start dragging the thumb
  thumb.addEventListener("pointerdown", (e) => {
    isDragging = true;
    thumb.setPointerCapture(e.pointerId);

    const thumbRect = thumb.getBoundingClientRect();
    dragOffsetY = e.clientY - thumbRect.top;
    e.preventDefault();
  });

  // move thumb while dragging
  window.addEventListener(
    "pointermove",
    (e) => {
      if (!isDragging) return;
      scrollToThumbPosition(e.clientY);
      e.preventDefault();
    },
    { passive: false }
  );

  // stop dragging
  window.addEventListener("pointerup", () => {
    isDragging = false;
  });

  // sync thumb when page scrolls normally
  window.addEventListener("scroll", syncThumbToScroll, { passive: true });

  // keep things in sync on resize
  window.addEventListener("resize", () => {
    setThumbSize();
    syncThumbToScroll();
  });

  // initial setup
  setThumbSize();
  syncThumbToScroll();
}