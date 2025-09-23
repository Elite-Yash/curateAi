export const removeEmoji = (str: string) => {
  return str?.replace(/^[^\p{L}\p{N}\s]+/u, "").trim();
};