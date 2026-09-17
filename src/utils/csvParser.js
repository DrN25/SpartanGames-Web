/**
 * Robust RFC 4180-compliant CSV Parser.
 * Handles embedded quotes (""), commas within quoted fields, and CRLF/LF line endings.
 */
export function parseCSV(text) {
  if (!text || typeof text !== "string") return [];
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentToken = "";

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        currentToken += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      row.push(currentToken.trim());
      currentToken = "";
    } else if ((c === "\r" || c === "\n") && !inQuotes) {
      if (c === "\r" && next === "\n") {
        i++;
      }
      row.push(currentToken.trim());
      currentToken = "";
      if (row.length > 1 || (row.length === 1 && row[0] !== "")) {
        lines.push(row);
      }
      row = [];
    } else {
      currentToken += c;
    }
  }

  if (currentToken || row.length > 0) {
    row.push(currentToken.trim());
    if (row.length > 1 || (row.length === 1 && row[0] !== "")) {
      lines.push(row);
    }
  }

  return lines;
}
