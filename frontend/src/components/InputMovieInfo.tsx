import { Input, Switch, Spacer, Textarea, DateInput, DateValue, Button } from '@nextui-org/react';
import { useState } from 'react';
import { TagManager } from './TagManager';
import { MovieCreateDto } from '@/interfaces/movie/dto/MovieCreateDto';
import { MovieUpdateDto } from '@/interfaces/movie/dto/MovieUpdateDto';
import { InputMovieInfoProps } from '@/types/InputMovieInfoProps';
import { LocalDate, LocalDateFromString } from '@/types/LocalDate';

const InputMovieInfo = <T extends MovieCreateDto | MovieUpdateDto>({ onSubmit }: InputMovieInfoProps<T>) => {
  const [isFilm, setIsFilm] = useState(false);
  const [dateValue, setDateValue] = useState<DateValue>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState<LocalDate>();
  const [duration, setDuration] = useState<number | undefined>();
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [productionCountry, setProductionCountry] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [actors, setActors] = useState<string[]>([]);
  const [director, setDirector] = useState<string[]>([]);
  const [seasons, setSeasons] = useState(0);
  const [series, setSeries] = useState(0);

  const handleToggle = (checked: boolean) => {
    setIsFilm(checked);
    if (checked) {
      setSeasons(0);
      setSeries(0);
    }
  };

  const handleDateChange = (date: DateValue | null) => {
    if (date) {
      setDateValue(date);
      setReleaseDate(LocalDateFromString(`${date.year}-${date.month}-${date.day}`));
    }
  };

  const handleSubmit = () => {
    const data = {
      title,
      description,
      releaseDate,
      duration,
      categories: categories.join(','),
      tags: tags.join(','),
      productionCountry: productionCountry.join(','),
      genres: genres.join(','),
      actors: actors.join(','),
      director: director.join(','),
      seasons: isFilm ? undefined : seasons,
      series: isFilm ? undefined : series,
    } as T;

    onSubmit(data);
  };
  return (
    <div style={{ marginLeft: '20px' }}>
      <h3>Movie Information</h3>
      <Spacer y={1} />
      <Input
        label="Title"
        placeholder="Movie Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        label="Description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <DateInput
        label="Release Date"
        className="max-w-sm"
        value={dateValue}
        onChange={handleDateChange}
      />
      <Input
        label="Duration"
        placeholder="Duration in minutes"
        value={duration?.toString() || ''}
        onChange={(e) => setDuration(Number(e.target.value))}
      />
      <Spacer y={1} />
      <TagManager
        initialItems={[]}
        onItemsChange={setCategories}
        label='Categories'
      />
      <TagManager
        initialItems={[]}
        onItemsChange={setTags}
        label='Tags'
      />
      <TagManager
        initialItems={[]}
        onItemsChange={setProductionCountry}
        label='Production country'
      />
      <TagManager
        initialItems={[]}
        onItemsChange={setGenres}
        label='Genres'
      />
      <TagManager
        initialItems={[]}
        onItemsChange={setActors}
        label='Actors'
      />
      <TagManager
        initialItems={[]}
        onItemsChange={setDirector}
        label='Director'
      />
      <Switch
        checked={isFilm}
        onChange={(e) => handleToggle(e.target.checked)}
      >
        {isFilm ? 'Film' : 'Series'}
      </Switch>
      {!isFilm && (
        <>
          <Input
            label="Seasons"
            type="number"
            value={seasons.toString()}
            onChange={(e) => setSeasons(Number(e.target.value))}
          />
          <Spacer y={0.5} />
          <Input
            label="Series"
            type="number"
            value={series.toString()}
            onChange={(e) => setSeries(Number(e.target.value))}
          />
        </>
      )}
      <Spacer y={1} />
      <Button
        onClick={handleSubmit}
        color="success"
        >Submit</Button>
    </div>
  );
};

export default InputMovieInfo;
