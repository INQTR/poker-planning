export async function copyTextToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first
  if ("clipboard" in navigator) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Safari iOS may reject clipboard access even with user gesture
      // Fall through to legacy method
    }
  }

  // Fallback for Safari iOS and older browsers
  return copyWithExecCommand(text);
}

function copyWithExecCommand(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const success = document.execCommand("copy");
    return success;
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}