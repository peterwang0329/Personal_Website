import { Routes, Route } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Profile } from "./components/Profile";
import { NovelReader } from "./components/NovelReader";
import { BrickBreaker } from "./components/BrickBreaker";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <a className="skip-link" href="#main">跳到主要內容</a>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main id="main" className="page" role="main">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reader" element={<NovelReader />} />
          <Route path="/game" element={<BrickBreaker />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
