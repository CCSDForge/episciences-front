export const alphabet: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export const START_YEAR = 1960;

export const allYears = (): number[] => {
  const years = [];

  const start = START_YEAR;
  const end = new Date().getFullYear();

  for (let year = end; year >= start; year--) {
    years.push(year);
  }

  return years;
}