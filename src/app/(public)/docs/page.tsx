"use client";

import dynamic from "next/dynamic";
// @ts-ignore
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocsPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_SWAGGER !== "true") {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>🚫 Documentação desativada neste ambiente</h2>
      </div>
    );
  }

  return <SwaggerUI url="/api/docs" />;
}
