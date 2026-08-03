/** Shared sidebar + mobile nav injector for Ordo preview screens */
(function () {
  const page = document.body.dataset.page || "today";
  const items = [
    { id: "today", href: "app-today.html", label: "Today", icon: "☀" },
    { id: "schedule", href: "app-schedule.html", label: "Schedule", icon: "◷" },
    { id: "focus", href: "app-focus.html", label: "Focus", icon: "◎" },
    { id: "habits", href: "app-habits.html", label: "Habits", icon: "🔥" },
    { id: "review", href: "app-review.html", label: "Day close", icon: "☾" },
    { id: "insights", href: "app-insights.html", label: "Insights", icon: "▦" },
  ];

  const logo = `
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="og" x1="4" y1="4" x2="28" y2="28">
          <stop stop-color="#3B82F6"/><stop offset=".55" stop-color="#8B5CF6"/><stop offset="1" stop-color="#22D3EE"/>
        </linearGradient>
      </defs>
      <ellipse cx="16" cy="16" rx="13" ry="13" stroke="url(#og)" stroke-width="1.5" opacity=".45"/>
      <circle cx="16" cy="16" r="7.5" stroke="url(#og)" stroke-width="2.25"/>
      <circle cx="26.5" cy="11" r="2.25" fill="url(#og)"/>
    </svg>`;

  const nav = items
    .map(
      (i) =>
        `<a class="nav-item${i.id === page ? " active" : ""}" href="${i.href}"><span aria-hidden="true">${i.icon}</span>${i.label}</a>`
    )
    .join("");

  const mobile = items
    .slice(0, 5)
    .map(
      (i) =>
        `<a class="${i.id === page ? "active" : ""}" href="${i.href}"><span>${i.icon}</span>${i.label}</a>`
    )
    .join("");

  const mount = document.getElementById("app-shell");
  if (!mount) return;

  mount.innerHTML = `
    <a class="back-home" href="index.html">← Marketing</a>
    <aside class="sidebar">
      <a class="sidebar-brand" href="index.html">${logo} Ordo</a>
      <nav>
        <div class="nav-label">Your day</div>
        ${nav}
        <div class="progress-box">
          <div class="t"><span style="color:var(--primary)">☑</span> Day progress</div>
          <div class="bar"><i style="width:46%"></i></div>
          <div class="s">5 of 11 · 46%</div>
        </div>
      </nav>
      <div class="sidebar-foot">
        <a class="nav-item" href="index.html"><span>⌘</span> Command <span style="margin-left:auto;font-family:var(--mono);font-size:10px;border:1px solid var(--border);padding:2px 6px;border-radius:4px;color:var(--text-3)">⌘K</span></a>
        <a class="nav-item" href="#"><span>⚙</span> Settings</a>
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        <h1 id="top-title"></h1>
        <div class="top-actions">
          <div class="search-pill">⌕ Search… <span style="margin-left:auto;font-family:var(--mono);font-size:10px;border:1px solid var(--border);padding:2px 6px;border-radius:4px">⌘K</span></div>
          <button class="icon-btn" type="button" aria-label="Notifications">🔔</button>
          <div class="avatar">AO</div>
        </div>
      </header>
      <div class="content" id="page-content"></div>
    </div>
    <nav class="mobile-nav" aria-label="Mobile">${mobile}</nav>
  `;

  const title = document.body.dataset.title || "Today";
  const t = document.getElementById("top-title");
  if (t) t.textContent = title;

  const content = document.getElementById("page-content");
  const src = document.getElementById("page-source");
  if (content && src) {
    content.innerHTML = src.innerHTML;
    src.remove();
  }
})();
