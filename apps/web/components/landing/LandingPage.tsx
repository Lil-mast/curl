"use client";

import { CommunityImpact } from "./CommunityImpact";
import { FinalCTA } from "./FinalCTA";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { MissionStrip } from "./MissionStrip";
import { Navbar } from "./Navbar";
import { OpportunitySection } from "./OpportunitySection";

export function LandingPage() {
  return (
    <div className="page-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <MissionStrip />
        <OpportunitySection />
        <HowItWorks />
        <CommunityImpact />
        <FinalCTA />
      </main>
    </div>
  );
}
