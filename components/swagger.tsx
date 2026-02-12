"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import type { SwaggerUIProps } from "swagger-ui-react";

const SwaggerUI = dynamic(
  () =>
    import("swagger-ui-react") as Promise<{
      default: React.ComponentType<SwaggerUIProps>;
    }>,
  { ssr: false },
);

import "swagger-ui-react/swagger-ui.css";

// Sync Nextra's "dark" class with Swagger UI's "dark-mode" class
function useSyncDarkMode() {
  useEffect(() => {
    const html = document.documentElement;

    const syncDarkMode = () => {
      html.classList.toggle("dark-mode", html.classList.contains("dark"));
    };

    syncDarkMode();

    const observer = new MutationObserver(() => {
      syncDarkMode();
    });

    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      html.classList.remove("dark-mode");
    };
  }, []);
}

export function Swagger() {
  useSyncDarkMode();

  return (
    <SwaggerUI
      url="https://raw.githubusercontent.com/authzed/api/refs/heads/main/docs/apidocs.swagger.json"
      deepLinking={true}
      supportedSubmitMethods={[]}
      tryItOutEnabled={false}
      defaultModelsExpandDepth={-1}
      defaultModelRendering={"model"}
    />
  );
}
