const root = document.documentElement;
const header = document.querySelector("[data-header]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const copyButton = document.querySelector("[data-copy-email]");
const year = document.querySelector("[data-year]");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const commandForm = document.querySelector("[data-command-form]");
const commandInput = commandForm.querySelector("input");
const commandHistory = document.querySelector("[data-shell-history]");
const commandStatus = document.querySelector("[data-command-status]");
const secretModal = document.querySelector("[data-secret-modal]");
const secretClose = document.querySelector("[data-secret-close]");
const secretCountdown = document.querySelector("[data-secret-countdown]");
const secretCountdownText = document.querySelector("[data-secret-countdown-text]");
const secretImage = document.querySelector("[data-secret-image]");
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const secretImageUrl = "https://media1.tenor.com/m/zcECT7bfjk8AAAAd/hello-lizard.gif";
let secretTimer = null;

const closeSecretModal = () => {
  secretModal.hidden = true;
  if (secretTimer) {
    window.clearInterval(secretTimer);
    secretTimer = null;
  }
};

const openSecretModal = () => {
  let remaining = 10;
  secretImage.src = secretImageUrl;
  secretModal.hidden = false;
  secretCountdown.textContent = remaining;
  secretCountdownText.textContent = remaining;

  if (secretTimer) {
    window.clearInterval(secretTimer);
  }

  secretTimer = window.setInterval(() => {
    remaining -= 1;
    secretCountdown.textContent = remaining;
    secretCountdownText.textContent = remaining;

    if (remaining <= 0) {
      closeSecretModal();
    }
  }, 1000);
};

const commands = {
  work: {
    target: "#work",
    output: "opening ./stack",
  },
  projects: {
    target: "#projects",
    output: "listing ./projects",
  },
  process: {
    target: "#process",
    output: "printing process.md",
  },
  experience: {
    target: "#experience",
    output: "tailing experience.log",
  },
  contact: {
    target: "#contact",
    output: "running contact.sh",
  },
  email: {
    output: "launching mail client",
    action: () => {
      window.location.href = "mailto:ayban.duran@gmail.com";
    },
  },
  eyah: {
    output: "secret unlocked",
    action: openSecretModal,
  },
  clear: {
    output: "",
    action: () => {
      commandHistory.replaceChildren();
    },
  },
  help: {
    output: "commands: work, projects, process, experience, contact, email, clear",
  },
};

year.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem("portfolio-theme");
root.dataset.theme = savedTheme || "dark";

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
});

secretClose.addEventListener("click", closeSecretModal);

copyButton.addEventListener("click", async () => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText("ayban.duran@gmail.com");
  }

  copyButton.textContent = "copied";
  window.setTimeout(() => {
    copyButton.textContent = "copy";
  }, 1400);
});

const appendHistory = (text, muted = false) => {
  const line = document.createElement("p");
  if (muted) {
    line.className = "muted";
  }
  line.textContent = text;
  commandHistory.append(line);
  commandHistory.scrollTop = commandHistory.scrollHeight;
};

commandForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const rawCommand = commandInput.value.trim().toLowerCase();
  if (!rawCommand) {
    return;
  }

  const command = commands[rawCommand];
  appendHistory(`$ ${rawCommand}`, true);
  commandInput.value = "";

  if (!command) {
    appendHistory(`command not found: ${rawCommand}`);
    commandStatus.textContent = "error";
    return;
  }

  commandStatus.textContent = "running";
  command.action?.();

  if (command.output) {
    appendHistory(command.output);
  }

  if (command.target) {
    document.querySelector(command.target).scrollIntoView({ behavior: "smooth", block: "start" });
  }

  window.setTimeout(() => {
    commandStatus.textContent = "idle";
  }, 500);
});

const setActiveLink = () => {
  const offset = header.offsetHeight + 32;
  const current = sections.reduce((activeSection, section) => {
    return section.offsetTop - offset <= window.scrollY ? section : activeSection;
  }, null);

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", current && link.getAttribute("href") === `#${current.id}`);
  });
};

setActiveLink();
window.addEventListener("scroll", setActiveLink, { passive: true });
