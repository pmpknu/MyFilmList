import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { TagManager } from "./TagManager";
import { formSchema, MovieFormValue } from "./MovieSchema";
import { MovieCreateDto } from "@/interfaces/movie/dto/MovieCreateDto";
import { MovieUpdateDto } from "@/interfaces/movie/dto/MovieUpdateDto";

interface InputMovieInfoProps<T extends MovieCreateDto | MovieUpdateDto> {
  onSubmit: (data: T) => void;
  initialData?: Partial<T>;
}

const InputMovieInfo = <T extends MovieFormValue>({
  onSubmit,
  initialData,
}: InputMovieInfoProps<T>) => {
  const form = useForm<MovieFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      ...initialData,
    },
  });

  const [isFilm, setIsFilm] = React.useState(form.watch("seasons") === undefined);

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: MovieFormValue) => {
    const formattedData: MovieFormValue = {
      ...data,
    };

    onSubmit(formattedData as T);
  };

  const handleSplitItems = (initialItems: string | null | undefined) => {
    if (!initialItems) return [];
    return initialItems?.split(',');
  }

  const hadnleJoinItems = (items: string[]) => items.join(',');

  const handleToggle = (checked: boolean) => {
    setIsFilm(checked);
    if (checked) {
      form.setValue("seasons", undefined);
      form.setValue("series", undefined);
    }
  };

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Movie Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="releaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Date</FormLabel>
                  <FormControl>
                    <Calendar
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={ (val) => {
                        if (val) {
                          const year = val?.getFullYear();
                          const month = (val?.getMonth() + 1).toString().padStart(2, '0');
                          const day = val?.getDate().toString().padStart(2, '0');
                          const formattedDate = `${year}-${month}-${day}`;
                          field.onChange(formattedDate);
                        }

                      }}
                      mode="single" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Duration in minutes"
                      {...field}
                      onChange={(e) => form.setValue("duration", Number(e.target.value))}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TagManager
              initialItems={handleSplitItems(form.watch("categories"))}
              onItemsChange={(items) => form.setValue("categories", hadnleJoinItems(items))}
              label="Categories"
            />
            <TagManager
              initialItems={handleSplitItems(form.watch("tags"))}
              onItemsChange={(items) => form.setValue("tags", hadnleJoinItems(items))}
              label="Tags"
            />
            <TagManager
              initialItems={handleSplitItems(form.watch("productionCountry"))}
              onItemsChange={(items) => form.setValue("productionCountry", hadnleJoinItems(items))}
              label="Production Country"
            />
            <TagManager
              initialItems={handleSplitItems(form.watch("genres"))}
              onItemsChange={(items) => form.setValue("genres", hadnleJoinItems(items))}
              label="Genres"
            />
            <TagManager
              initialItems={handleSplitItems(form.watch("actors"))}
              onItemsChange={(items) => form.setValue("actors", hadnleJoinItems(items))}
              label="Actors"
            />
            <TagManager
              initialItems={handleSplitItems(form.watch("director"))}
              onItemsChange={(items) => form.setValue("director", hadnleJoinItems(items))}
              label="Director"
            />
            <FormField
              name="isFilm"
              render={() => (
                <FormItem>
                  <Switch checked={isFilm} onCheckedChange={handleToggle} />
                  {isFilm ? "Film" : "Series"}
                </FormItem>
              )}
            />
            {!isFilm && (
              <>
                <FormField
                  control={form.control}
                  name="seasons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seasons</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Number of seasons"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          value={field.value || ''} // Ensure value is never undefined
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="series"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Series</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Number of series"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InputMovieInfo;
