export type LocalDate = string;

export const LocalDateFromString = (date: string): LocalDate => date;
export const DateFromLocalDate = (date: LocalDate): Date => new Date(date);