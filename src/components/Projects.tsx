import { useRef, useEffect, useState } from "react";

/* ─── fade-in wrapper ─── */
function FadeIn({
  children,
  delay = 0,
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = `opacity .6s var(--ease) ${delay}ms, transform .6s var(--ease) ${delay}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        obs.disconnect();
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}

/* ─── data ─── */
type Category = "all" | "ml" | "web" | "iot" | "desktop" | "game";

interface Project {
  id: string;
  title: string;
  titleEn?: string;
  category: Category;
  categoryLabel: string;
  categoryColor: string;
  emoji: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  images?: string[];
  highlights?: string[];
}

const PROJECTS: Project[] = [
  {
    id: "ai-cup",
    title: "AI CUP — 交易警示帳戶分類",
    titleEn: "2025 玉山人工智慧挑戰賽",
    category: "ml",
    categoryLabel: "機器學習",
    categoryColor: "var(--primary)",
    emoji: "🤖",
    description:
      "利用機器學習技術對銀行帳戶交易資料進行特徵工程與分類，預測是否為警示（可疑）帳戶。參加 2025 玉山人工智慧挑戰賽。",
    tech: ["Python", "pandas", "numpy", "scikit-learn", "joblib", "Random Forest"],
    github: "https://github.com/peterwang0329/AI-CUP-2025-Transaction-Alert",
    highlights: [
      "Random Forest Classifier 模型訓練與預測",
      "帳戶級特徵聚合：交易金額統計、通路分布比例",
      "StandardScaler 特徵縮放標準化流程",
      "支援模型序列化（joblib）與重複使用",
    ],
  },
  {
    id: "coral-farm",
    title: "珊瑚農場百萬室內缸",
    category: "ml",
    categoryLabel: "電腦視覺",
    categoryColor: "var(--primary2)",
    emoji: "🪸",
    description:
      "為「珊瑚農場百萬室內缸」計畫建立的珊瑚與小丑魚影像辨識資料集，從多個網路來源爬取並整理標記資料，支援 YOLO 格式訓練。",
    tech: ["Python", "Web Scraping", "Selenium", "YOLO", "Computer Vision"],
    github: "https://github.com/peterwang0329/coral-farm-dataset",
    highlights: [
      "珊瑚種類：16 種（共 3,000+ 筆標記）",
      "小丑魚種類：3 種（共 900 筆標記）",
      "多來源爬蟲（iNaturalist、Flickr、Corals of the World）",
      "YOLO 格式標記資料集",
    ],
  },
  {
    id: "currency",
    title: "Currency Trend Analysis",
    titleEn: "匯率趨勢與比較分析",
    category: "ml",
    categoryLabel: "資料分析",
    categoryColor: "var(--good)",
    emoji: "📊",
    description:
      "透過爬蟲從台灣銀行歷史匯率網站取得 USD、GBP、AUD 三個月匯率資料，進行趨勢分析與視覺化比較。",
    tech: ["Python", "Jupyter Notebook", "Web Scraping", "Matplotlib", "pandas"],
    github:
      "https://github.com/peterwang0329/Currency-Trend-and-Comparative-Analysis",
    highlights: [
      "爬取台灣銀行現金買入/賣出匯率",
      "三幣種變動率比較折線圖",
      "匯率分佈箱型圖分析",
    ],
  },
  {
    id: "wb-easy-post",
    title: "wb_easy_post",
    titleEn: "FastAPI 動態部落格系統",
    category: "web",
    categoryLabel: "Web 開發",
    categoryColor: "var(--primary2)",
    emoji: "🌐",
    description:
      "使用 FastAPI 框架開發的動態型部落格網站，部署於 Render 平台。支援文章發佈、瀏覽、使用者登入等完整功能。",
    tech: ["Python", "FastAPI", "SQLite", "HTML/CSS", "Render"],
    github: "https://github.com/peterwang0329/wb_easy_post",
    demo: "https://wb-test-post.onrender.com/",
    highlights: [
      "文章發佈、瀏覽功能",
      "使用者登入系統",
      "SQLite 資料庫儲存",
      "Render 平台雲端部署",
    ],
  },
  {
    id: "iot",
    title: "溫溼度監控系統",
    titleEn: "Temperature & Humidity Monitoring",
    category: "iot",
    categoryLabel: "IoT 嵌入式",
    categoryColor: "var(--warning)",
    emoji: "🌡️",
    description:
      "基於 ESP32S 的 IoT 邊緣伺服器，透過 Wi-Fi 提供網頁介面的溫溼度即時監控與繼電器遠端控制。頁面每 5 秒自動刷新。",
    tech: ["Arduino C++", "ESP32", "OneWire", "DS18B20", "WiFi", "HTML/JS"],
    github:
      "https://github.com/peterwang0329/Temperature-Humidity-Monitoring-System",
    highlights: [
      "ESP32S 架設本機 HTTP 伺服器（Port 8080）",
      "即時溫度顯示（DS18B20 感測器）",
      "自動模式：依溫度觸發繼電器（< 16°C / 16-26°C / > 26°C）",
      "遠端手動控制繼電器",
    ],
  },
  {
    id: "ticketing",
    title: "訂票系統",
    titleEn: "Ticketing System (WPF)",
    category: "desktop",
    categoryLabel: "桌面應用",
    categoryColor: "var(--good)",
    emoji: "🎟️",
    description:
      "使用 WPF 框架開發的 Windows 桌面電影訂票應用程式，提供完整的選位與訂票流程，精美 XAML UI 設計。",
    tech: ["C#", "WPF", ".NET", "XAML", "Visual Studio"],
    github: "https://github.com/peterwang0329/Ticketing-System-WPF",
    images: [
      "/project-images/ticketing/page1.png",
      "/project-images/ticketing/page2.png",
      "/project-images/ticketing/page3.png",
      "/project-images/ticketing/page4.png",
    ],
    highlights: [
      "多頁面導航（選單 → 座位選擇 → 確認）",
      "互動式座位圖介面",
      "精美 UI 設計（XAML）",
    ],
  },
  {
    id: "lonely-basin",
    title: "孤寂盆地：生存試煉",
    titleEn: "Lonely Basin: Trial of Survival",
    category: "game",
    categoryLabel: "遊戲開發",
    categoryColor: "var(--primary)",
    emoji: "🎮",
    description:
      "以 Unity 引擎開發的 3D 生存主題遊戲。靈感取自 CODM 與三角洲行動的搜打撤模式，玩家在孤寂盆地封閉環境中搜索寶箱並面對不斷生成的怪物。",
    tech: ["Unity", "C#", "DirectX 12", "3D Game Development"],
    github: "https://github.com/peterwang0329/Lonely-Basin-Trial-of-Survival",
    images: [
      "/project-images/lonely-basin/main.png",
      "/project-images/lonely-basin/background.png",
      "/project-images/lonely-basin/mechanism.png",
      "/project-images/lonely-basin/mechanism2.png",
      "/project-images/lonely-basin/mechanism3.png",
      "/project-images/lonely-basin/gameplay.png",
      "/project-images/lonely-basin/gameplay2.png",
      "/project-images/lonely-basin/gameplay3.png",
      "/project-images/lonely-basin/pause.png",
      "/project-images/lonely-basin/result.png",
    ],
    highlights: [
      "3D 開放式生存探索地圖",
      "搜打撤遊戲機制",
      "動態怪物生成系統",
      "Unity Asset Store 免費開源模型",
    ],
  },
  {
    id: "crumb-cat",
    title: "梗圖貓大戰貓咪",
    titleEn: "Meme Cat vs. Cat",
    category: "game",
    categoryLabel: "遊戲開發",
    categoryColor: "var(--primary2)",
    emoji: "🐱",
    description:
      "結合植物大戰殭屍玩法與貓咪大戰爭元素的 Unity 2D 對戰遊戲。包含 Rush 模式（擊敗10波敵人）與 Boss 戰兩個關卡。",
    tech: ["Unity", "C#", "DirectX 12", "Game Development"],
    github: "https://github.com/peterwang0329/Meme-Cat-vs-Cat",
    images: [
      "/project-images/crumb-cat/main.png",
      "/project-images/crumb-cat/system.png",
      "/project-images/crumb-cat/stage.png",
      "/project-images/crumb-cat/enemy.png",
      "/project-images/crumb-cat/item.png",
    ],
    highlights: [
      "第一關：Rush 模式，擊敗 10 波敵人",
      "第二關：Boss 戰模式",
      "梗圖風格視覺設計",
      "輕鬆歡樂的對戰體驗",
    ],
  },
];

const FILTERS: { key: Category; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "ml", label: "機器學習 / AI" },
  { key: "web", label: "Web 開發" },
  { key: "iot", label: "IoT 嵌入式" },
  { key: "desktop", label: "桌面應用" },
  { key: "game", label: "遊戲開發" },
];

/* ─── image gallery modal ─── */
function ImageModal({
  images,
  onClose,
}: {
  images: string[];
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight")
        setIdx((i) => Math.min(images.length - 1, i + 1));
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [images.length, onClose]);

  return (
    <div className="prj-modal-overlay" onClick={onClose}>
      <div
        className="prj-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="prj-modal__close"
          onClick={onClose}
          aria-label="關閉"
          type="button"
        >
          ✕
        </button>
        <img
          src={images[idx]}
          alt={`截圖 ${idx + 1}`}
          className="prj-modal__img"
        />
        {images.length > 1 && (
          <div className="prj-modal__nav">
            <button
              className="prj-modal__nav-btn"
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
              disabled={idx === 0}
              aria-label="上一張"
              type="button"
            >
              ‹
            </button>
            <span className="prj-modal__counter">
              {idx + 1} / {images.length}
            </span>
            <button
              className="prj-modal__nav-btn"
              onClick={() =>
                setIdx((i) => Math.min(images.length - 1, i + 1))
              }
              disabled={idx === images.length - 1}
              aria-label="下一張"
              type="button"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── project card ─── */
function ProjectCard({
  project,
  delay,
}: {
  project: Project;
  delay: number;
}) {
  const [modalImages, setModalImages] = useState<string[] | null>(null);

  return (
    <>
      <FadeIn delay={delay} className="prj-card">
        <div
          className="prj-card__bar"
          style={{ background: project.categoryColor }}
        />
        <div className="prj-card__head">
          <span className="prj-card__emoji" aria-hidden="true">
            {project.emoji}
          </span>
          <div
            className="prj-card__badge"
            style={{
              color: project.categoryColor,
              borderColor: project.categoryColor,
            }}
          >
            {project.categoryLabel}
          </div>
        </div>
        <h3 className="prj-card__title">{project.title}</h3>
        {project.titleEn && (
          <p className="prj-card__subtitle">{project.titleEn}</p>
        )}
        <p className="prj-card__desc">{project.description}</p>
        {project.highlights && (
          <ul className="prj-card__highlights">
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        <div className="prj-card__tech">
          {project.tech.map((t) => (
            <span key={t} className="prj-tag">
              {t}
            </span>
          ))}
        </div>
        <div className="prj-card__actions">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="prj-btn prj-btn--ghost"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="prj-btn prj-btn--primary"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Live Demo
            </a>
          )}
          {project.images && project.images.length > 0 && (
            <button
              className="prj-btn prj-btn--ghost"
              onClick={() => setModalImages(project.images!)}
              type="button"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              畫面預覽
              <span className="prj-btn__count">{project.images.length}</span>
            </button>
          )}
        </div>
      </FadeIn>

      {modalImages && (
        <ImageModal
          images={modalImages}
          onClose={() => setModalImages(null)}
        />
      )}
    </>
  );
}

/* ─── main component ─── */
export function Projects() {
  const [activeFilter, setActiveFilter] = useState<Category>("all");

  const filtered =
    activeFilter === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <div className="prj-root">
      {/* ── Hero ── */}
      <section className="prj-hero">
        <div className="prj-hero__glow prj-hero__glow--a" />
        <div className="prj-hero__glow prj-hero__glow--b" />
        <div className="container prj-hero__inner">
          <FadeIn className="prj-hero__copy">
            <p className="ps-eyebrow">Personal Projects</p>
            <h1 className="prj-hero__title">
              個人
              <br />
              <span className="ps-gradient-text">專案作品集</span>
            </h1>
            <p className="prj-hero__sub">
              涵蓋機器學習、IoT 嵌入式系統、桌面應用程式、遊戲開發及 Web
              應用等多元領域，記錄每段學習旅程中的成果與挑戰。
            </p>
            <div className="prj-hero__stats">
              <div className="prj-stat">
                <strong>8</strong>
                <span>個人專案</span>
              </div>
              <div className="prj-stat">
                <strong>5+</strong>
                <span>技術領域</span>
              </div>
              <div className="prj-stat">
                <strong>10+</strong>
                <span>程式語言 / 框架</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Filter + Grid ── */}
      <section className="prj-list-section">
        <div className="container">
          <FadeIn
            className="prj-filters"
            role="tablist"
            aria-label="專案類別篩選"
          >
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`prj-filter-btn${activeFilter === f.key ? " prj-filter-btn--active" : ""
                  }`}
                onClick={() => setActiveFilter(f.key)}
                role="tab"
                aria-selected={activeFilter === f.key}
                type="button"
              >
                {f.label}
              </button>
            ))}
          </FadeIn>

          <p className="prj-count ps-muted">
            顯示 {filtered.length} / {PROJECTS.length} 個專案
          </p>

          <div className="prj-grid">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} project={p} delay={i * 70} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills Summary ── */}
      <section className="prj-skills ps-band">
        <div className="container">
          <FadeIn>
            <p className="ps-eyebrow">Tech Stack</p>
            <h2>技術技能分布</h2>
          </FadeIn>
          <div className="prj-skills__grid">
            {[
              {
                label: "程式語言",
                items: [
                  "Python",
                  "C#",
                  "C++ (Arduino)",
                  "JavaScript",
                  "HTML/CSS",
                ],
              },
              {
                label: "框架工具",
                items: [
                  "FastAPI",
                  "WPF",
                  "Unity",
                  "scikit-learn",
                  "pandas",
                  "Matplotlib",
                ],
              },
              {
                label: "硬體 / IoT",
                items: ["ESP32S", "DS18B20", "Arduino IDE"],
              },
              {
                label: "資料庫 / 部署",
                items: ["SQLite", "Render", "GitHub Pages"],
              },
            ].map((group, i) => (
              <FadeIn
                key={group.label}
                delay={i * 80}
                className="prj-skill-group"
              >
                <h4 className="prj-skill-group__label">{group.label}</h4>
                <div className="prj-skill-group__tags">
                  {group.items.map((item) => (
                    <span key={item} className="prj-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
