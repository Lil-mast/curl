"use client";

import { useEffect, useState } from "react";
import { Button, Drawer, Dropdown } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Brand } from "./BrandMark";
import { useLanguage } from "./LanguageContext";
import type { Lang } from "./copy";

const links = [
  { href: "#how-it-works", key: "how" as const },
  { href: "#opportunities", key: "opportunities" as const },
  { href: "#about", key: "about" as const },
];

export function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const langItems: MenuProps["items"] = [
    { key: "so", label: "🇸🇴 Somali" },
    { key: "en", label: "🇬🇧 English" },
  ];

  const onLangClick: MenuProps["onClick"] = ({ key }) => {
    setLang(key as Lang);
  };

  const languageButton = (
    <Dropdown
      menu={{ items: langItems, onClick: onLangClick, selectedKeys: [lang] }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Button className="lang-btn" aria-label="Language">
        <span aria-hidden="true">{lang === "so" ? "🇸🇴" : "🇬🇧"}</span>
        <span className="lang-label">{lang === "so" ? "Somali" : "English"}</span>
      </Button>
    </Dropdown>
  );

  const navAnchors = (
    <>
      {links.map((link) => (
        <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
          {t.nav[link.key]}
        </a>
      ))}
    </>
  );

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <Brand />
        <nav className="nav-links" aria-label="Primary">
          {navAnchors}
        </nav>
        <div className="nav-actions">
          {languageButton}
          <Button type="primary" href="/assistant" className="nav-cta">
            {t.nav.try}
          </Button>
          <Button
            className="menu-btn"
            type="text"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            icon={<MenuOutlined />}
            onClick={() => setOpen(true)}
          />
        </div>
      </div>
      <Drawer
        title="Maktab AI"
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
        width={300}
      >
        <nav className="drawer-links" id="mobile-nav" aria-label="Mobile">
          {navAnchors}
        </nav>
        <div style={{ marginTop: 24 }}>
          <Button type="primary" href="/assistant" block size="large">
            {t.nav.try}
          </Button>
        </div>
      </Drawer>
    </header>
  );
}
