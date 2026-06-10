/**
 * 個人書庫頁面
 * 展示使用者上傳的書籍、書籤
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Trash2, BookmarkIcon,
  Clock, ChevronDown, ChevronUp, Loader2, Library as LibraryIcon,
  LogIn, AlertCircle, ArrowRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch, ApiError } from "../utils/apiClient";

interface Book {
  id: number;
  file_name: string;
  novel_name: string;
  total_chapters: number;
  current_chapter: number;
  font_size: number;
  reader_theme: string;
  last_read_at: string;
  created_at: string;
}

interface Bookmark {
  id: number;
  book_id: number;
  chapter_index: number;
  title: string | null;
  note: string | null;
  created_at: string;
}

type LibraryTab = "books" | "bookmarks";

export function Library() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<LibraryTab>("books");
  const [books, setBooks] = useState<Book[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 展開的書籍詳情
  const [expandedBookId, setExpandedBookId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError("");

    try {
      const booksData = await apiFetch<Book[]>("/api/books");
      setBooks(booksData);

      // 取得所有書籍的書籤
      const allBookmarks: Bookmark[] = [];
      for (const book of booksData) {
        try {
          const bm = await apiFetch<Bookmark[]>(`/api/books/${book.id}/bookmarks`);
          allBookmarks.push(...bm);
        } catch {
          // 個別失敗不影響整體
        }
      }
      setBookmarks(allBookmarks);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail);
      } else {
        setError("載入資料失敗");
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteBook = async (bookId: number) => {
    if (!confirm("確定要刪除此書籍嗎？相關的書籤也會一併刪除。")) return;
    try {
      await apiFetch(`/api/books/${bookId}`, { method: "DELETE" });
      setBooks(prev => prev.filter(b => b.id !== bookId));
      setBookmarks(prev => prev.filter(bm => bm.book_id !== bookId));
    } catch {
      alert("刪除失敗");
    }
  };

  const handleDeleteBookmark = async (bookmarkId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 避免觸發卡片的跳轉事件
    try {
      await apiFetch(`/api/bookmarks/${bookmarkId}`, { method: "DELETE" });
      setBookmarks(prev => prev.filter(bm => bm.id !== bookmarkId));
    } catch {
      alert("刪除書籤失敗");
    }
  };

  const handleBookmarkClick = (bm: Bookmark) => {
    // 跳轉至對應書籍，並帶上章節 index
    navigate(`/reader?bookId=${bm.book_id}&chapterIndex=${bm.chapter_index}`);
  };

  const getBookName = (bookId: number) => {
    return books.find(b => b.id === bookId)?.novel_name || "未知書籍";
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  // 未登入提示
  if (!authLoading && !isAuthenticated) {
    return (
      <section className="section">
        <div className="container">
          <div className="libraryEmpty">
            <LogIn size={48} className="libraryEmpty__icon" />
            <h2>請先登入</h2>
            <p className="libraryEmpty__text">登入帳號以查看您的個人書庫與閱讀紀錄。</p>
            <button className="btn btn--primary" onClick={() => navigate("/login")}>
              <LogIn size={18} />
              前往登入
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="sectionHead reveal is-visible">
          <h2 className="sectionTitle">
            <LibraryIcon size={28} style={{ verticalAlign: "middle", marginRight: "10px" }} />
            我的書庫
          </h2>
          <p className="sectionLead">管理您的書籍、閱讀進度與書籤。</p>
        </div>

        {/* Tab 導覽 */}
        <div className="filterBar reveal is-visible">
          <span className="filterBar__title">分類瀏覽</span>
          <div className="filterBar__buttons">
            <button
              className="tabBtn"
              aria-selected={activeTab === "books"}
              onClick={() => setActiveTab("books")}
            >
              <BookOpen size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />
              書籍 ({books.length})
            </button>
            <button
              className="tabBtn"
              aria-selected={activeTab === "bookmarks"}
              onClick={() => setActiveTab("bookmarks")}
            >
              <BookmarkIcon size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />
              書籤 ({bookmarks.length})
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="libraryEmpty">
            <Loader2 size={32} className="spinIcon" />
            <p>載入中...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="authError" style={{ marginBottom: "16px" }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* 書籍列表 */}
        {!isLoading && activeTab === "books" && (
          <div className="grid reveal is-visible" style={{ gap: "14px" }}>
            {books.length === 0 ? (
              <div className="libraryEmpty">
                <BookOpen size={48} className="libraryEmpty__icon" />
                <h3>尚無書籍</h3>
                <p className="libraryEmpty__text">前往小說閱讀器上傳您的第一本書吧！</p>
                <button className="btn btn--primary" onClick={() => navigate("/reader")}>
                  <BookOpen size={18} />
                  前往閱讀器
                </button>
              </div>
            ) : (
              books.map((book) => (
                <div key={book.id} className="libraryBook card">
                  <div className="libraryBook__header">
                    <div className="libraryBook__info">
                      <h3 className="libraryBook__title">{book.novel_name}</h3>
                      <div className="libraryBook__meta">
                        <span className="chip">
                          {book.current_chapter + 1} / {book.total_chapters} 章
                        </span>
                        <span className="libraryBook__date">
                          <Clock size={12} />
                          {formatDate(book.last_read_at)}
                        </span>
                      </div>
                    </div>
                    <div className="libraryBook__actions">
                      <button
                        className="btn btn--primary btn--sm"
                        onClick={() => navigate(`/reader?bookId=${book.id}`)}
                        title="繼續閱讀"
                      >
                        <BookOpen size={16} />
                      </button>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => setExpandedBookId(expandedBookId === book.id ? null : book.id)}
                        title="詳細資訊"
                      >
                        {expandedBookId === book.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button
                        className="btn btn--ghost btn--sm libraryBook__deleteBtn"
                        onClick={() => handleDeleteBook(book.id)}
                        title="刪除書籍"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* 進度條 */}
                  <div className="libraryBook__progress">
                    <div className="bar">
                      <span style={{ width: `${book.total_chapters > 0 ? ((book.current_chapter + 1) / book.total_chapters * 100) : 0}%` }} />
                    </div>
                    <span className="libraryBook__progressText">
                      {book.total_chapters > 0 ? Math.round((book.current_chapter + 1) / book.total_chapters * 100) : 0}%
                    </span>
                  </div>

                  {/* 展開的詳細資訊 */}
                  {expandedBookId === book.id && (
                    <div className="libraryBook__details">
                      <div className="libraryBook__detailRow">
                        <span>檔案名稱</span>
                        <span>{book.file_name}</span>
                      </div>
                      <div className="libraryBook__detailRow">
                        <span>字體大小</span>
                        <span>{book.font_size}px</span>
                      </div>
                      <div className="libraryBook__detailRow">
                        <span>閱讀主題</span>
                        <span>{book.reader_theme}</span>
                      </div>
                      <div className="libraryBook__detailRow">
                        <span>加入時間</span>
                        <span>{formatDate(book.created_at)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* 書籤列表 */}
        {!isLoading && activeTab === "bookmarks" && (
          <div className="grid reveal is-visible" style={{ gap: "14px" }}>
            {bookmarks.length === 0 ? (
              <div className="libraryEmpty">
                <BookmarkIcon size={48} className="libraryEmpty__icon" />
                <h3>尚無書籤</h3>
                <p className="libraryEmpty__text">在閱讀小說時，可以為喜歡的章節加入書籤。</p>
              </div>
            ) : (
              bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="card libraryBookmark"
                  onClick={() => handleBookmarkClick(bm)}
                  style={{ cursor: "pointer" }}
                  title={`前往《${getBookName(bm.book_id)}》第 ${bm.chapter_index + 1} 章`}
                >
                  <div className="libraryBookmark__header">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
                      <BookmarkIcon size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <span className="libraryBookmark__bookName">{getBookName(bm.book_id)}</span>
                        <span className="chip" style={{ marginLeft: "8px" }}>
                          第 {bm.chapter_index + 1} 章
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                      {/* 跳轉提示箭頭 */}
                      <ArrowRight size={15} style={{ color: "var(--muted)", opacity: 0.6 }} />
                      <button
                        className="btn btn--ghost btn--sm libraryBook__deleteBtn"
                        onClick={(e) => handleDeleteBookmark(bm.id, e)}
                        title="刪除書籤"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {bm.title && <p className="libraryBookmark__title">{bm.title}</p>}
                  {bm.note && <p className="libraryBookmark__note">{bm.note}</p>}
                  <span className="libraryBookmark__date">{formatDate(bm.created_at)}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
