import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Moon, Sun, Menu } from "lucide-react";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

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
        </nav>

        <div className="topbar__actions">
          <button onClick={toggleTheme} className="btn btn--ghost" type="button" aria-label="切換深色模式">
            <span className="icon" aria-hidden="true">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </span>
            <span className="topbar__actionsText">主題</span>
          </button>
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
        </div>
      </nav>
    </header>
  );
}
