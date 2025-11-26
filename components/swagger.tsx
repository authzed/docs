"use client"

import dynamic from "next/dynamic";
import type { SwaggerUIProps } from "swagger-ui-react";

const SwaggerUI = dynamic(
  () =>
    import("swagger-ui-react") as Promise<{
      default: React.ComponentType<SwaggerUIProps>;
    }>,
  { ssr: false },
);

import "swagger-ui-react/swagger-ui.css";

export function Swagger() {
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
