"use client";

import { useTheme } from "next-themes";
import { useEffect, useId, useState } from "react";

/** Renders a ```mermaid block as an SVG diagram, recoloured for light/dark theme. */
export function Mermaid({ chart }: { chart: string }) {
  const { resolvedTheme } = useTheme();
  const rawId = useId();
  const id = "mmd-" + rawId.replace(/[^a-zA-Z0-9]/g, "");
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const dark = resolvedTheme === "dark";

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
          themeVariables: dark
            ? {
                background: "#151826",
                primaryColor: "#1f2440",
                primaryTextColor: "#e8eaf3",
                primaryBorderColor: "#8d73ff",
                lineColor: "#9298b0",
                secondaryColor: "#173434",
                tertiaryColor: "#1c2032",
                edgeLabelBackground: "#151826",
                clusterBkg: "#1c2032",
                clusterBorder: "#262b40",
                fontSize: "14px",
              }
            : {
                background: "#ffffff",
                primaryColor: "#f0ecff",
                primaryTextColor: "#141726",
                primaryBorderColor: "#6d4aff",
                lineColor: "#646a82",
                secondaryColor: "#e3f5f5",
                tertiaryColor: "#f1f2f7",
                edgeLabelBackground: "#ffffff",
                clusterBkg: "#f6f7fb",
                clusterBorder: "#e4e6ef",
                fontSize: "14px",
              },
          flowchart: { curve: "basis", padding: 12, htmlLabels: true },
        });
        const { svg } = await mermaid.render(`${id}-${dark ? "d" : "l"}`, chart.trim());
        if (!cancelled) {
          setSvg(svg);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, resolvedTheme, id]);

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-[12.5px] text-red-600">
        <p className="font-semibold">Diagram error</p>
        <pre className="mt-1 whitespace-pre-wrap">{error.split("\n").slice(0, 4).join("\n")}</pre>
      </div>
    );
  }

  return (
    <div
      className="mermaid-diagram flex justify-center overflow-x-auto rounded-xl border border-border bg-surface p-4"
      aria-busy={!svg}
      // SVG produced by mermaid with securityLevel "strict" (labels are escaped).
      dangerouslySetInnerHTML={{ __html: svg || '<p class="text-[13px] text-muted">Drawing diagram…</p>' }}
    />
  );
}
