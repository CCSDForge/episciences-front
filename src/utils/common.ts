export enum MODE {
  TILE = 'tile',
  LIST = 'list'
};

export const alphabet: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export const years = (): number[] => {
  const allYears = [];

  const start = 2018;
  const end = new Date().getFullYear();

  for (let year = start; year <= end; year++) {
    allYears.push(year);
  }

  return allYears;
} 