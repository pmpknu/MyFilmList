import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { formSchema, WatchlistFormValue } from './WatchListSchema';
import { WatchListCreateDto } from '@/interfaces/watchlist/dto/WatchListCreateDto';
import { WatchListUpdateDto } from '@/interfaces/watchlist/dto/WatchListUpdateDto';

interface InputWatchListInfoProps<T extends WatchListCreateDto | WatchListUpdateDto> {
  onSubmit: (data: T) => void;
  initialData?: Partial<T>;
}

const InputWatchListInfo = <T extends WatchlistFormValue>({
  onSubmit,
  initialData
}: InputWatchListInfoProps<T>) => {
  const form = useForm<WatchlistFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      ...initialData
    }
  });

  useEffect(() => {
    if (initialData) {
      console.log('RESETING FORM by data: ', initialData);
      form.reset({
        ...initialData
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: WatchlistFormValue) => {
    const formattedData: WatchlistFormValue = {
      ...data
    };

    onSubmit(formattedData as T);
  };

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder='Watchlist Title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='visibility'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Доступность</FormLabel>
                  <FormControl>
                    <div>
                    <Switch
                      checked={field.value === undefined ? true : field.value}
                      onCheckedChange={(c) => form.setValue('visibility', c)}
                    />
                      {field.value === undefined
                        ? 'Публичный'
                        : field.value
                          ? 'Публичный'
                          : 'Приватный'}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InputWatchListInfo;
