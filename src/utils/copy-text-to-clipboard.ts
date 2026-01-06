export async function copyTextToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first
  if ("clipboard" in navigator) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Safari iOS may reject clipboard access even with user gesture
      // Log in development for debugging
      if (process.env.NODE_ENV === "development") {
        console.warn("Clipboard API failed, falling back to execCommand:", error);
      }
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
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("execCommand copy failed:", error);
    }
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}