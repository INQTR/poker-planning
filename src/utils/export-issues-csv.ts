import type { ExportableIssue } from "@/convex/model/issues";

/**
 * Escapes a CSV field value (handles commas, quotes, newlines)
 */
function escapeCSVField(value: string | number | null): string {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  // If contains comma, quote, or newline, wrap in quotes and escape existing quotes
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Formats a number for CSV (rounds to 1 decimal place)
 */
function formatNumber(value: number | null): string {
  if (value === null) return "";
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

/**
 * Converts issues data to CSV format
 */
export function issuesToCSV(issues: ExportableIssue[]): string {
  const headers = [
    "Title",
    "Final Estimate",
    "Status",
    "Voted At",
    "Vote Count",
    "Average",
    "Median",
    "Agreement %",
    "Notes",
  ];
  const headerRow = headers.join(",");

  const dataRows = issues.map((issue) =>
    [
      escapeCSVField(issue.title),
      escapeCSVField(issue.finalEstimate),
      escapeCSVField(issue.status),
      escapeCSVField(issue.votedAt),
      escapeCSVField(issue.voteCount),
      escapeCSVField(formatNumber(issue.average)),
      escapeCSVField(formatNumber(issue.median)),
      escapeCSVField(issue.agreement !== null ? `${issue.agreement}%` : null),
      escapeCSVField(issue.notes),
    ].join(",")
  );

  return [headerRow, ...dataRows].join("\n");
}

/**
 * Triggers a browser download of the CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports issues to a CSV file and triggers download
 */
export function exportIssuesToCSV(
  issues: ExportableIssue[],
  roomName: string
): void {
  const csvContent = issuesToCSV(issues);
  const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const sanitizedRoomName = roomName.replace(/[^a-zA-Z0-9-_]/g, "_");
  const filename = `${sanitizedRoomName}_issues_${timestamp}.csv`;
  downloadCSV(csvContent, filename);
}
