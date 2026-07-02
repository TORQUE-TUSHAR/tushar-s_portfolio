const root = document.documentElement;
    const year = document.getElementById("year");
    const nav = document.getElementById("navbar");
    const backTop = document.getElementById("backTop");
    const mobilePanel = document.getElementById("mobilePanel");
    const menuBtn = document.getElementById("menuBtn");
    const themeToggle = document.getElementById("themeToggle");
    const toast = document.getElementById("toast");
    const typed = document.getElementById("typed");
    const scrollProgress = document.getElementById("scrollProgress");

    year.textContent = new Date().getFullYear();

    let pointerFrame = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight * 0.2;
    window.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        root.style.setProperty("--mx", `${pointerX}px`);
        root.style.setProperty("--my", `${pointerY}px`);
        pointerFrame = 0;
      });
    }, { passive: true });

    const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
    root.dataset.theme = savedTheme;

    themeToggle.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("portfolio-theme", next);
      themeToggle.innerHTML = next === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    menuBtn.addEventListener("click", () => {
      mobilePanel.classList.toggle("open");
      menuBtn.innerHTML = mobilePanel.classList.contains("open") ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll(".mobile-panel a").forEach((link) => {
      link.addEventListener("click", () => {
        mobilePanel.classList.remove("open");
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });

    const sections = [...document.querySelectorAll("main section[id]")];
    const navLinks = [...document.querySelectorAll(".nav-links a")];
    let scrollFrame = 0;
    let scrollTimer = 0;

    function handleScroll() {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress.style.transform = `scaleX(${Math.min(1, scrollY / maxScroll)})`;
      nav.style.top = scrollY > 40 ? "10px" : "";
      backTop.classList.toggle("show", scrollY > 520);
      document.body.classList.add("is-scrolling");
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => document.body.classList.remove("is-scrolling"), 120);

      let current = sections[0];
      for (const section of sections) {
        if (scrollY + 150 >= section.offsetTop) current = section;
      }
      navLinks.forEach((link) => {
        link.classList.toggle("active", current && link.getAttribute("href") === `#${current.id}`);
      });
      scrollFrame = 0;
    }

    window.addEventListener("scroll", () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(handleScroll);
    }, { passive: true });

    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    function animateNumber(element, nextValue) {
      const end = Number(nextValue) || 0;
      const start = Number(element.textContent) || 0;
      const duration = 820;
      const started = performance.now();
      function tick(now) {
        const progress = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(start + (end - start) * eased);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    const phrases = [
      "Udhaar Setu",
      "Android interfaces",
      "Flutter app ideas",
      "Python automations",
      "data experiments"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const phrase = phrases[phraseIndex];
      typed.textContent = phrase.slice(0, charIndex);

      if (!deleting && charIndex < phrase.length) {
        charIndex += 1;
        setTimeout(typeLoop, 72);
        return;
      }

      if (!deleting && charIndex === phrase.length) {
        deleting = true;
        setTimeout(typeLoop, 1300);
        return;
      }

      if (deleting && charIndex > 0) {
        charIndex -= 1;
        setTimeout(typeLoop, 38);
        return;
      }

      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeLoop, 240);
    }
    typeLoop();

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13 });

    document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

    document.querySelectorAll(".magnetic").forEach((item) => {
      item.addEventListener("pointermove", (event) => {
        const rect = item.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        item.style.transform = `translate(${x * 0.1}px, ${y * 0.18}px)`;
      });
      item.addEventListener("pointerleave", () => {
        item.style.transform = "";
      });
    });

    const tiltCard = document.getElementById("tiltCard");
    let tiltFrame = 0;
    let tiltEvent = null;
    tiltCard.addEventListener("pointermove", (event) => {
      tiltEvent = event;
      if (tiltFrame) return;
      tiltFrame = requestAnimationFrame(() => {
      const rect = tiltCard.getBoundingClientRect();
      const x = (tiltEvent.clientX - rect.left) / rect.width - 0.5;
      const y = (tiltEvent.clientY - rect.top) / rect.height - 0.5;
      tiltCard.querySelector(".profile-card").style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-8px)`;
        tiltFrame = 0;
      });
    }, { passive: true });
    tiltCard.addEventListener("pointerleave", () => {
      tiltCard.querySelector(".profile-card").style.transform = "";
    });

    const langColors = {
      JavaScript: "#b8f7ff",
      Python: "#00e5ff",
      Dart: "#00e5ff",
      Kotlin: "#66f2ff",
      Java: "#b8f7ff",
      HTML: "#00e5ff",
      CSS: "#66f2ff",
      TypeScript: "#00e5ff",
      Shell: "#66f2ff",
      C: "#0f5f73",
      default: "#00e5ff"
    };

    const projectIcons = ["fa-mobile-screen", "fa-bolt", "fa-database", "fa-globe", "fa-code", "fa-wand-magic-sparkles"];

    const projectDetails = {
      udhaar_setu: {
        title: "Udhaar Setu",
        summary: "Digital khata and credit-management app for tracking lending, borrowing, customer balances, reminders, and transaction reports.",
        points: ["Digital ledger", "Debit/credit tracking", "Payment reminders", "PDF reports"],
        icon: "fa-bolt",
        priority: 1
      },
      "wish-you.in": {
        title: "Wish You.In",
        summary: "Personalized greeting-link web app for festivals, birthdays, and occasions, built for quick sharing with animated visual themes.",
        points: ["Custom links", "Greeting cards", "Viral sharing", "Client-side UI"],
        icon: "fa-wand-magic-sparkles",
        priority: 2
      },
      "o-aadhunikbazar": {
        title: "AadhunikBazar",
        summary: "Modern-market e-commerce project with product browsing, cart-style flows, category organization, and localized storefront ideas.",
        points: ["Product catalog", "Shopping flow", "Categories", "Responsive commerce"],
        icon: "fa-store",
        priority: 3
      },
      portfolio: {
        title: "Portfolio",
        summary: "Animated AMOLED portfolio website with liquid glass effects, GitHub-powered projects, smooth scrolling, and responsive sections.",
        points: ["Liquid glass", "GitHub API", "Responsive UI", "Smooth motion"],
        icon: "fa-id-card-clip",
        priority: 4
      },
      "python-assignment-1": {
        title: "Python Assignment 1",
        summary: "Python practice repository focused on fundamentals, structured problem solving, and clean beginner-friendly programming exercises.",
        points: ["Python basics", "Problem solving", "Assignments", "Practice code"],
        icon: "fa-code",
        priority: 5
      },
      "python-assignment-2": {
        title: "Python Assignment 2",
        summary: "Follow-up Python assignment repository extending practice with more exercises, logic building, and programming workflow familiarity.",
        points: ["Python logic", "Exercises", "Learning repo", "Code practice"],
        icon: "fa-terminal",
        priority: 6
      }
    };

    const fallbackProjectList = [
      {
        name: "Udhaar_Setu",
        description: projectDetails.udhaar_setu.summary,
        language: "Kotlin",
        stargazers_count: 1,
        forks_count: 0,
        updated_at: "2026-05-01T00:00:00Z",
        html_url: "https://github.com/TORQUE-TUSHAR/Udhaar_Setu"
      },
      {
        name: "wish-you.in",
        description: projectDetails["wish-you.in"].summary,
        language: "CSS",
        stargazers_count: 1,
        forks_count: 0,
        updated_at: "2026-05-01T00:00:00Z",
        html_url: "https://github.com/TORQUE-TUSHAR/wish-you.in"
      },
      {
        name: "o-AadhunikBazar",
        description: projectDetails["o-aadhunikbazar"].summary,
        language: "TypeScript",
        stargazers_count: 3,
        forks_count: 0,
        updated_at: "2026-03-01T00:00:00Z",
        html_url: "https://github.com/TORQUE-TUSHAR/o-AadhunikBazar"
      },
      {
        name: "portfolio",
        description: projectDetails.portfolio.summary,
        language: "HTML",
        stargazers_count: 0,
        forks_count: 0,
        updated_at: "2026-05-01T00:00:00Z",
        html_url: "https://github.com/TORQUE-TUSHAR/portfolio"
      },
      {
        name: "python-assignment-1",
        description: projectDetails["python-assignment-1"].summary,
        language: "Python",
        stargazers_count: 3,
        forks_count: 0,
        updated_at: "2026-03-01T00:00:00Z",
        html_url: "https://github.com/TORQUE-TUSHAR/python-assignment-1"
      },
      {
        name: "python-assignment-2",
        description: projectDetails["python-assignment-2"].summary,
        language: "Python",
        stargazers_count: 3,
        forks_count: 0,
        updated_at: "2026-03-01T00:00:00Z",
        html_url: "https://github.com/TORQUE-TUSHAR/python-assignment-2"
      }
    ];

    function titleCase(name) {
      return name.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    function projectKey(name) {
      return String(name).toLowerCase();
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char]));
    }

    function renderProjects(repos) {
      const grid = document.getElementById("projectsGrid");
      const repoByName = new Map(repos.filter((repo) => repo.name !== "TORQUE-TUSHAR").map((repo) => [projectKey(repo.name), repo]));
      fallbackProjectList.forEach((project) => {
        const key = projectKey(project.name);
        if (!repoByName.has(key)) repoByName.set(key, project);
      });
      const usable = [...repoByName.values()]
        .sort((a, b) => {
          const detailA = projectDetails[projectKey(a.name)];
          const detailB = projectDetails[projectKey(b.name)];
          const priorityA = detailA?.priority || 99;
          const priorityB = detailB?.priority || 99;
          if (priorityA !== priorityB) return priorityA - priorityB;
          return new Date(b.updated_at) - new Date(a.updated_at);
        })
        .slice(0, 6);
      if (!usable.length) {
        renderFallbackProjects();
        return;
      }

      grid.innerHTML = usable.map((repo, index) => {
        const details = projectDetails[projectKey(repo.name)];
        const lang = repo.language || "Code";
        const color = langColors[lang] || langColors.default;
        const desc = details?.summary || repo.description || "A public repository by Tushar kumar . Open GitHub to explore the source and project details.";
        const icon = details?.icon || projectIcons[index % projectIcons.length];
        const safeName = escapeHtml(details?.title || titleCase(repo.name));
        const safeDesc = escapeHtml(desc.length > 140 ? `${desc.slice(0, 137)}...` : desc);
        const safeLang = escapeHtml(lang);
        const safeUrl = escapeHtml(repo.html_url);
        const points = details?.points || [];
        return `
          <article class="project-card glass reveal" style="transition-delay:${index * 70}ms">
            <div class="project-top">
              <div class="project-icon"><i class="fas ${icon}"></i></div>
              <a class="project-link" href="${safeUrl}" target="_blank" rel="noreferrer" aria-label="Open ${safeName} on GitHub"><i class="fab fa-github"></i></a>
            </div>
            <h3>${safeName}</h3>
            <p>${safeDesc}</p>
            <div class="project-points">
              ${points.map((point) => `<span class="project-point">${escapeHtml(point)}</span>`).join("")}
            </div>
            <div class="project-meta">
              <span class="meta-pill"><span class="lang-dot" style="background:${color}"></span>${safeLang}</span>
              <span class="meta-pill"><i class="fas fa-star"></i>${repo.stargazers_count || 0}</span>
              <span class="meta-pill"><i class="fas fa-code-fork"></i>${repo.forks_count || 0}</span>
              <span class="meta-pill">${new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
            </div>
          </article>
        `;
      }).join("");

      grid.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));
    }

    function renderFallbackProjects() {
      renderProjects(fallbackProjectList);
    }

    async function loadGitHub() {
      try {
        const [profileResponse, reposResponse] = await Promise.all([
          fetch("https://api.github.com/users/TORQUE-TUSHAR"),
          fetch("https://api.github.com/users/TORQUE-TUSHAR/repos?sort=updated&per_page=12")
        ]);

        if (profileResponse.ok) {
          const profile = await profileResponse.json();
          animateNumber(document.getElementById("heroRepos"), profile.public_repos || 7);
          animateNumber(document.getElementById("repoCount"), profile.public_repos || 7);
          animateNumber(document.getElementById("heroFollowers"), profile.followers || 4);
          animateNumber(document.getElementById("followerCount"), profile.followers || 4);
        }

        if (!reposResponse.ok) throw new Error("Repository request failed");
        const repos = await reposResponse.json();
        const totals = repos.reduce((acc, repo) => {
          acc.stars += repo.stargazers_count || 0;
          acc.forks += repo.forks_count || 0;
          return acc;
        }, { stars: 0, forks: 0 });

        animateNumber(document.getElementById("heroStars"), totals.stars);
        animateNumber(document.getElementById("starCount"), totals.stars);
        animateNumber(document.getElementById("forkCount"), totals.forks);
        renderProjects(repos);
      } catch (error) {
        console.warn("GitHub data unavailable", error);
        renderFallbackProjects();
      }
    }

    loadGitHub();

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2600);
    }

    document.getElementById("contactForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim() || `Portfolio Contact: ${name || "Hello"}`;
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        showToast("Please add your name, email, and message.");
        return;
      }

      const body = `Hi Sahil,%0D%0A%0D%0AName: ${encodeURIComponent(name)}%0D%0AEmail: ${encodeURIComponent(email)}%0D%0A%0D%0A${encodeURIComponent(message)}`;
      window.location.href = `mailto:tusharkumar5090@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    });

