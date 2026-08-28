"use client";

import { Catalog } from "@/components/catalog";
import { t } from "@/lib/i18n";
import { useApp } from "@/lib/store";

export default function ScholarshipsPage() {
  const { lang } = useApp();
  return (
    <div className="space-y-4">
      <p className="rounded-2xl bg-gold/35 px-4 py-3 text-sm font-medium">{t("scholarshipCaution", lang)}</p>
      <Catalog title={t("scholarships", lang)} kinds={["scholarship"]} />
    </div>
  );
}
