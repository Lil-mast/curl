export const maktabTheme = {
  token: {
    colorPrimary: "#134e3a",
    colorInfo: "#134e3a",
    colorSuccess: "#134e3a",
    colorWarning: "#b85c38",
    colorLink: "#134e3a",
    colorText: "#1c1915",
    colorTextSecondary: "#4a453d",
    colorBgBase: "#fbf7f1",
    colorBgContainer: "#fffdf9",
    colorBorder: "rgba(28, 25, 21, 0.12)",
    borderRadius: 10,
    fontFamily:
      'var(--font-jakarta), "Segoe UI", system-ui, -apple-system, sans-serif',
    fontSize: 15,
    controlHeight: 42,
    wireframe: false,
  },
  components: {
    Button: {
      primaryShadow: "none",
      defaultBorderColor: "rgba(28, 25, 21, 0.18)",
      defaultColor: "#1c1915",
      fontWeight: 600,
      paddingInline: 18,
    },
    Card: {
      borderRadiusLG: 20,
      paddingLG: 22,
    },
    Drawer: {
      colorBgElevated: "#f6f1e8",
    },
  },
};
