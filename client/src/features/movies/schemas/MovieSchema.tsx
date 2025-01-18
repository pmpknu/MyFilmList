import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(1).max(255).nonempty("У фильма должно быть название"),
  description: z.string().optional(),
  releaseDate: z.date().optional(),
  duration: z.number().int().positive("Если продолжительность неизвестна, оставьте поле пустым").optional(),
  categories: z.string().max(127).optional(),
  tags: z.string().max(127).optional(),
  productionCountry: z.string().max(63).optional(),
  genres: z.string().max(127).optional(),
  actors: z.string().optional(),
  director: z.string().max(127).optional(),
  seasons: z.number().int().nonnegative("Количество сезонов не может быть отрицательным").optional(),
  series: z.number().int().nonnegative("Количество серий не может быть отрицательным").optional(),
})

export type MovieFormValue = z.infer<typeof formSchema>