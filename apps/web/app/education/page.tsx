"use client";

import { Catalog } from "@/components/catalog";
import { t } from "@/lib/i18n";
import { useApp } from "@/lib/store";

export default function EducationPage() {
  const { lang } = useApp();
  return <Catalog title={t("education", lang)} kinds={["education"]} />;
}
