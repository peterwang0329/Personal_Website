/**
 * 登入 / 註冊頁面
 * 整合登入與註冊表單，可透過 Tab 切換
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { ApiError } from "../utils/apiClient";

type AuthTab = "login" | "register";

export function LoginPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 已登入就導向首頁
  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  const switchTab = (tab: AuthTab) => {
    setActiveTab(tab);
    setError("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setDisplayName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 前端驗證
    if (username.trim().length < 3) {
      setError("使用者名稱至少需要 3 個字元");
      return;
    }
    if (password.length < 6) {
      setError("密碼至少需要 6 個字元");
      return;
    }
    if (activeTab === "register" && password !== confirmPassword) {
      setError("兩次密碼輸入不一致");
      return;
    }

    setIsSubmitting(true);

    try {
      if (activeTab === "login") {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), password, displayName.trim() || undefined);
      }
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail);
      } else {
        setError("發生未知錯誤，請稍後再試");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="authPage">
          {/* 裝飾背景 */}
          <div className="authPage__bg">
            <div className="blob blob--a" />
            <div className="blob blob--b" />
          </div>

          {/* 登入卡片 */}
          <div className="authCard reveal is-visible">
            <div className="authCard__header">
              <h1 className="authCard__title">
                {activeTab === "login" ? "歡迎回來" : "建立帳號"}
              </h1>
              <p className="authCard__subtitle">
                {activeTab === "login"
                  ? "登入以同步您的閱讀進度與書庫"
                  : "註冊帳號，開始管理您的閱讀紀錄"
                }
              </p>
            </div>

            {/* Tab 切換 */}
            <div className="authTabs">
              <button
                className={`authTab ${activeTab === "login" ? "authTab--active" : ""}`}
                onClick={() => switchTab("login")}
                type="button"
              >
                <LogIn size={16} />
                登入
              </button>
              <button
                className={`authTab ${activeTab === "register" ? "authTab--active" : ""}`}
                onClick={() => switchTab("register")}
                type="button"
              >
                <UserPlus size={16} />
                註冊
              </button>
            </div>

            {/* 錯誤訊息 */}
            {error && (
              <div className="authError">
                <span>{error}</span>
              </div>
            )}

            {/* 表單 */}
            <form className="authForm" onSubmit={handleSubmit}>
              <div className="field">
                <label className="field__label" htmlFor="auth-username">使用者名稱</label>
                <input
                  id="auth-username"
                  type="text"
                  placeholder="輸入使用者名稱"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {activeTab === "register" && (
                <div className="field">
                  <label className="field__label" htmlFor="auth-display-name">顯示名稱（選填）</label>
                  <input
                    id="auth-display-name"
                    type="text"
                    placeholder="在網站上顯示的名稱"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              )}

              <div className="field">
                <label className="field__label" htmlFor="auth-password">密碼</label>
                <div className="passwordField">
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="輸入密碼"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={activeTab === "login" ? "current-password" : "new-password"}
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="passwordToggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "隱藏密碼" : "顯示密碼"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {activeTab === "register" && (
                <div className="field">
                  <label className="field__label" htmlFor="auth-confirm-password">確認密碼</label>
                  <input
                    id="auth-confirm-password"
                    type="password"
                    placeholder="再次輸入密碼"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn--primary authSubmitBtn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="spinIcon" />
                    處理中...
                  </>
                ) : (
                  <>
                    {activeTab === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
                    {activeTab === "login" ? "登入" : "建立帳號"}
                  </>
                )}
              </button>
            </form>

            {/* 底部切換提示 */}
            <div className="authFooter">
              {activeTab === "login" ? (
                <p>
                  還沒有帳號？{" "}
                  <button className="authSwitchBtn" onClick={() => switchTab("register")} type="button">
                    立即註冊
                  </button>
                </p>
              ) : (
                <p>
                  已有帳號？{" "}
                  <button className="authSwitchBtn" onClick={() => switchTab("login")} type="button">
                    前往登入
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
