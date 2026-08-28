"use client";

import { Catalog } from "@/components/catalog";
import { t } from "@/lib/i18n";
import { useApp } from "@/lib/store";

export default function OpportunitiesPage() {
  const { lang } = useApp();
  return <Catalog title={t("opportunities", lang)} />;
}
