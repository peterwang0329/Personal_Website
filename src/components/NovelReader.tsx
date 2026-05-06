import React, { useState, useRef, useEffect } from "react";
import { Upload, ChevronLeft, ChevronRight, Settings2, List, Maximize, Minimize, X } from "lucide-react";

interface Chapter {
  title: string;
  content: string;
}

export function NovelReader() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [readerTheme, setReaderTheme] = useState<"light" | "sepia" | "dark" | "gray" | "green">("light");
  const [showSettings, setShowSettings] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseText(text);
    };
    reader.readAsText(file);
  };

  const parseText = (text: string) => {
    // 簡單的章節分割邏輯：尋找 "第X章" 或 "Chapter X"
    const chapterRegex = /(?=第[一二三四五六七八九十百千零0-9]+[章回節]\s|Chapter\s+\d+)/g;
    const parts = text.split(chapterRegex);

    if (parts.length === 1) {
      // 若無章節格式，則整包當作第一章
      setChapters([{ title: "開始閱讀", content: parts[0] }]);
      setCurrentChapter(0);
      return;
    }

    const parsedChapters = parts.map((part, index) => {
      const lines = part.trim().split('\n');
      const title = lines[0].trim() || `第 ${index + 1} 章`;
      const content = lines.slice(1).join('\n').trim();
      return { title, content };
    });

    setChapters(parsedChapters.filter(c => c.content.length > 0));
    setCurrentChapter(0);
  };

  useEffect(() => {
    // 切換章節時回到頂部
    if (readerRef.current) {
      readerRef.current.scrollTop = 0;
    }
  }, [currentChapter]);

  useEffect(() => {
    // 開啟章節列表時，自動捲動到當前章節
    if (showChapterList) {
      setTimeout(() => {
        document.getElementById(`chapter-${currentChapter}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 50);
    }
  }, [showChapterList, currentChapter]);

  const getThemeStyles = () => {
    switch (readerTheme) {
      case "sepia": return { backgroundColor: "#f4ecd8", color: "#433422" };
      case "dark": return { backgroundColor: "#1a1a1a", color: "#e0e0e0" };
      case "gray": return { backgroundColor: "#d9d5d5ff", color: "#333333" };
      case "green": return { backgroundColor: "#acefb9ff", color: "#1b4d26" };
      default: return { backgroundColor: "#ffffff", color: "#333333" };
    }
  };

  return (
    <section id="reader" className="section section--alt">
      <div className="container">
        <div className="sectionHead reveal is-visible">
          <h2 className="sectionTitle">小說閱讀器</h2>
          <p className="sectionLead">上傳 TXT 檔案即可開始閱讀，支援自動章節分割與護眼模式。</p>
          <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-start" }}>
            <label className="btn btn--primary" style={{ cursor: "pointer", margin: 0, display: "inline-flex", alignItems: "center" }}>
              <Upload size={18} style={{ marginRight: "8px" }} />
              上傳 TXT 檔
              <input type="file" accept=".txt" onChange={handleFileUpload} style={{ display: "none" }} />
            </label>
          </div>
        </div>

        <div className="card reveal is-visible" style={isFullScreen ? {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9998,
          margin: 0,
          borderRadius: 0,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflowY: "auto",
          backgroundColor: getThemeStyles().backgroundColor,
          color: getThemeStyles().color,
        } : { position: "relative", display: "flex", flexDirection: "column" }}>
          {/* Toolbar */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {chapters.length > 0 && (
                <span style={{ fontSize: "14px", color: "var(--muted)", marginRight: "10px", display: "flex", alignItems: "center" }}>
                  {currentChapter + 1} / {chapters.length} 章
                </span>
              )}
              {chapters.length > 0 && (
                <button className="btn btn--ghost btn--sm" onClick={() => setShowChapterList(true)} title="章節列表">
                  <List size={18} />
                </button>
              )}
              <button className="btn btn--ghost btn--sm" onClick={() => setShowSettings(!showSettings)} title="閱讀設定">
                <Settings2 size={18} />
              </button>
              <button className="btn btn--ghost btn--sm" onClick={() => setIsFullScreen(!isFullScreen)} title={isFullScreen ? "退出全螢幕" : "全螢幕"}>
                {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="callout" style={{ marginBottom: "16px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <div>
                <span className="callout__title" style={{ display: "block", marginBottom: "8px" }}>字體大小</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="btn btn--ghost btn--sm" onClick={() => setFontSize(f => Math.max(12, f - 2))}>A-</button>
                  <span style={{ display: "inline-flex", alignItems: "center" }}>{fontSize}px</span>
                  <button className="btn btn--ghost btn--sm" onClick={() => setFontSize(f => Math.min(32, f + 2))}>A+</button>
                </div>
              </div>
              <div>
                <span className="callout__title" style={{ display: "block", marginBottom: "8px" }}>閱讀主題</span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button className={`btn btn--sm ${readerTheme === 'light' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setReaderTheme('light')}>明亮</button>
                  <button className={`btn btn--sm ${readerTheme === 'sepia' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setReaderTheme('sepia')}>護眼</button>
                  <button className={`btn btn--sm ${readerTheme === 'dark' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setReaderTheme('dark')}>深色</button>
                  <button className={`btn btn--sm ${readerTheme === 'gray' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setReaderTheme('gray')}>灰色</button>
                  <button className={`btn btn--sm ${readerTheme === 'green' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setReaderTheme('green')}>淺綠</button>
                </div>
              </div>
            </div>
          )}

          {/* Reader Area */}
          <div
            ref={readerRef}
            style={{
              ...getThemeStyles(),
              borderRadius: isFullScreen ? "0" : "12px",
              padding: isFullScreen ? "5vw 10vw" : "24px",
              minHeight: "400px",
              maxHeight: isFullScreen ? "none" : "60vh",
              flex: isFullScreen ? 1 : "auto",
              overflowY: "auto",
              transition: "background-color 0.3s, color 0.3s"
            }}
          >
            {chapters.length === 0 ? (
              <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "inherit", opacity: 0.6 }}>
                請上傳小說檔案以開始閱讀...
              </div>
            ) : (
              <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <h3 style={{ fontSize: `${fontSize * 1.5}px`, marginTop: 0, marginBottom: "24px", borderBottom: "1px solid currentColor", paddingBottom: "12px" }}>
                  {chapters[currentChapter].title}
                </h3>
                <div style={{ fontSize: `${fontSize}px`, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                  {chapters[currentChapter].content}
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {chapters.length > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
              <button
                className="btn btn--ghost"
                disabled={currentChapter === 0}
                onClick={() => setCurrentChapter(c => Math.max(0, c - 1))}
              >
                <ChevronLeft size={18} /> 上一章
              </button>

              <button
                className="btn btn--ghost"
                disabled={currentChapter === chapters.length - 1}
                onClick={() => setCurrentChapter(c => Math.min(chapters.length - 1, c + 1))}
              >
                下一章 <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Chapter List Sidebar */}
        {showChapterList && (
          <>
            <div
              style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 }}
              onClick={() => setShowChapterList(false)}
            />
            <div
              style={{
                position: "fixed", top: 0, right: 0, bottom: 0, width: "300px", maxWidth: "80vw",
                ...getThemeStyles(),
                zIndex: 10000, padding: "20px",
                boxShadow: "-2px 0 10px rgba(0,0,0,0.2)",
                transition: "transform 0.3s ease",
                display: "flex", flexDirection: "column"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0 }}>章節列表</h3>
                <button className="btn btn--ghost btn--sm" onClick={() => setShowChapterList(false)}>
                  <X size={20} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto", flex: 1, paddingRight: "8px" }}>
                {chapters.map((chap, idx) => (
                  <button
                    key={idx}
                    id={`chapter-${idx}`}
                    onClick={() => {
                      setCurrentChapter(idx);
                      setShowChapterList(false);
                    }}
                    style={{
                      textAlign: "left",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "none",
                      background: currentChapter === idx ? (readerTheme === 'dark' ? '#333' : 'rgba(0,0,0,0.08)') : 'transparent',
                      color: "inherit",
                      cursor: "pointer",
                      fontWeight: currentChapter === idx ? "bold" : "normal",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      if (currentChapter !== idx) e.currentTarget.style.background = readerTheme === 'dark' ? '#2a2a2a' : 'rgba(0,0,0,0.04)';
                    }}
                    onMouseLeave={(e) => {
                      if (currentChapter !== idx) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {chap.title}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
