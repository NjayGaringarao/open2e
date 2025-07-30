export const normalize = (q: string) =>
  q
    .normalize("NFD") // decompose combined letters
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^\w\s]/g, "") // strip symbols
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // invisible characters
    .replace(/\s+/g, " ") // collapse spaces
    .trim()
    .toLocaleLowerCase("en"); // case normalization
