const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll('a[href^="#"]')];
const header = document.querySelector(".site-header");
let lockedScrollY = 0;

function closeMenu() {
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.querySelector(".sr-only") && (menuButton.querySelector(".sr-only").textContent = "Open navigation");
  navigation?.classList.remove("open");
  document.body.classList.remove("menu-open");
  document.body.style.top = "";
  window.scrollTo(0, lockedScrollY);
}

function openMenu() {
  lockedScrollY = window.scrollY;
  menuButton?.setAttribute("aria-expanded", "true");
  menuButton?.querySelector(".sr-only") && (menuButton.querySelector(".sr-only").textContent = "Close navigation");
  document.body.style.top = `-${lockedScrollY}px`;
  navigation?.classList.add("open");
  document.body.classList.add("menu-open");
}

function scrollToTarget(hash) {
  const target = hash === "#" ? document.querySelector("#main") : document.querySelector(hash);
  if (!target) return false;

  const headerOffset = (header?.offsetHeight || 0) + 18;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
  history.pushState(null, "", hash === "#" ? "#main" : hash);
  return true;
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href.length <= 1) return;
    event.preventDefault();
    const wasOpen = menuButton?.getAttribute("aria-expanded") === "true";
    if (wasOpen) {
      closeMenu();
      window.requestAnimationFrame(() => scrollToTarget(href));
    } else {
      scrollToTarget(href);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));

const lab = document.querySelector(".market-lab");
document.querySelector(".lab-pulse")?.addEventListener("click", () => {
  if (!lab) return;
  lab.classList.remove("is-shifting");
  void lab.offsetWidth;
  lab.classList.add("is-shifting");
});

const priceRange = document.querySelector("#price-range");
const priceDisplay = document.querySelector("#price-display");
const demandOutput = document.querySelector("#demand-output");
const revenueOutput = document.querySelector("#revenue-output");
const profitOutput = document.querySelector("#profit-output");
const buyersCount = document.querySelector("#buyers-count");
const feedbackIcon = document.querySelector("#feedback-icon");
const feedbackTitle = document.querySelector("#feedback-title");
const feedbackCopy = document.querySelector("#feedback-copy");
const buyerDots = document.querySelector("#buyer-dots");

if (buyerDots) {
  for (let i = 0; i < 100; i += 1) {
    const dot = document.createElement("i");
    buyerDots.appendChild(dot);
  }
}

function marketResponse(price) {
  if (!priceDisplay || !demandOutput || !revenueOutput || !profitOutput || !buyersCount || !buyerDots || !feedbackIcon || !feedbackTitle || !feedbackCopy) return;

  const demand = Math.max(6, Math.round(100 - (price - 5) * 6.4));
  const sales = price * demand;
  const pressure = demand > 70 ? "High" : demand > 35 ? "Medium" : "Low";

  priceDisplay.textContent = `$${price}`;
  demandOutput.textContent = demand;
  revenueOutput.textContent = `$${sales}`;
  profitOutput.textContent = pressure;
  buyersCount.textContent = demand;

  buyerDots.querySelectorAll("i").forEach((dot, index) => {
    dot.classList.toggle("active", index < demand);
  });

  if (price <= 7) {
    feedbackIcon.textContent = "↑";
    feedbackTitle.textContent = "The line is huge";
    feedbackCopy.textContent = "A low price attracts many buyers. When lots of people want a limited item, sellers may raise the price.";
  } else if (price <= 11) {
    feedbackIcon.textContent = "↗";
    feedbackTitle.textContent = "Demand is strong";
    feedbackCopy.textContent = "Many buyers still want the limited drop. This is the supply-and-demand story from the sneaker example.";
  } else if (price <= 15) {
    feedbackIcon.textContent = "≈";
    feedbackTitle.textContent = "Some buyers leave";
    feedbackCopy.textContent = "As the price rises, fewer people stay in line. Price changes when buyers and sellers react.";
  } else {
    feedbackIcon.textContent = "↓";
    feedbackTitle.textContent = "Buyers pull back";
    feedbackCopy.textContent = "At a high price, many buyers walk away. If demand drops, the price can fall too.";
  }
}

priceRange?.addEventListener("input", (event) => marketResponse(Number(event.target.value)));
marketResponse(Number(priceRange?.value || 10));

const sectionTargets = [...document.querySelectorAll("main section[id], footer[id]")];
const sectionObserver = new IntersectionObserver((entries) => {
  const visibleEntry = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visibleEntry) return;
  const activeId = visibleEntry.target.id;

  document.querySelectorAll(".main-nav a").forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}, { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] });

sectionTargets.forEach((section) => sectionObserver.observe(section));

