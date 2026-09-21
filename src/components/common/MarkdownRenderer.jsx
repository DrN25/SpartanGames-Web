import React from "react";

/**
 * Tokenizes inline Markdown: bold (**), italic (*), code (`), links ([text](url))
 */
export function renderInlineMarkdown(text) {
  if (!text) return null;

  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={i} className="font-bold text-slate-950 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={i} className="italic text-slate-800 dark:text-slate-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded font-mono text-[11px] bg-slate-100 dark:bg-black/50 text-amber-700 dark:text-[#FFDE17] border border-slate-200 dark:border-gray-800"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-600 dark:text-[#FFDE17] underline font-bold hover:opacity-80 transition-opacity"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export function isTableRow(line) {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.length > 2;
}

export function isTableSeparator(line) {
  const trimmed = line.trim();
  return /^\|?(\s*:?-+:?\s*\|?)+$/.test(trimmed) && trimmed.includes("-");
}

export function parseTableRow(line) {
  const trimmed = line.trim();
  const stripped = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return stripped.split("|").map((cell) => cell.trim());
}

/**
 * Full Markdown Renderer: supports Headings, Tables, Lists, Code Blocks, Quotes, and Paragraphs
 * Colors dynamically optimized for high-contrast visibility in both Light and Dark modes
 */
export default function MarkdownRenderer({ content, className = "" }) {
  if (!content) return null;

  const lines = content.split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      i++;
      continue;
    }

    // 1. Code Block: ```
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      i++;
      const codeLines = [];
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: "code", lang, code: codeLines.join("\n") });
      continue;
    }

    // 2. Markdown Table: line has pipes and next line is a separator
    if (isTableRow(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const headers = parseTableRow(line);
      i += 2; // skip header and separator
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(parseTableRow(lines[i]));
        i++;
      }
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    // 3. Headings: ###, ##, #
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2]
      });
      i++;
      continue;
    }

    // 4. Unordered Lists: -, *, •
    if (/^[-*•]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*•]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // 5. Ordered Lists: 1., 2., etc.
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // 6. Blockquotes: >
    if (line.startsWith("> ")) {
      blocks.push({ type: "quote", text: line.slice(2) });
      i++;
      continue;
    }

    // 7. Regular Paragraph
    blocks.push({ type: "p", text: line });
    i++;
  }

  return (
    <div className={`markdown-body space-y-1.5 ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === "heading") {
          if (block.level === 1) {
            return (
              <div
                key={idx}
                className="text-xs font-black mt-3 mb-1.5 text-slate-950 dark:text-[#FFDE17] uppercase tracking-wider pb-1 border-b border-slate-200 dark:border-gray-800"
              >
                {renderInlineMarkdown(block.text)}
              </div>
            );
          }
          if (block.level === 2) {
            return (
              <div
                key={idx}
                className="text-xs font-black mt-2.5 mb-1 text-slate-900 dark:text-amber-400 uppercase tracking-wide"
              >
                {renderInlineMarkdown(block.text)}
              </div>
            );
          }
          return (
            <div
              key={idx}
              className="text-xs font-bold mt-2 mb-0.5 text-slate-900 dark:text-slate-100"
            >
              {renderInlineMarkdown(block.text)}
            </div>
          );
        }

        if (block.type === "table") {
          return (
            <div
              key={idx}
              className="overflow-x-auto my-3 rounded-xl border border-slate-300 dark:border-gray-800 shadow-xs max-w-full bg-white dark:bg-[#0c1018]"
            >
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-gray-800">
                    {block.headers.map((th, thIdx) => (
                      <th
                        key={thIdx}
                        className="px-2.5 py-1.5 font-black text-slate-950 dark:text-[#FFDE17] whitespace-nowrap"
                      >
                        {renderInlineMarkdown(th)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 dark:divide-gray-800">
                  {block.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={
                        rIdx % 2 === 0
                          ? "bg-white dark:bg-[#131923]"
                          : "bg-slate-50/80 dark:bg-[#0f141f]"
                      }
                    >
                      {row.map((td, tdIdx) => (
                        <td
                          key={tdIdx}
                          className="px-2.5 py-1.5 text-slate-800 dark:text-slate-200 whitespace-nowrap font-medium"
                        >
                          {renderInlineMarkdown(td)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "code") {
          return (
            <div
              key={idx}
              className="my-2.5 p-2.5 rounded-xl font-mono text-[11px] overflow-x-auto border leading-relaxed bg-[#0b0f17] text-amber-300 border-gray-800 shadow-inner"
            >
              {block.lang && (
                <div className="text-[9px] uppercase font-bold text-slate-500 mb-1 border-b border-gray-800 pb-0.5">
                  {block.lang}
                </div>
              )}
              <pre className="whitespace-pre">{block.code}</pre>
            </div>
          );
        }

        if (block.type === "ul") {
          return (
            <ul key={idx} className="my-1.5 pl-4 space-y-1 list-disc text-slate-800 dark:text-slate-200">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-xs leading-relaxed">
                  {renderInlineMarkdown(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={idx} className="my-1.5 pl-4 space-y-1 list-decimal text-slate-800 dark:text-slate-200">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-xs leading-relaxed">
                  {renderInlineMarkdown(item)}
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={idx}
              className="my-2 pl-3 py-1 border-l-2 border-amber-500 italic text-[11px] bg-amber-500/10 text-slate-800 dark:text-slate-200 rounded-r-lg"
            >
              {renderInlineMarkdown(block.text)}
            </blockquote>
          );
        }

        return (
          <p key={idx} className="my-1 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
            {renderInlineMarkdown(block.text)}
          </p>
        );
      })}
    </div>
  );
}
