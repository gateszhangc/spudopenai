const topbar = document.querySelector("[data-topbar]");
const yearNode = document.querySelector("#current-year");
const revealNodes = document.querySelectorAll("[data-reveal]");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const handleScroll = () => {
  if (!topbar) return;
  topbar.classList.toggle("is-scrolled", window.scrollY > 12);
};

window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

