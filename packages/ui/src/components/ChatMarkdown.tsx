/**
 * @file packages/ui/src/components/ChatMarkdown.tsx
 * @description Lightweight React Markdown renderer for AI Copilot responses.
 * Supports headings, bold, italic, inline code, code blocks, lists, blockquotes, rules, and tables.
 * @author yuva.devlab@gmail.com
 */

import { Fragment, type ReactNode } from "react";

export interface ChatMarkdownProps {
  /** Raw GitHub-flavored markdown text */
  readonly content: string;
}

function renderInline(text: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("`")) {
      tokens.push(<code key={keyIdx++}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**")) {
      tokens.push(<strong key={keyIdx++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      tokens.push(<em key={keyIdx++}>{token.slice(1, -1)}</em>);
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }
  return tokens;
}

function parseTableCells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableSeparator(line: string): boolean {
  return /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(line.trim());
}

/**
 * Renders markdown content inside AI Copilot message bubbles.
 */
export function ChatMarkdown({ content }: ChatMarkdownProps) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const raw = lines[i] ?? "";
    const trimmed = raw.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? "").trim().startsWith("```")) {
        codeLines.push(lines[i] ?? "");
        i++;
      }
      i++;
      blocks.push(
        <pre key={blockKey++} className="chat-md-pre">
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    if (/^[-*_]{3,}$/.test(trimmed)) {
      blocks.push(<hr key={blockKey++} className="chat-md-hr" />);
      i++;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1]?.length ?? 3;
      const body = renderInline(headingMatch[2] ?? "");
      if (level <= 2) blocks.push(<h3 key={blockKey++}>{body}</h3>);
      else if (level === 3) blocks.push(<h4 key={blockKey++}>{body}</h4>);
      else blocks.push(<h5 key={blockKey++}>{body}</h5>);
      i++;
      continue;
    }

    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && (lines[i] ?? "").trim().startsWith(">")) {
        quoteLines.push((lines[i] ?? "").trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote key={blockKey++} className="chat-md-quote">
          {quoteLines.map((q, idx) => (
            <Fragment key={idx}>
              {idx > 0 && <br />}
              {renderInline(q)}
            </Fragment>
          ))}
        </blockquote>,
      );
      continue;
    }

    if (trimmed.includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1] ?? "")) {
      const headers = parseTableCells(trimmed);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && (lines[i] ?? "").includes("|") && (lines[i] ?? "").trim()) {
        rows.push(parseTableCells(lines[i] ?? ""));
        i++;
      }
      blocks.push(
        <div key={blockKey++} className="chat-md-table-wrap">
          <table className="chat-md-table">
            <thead>
              <tr>
                {headers.map((h, idx) => (
                  <th key={idx}>{renderInline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {headers.map((_, cIdx) => (
                    <td key={cIdx}>{renderInline(row[cIdx] ?? "")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test((lines[i] ?? "").trim())) {
        items.push((lines[i] ?? "").trim().replace(/^[-*+]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={blockKey++} className="chat-md-list">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test((lines[i] ?? "").trim())) {
        items.push((lines[i] ?? "").trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={blockKey++} className="chat-md-list is-ordered">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const paraLines: string[] = [trimmed];
    i++;
    while (
      i < lines.length &&
      (lines[i] ?? "").trim() &&
      !/^(#{1,4}\s|>|[-*+]\s|\d+\.\s|```|[-*_]{3,}$)/.test((lines[i] ?? "").trim())
    ) {
      paraLines.push((lines[i] ?? "").trim());
      i++;
    }
    blocks.push(
      <p key={blockKey++}>
        {paraLines.map((line, idx) => (
          <Fragment key={idx}>
            {idx > 0 && " "}
            {renderInline(line)}
          </Fragment>
        ))}
      </p>,
    );
  }

  return <div className="chat-md">{blocks}</div>;
}
