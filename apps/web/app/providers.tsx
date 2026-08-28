"use client";

import "@ant-design/v5-patch-for-react-19";
import { App, ConfigProvider } from "antd";
import { LanguageProvider } from "@/components/landing/LanguageContext";
import { maktabTheme } from "./theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={maktabTheme}>
      <App>
        <LanguageProvider>{children}</LanguageProvider>
      </App>
    </ConfigProvider>
  );
}
