document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll("[data-reveal]");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const navigationLinks = [...document.querySelectorAll(".site-nav a")];
const observedSections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (observedSections.length) {
  const setActiveNavigation = (sectionId) => {
    navigationLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("is-active", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  const updateActiveNavigation = () => {
    const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 300);
    const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
    let currentSection = observedSections[0];

    observedSections.forEach((section) => {
      if (section.offsetTop <= marker) currentSection = section;
    });

    if (isAtBottom) currentSection = observedSections[observedSections.length - 1];
    setActiveNavigation(currentSection.id);
  };

  let navigationFrame = 0;
  const requestNavigationUpdate = () => {
    if (navigationFrame) return;
    navigationFrame = window.requestAnimationFrame(() => {
      navigationFrame = 0;
      updateActiveNavigation();
    });
  };

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => setActiveNavigation(link.hash.slice(1)));
  });

  window.addEventListener("scroll", requestNavigationUpdate, { passive: true });
  window.addEventListener("resize", requestNavigationUpdate);
  updateActiveNavigation();
}
