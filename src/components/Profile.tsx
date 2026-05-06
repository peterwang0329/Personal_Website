import { useState, useEffect, useRef } from "react";
import { PROFILE } from "../data/profile";

export function Profile() {
  const [visibleSkills, setVisibleSkills] = useState(false);
  const skillListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleSkills(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (skillListRef.current) {
      observer.observe(skillListRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="profile" className="section">
      <div className="container">
        {/* About Section */}
        <div className="sectionHead reveal is-visible">
          <h2 className="sectionTitle">關於我</h2>
          <p className="sectionLead">{PROFILE.about.lead}</p>
        </div>

        <div className="aboutGrid">
          <article className="card reveal is-visible">
            <h3 className="card__title">我擅長什麼</h3>
            <p className="card__text">{PROFILE.about.strength}</p>
            <div className="pillRow">
              {PROFILE.about.strengthPills.map((pill) => (
                <span key={pill} className="pill">{pill}</span>
              ))}
            </div>
          </article>

          <article className="card reveal is-visible">
            <h3 className="card__title">我在找什麼</h3>
            <p className="card__text">{PROFILE.about.looking}</p>
            <div className="callout">
              <div className="callout__title">一句話自介</div>
              <div className="callout__body">{PROFILE.about.oneLiner}</div>
            </div>
          </article>
        </div>

        {/* Skills Section */}
        <div className="skillsLayout" style={{ marginTop: "44px" }}>
          <div className="card reveal is-visible">
            <h3 className="card__title">技能雷達（精選）</h3>
            <div className="skillList" ref={skillListRef} aria-label="技能清單">
              {PROFILE.skills.map((skill) => (
                <div key={skill.name} className="skill">
                  <div className="skill__top">
                    <div className="skill__name">{skill.name}</div>
                    <div className="skill__level">{skill.levelLabel}</div>
                  </div>
                  <div className="bar">
                    <span style={{ width: visibleSkills ? `${skill.value}%` : "0%" }}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card reveal is-visible">
            <h3 className="card__title">工具與習慣</h3>
            <ul className="checkList">
              {PROFILE.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
            <div className="divider"></div>
            <h3 className="card__title">我重視的事</h3>
            <div className="pillRow">
              {PROFILE.values.map((val) => (
                <span key={val} className="pill">{val}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Projects & Experience Section */}
        <div className="aboutGrid" style={{ marginTop: "44px" }}>
          <div className="card reveal is-visible">
            <h3 className="card__title" style={{ marginBottom: "18px" }}>作品集</h3>
            <div className="grid projectsGrid" style={{ gridTemplateColumns: "1fr" }}>
              {PROFILE.projects.map((proj) => (
                <article key={proj.title} className="project" style={{ minHeight: "auto" }}>
                  <h3 className="project__title">{proj.title}</h3>
                  <p className="project__desc">{proj.desc}</p>
                  <div className="tags">
                    {proj.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="card reveal is-visible">
            <h3 className="card__title" style={{ marginBottom: "18px" }}>學習與經歷</h3>
            <div className="timeline">
              {PROFILE.experience.map((exp) => (
                <div key={exp.title} className="event">
                  <div className="event__time">{exp.time}</div>
                  <div>
                    <h3 className="event__title">{exp.title}</h3>
                    <p className="event__body">{exp.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
