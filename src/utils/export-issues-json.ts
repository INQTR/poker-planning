import type { EnhancedExportableIssue } from "@/convex/model/issues";
import { downloadFile } from "./download-file";

/**
 * Exports issues to a JSON file and triggers download
 */
export function exportIssuesToJSON(
  issues: EnhancedExportableIssue[],
  roomName: string
): void {
  const data = {
    exportedAt: new Date().toISOString(),
    roomName,
    issueCount: issues.length,
    issues,
  };

  const jsonContent = JSON.stringify(data, null, 2);
  const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const sanitizedRoomName = roomName.replace(/[^a-zA-Z0-9-_]/g, "_");
  const filename = `${sanitizedRoomName}_issues_${timestamp}.json`;
  downloadFile(jsonContent, filename, "application/json;charset=utf-8;");
}
