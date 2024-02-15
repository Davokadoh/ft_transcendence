// src/provider.tsx
import { I18nProvider } from "@react-aria/i18n";
import { OverlayProvider } from "@react-aria/overlays";
import { jsx } from "react/jsx-runtime";
var NextUIProvider = ({
  children,
  locale = "en-US",
  ...otherProps
}) => {
  return /* @__PURE__ */ jsx(I18nProvider, { locale, children: /* @__PURE__ */ jsx(OverlayProvider, { ...otherProps, children }) });
};

export {
  NextUIProvider
};
