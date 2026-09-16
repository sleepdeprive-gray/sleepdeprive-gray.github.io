const root = document.documentElement;
const header = document.querySelector("[data-header]");
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
  .map((link) => {
    const href = link.getAttribute("href");
    return href && href.startsWith("#") ? document.querySelector(href) : null;
  })
  .filter(Boolean);

// --- Terminal State & Controls ---
let commandHistoryList = [];
let historyCursor = -1;

const openCli = () => {
  if (!cliPanel) return;
  cliPanel.hidden = false;
  cliPanel.removeAttribute("hidden");
  cliToggle?.setAttribute("aria-expanded", "true");
  cliToggle?.classList.add("is-active");
  window.setTimeout(() => {
    commandInput?.focus();
  }, 60);
};

const closeCli = () => {
  if (!cliPanel) return;
  cliPanel.hidden = true;
  cliPanel.setAttribute("hidden", "");
  cliToggle?.setAttribute("aria-expanded", "false");
  cliToggle?.classList.remove("is-active");
};

const toggleCli = () => {
  if (!cliPanel) return;
  const isHidden = cliPanel.hidden || cliPanel.hasAttribute("hidden");
  if (isHidden) {
    openCli();
  } else {
    closeCli();
  }
};

cliToggle?.addEventListener("click", (e) => {
  e.preventDefault();
  toggleCli();
});

cliClose?.addEventListener("click", (e) => {
  e.preventDefault();
  closeCli();
});

// Keyboard shortcut: Press ` (backtick) anywhere to open/close shell, Esc to close
window.addEventListener("keydown", (e) => {
  if (e.key === "`" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
    e.preventDefault();
    toggleCli();
  } else if (e.key === "Escape" && cliPanel && (!cliPanel.hidden && !cliPanel.hasAttribute("hidden"))) {
    closeCli();
  }
});

// History navigation (Up / Down) and tab completion on input
commandInput?.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (commandHistoryList.length === 0) return;
    if (historyCursor === -1) {
      historyCursor = commandHistoryList.length - 1;
    } else if (historyCursor > 0) {
      historyCursor -= 1;
    }
    commandInput.value = commandHistoryList[historyCursor] || "";
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyCursor !== -1) {
      if (historyCursor < commandHistoryList.length - 1) {
        historyCursor += 1;
        commandInput.value = commandHistoryList[historyCursor] || "";
      } else {
        historyCursor = -1;
        commandInput.value = "";
      }
    }
  } else if (e.key === "Tab") {
    e.preventDefault();
    const current = commandInput.value.trim().toLowerCase();
    if (!current) return;
    const available = [
      "help",
      "stack",
      "skills",
      "pm",
      "leadership",
      "management",
      "projects",
      "experience",
      "contact",
      "email",
      "whatsapp",
      "whoami",
      "clear",
      "exit",
      "ls",
      "github",
      "linkedin"
    ];
    const match = available.find((cmd) => cmd.startsWith(current));
    if (match) {
      commandInput.value = match;
    }
  }
});

const scrollToTarget = (targetSelector) => {
  const target = document.querySelector(targetSelector);
  if (!target) return;
  const headerOffset = header ? header.offsetHeight + 24 : 24;
  const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top: targetPosition, behavior: "smooth" });
};

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

// Available Shell Commands
const commands = {
  stack: {
    target: "#stack",
    output: "opening ./stack — technical stack and competencies",
  },
  skills: {
    target: "#stack",
    output: "navigating to ./stack",
  },
  tech: {
    target: "#stack",
    output: "navigating to ./stack",
  },
  tools: {
    target: "#stack",
    output: "navigating to ./stack",
  },
  pm: {
    target: "#pm-competencies",
    output: "viewing ./pm-competencies.log — Leadership & Delivery Competencies",
  },
  leadership: {
    target: "#pm-competencies",
    output: "viewing ./pm-competencies.log",
  },
  management: {
    target: "#pm-competencies",
    output: "viewing ./pm-competencies.log",
  },
  competencies: {
    target: "#pm-competencies",
    output: "viewing ./pm-competencies.log",
  },
  projects: {
    target: "#projects",
    output: "listing ./projects — CSG-OITS, Artemis, iTrack Async, Nemo, Jobless",
  },
  work: {
    target: "#projects",
    output: "listing ./projects",
  },
  portfolio: {
    target: "#projects",
    output: "listing ./projects",
  },
  experience: {
    target: "#experience",
    output: "tailing experiences.log — milestone history & leadership roles",
  },
  experiences: {
    target: "#experience",
    output: "tailing experiences.log",
  },
  exp: {
    target: "#experience",
    output: "tailing experiences.log",
  },
  career: {
    target: "#experience",
    output: "tailing experiences.log",
  },
  timeline: {
    target: "#experience",
    output: "tailing experiences.log",
  },
  contact: {
    target: "#contact",
    output: "executing ./contact.sh — email: ayban.duran@gmail.com | status: available (full-time & contracts)",
  },
  "contact.sh": {
    target: "#contact",
    output: "executing ./contact.sh — email: ayban.duran@gmail.com | status: available (full-time & contracts)",
  },
  "./contact.sh": {
    target: "#contact",
    output: "executing ./contact.sh — email: ayban.duran@gmail.com | status: available (full-time & contracts)",
  },
  "./contact.sh --status=available": {
    target: "#contact",
    output: "executing ./contact.sh — status: available | channels: email, linkedin, github",
  },
  hire: {
    target: "#contact",
    output: "running ./contact.sh — open for full stack, backend & PM roles",
  },
  reach: {
    target: "#contact",
    output: "running ./contact.sh",
  },
  whoami: {
    target: "#home",
    output: "Ivan Parales Duran — Full stack developer & PM lead (Cum Laude, BS IT)",
  },
  about: {
    target: "#home",
    output: "Ivan Parales Duran — Full stack developer & PM lead",
  },
  bio: {
    target: "#home",
    output: "Ivan Parales Duran — Backend-focused full stack developer & project manager",
  },
  email: {
    output: "ayban.duran@gmail.com (launching mail client)",
    action: async () => {
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText("ayban.duran@gmail.com");
        } catch (_) {}
      }
      window.location.href = "mailto:ayban.duran@gmail.com";
    },
  },
  mail: {
    output: "launching mail client (ayban.duran@gmail.com)",
    action: () => {
      window.location.href = "mailto:ayban.duran@gmail.com";
    },
  },
  whatsapp: {
    output: "opening WhatsApp chat (+639919048089)",
    action: () => {
      window.open("https://wa.me/639919048089", "_blank");
    },
  },
  wa: {
    output: "opening WhatsApp chat (+639919048089)",
    action: () => {
      window.open("https://wa.me/639919048089", "_blank");
    },
  },
  ls: {
    output: "drwx ./stack  drwx ./pm-competencies  drwx ./projects  -rw- experiences.log  -rwx contact.sh",
  },
  dir: {
    output: "drwx ./stack  drwx ./pm-competencies  drwx ./projects  -rw- experiences.log  -rwx contact.sh",
  },
  cat: {
    output: "usage: cat [pm-competencies.log | experiences.log | leadership.md]",
  },
  "cat ./pm-competencies.log": {
    target: "#pm-competencies",
    output: "Loaded 4 core PM pillars: Agile Roadmapping, Technical PRDs, QA & Code Review, Cross-Functional Alignment",
  },
  "cat pm-competencies.log": {
    target: "#pm-competencies",
    output: "Loaded 4 core PM pillars: Agile Roadmapping, Technical PRDs, QA & Code Review, Cross-Functional Alignment",
  },
  "cat experiences.log": {
    target: "#experience",
    output: "2022-2026: BS IT (Cum Laude) | Nov 2025-Sep 2026: Project Head (OITS) | Mar-May 2026: Full Stack Intern",
  },
  "cat leadership.md": {
    target: "#pm-competencies",
    output: "Bridging technical architecture and project execution to deliver maintainable software on schedule.",
  },
  github: {
    output: "opening https://github.com/sleepdeprive-gray",
    action: () => {
      window.open("https://github.com/sleepdeprive-gray", "_blank");
    },
  },
  git: {
    output: "opening https://github.com/sleepdeprive-gray",
    action: () => {
      window.open("https://github.com/sleepdeprive-gray", "_blank");
    },
  },
  linkedin: {
    output: "opening https://www.linkedin.com/in/duran-ivan/",
    action: () => {
      window.open("https://www.linkedin.com/in/duran-ivan/", "_blank");
    },
  },
  date: {
    output: `system time: ${new Date().toLocaleString()}`,
  },
  time: {
    output: `system time: ${new Date().toLocaleTimeString()}`,
  },
  sudo: {
    output: "Permission granted: you are already in guest superuser mode :)",
  },
  clear: {
    output: "",
    action: () => {
      commandHistory?.replaceChildren();
    },
  },
  cls: {
    output: "",
    action: () => {
      commandHistory?.replaceChildren();
    },
  },
  exit: {
    output: "closing shell",
    action: () => {
      window.setTimeout(closeCli, 280);
    },
  },
  close: {
    output: "closing shell",
    action: () => {
      window.setTimeout(closeCli, 280);
    },
  },
  quit: {
    output: "closing shell",
    action: () => {
      window.setTimeout(closeCli, 280);
    },
  },
  help: {
    output: "commands: stack, pm, projects, experience, contact, whoami, email, github, linkedin, ls, clear, exit",
  },
  "?": {
    output: "commands: stack, pm, projects, experience, contact, whoami, email, github, linkedin, ls, clear, exit",
  },
};

const executeCommand = (rawInput) => {
  const rawCommand = rawInput.trim();
  if (!rawCommand) return;

  const normalized = rawCommand.toLowerCase();
  commandHistoryList.push(rawCommand);
  historyCursor = -1;

  appendHistory(`$ ${rawCommand}`, true);

  if (commandInput) {
    commandInput.value = "";
  }

  const command = commands[normalized] || commands[normalized.replace(/^\.\//, "")];

  if (!command) {
    appendHistory(`command not found: ${rawCommand}. Type "help" for available commands.`);
    if (commandStatus) commandStatus.textContent = "error";
    window.setTimeout(() => {
      if (commandStatus) commandStatus.textContent = "idle";
    }, 1200);
    return;
  }

  if (commandStatus) commandStatus.textContent = "running";

  try {
    command.action?.();
  } catch (err) {
    console.error("Command error:", err);
  }

  if (command.output) {
    appendHistory(command.output);
  }

  if (command.target) {
    scrollToTarget(command.target);
  }

  window.setTimeout(() => {
    if (commandStatus) commandStatus.textContent = "idle";
  }, 400);
};

commandForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!commandInput) return;
  executeCommand(commandInput.value);
});

// Allow clicking on any prompt across the site (e.g. $ whoami, $ cat ./pm-competencies.log)
document.querySelectorAll("[data-exec]").forEach((el) => {
  el.setAttribute("title", "Click to run in terminal");
  el.addEventListener("click", () => {
    const cmd = el.getAttribute("data-exec");
    if (cmd) {
      openCli();
      executeCommand(cmd);
    }
  });
});

// Copy Email Button
copyButton?.addEventListener("click", async () => {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText("ayban.duran@gmail.com");
    } catch (_) {}
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

// Dynamic year in footer
if (year) {
  year.textContent = new Date().getFullYear();
}

root.dataset.theme = "dark";

// Active Nav Link Spy
const setActiveLink = () => {
  const headerOffset = header ? header.offsetHeight + 40 : 40;
  const currentScroll = window.scrollY;

  let currentSection = null;
  for (const section of sections) {
    const top = section.getBoundingClientRect().top + window.scrollY;
    if (top - headerOffset <= currentScroll) {
      currentSection = section;
    }
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle(
      "is-active",
      Boolean(currentSection && href === `#${currentSection.id}`)
    );
  });
};

setActiveLink();
window.addEventListener("scroll", setActiveLink, { passive: true });
