/* ==========================================================================
   Ivan Parales Duran Portfolio — Script & Interactive Controls
   Multi-page Navigation, Left-Stuck Tabs & Theme Toggle Persistence
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  // --- DOM Elements ---
  const sideNavDock = document.querySelector("[data-side-nav]");
  const sideNavItems = Array.from(document.querySelectorAll(".side-nav-item"));
  const themeToggleBtn = document.querySelector("[data-theme-toggle]");
  const yearElement = document.querySelector("[data-year]");

  // 1. Dynamic Year Update
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Global Theme Persistence & Sync (Default Night/Dark Mode)
  const applyTheme = (theme) => {
    const activeTheme = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", activeTheme);
  };

  const savedTheme = localStorage.getItem("ivan_portfolio_theme") || "dark";
  applyTheme(savedTheme);

  themeToggleBtn?.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("ivan_portfolio_theme", nextTheme);
  });

  // Cross-Tab / Window Real-time Synchronization
  window.addEventListener("storage", (e) => {
    if (e.key === "ivan_portfolio_theme" && e.newValue) {
      applyTheme(e.newValue);
    }
  });

  // 3. Multi-Page Active Nav Tab Determination
  const currentPath = window.location.pathname.toLowerCase();
  
  let activePageKey = "home";
  if (currentPath.includes("web-development")) {
    activePageKey = "web-development";
  } else if (currentPath.includes("software-development")) {
    activePageKey = "software-development";
  } else if (currentPath.includes("project-management")) {
    activePageKey = "project-management";
  } else if (currentPath.includes("sales-marketing")) {
    activePageKey = "sales-marketing";
  } else {
    activePageKey = "home";
  }

  sideNavItems.forEach((item) => {
    const pageAttr = item.getAttribute("data-page");
    if (pageAttr === activePageKey) {
      item.classList.add("is-active");
    } else {
      item.classList.remove("is-active");
    }
  });

  // 4. Responsive label box width based on exact rendered label length
  const computeNavTabWidths = () => {
    sideNavItems.forEach((item) => {
      const label = item.querySelector(".nav-label");
      if (!label) return;

      const span = document.createElement("span");
      span.style.font = window.getComputedStyle(label).font;
      span.style.visibility = "hidden";
      span.style.position = "absolute";
      span.style.whiteSpace = "nowrap";
      span.textContent = label.textContent;
      document.body.appendChild(span);
      const textWidth = span.getBoundingClientRect().width;
      document.body.removeChild(span);

      // Snug fit: 14px left pad + 22px icon + 14px gap + textWidth + 14px gap + 10px arrow + 16px right pad
      const responsiveWidth = Math.ceil(14 + 22 + 14 + textWidth + 14 + 10 + 16);
      item.style.setProperty("--tab-expanded-width", `${responsiveWidth}px`);
    });
  };

  computeNavTabWidths();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(computeNavTabWidths);
  }
});
