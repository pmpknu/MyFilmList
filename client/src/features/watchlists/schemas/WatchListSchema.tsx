import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(1).max(255).nonempty('У коллекции должно быть название'),
  visibility: z.boolean().optional()
});

export type WatchlistFormValue = z.infer<typeof formSchema>;
