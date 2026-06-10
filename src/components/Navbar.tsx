import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, LogOut, Library, LogIn, ChevronDown, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // 點擊外部關閉使用者下拉選單
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    closeMenu();
    navigate("/");
  };

  return (
    <header className="topbar" role="banner">
      <div className="container topbar__inner">
        <NavLink className="brand" to="/" aria-label="回到首頁" onClick={closeMenu}>
          <span className="brand__mark" id="brandMark" aria-hidden="true">P</span>
          <span className="brand__text" id="brandText">Peter</span>
        </NavLink>

        <nav className="nav" aria-label="主要導覽">
          <NavLink className="nav__link" to="/">網站介紹</NavLink>
          <NavLink className="nav__link" to="/profile">個人簡介</NavLink>
          <NavLink className="nav__link" to="/reader">小說閱讀器</NavLink>
          <NavLink className="nav__link" to="/game">打磚塊遊戲</NavLink>
          {isAuthenticated && (
            <NavLink className="nav__link" to="/library">我的書庫</NavLink>
          )}
        </nav>

        <div className="topbar__actions">
          <button onClick={toggleTheme} className="btn btn--ghost" type="button" aria-label="切換深色模式">
            <span className="icon" aria-hidden="true">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </span>
            <span className="topbar__actionsText">主題</span>
          </button>

          {/* 使用者狀態 */}
          {isAuthenticated ? (
            <div className="userMenu" ref={userMenuRef}>
              <button
                className="btn btn--ghost userMenu__trigger"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                type="button"
                aria-label="使用者選單"
                aria-expanded={userMenuOpen}
              >
                <span className="userMenu__avatar">
                  {(user?.display_name || user?.username || "U").charAt(0).toUpperCase()}
                </span>
                <span className="userMenu__name">{user?.display_name || user?.username}</span>
                <ChevronDown size={14} className={`userMenu__arrow ${userMenuOpen ? "userMenu__arrow--open" : ""}`} />
              </button>

              {userMenuOpen && (
                <div className="userMenu__dropdown">
                  <div className="userMenu__header">
                    <span className="userMenu__headerName">{user?.display_name || user?.username}</span>
                    <span className="userMenu__headerSub">@{user?.username}</span>
                  </div>
                  <div className="userMenu__divider" />
                  <button
                    className="userMenu__item"
                    onClick={() => { navigate("/library"); setUserMenuOpen(false); }}
                  >
                    <Library size={16} />
                    我的書庫
                  </button>
                  {user?.is_admin && (
                    <>
                      <div className="userMenu__divider" />
                      <button
                        className="userMenu__item userMenu__item--admin"
                        onClick={() => { navigate("/admin"); setUserMenuOpen(false); }}
                      >
                        <Shield size={16} />
                        管理員後台
                      </button>
                    </>
                  )}
                  <div className="userMenu__divider" />
                  <button className="userMenu__item userMenu__item--danger" onClick={handleLogout}>
                    <LogOut size={16} />
                    登出
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn btn--primary btn--sm"
              onClick={() => navigate("/login")}
              type="button"
            >
              <LogIn size={16} />
              <span>登入</span>
            </button>
          )}

          <button 
            onClick={toggleMenu} 
            className="btn btn--ghost topbar__menuBtn" 
            type="button" 
            aria-label="開啟選單" 
            aria-expanded={menuOpen} 
            aria-controls="mobileNav"
          >
            <span className="icon" aria-hidden="true">
              <Menu size={18} />
            </span>
            <span className="topbar__actionsText">選單</span>
          </button>
        </div>
      </div>

      <nav id="mobileNav" className="mobileNav" aria-label="行動版導覽" hidden={!menuOpen}>
        <div className="container mobileNav__inner">
          <NavLink className="mobileNav__link" to="/" onClick={closeMenu}>網站介紹</NavLink>
          <NavLink className="mobileNav__link" to="/profile" onClick={closeMenu}>個人簡介</NavLink>
          <NavLink className="mobileNav__link" to="/reader" onClick={closeMenu}>小說閱讀器</NavLink>
          <NavLink className="mobileNav__link" to="/game" onClick={closeMenu}>打磚塊遊戲</NavLink>
          {isAuthenticated && (
            <NavLink className="mobileNav__link" to="/library" onClick={closeMenu}>
              <Library size={16} style={{ verticalAlign: "middle", marginRight: "6px" }} />
              我的書庫
            </NavLink>
          )}
          {isAuthenticated && user?.is_admin && (
            <NavLink className="mobileNav__link mobileNav__link--admin" to="/admin" onClick={closeMenu}>
              <Shield size={16} style={{ verticalAlign: "middle", marginRight: "6px" }} />
              管理員後台
            </NavLink>
          )}
          {isAuthenticated ? (
            <button className="mobileNav__link" onClick={handleLogout} style={{ width: "100%", textAlign: "left", cursor: "pointer", background: "none", border: "1px solid var(--line)", borderRadius: "14px" }}>
              <LogOut size={16} style={{ verticalAlign: "middle", marginRight: "6px" }} />
              登出（{user?.display_name || user?.username}）
            </button>
          ) : (
            <NavLink className="mobileNav__link" to="/login" onClick={closeMenu}>
              <LogIn size={16} style={{ verticalAlign: "middle", marginRight: "6px" }} />
              登入 / 註冊
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
