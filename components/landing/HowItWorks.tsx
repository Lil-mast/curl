"use client";

import { Mic, Bot, Rocket } from "lucide-react";
import { useLanguage } from "./LanguageContext";

const icons = [Mic, Bot, Rocket];

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section className="section" id="how-it-works" aria-labelledby="how-title">
      <div className="wrap">
        <h2 className="section-title" id="how-title">
          {t.how.title}
        </h2>
        <div className="steps">
          {t.how.steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <article className="step" key={step.num}>
                <div className="step-num">
                  {step.num} — {step.title}
                </div>
                <div className="step-icon" aria-hidden="true">
                  <Icon />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
