"use client";

import "@ant-design/v5-patch-for-react-19";
import { App, ConfigProvider } from "antd";
import { LanguageProvider } from "@/components/landing/LanguageContext";
import { AppProvider } from "@/lib/store";
import { maktabTheme } from "./theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={maktabTheme}>
      <App>
        <LanguageProvider>
          <AppProvider>{children}</AppProvider>
        </LanguageProvider>
      </App>
    </ConfigProvider>
  );
}
