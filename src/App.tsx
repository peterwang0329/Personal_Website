import { Routes, Route } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Profile } from "./components/Profile";
import { NovelReader } from "./components/NovelReader";
import { BrickBreaker } from "./components/BrickBreaker";
import { LoginPage } from "./components/LoginPage";
import { Library } from "./components/Library";
import { AdminPanel } from "./components/AdminPanel";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <AuthProvider>
      <a className="skip-link" href="#main">跳到主要內容</a>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main id="main" className="page" role="main">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reader" element={<NovelReader />} />
          <Route path="/game" element={<BrickBreaker />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/library" element={<Library />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>

      <Footer />
    </AuthProvider>
  );
}

export default App;
