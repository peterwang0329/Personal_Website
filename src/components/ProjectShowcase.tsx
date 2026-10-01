import { useRef, useEffect, useState } from "react";

/* ─── animated counter ─── */
function useCountUp(target: number, decimals = 0, duration = 1400) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(parseFloat((ease * target).toFixed(decimals)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, decimals, duration]);
  return { val, ref };
}

/* ─── fade-in wrapper ─── */
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
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
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ─── metric card ─── */
function MetricCard({
  value,
  suffix,
  label,
  desc,
  decimals,
  delay,
}: {
  value: number;
  suffix?: string;
  label: string;
  desc: string;
  decimals?: number;
  delay: number;
}) {
  const { val, ref } = useCountUp(value, decimals ?? 0);
  return (
    <FadeIn delay={delay} className="ps-metric">
      <strong className="ps-metric__val">
        <span ref={ref}>{val.toFixed(decimals ?? 0)}</span>
        {suffix}
      </strong>
      <span className="ps-metric__label">{label}</span>
      <p className="ps-metric__desc">{desc}</p>
    </FadeIn>
  );
}

/* ─── main component ─── */
export function ProjectShowcase() {
  const steps = [
    {
      num: "01",
      title: "聽懂問題",
      body: "透過 Faster-Whisper 將使用者語音轉換為文字，作為後續查詢與回覆生成的輸入。",
      color: "var(--primary)",
    },
    {
      num: "02",
      title: "查找史料",
      body: "使用 Multilingual E5 與 Qdrant 建立向量資料庫，快速找出和問題最相關的歷史內容。",
      color: "var(--primary2)",
    },
    {
      num: "03",
      title: "生成回答",
      body: "結合 Hybrid RAG 與大型語言模型，讓回答更貼近史料脈絡並降低錯誤生成。",
      color: "var(--good)",
    },
    {
      num: "04",
      title: "自然回覆",
      body: "透過 GPT-SoVITS 將文字轉成語音，營造與歷史人物對話的沉浸式感受。",
      color: "var(--warning)",
    },
  ];

  const techs = [
    {
      title: "ASUS ASCENT GX10",
      body: "作為邊緣 AI 運算平台，支援本地推論，讓系統在無外部網路時仍可運作。",
      accent: "var(--primary)",
    },
    {
      title: "Faster-Whisper STT",
      body: "負責語音轉文字，兼顧辨識效率與低延遲，讓互動更即時。",
      accent: "var(--primary2)",
    },
    {
      title: "Qdrant + E5",
      body: "將胡璉將軍相關文本轉為語意向量，提供精準的歷史資料檢索。",
      accent: "var(--good)",
    },
    {
      title: "Hybrid RAG",
      body: "將檢索結果重新排序與篩選，協助模型產生更可靠的導覽內容。",
      accent: "var(--warning)",
    },
    {
      title: "GPT OSS LLM",
      body: "以本地化大型語言模型生成具邏輯與脈絡的回答。",
      accent: "var(--primary)",
    },
    {
      title: "GPT-SoVITS TTS",
      body: "將回覆轉為自然語音，提升導覽角色的臨場感。",
      accent: "var(--primary2)",
    },
  ];

  return (
    <div className="ps-root">
      {/* ── Hero ── */}
      <section className="ps-hero">
        <div className="ps-hero__glow ps-hero__glow--a" />
        <div className="ps-hero__glow ps-hero__glow--b" />
        <div className="container ps-hero__inner">
          <FadeIn className="ps-hero__copy">
            <p className="ps-eyebrow">國立金門大學 資訊工程學系 專題製作</p>
            <h1 className="ps-hero__title">
              AI 即時互動
              <br />
              <span className="ps-gradient-text">導覽系統</span>
            </h1>
            <p className="ps-hero__sub">
              以胡璉將軍為核心導覽角色，結合語音辨識、檢索增強生成、
              大型語言模型與語音合成，讓使用者能用自然對話認識金門歷史與戰地文化。
            </p>
            <div className="ps-hero__actions">
              <a className="ps-btn ps-btn--primary" href="#ps-about">
                了解專題
              </a>
              <a className="ps-btn ps-btn--ghost" href="#ps-tech">
                查看技術
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={200} className="ps-hero__visual">
            <div className="ps-hero__frame">
              <img
                src="/report-media/report-01.png"
                alt="AI 即時互動導覽系統介面截圖"
              />
            </div>
            <p className="ps-hero__caption">系統以語音問答方式提供即時導覽回應</p>
          </FadeIn>
        </div>
      </section>

      {/* ── About ── */}
      <section id="ps-about" className="ps-about ps-band">
        <div className="container">
          <FadeIn>
            <p className="ps-eyebrow">Project Overview</p>
            <h2>把靜態史料變成可互動的導覽體驗</h2>
          </FadeIn>
          <div className="ps-about__grid">
            <FadeIn delay={100} className="ps-about__text">
              <p>
                傳統導覽多半依賴解說牌、紙本資料或固定影片，資訊傳遞較單向，也較難吸引習慣互動式內容的年輕族群。本專題希望透過
                AI 技術，降低導覽人力負擔，同時提升文化介紹的趣味性與沉浸感。
              </p>
              <p>
                系統以被稱為「金門現代恩主公」的胡璉將軍作為虛擬導覽角色，讓使用者可以提出問題，並獲得具備史料依據的語音回覆。
              </p>
            </FadeIn>
            <FadeIn delay={200} className="ps-facts">
              {[
                { label: "導覽主題", value: "金門歷史與胡璉將軍" },
                { label: "互動方式", value: "語音問答" },
                { label: "部署方式", value: "邊緣 AI 本地化運算" },
              ].map((f) => (
                <div key={f.label} className="ps-fact">
                  <span className="ps-fact__label">{f.label}</span>
                  <strong className="ps-fact__value">{f.value}</strong>
                </div>
              ))}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="ps-steps">
        <div className="container">
          <FadeIn>
            <p className="ps-eyebrow">Workflow</p>
            <h2>四步驟閉環流程</h2>
          </FadeIn>
          <div className="ps-steps__grid">
            {steps.map((s, i) => (
              <FadeIn key={s.num} delay={i * 80} className="ps-step">
                <span
                  className="ps-step__num"
                  style={{ background: s.color }}
                >
                  {s.num}
                </span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── System Flow ── */}
      <section id="ps-flow" className="ps-band">
        <div className="container ps-split">
          <FadeIn className="ps-split__copy">
            <p className="ps-eyebrow">System Flow</p>
            <h2>從提問到語音回覆的完整閉環</h2>
            <p className="ps-muted">
              使用者說出問題後，系統會先完成語音辨識，再進入知識檢索與模型生成，最後以合成語音播放回答。
            </p>
          </FadeIn>
          <FadeIn delay={150} className="ps-split__img">
            <img
              src="/report-media/report-08.png"
              alt="AI 導覽系統軟硬體流程圖"
            />
          </FadeIn>
        </div>
      </section>

      {/* ── Demo Video ── */}
      <section id="ps-video" className="ps-video-section">
        <div className="container">
          <FadeIn className="ps-section-head ps-section-head--center">
            <p className="ps-eyebrow">Demo Video</p>
            <h2>成果展示影片</h2>
            <p className="ps-muted">
              透過實際展示影片，可以快速了解 AI 即時互動導覽系統的操作畫面與語音互動成果。
            </p>
          </FadeIn>
          <FadeIn delay={150} className="ps-video__frame">
            <video
              controls
              preload="metadata"
            >
              <source src="/HuLian.mp4" type="video/mp4" />
              您的瀏覽器不支援影片播放。
            </video>
          </FadeIn>
        </div>
      </section>

      {/* ── Tech ── */}
      <section id="ps-tech" className="ps-band">
        <div className="container">
          <FadeIn>
            <p className="ps-eyebrow">Core Technology</p>
            <h2>核心技術模組</h2>
          </FadeIn>
          <div className="ps-tech-grid">
            {techs.map((t, i) => (
              <FadeIn key={t.title} delay={i * 70} className="ps-tech-card">
                <div
                  className="ps-tech-card__bar"
                  style={{ background: t.accent }}
                />
                <h3>{t.title}</h3>
                <p>{t.body}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Local Deployment ── */}
      <section className="ps-deploy">
        <div className="container ps-split ps-split--rev">
          <FadeIn delay={150} className="ps-split__img">
            <img
              src="/report-media/report-04.png"
              alt="ASUS ASCENT GX10 設備圖片"
            />
          </FadeIn>
          <FadeIn className="ps-split__copy">
            <p className="ps-eyebrow">Local Deployment</p>
            <h2>全本地化部署，兼顧反應速度與資料隱私</h2>
            <p className="ps-muted">
              本專題將模型與資料庫部署在邊緣設備上，降低對雲端服務的依賴，也讓導覽場域在網路不穩定時仍能維持基本運作。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Results ── */}
      <section id="ps-results" className="ps-band">
        <div className="container">
          <FadeIn>
            <p className="ps-eyebrow">Results</p>
            <h2>成果亮點</h2>
          </FadeIn>
          <div className="ps-metrics">
            <MetricCard
              value={0.92}
              label="檢索召回率"
              desc="資料庫問答場景中，系統能有效找回相關史料內容。"
              decimals={2}
              delay={0}
            />
            <MetricCard
              value={0.88}
              label="答案相似度"
              desc="生成回答與標準答案具備良好語意一致性。"
              decimals={2}
              delay={100}
            />
            <MetricCard
              value={90}
              suffix="%+"
              label="語音相似度"
              desc="GPT-SoVITS 合成語音具備接近原音檔的聲音表現。"
              decimals={0}
              delay={200}
            />
          </div>
          <div className="ps-charts">
            <FadeIn delay={100} className="ps-chart-card">
              <img
                src="/report-media/report-06.jpg"
                alt="GPT OSS-20B RAGAS 評分圖"
              />
            </FadeIn>
            <FadeIn delay={200} className="ps-chart-card">
              <img
                src="/report-media/report-10.png"
                alt="語音相似度評估圖"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="ps-gallery">
        <div className="container">
          <FadeIn>
            <p className="ps-eyebrow">Gallery</p>
            <h2>系統截圖</h2>
          </FadeIn>
          <div className="ps-gallery__grid">
            {[
              { src: "/report-media/report-02.jpg", alt: "系統截圖 1" },
              { src: "/report-media/report-05.png", alt: "系統截圖 2" },
              { src: "/report-media/report-11.png", alt: "系統截圖 3" },
              { src: "/report-media/report-12.png", alt: "系統截圖 4" },
            ].map((img, i) => (
              <FadeIn key={img.src} delay={i * 80} className="ps-gallery__item">
                <img src={img.src} alt={img.alt} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="ps-team ps-band">
        <div className="container ps-team__inner">
          <FadeIn className="ps-team__copy">
            <p className="ps-eyebrow">Team</p>
            <h2>專題團隊</h2>
            <p className="ps-muted">指導老師：趙于翔 副教授</p>
            <p className="ps-muted">
              專題組員：汪章貴、楊松城、吳尚樺、林彥廷、藍健洲
            </p>
          </FadeIn>
          <FadeIn delay={150} className="ps-team__logo">
            <img
              src="/report-media/report-03.png"
              alt="國立金門大學標誌"
            />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
