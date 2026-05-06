export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__left">
          <span>© {currentYear} <span id="footerName">Peter</span></span>
          <span className="sep" aria-hidden="true">·</span>
          <span id="lastUpdated">React + TypeScript 重構版</span>
        </div>
        <div className="footer__right">
          <button className="footerLink" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>回頂部</button>
        </div>
      </div>
    </footer>
  );
}
