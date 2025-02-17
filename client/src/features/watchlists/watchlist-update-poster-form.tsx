'use client';

import { useParams, useRouter } from 'next/navigation';
import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import WatchlistService from '@/services/WatchListService';
import { WatchListDto } from '@/interfaces/watchlist/dto/WatchListDto';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const formSchema = z.object({
  image: z
    .any()
    .refine((files) => files?.length == 1, 'Изображение обязательно.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, 'Максимальный размер файла 5MB.')
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Поддерживаются форматы .jpg, .jpeg, .png и .webp'
    )
});

interface WatchlistPosterUpdateFormProps {
  initialData: WatchListDto | null;
  pageTitle: string;
}

export default function WatchlistPosterUpdateForm({
  initialData,
  pageTitle
}: WatchlistPosterUpdateFormProps) {
  const router = useRouter();
  const { id } = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!id) return;
    const watchlistId = parseInt(String(id));
    if (!watchlistId) return;

    const formData = new FormData();
    formData.append('file', values.image[0]);

    try {
      await WatchlistService.uploadWatchListPhoto(watchlistId, formData);
      toast.success('Постер успешно обновлен');
      router.push(`/watchlists/${watchlistId}`);
    } catch (error) {
      console.error('Failed to update watchlist poster:', error);
      toast.error('Не удалось обновить картинку коллекции');
    }
  }

  function handleSkip() {
    if (!id) return;
    const watchlistId = parseInt(String(id));
    if (!watchlistId) return;
    router.push(`/watchlists/${watchlistId}`);
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Постер коллекции</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      maxFiles={1}
                      maxSize={MAX_FILE_SIZE}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-between'>
              <Button type='submit'>Обновить картинку</Button>
              <Button variant='secondary' onClick={handleSkip}>
                Пропустить
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
