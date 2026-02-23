/**
 * Generates a random guest display name like "Guest 4829".
 * Users can change their name later via the user menu.
 */
export function generateGuestName(): string {
  const number = Math.floor(1000 + Math.random() * 9000);
  return `Guest ${number}`;
}
