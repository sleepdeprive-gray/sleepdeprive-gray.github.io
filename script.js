const root = document.documentElement;
const header = document.querySelector("[data-header]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const copyButton = document.querySelector("[data-copy-email]");
const copyButtonLabel = document.querySelector("[data-copy-email-label]");
const year = document.querySelector("[data-year]");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const commandForm = document.querySelector("[data-command-form]");
const commandInput = commandForm?.querySelector("input");
const commandHistory = document.querySelector("[data-shell-history]");
const commandStatus = document.querySelector("[data-command-status]");

const cliPanel = document.querySelector("[data-cli-panel]");
const cliToggle = document.querySelector("[data-cli-toggle]");
const cliClose = document.querySelector("[data-cli-close]");

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const openCli = () => {
  if (!cliPanel) return;
  cliPanel.hidden = false;
  cliToggle?.setAttribute("aria-expanded", "true");
  cliToggle?.classList.add("is-active");
  commandInput?.focus();
};

const closeCli = () => {
  if (!cliPanel) return;
  cliPanel.hidden = true;
  cliToggle?.setAttribute("aria-expanded", "false");
  cliToggle?.classList.remove("is-active");
};

const toggleCli = () => {
  if (!cliPanel) return;
  if (cliPanel.hidden) {
    openCli();
  } else {
    closeCli();
  }
};

cliToggle?.addEventListener("click", toggleCli);
cliClose?.addEventListener("click", closeCli);

// Keyboard shortcut: Press ` (backtick) anywhere to open/close shell, Esc to close
window.addEventListener("keydown", (e) => {
  if (e.key === "`" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
    e.preventDefault();
    toggleCli();
  } else if (e.key === "Escape" && cliPanel && !cliPanel.hidden) {
    closeCli();
  }
});

const commands = {
  stack: {
    target: "#stack",
    output: "opening ./stack",
  },
  work: {
    target: "#stack",
    output: "opening ./stack",
  },
  projects: {
    target: "#projects",
    output: "listing ./projects",
  },
  experience: {
    target: "#experience",
    output: "tailing experiences.log",
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
  clear: {
    output: "",
    action: () => {
      commandHistory?.replaceChildren();
    },
  },
  exit: {
    output: "closing shell",
    action: () => {
      window.setTimeout(closeCli, 350);
    },
  },
  close: {
    output: "closing shell",
    action: () => {
      window.setTimeout(closeCli, 350);
    },
  },
  help: {
    output: "commands: stack, projects, experience, contact, email, clear, exit",
  },
};

if (year) {
  year.textContent = new Date().getFullYear();
}

const savedTheme = localStorage.getItem("portfolio-theme");
root.dataset.theme = savedTheme || "dark";

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
});

copyButton?.addEventListener("click", async () => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText("ayban.duran@gmail.com");
  }

  if (copyButtonLabel) {
    copyButtonLabel.textContent = "copied email";
  }
  window.setTimeout(() => {
    if (copyButtonLabel) {
      copyButtonLabel.textContent = "copy email";
    }
  }, 1400);
});

const appendHistory = (text, muted = false) => {
  if (!commandHistory) return;
  const line = document.createElement("p");
  if (muted) {
    line.className = "muted";
  }
  line.textContent = text;
  commandHistory.append(line);
  commandHistory.scrollTop = commandHistory.scrollHeight;
};

commandForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!commandInput) return;
  const rawCommand = commandInput.value.trim().toLowerCase();
  if (!rawCommand) {
    return;
  }

  const command = commands[rawCommand];
  appendHistory(`$ ${rawCommand}`, true);
  commandInput.value = "";

  if (!command) {
    appendHistory(`command not found: ${rawCommand}`);
    if (commandStatus) commandStatus.textContent = "error";
    return;
  }

  if (commandStatus) commandStatus.textContent = "running";
  command.action?.();

  if (command.output) {
    appendHistory(command.output);
  }

  if (command.target) {
    document.querySelector(command.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  window.setTimeout(() => {
    if (commandStatus) commandStatus.textContent = "idle";
  }, 500);
});

const setActiveLink = () => {
  const offset = header ? header.offsetHeight + 32 : 32;
  const current = sections.reduce((activeSection, section) => {
    return section && section.offsetTop - offset <= window.scrollY ? section : activeSection;
  }, null);

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", current && link.getAttribute("href") === `#${current.id}`);
  });
};

setActiveLink();
window.addEventListener("scroll", setActiveLink, { passive: true });
