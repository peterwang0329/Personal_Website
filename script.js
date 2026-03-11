// 你只需要改這裡：個人資料設定
const PROFILE = {
  name: "Peter",
  headlinePrefix: "專注於",
  roles: ["前端開發", "介面設計", "互動體驗", "效能與可用性"],
  statusText: "開放合作中",
  summary:
    "我喜歡把複雜的問題拆小、做成好用的產品。擅長在設計與工程之間找到平衡，讓畫面漂亮、也跑得快。",
  location: "台灣",
  topSkillText: "HTML / CSS / JavaScript",
  availability: "接案 / 合作",
  chipText: "Frontend",
  cardDesc: "做出讓人一眼喜歡、每天都想用的介面。",
  stats: {
    years: "3+",
    projects: "12",
    focus: "UX",
  },
  links: {
    email: "hello@example.com",
    github: "https://github.com/yourname",
    linkedin: "https://www.linkedin.com/in/yourname",
  },
  about: {
    lead:
      "我在意「做得出來」更在意「做得好」。從資訊架構、版面節奏到互動細節，都希望能讓使用者少想一步。",
    strength:
      "以純前端把想法快速落地：切版、動效、元件化、效能與可用性（a11y）。也能把需求拆成可交付的里程碑。",
    looking:
      "期待跟在意品質的團隊合作：願意討論、願意迭代、願意把產品做到更成熟。",
    oneLiner: "把複雜變簡單，把介面做漂亮。",
    strengthPills: ["UI 切版", "互動動效", "元件化", "效能", "無障礙 a11y", "可維護性"],
  },
  skills: [
    { name: "HTML", levelLabel: "精通", value: 92 },
    { name: "CSS（RWD / 動效）", levelLabel: "精通", value: 90 },
    { name: "JavaScript", levelLabel: "熟練", value: 86 },
    { name: "可用性 / 無障礙", levelLabel: "熟練", value: 78 },
    { name: "效能與最佳化", levelLabel: "熟練", value: 76 },
  ],
  tools: [
    "把需求拆成里程碑與可交付成果",
    "建立一致的設計與元件規範",
    "重視可讀性、可維護性與可測試性",
    "以使用者路徑設計互動與資訊層級",
  ],
  values: ["清楚的溝通", "品質與細節", "務實交付", "持續迭代"],
  projectFilters: ["全部", "網站", "工具", "互動"],
  projects: [
    {
      title: "Landing Page 轉換率優化",
      desc: "重新設計版面節奏與 CTA，並加入互動與視覺層級，提升使用者理解與轉換。",
      tags: ["網站", "UI", "RWD"],
      links: [
        { label: "展示", href: "#", kind: "demo" },
        { label: "程式碼", href: "#", kind: "code" },
      ],
    },
    {
      title: "待辦清單（純 JS）",
      desc: "支援篩選、拖曳排序、LocalStorage 儲存、鍵盤操作與 a11y。",
      tags: ["工具", "互動", "JavaScript"],
      links: [
        { label: "展示", href: "#", kind: "demo" },
        { label: "程式碼", href: "#", kind: "code" },
      ],
    },
    {
      title: "作品集元件庫（小型）",
      desc: "以一致的樣式系統做卡片、按鈕、表單等元件，提升開發效率與一致性。",
      tags: ["網站", "工具", "CSS"],
      links: [
        { label: "程式碼", href: "#", kind: "code" },
      ],
    },
    {
      title: "互動式簡報頁",
      desc: "用 IntersectionObserver 與動畫過場做敘事節奏，讓內容更容易被看完。",
      tags: ["互動", "網站"],
      links: [
        { label: "展示", href: "#", kind: "demo" },
      ],
    },
    {
      title: "表單體驗強化",
      desc: "補足錯誤提示、即時驗證、焦點樣式與鍵盤導覽，讓填寫更順暢。",
      tags: ["工具", "可用性", "互動"],
      links: [
        { label: "案例", href: "#", kind: "demo" },
      ],
    },
    {
      title: "動畫徽章與卡片效果",
      desc: "用 CSS 變數與漸層打造一致的視覺語言，並支援 reduced-motion。",
      tags: ["CSS", "互動"],
      links: [{ label: "程式碼", href: "#", kind: "code" }],
    },
  ],
  experience: [
    {
      time: "2024 — 現在",
      title: "自由接案 / 個人專案",
      body: "接案與自做專案並行：著重介面品質、互動細節與交付節奏，讓需求能快速落地並持續迭代。",
    },
    {
      time: "2022 — 2024",
      title: "前端工程（協作）",
      body: "與設計/產品協作，建立元件與樣式規範；優化頁面載入與互動效能，提升使用者體驗。",
    },
    {
      time: "更早",
      title: "持續學習與累積",
      body: "透過閱讀文件、拆解網站、做 side project，把學到的東西快速做成可展示的成果。",
    },
  ],
};

// -----------------------------
// 以下通常不用改：渲染與互動
// -----------------------------

function $(sel, root = document) {
  return root.querySelector(sel);
}
function $all(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setLink(id, href, text) {
  const el = document.getElementById(id);
  if (!el) return;
  if (href) el.setAttribute("href", href);
  if (text) el.textContent = text;
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

function applyProfile() {
  document.title = `個人介紹｜${PROFILE.name}`;
  setText("nameText", PROFILE.name);
  setText("cardName", PROFILE.name);
  setText("footerName", PROFILE.name);
  setText("avatarInitial", (PROFILE.name || "P").trim().slice(0, 1).toUpperCase());
  setText("headlinePrefix", PROFILE.headlinePrefix);
  setText("statusText", PROFILE.statusText);
  setText("summaryText", PROFILE.summary);
  setText("locationText", PROFILE.location);
  setText("topSkillText", PROFILE.topSkillText);
  setText("availabilityText", PROFILE.availability);
  setText("chipText", PROFILE.chipText);
  setText("cardDesc", PROFILE.cardDesc);
  setText("statYears", PROFILE.stats.years);
  setText("statProjects", PROFILE.stats.projects);
  setText("statFocus", PROFILE.stats.focus);

  setText("aboutLead", PROFILE.about.lead);
  setText("aboutStrength", PROFILE.about.strength);
  setText("aboutLooking", PROFILE.about.looking);
  setText("oneLiner", PROFILE.about.oneLiner);

  const email = PROFILE.links.email;
  setLink("emailLink", `mailto:${email}`, email);
  setLink("githubLink", PROFILE.links.github);
  setLink("githubLink2", PROFILE.links.github);
  setLink("linkedinLink", PROFILE.links.linkedin);
  setLink("linkedinLink2", PROFILE.links.linkedin);
}

function renderPills(containerId, pills) {
  const root = document.getElementById(containerId);
  if (!root) return;
  root.innerHTML = "";
  for (const text of pills) {
    const span = document.createElement("span");
    span.className = "pill";
    span.textContent = text;
    root.appendChild(span);
  }
}

function renderSkills() {
  const list = $("#skillList");
  if (!list) return;
  list.innerHTML = "";

  for (const s of PROFILE.skills) {
    const wrap = document.createElement("div");
    wrap.className = "skill";

    const top = document.createElement("div");
    top.className = "skill__top";

    const name = document.createElement("div");
    name.className = "skill__name";
    name.textContent = s.name;

    const level = document.createElement("div");
    level.className = "skill__level";
    level.textContent = s.levelLabel;

    const bar = document.createElement("div");
    bar.className = "bar";
    const fill = document.createElement("span");
    fill.style.width = "0%";
    fill.dataset.targetWidth = String(Math.max(0, Math.min(100, s.value)));
    bar.appendChild(fill);

    top.appendChild(name);
    top.appendChild(level);
    wrap.appendChild(top);
    wrap.appendChild(bar);
    list.appendChild(wrap);
  }
}

function animateSkillBarsWhenVisible() {
  const fills = $all(".bar > span");
  if (!fills.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target;
        const target = el.dataset.targetWidth || "0";
        el.style.width = `${target}%`;
        obs.unobserve(el);
      }
    },
    { threshold: 0.2 }
  );

  for (const f of fills) obs.observe(f);
}

function renderTools() {
  const list = $("#toolList");
  if (!list) return;
  list.innerHTML = "";
  for (const t of PROFILE.tools) {
    const li = document.createElement("li");
    li.textContent = t;
    list.appendChild(li);
  }
}

function normalizeTag(tag) {
  return String(tag || "").trim();
}

function projectMatchesFilter(project, filter) {
  if (filter === "全部") return true;
  const tags = (project.tags || []).map(normalizeTag);
  return tags.includes(filter);
}

function renderProjectFilters(onSelect) {
  const root = $("#projectFilters");
  if (!root) return;
  root.innerHTML = "";

  for (const f of PROFILE.projectFilters) {
    const btn = document.createElement("button");
    btn.className = "tabBtn";
    btn.type = "button";
    btn.role = "tab";
    btn.dataset.filter = f;
    btn.setAttribute("aria-selected", f === "全部" ? "true" : "false");
    btn.textContent = f;
    btn.addEventListener("click", () => onSelect(f));
    root.appendChild(btn);
  }
}

function renderProjects(activeFilter) {
  const grid = $("#projectsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const items = PROFILE.projects.filter((p) => projectMatchesFilter(p, activeFilter));

  for (const p of items) {
    const card = document.createElement("article");
    card.className = "project reveal";
    card.dataset.reveal = "";

    const h = document.createElement("h3");
    h.className = "project__title";
    h.textContent = p.title;

    const desc = document.createElement("p");
    desc.className = "project__desc";
    desc.textContent = p.desc;

    const tags = document.createElement("div");
    tags.className = "tags";
    for (const t of p.tags || []) {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = t;
      tags.appendChild(span);
    }

    const links = document.createElement("div");
    links.className = "project__links";
    for (const l of p.links || []) {
      const a = document.createElement("a");
      a.className = "miniLink";
      a.href = l.href || "#";
      if (String(l.href || "").startsWith("http")) {
        a.target = "_blank";
        a.rel = "noreferrer";
      }
      a.textContent = l.label;
      links.appendChild(a);
    }

    card.appendChild(h);
    card.appendChild(desc);
    card.appendChild(tags);
    card.appendChild(links);
    grid.appendChild(card);
  }
}

function setActiveFilter(filter) {
  $all("#projectFilters .tabBtn").forEach((b) => {
    b.setAttribute("aria-selected", b.dataset.filter === filter ? "true" : "false");
  });
}

function renderTimeline() {
  const root = $("#timeline");
  if (!root) return;
  root.innerHTML = "";

  for (const e of PROFILE.experience) {
    const wrap = document.createElement("div");
    wrap.className = "event";

    const time = document.createElement("div");
    time.className = "event__time";
    time.textContent = e.time;

    const body = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "event__title";
    title.textContent = e.title;
    const text = document.createElement("p");
    text.className = "event__body";
    text.textContent = e.body;
    body.appendChild(title);
    body.appendChild(text);

    wrap.appendChild(time);
    wrap.appendChild(body);
    root.appendChild(wrap);
  }
}

function setupReveal() {
  const targets = $all("[data-reveal]");
  if (!targets.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-visible");
        obs.unobserve(e.target);
      }
    },
    { threshold: 0.14 }
  );

  for (const t of targets) obs.observe(t);
}

function setupScrollSpy() {
  const links = $all('.nav__link[href^="#"]');
  if (!links.length) return;

  const map = new Map();
  for (const a of links) {
    const id = a.getAttribute("href")?.slice(1);
    const sec = id ? document.getElementById(id) : null;
    if (sec) map.set(sec, a);
  }

  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
      if (!visible) return;
      for (const a of links) a.removeAttribute("aria-current");
      const hit = map.get(visible.target);
      if (hit) hit.setAttribute("aria-current", "page");
    },
    { threshold: [0.3, 0.5, 0.7], rootMargin: "-18% 0px -70% 0px" }
  );

  for (const sec of map.keys()) obs.observe(sec);
}

function setupTheme() {
  const key = "site-theme";
  const btn = $("#themeToggle");
  if (!btn) return;

  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const saved = localStorage.getItem(key);
  const initial = saved || (prefersDark ? "dark" : "light");
  document.documentElement.dataset.theme = initial;

  function toggle() {
    const cur = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem(key, next);
    showToast(next === "dark" ? "已切換：深色模式" : "已切換：淺色模式");
  }

  btn.addEventListener("click", toggle);
}

function setupMobileMenu() {
  const btn = $("#menuToggle");
  const menu = $("#mobileNav");
  if (!btn || !menu) return;

  function setOpen(open) {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    menu.hidden = !open;
  }

  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  });

  $all('#mobileNav a[href^="#"]').forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

async function copyEmail() {
  const email = PROFILE.links.email;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(email);
    } else {
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    showToast("已複製 Email");
  } catch {
    showToast("複製失敗，請手動複製");
  }
}

function setupCopyButtons() {
  const b1 = $("#copyEmailBtn");
  const b2 = $("#copyEmailBtn2");
  if (b1) b1.addEventListener("click", copyEmail);
  if (b2) b2.addEventListener("click", copyEmail);
}

function setupContactForm() {
  const form = $("#contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();

    const emailTo = PROFILE.links.email;
    const body = [
      `嗨 ${PROFILE.name}，`,
      "",
      message,
      "",
      `— ${name || "（未填姓名）"}`,
    ].join("\n");

    const mailto = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}

function setupRoleRotator() {
  const el = $("#roleText");
  if (!el) return;

  const roles = (PROFILE.roles || []).filter(Boolean);
  if (!roles.length) return;

  let idx = 0;
  let t = null;

  function next() {
    idx = (idx + 1) % roles.length;
    el.textContent = roles[idx];
  }

  t = setInterval(next, 2400);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (t) clearInterval(t);
      t = null;
    } else if (!t) {
      t = setInterval(next, 2400);
    }
  });
}

function setupYear() {
  const y = String(new Date().getFullYear());
  setText("yearText", y);
}

function main() {
  applyProfile();
  renderPills("strengthPills", PROFILE.about.strengthPills);
  renderPills("valuePills", PROFILE.values);
  renderSkills();
  renderTools();
  renderTimeline();

  let active = "全部";
  renderProjectFilters((f) => {
    active = f;
    setActiveFilter(active);
    renderProjects(active);
    setupReveal(); // 讓新渲染的作品卡也能進場
  });
  setActiveFilter(active);
  renderProjects(active);

  setupTheme();
  setupMobileMenu();
  setupCopyButtons();
  setupContactForm();
  setupRoleRotator();
  setupScrollSpy();
  setupReveal();
  animateSkillBarsWhenVisible();
  setupYear();
}

document.addEventListener("DOMContentLoaded", main);
