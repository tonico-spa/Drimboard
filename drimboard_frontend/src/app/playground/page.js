"use client";

import EmbeddedPage from "@/components/EmbeddedPage";

export default function PlaygroundPage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        paddingTop: 72,
        boxSizing: "border-box",
      }}
    >
      <EmbeddedPage
        url="https://blockly-web.dplpleoajxzor.amplifyapp.com/"
        allowedOrigins={["https://blockly-web.dplpleoajxzor.amplifyapp.com"]}
        savedProjects={[]}
        onProjectsChange={() => {}}
      />
    </div>
  );
}
