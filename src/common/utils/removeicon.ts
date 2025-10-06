export const removeEmoji = (str: string) => {
  return str?.split(' ')?.slice(1)?.join(' ');
};