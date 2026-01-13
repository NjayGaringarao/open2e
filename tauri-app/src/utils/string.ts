export const normalize = (q: string) =>
  q
    .normalize("NFD") // decompose combined letters
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^\w\s]/g, "") // strip symbols
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // invisible characters
    .replace(/\s+/g, " ") // collapse spaces
    .trim()
    .toLocaleLowerCase("en"); // case normalization

export const getDisplayTime = (date: Date): string => {
  const now = new Date();

  const isSameDay =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  const options: Intl.DateTimeFormatOptions = isSameDay
    ? { hour: "numeric", minute: "numeric", hour12: true }
    : {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

  return date.toLocaleString(undefined, options);
};

export const hashSHA256 = async (text: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};
