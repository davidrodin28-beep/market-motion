const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.querySelector(".sr-only").textContent = isOpen ? "Open navigation" : "Close navigation";
  navigation.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    navigation.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
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

for (let i = 0; i < 100; i += 1) {
  const dot = document.createElement("i");
  buyerDots?.appendChild(dot);
}

function marketResponse(price) {
  const demand = Math.max(6, Math.round(100 - (price - 5) * 6.4));
  const revenue = price * demand;
  const profit = (price - 4) * demand;

  priceDisplay.textContent = `$${price}`;
  demandOutput.textContent = demand;
  revenueOutput.textContent = `$${revenue}`;
  profitOutput.textContent = `$${profit}`;
  buyersCount.textContent = demand;

  buyerDots.querySelectorAll("i").forEach((dot, index) => {
    dot.classList.toggle("active", index < demand);
  });

  if (price <= 7) {
    feedbackIcon.textContent = "↑";
    feedbackTitle.textContent = "Selling fast";
    feedbackCopy.textContent = "Demand is huge, but your margin is slim. Could a slightly higher price earn more without losing too many buyers?";
  } else if (price <= 11) {
    feedbackIcon.textContent = "↗";
    feedbackTitle.textContent = "Strong demand";
    feedbackCopy.textContent = "Many buyers are interested. Try raising the price—will extra profit per bag make up for fewer sales?";
  } else if (price <= 15) {
    feedbackIcon.textContent = "≈";
    feedbackTitle.textContent = "Near the sweet spot";
    feedbackCopy.textContent = "Price and demand are finding a useful balance. Test nearby prices to see where profit reaches its peak.";
  } else {
    feedbackIcon.textContent = "↓";
    feedbackTitle.textContent = "Buyers pull back";
    feedbackCopy.textContent = "Each bag earns more, but many buyers walk away. A high price can shrink the market faster than you expect.";
  }
}

priceRange?.addEventListener("input", (event) => marketResponse(Number(event.target.value)));
marketResponse(Number(priceRange?.value || 10));

const audienceCopy = {
  students: "Students learn to spot patterns, explain their thinking, and make confident choices—even when there isn’t one perfect answer.",
  parents: "Parents see curiosity turn into practical judgment: asking sharper questions, reading evidence, and understanding the choices behind everyday prices.",
  schools: "Schools get a flexible, interdisciplinary program that makes mathematics meaningful and gives students a lively reason to collaborate."
};

document.querySelectorAll(".audience-tabs button").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".audience-tabs button").forEach((button) => button.setAttribute("aria-selected", "false"));
    tab.setAttribute("aria-selected", "true");
    document.querySelector("#audience-copy").textContent = audienceCopy[tab.dataset.audience];
  });
});

document.querySelector("#newsletter-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#email");
  const message = document.querySelector("#form-message");
  if (!email.checkValidity()) {
    email.reportValidity();
    return;
  }
  message.textContent = "You’re on the list. Keep asking good questions.";
  email.value = "";
});
