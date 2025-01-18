import React, { useState, useEffect } from "react";

import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TagManager } from "./TagManager";
import { MovieCreateDto } from '@/interfaces/movie/dto/MovieCreateDto';
import { MovieUpdateDto } from '@/interfaces/movie/dto/MovieUpdateDto';
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { InputMovieInfoProps } from 'types/InputMovieInfoProps';
import { formSchema, MovieFormValue } from "./MovieSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const InputMovieInfo = <T extends MovieCreateDto | MovieUpdateDto>({
  onSubmit,
  initialData,
}: InputMovieInfoProps<T>) => {
  const [isFilm, setIsFilm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState<Date>();
  const [duration, setDuration] = useState<number | undefined>();
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [productionCountry, setProductionCountry] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [actors, setActors] = useState<string[]>([]);
  const [director, setDirector] = useState<string[]>([]);
  const [seasons, setSeasons] = useState(0);
  const [series, setSeries] = useState(0);

  const form = useForm<MovieFormValue>({
    resolver: zodResolver(formSchema),
   });

  const doif = (condition: any, callback: (param: any) => void) => {
    if (condition) callback(condition);
  };

  useEffect(() => {
    if (initialData) {
      doif(initialData.title, setTitle);
      doif(initialData.description, setDescription);
      doif(initialData.releaseDate, setReleaseDate);
      doif(initialData.duration, setDuration);
      doif(initialData.categories?.split(","), setCategories);
      doif(initialData.tags?.split(","), setTags);
      doif(initialData.productionCountry?.split(","), setProductionCountry);
      doif(initialData.genres?.split(","), setGenres);
      doif(initialData.actors?.split(","), setActors);
      doif(initialData.director?.split(","), setDirector);
      doif(initialData.seasons, setSeasons);
      doif(initialData.series, setSeries);
      doif(initialData.seasons === undefined, setIsFilm);
    }
  }, [initialData]);

  const handleToggle = (checked: boolean) => {
    setIsFilm(checked);
    if (checked) {
      setSeasons(0);
      setSeries(0);
    }
  };

  const handleSubmit = () => {
    const data = {
      title,
      description,
      releaseDate,
      duration,
      categories: categories.join(","),
      tags: tags.join(","),
      productionCountry: productionCountry.join(","),
      genres: genres.join(","),
      actors: actors.join(","),
      director: director.join(","),
      seasons: isFilm ? undefined : seasons,
      series: isFilm ? undefined : series,
    } as T;

    onSubmit(data);
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
                    <Input
                      placeholder="Movie Title"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              render={() => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="releaseDate"
              render={() => (
                <FormItem>
                  <FormLabel>Release Date</FormLabel>
                  <FormControl>
                    <Calendar
                      selected={releaseDate}
                      onSelect={setReleaseDate}
                      mode="single"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="duration"
              render={() => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={duration?.toString() || ""}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      placeholder="Duration in minutes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TagManager
              initialItems={categories}
              onItemsChange={setCategories}
              label="Categories"
            />
            <TagManager initialItems={tags} onItemsChange={setTags} label="Tags" />
            <TagManager
              initialItems={productionCountry}
              onItemsChange={setProductionCountry}
              label="Production Country"
            />
            <TagManager initialItems={genres} onItemsChange={setGenres} label="Genres" />
            <TagManager initialItems={actors} onItemsChange={setActors} label="Actors" />
            <TagManager initialItems={director} onItemsChange={setDirector} label="Director" />
            <FormField
              name="isFilm"
              render={() => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Switch checked={isFilm} onCheckedChange={handleToggle} />
                  {isFilm ? "Film" : "Series"}
                </FormItem>
              )}
            />
            {!isFilm && (
              <>
                <FormField
                  name="seasons"
                  render={() => (
                    <FormItem>
                      <FormLabel>Seasons</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={seasons.toString()}
                          onChange={(e) => setSeasons(Number(e.target.value))}
                          placeholder="Number of seasons"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="series"
                  render={() => (
                    <FormItem>
                      <FormLabel>Series</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={series.toString()}
                          onChange={(e) => setSeries(Number(e.target.value))}
                          placeholder="Number of series"
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
