/**
 * AES-256-GCM encryption utilities for OAuth token storage.
 * Uses Web Crypto API (available in Convex actions).
 */

const ALGORITHM = "AES-GCM";

// Helper to convert Uint8Array to ArrayBuffer accepted by Web Crypto API
function toBuffer(arr: Uint8Array): ArrayBuffer {
  return arr.buffer.slice(arr.byteOffset, arr.byteOffset + arr.byteLength) as ArrayBuffer;
}

export async function encryptToken(
  plaintext: string,
  keyHex: string
): Promise<{ ciphertext: string; iv: string; authTag: string }> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await crypto.subtle.importKey(
    "raw",
    toBuffer(hexToBuffer(keyHex)),
    ALGORITHM,
    false,
    ["encrypt"]
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv: toBuffer(iv) },
    key,
    encoder.encode(plaintext)
  );

  // GCM appends the 16-byte auth tag to the ciphertext
  const encryptedArray = new Uint8Array(encrypted);
  const ciphertext = encryptedArray.slice(0, -16);
  const authTag = encryptedArray.slice(-16);

  return {
    ciphertext: bufferToHex(ciphertext),
    iv: bufferToHex(iv),
    authTag: bufferToHex(authTag),
  };
}

export async function decryptToken(
  ciphertext: string,
  iv: string,
  authTag: string,
  keyHex: string
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    toBuffer(hexToBuffer(keyHex)),
    ALGORITHM,
    false,
    ["decrypt"]
  );

  // Reconstruct ciphertext + authTag for GCM decryption
  const ciphertextBuf = hexToBuffer(ciphertext);
  const authTagBuf = hexToBuffer(authTag);
  const combined = new Uint8Array(ciphertextBuf.length + authTagBuf.length);
  combined.set(ciphertextBuf);
  combined.set(authTagBuf, ciphertextBuf.length);

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: toBuffer(hexToBuffer(iv)) },
    key,
    toBuffer(combined)
  );

  return new TextDecoder().decode(decrypted);
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
