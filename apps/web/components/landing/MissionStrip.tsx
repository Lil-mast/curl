"use client";

import { GlobalOutlined, RobotOutlined, TeamOutlined } from "@ant-design/icons";
import { useLanguage } from "./LanguageContext";

const icons = [TeamOutlined, GlobalOutlined, RobotOutlined];

export function MissionStrip() {
  const { t } = useLanguage();

  return (
    <section className="mission" aria-labelledby="mission-title">
      <div className="wrap">
        <div className="mission-card">
          <h2 id="mission-title">{t.mission.title}</h2>
          <div className="mission-grid">
            {t.mission.items.map((item, index) => {
              const Icon = icons[index];
              return (
                <article className="mission-item" key={item.title}>
                  <div className="mission-icon" aria-hidden="true">
                    <Icon />
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
