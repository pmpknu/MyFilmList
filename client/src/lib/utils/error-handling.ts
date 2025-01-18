export const extractSeconds = (input: string): number | null => {
  const regex = /(\d+)\s*seconds/;
  const match = input.match(regex);
  return match ? parseInt(match[1], 10) : null;
};
