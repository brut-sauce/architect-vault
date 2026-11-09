import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { ReactNode } from "react";
import { slugify } from "@/lib/reference-shared";
import { Mermaid } from "./mermaid";

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

/** Renders a note written in Markdown (GFM tables, task lists, code highlighting). */
export function Markdown({ source }: { source: string }) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, plainText: ["mermaid", "text"] }]]}
        components={{
          h2: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
          h3: ({ children }) => <h3 id={slugify(textOf(children))}>{children}</h3>,
          a: ({ href, children }) => (
            <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              {children}
            </a>
          ),
          pre: ({ children }) => {
            const child = Array.isArray(children) ? children[0] : children;
            const cls =
              child && typeof child === "object" && "props" in child
                ? String((child as { props: { className?: string } }).props.className ?? "")
                : "";
            if (/\blanguage-mermaid\b/.test(cls)) return <Mermaid chart={textOf(children)} />;
            return <pre>{children}</pre>;
          },
          table: ({ children }) => (
            <div className="md-table">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
