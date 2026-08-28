"use client";

import {
  ArrowRightOutlined,
  BookOutlined,
  GlobalOutlined,
  ReadOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Card, Col, Row } from "antd";
import { useLanguage } from "./LanguageContext";

const icons = [ReadOutlined, SolutionOutlined, BookOutlined, GlobalOutlined];

export function OpportunitySection() {
  const { t } = useLanguage();

  return (
    <section className="section" id="opportunities" aria-labelledby="opp-title">
      <div className="wrap">
        <p className="section-kicker">{t.opportunities.kicker}</p>
        <h2 className="section-title" id="opp-title">
          {t.opportunities.title}
        </h2>
        <p className="section-lede">{t.opportunities.lede}</p>
        <Row
          gutter={[
            { xs: 12, sm: 16, md: 18 },
            { xs: 12, sm: 16, md: 18 },
          ]}
          className="opp-row"
        >
          {t.opportunities.cards.map((card, index) => {
            const Icon = icons[index];
            return (
              <Col xs={24} sm={12} lg={6} key={card.title}>
                <Card className="opp-card" variant="outlined" hoverable>
                  <div className="opp-icon" aria-hidden="true">
                    <Icon />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <span className="opp-more">
                    {t.opportunities.more} <ArrowRightOutlined />
                  </span>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </section>
  );
}
