import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PROFILE } from "../data/profile";

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % PROFILE.roles.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(PROFILE.links.email).then(() => {
      alert("已複製 Email");
    });
  };

  return (
    <section id="home" className="hero">
      <div className="container hero__grid">
        <div className="hero__copy">
          <div className="badge reveal is-visible">
            <span className="dot" aria-hidden="true"></span>
            <span>{PROFILE.statusText}</span>
          </div>

          <h1 className="hero__title reveal is-visible">
            你好，我是 <span className="gradText">{PROFILE.name}</span>。
          </h1>

          <p className="hero__subtitle reveal is-visible">
            <span>{PROFILE.headlinePrefix}</span>
            <span className="role">{PROFILE.roles[roleIndex]}</span>
            <span className="caret" aria-hidden="true"></span>
          </p>

          <p className="hero__summary reveal is-visible">
            {PROFILE.summary}
          </p>

          <div className="hero__cta reveal is-visible">
            <Link className="btn btn--primary" to="/profile">看簡介</Link>
            <button onClick={copyEmail} className="btn btn--ghost" type="button">
              複製 Email
            </button>
          </div>

          <div className="hero__meta reveal is-visible">
            <div className="metaItem">
              <span className="metaItem__label">所在地</span>
              <span className="metaItem__value">{PROFILE.location}</span>
            </div>
            <div className="metaItem">
              <span className="metaItem__label">主要技能</span>
              <span className="metaItem__value">{PROFILE.topSkillText}</span>
            </div>
            <div className="metaItem">
              <span className="metaItem__label">目前狀態</span>
              <span className="metaItem__value">{PROFILE.availability}</span>
            </div>
          </div>
        </div>

        <div className="hero__card reveal is-visible">
          <div className="profile">
            <div className="profile__avatar" aria-hidden="true">
              <div className="avatarRing"></div>
              <div className="avatarFace">
                <span className="avatarInitial">{PROFILE.name[0]}</span>
              </div>
            </div>
            <div className="profile__info">
              <div className="profile__nameRow">
                <h2 className="profile__name">{PROFILE.name}</h2>
                <span className="chip">{PROFILE.chipText}</span>
              </div>
              <p className="profile__desc">{PROFILE.cardDesc}</p>
              <div className="profile__links">
                <a className="linkBtn" href={PROFILE.links.github} target="_blank" rel="noreferrer">GitHub</a>
                <a className="linkBtn" href={PROFILE.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              </div>
            </div>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat__num">{PROFILE.stats.years}</div>
              <div className="stat__label">經驗</div>
            </div>
            <div className="stat">
              <div className="stat__num">{PROFILE.stats.projects}</div>
              <div className="stat__label">作品 / 專案</div>
            </div>
            <div className="stat">
              <div className="stat__num">{PROFILE.stats.focus}</div>
              <div className="stat__label">求職方向</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__bg" aria-hidden="true">
        <div className="blob blob--a"></div>
        <div className="blob blob--b"></div>
        <div className="gridGlow"></div>
      </div>
    </section>
  );
}
