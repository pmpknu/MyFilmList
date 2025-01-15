import { Input, Switch, Spacer, Textarea, DateInput, DateValue, Button } from '@nextui-org/react';
import { CalendarDate } from '@internationalized/date';
import { useEffect, useState } from 'react';
import { TagManager } from './TagManager';
import { MovieCreateDto } from '@/interfaces/movie/dto/MovieCreateDto';
import { MovieUpdateDto } from '@/interfaces/movie/dto/MovieUpdateDto';
import { InputMovieInfoProps } from '@/types/InputMovieInfoProps';
import { DateFromLocalDate, LocalDate, LocalDateFromString } from '@/types/LocalDate';

const InputMovieInfo = <T extends MovieCreateDto | MovieUpdateDto>({ onSubmit, initialData }: InputMovieInfoProps<T>) => {
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

  const doif = (condition: any, callback: (param: any) => void) => {
    if (condition) callback(condition);
  }

  useEffect(() => {
    if (initialData) {
      doif(initialData.title, setTitle)
      doif(initialData.description, setDescription);
      doif(initialData.releaseDate,handleLocalDateChange);
      doif(initialData.duration,setDuration);
      doif(initialData.categories?.split(','),setCategories);
      doif(initialData.tags?.split(',') ,setTags);
      doif(initialData.productionCountry?.split(','),setProductionCountry);
      doif(initialData.genres?.split(','),setGenres);
      doif(initialData.actors?.split(','),setActors);
      doif(initialData.director?.split(',') ,setDirector);
      doif(initialData.seasons,setSeasons);
      doif(initialData.series,setSeries);
      doif(initialData.seasons === undefined,setIsFilm);
    }
  }, [initialData]);

  const handleToggle = (checked: boolean) => {
    setIsFilm(checked);
    if (checked) {
      setSeasons(0);
      setSeries(0);
    }
  };

  const handleLocalDateChange = (date: LocalDate | null) => {
    if (date) {
      setReleaseDate(date);
      const dateValue = DateFromLocalDate(date);
      setDateValue(new CalendarDate(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDay())
      );
    }
  }

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

  const handleInitialItems = (initialItems: string | null | undefined) => {
    if (!initialItems) return [];
    return initialItems?.split(',');
  }

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
        initialItems={handleInitialItems(initialData?.categories)}
        onItemsChange={setCategories}
        label='Categories'
      />
      <TagManager
        initialItems={handleInitialItems(initialData?.tags)}
        onItemsChange={setTags}
        label='Tags'
      />
      <TagManager
        initialItems={handleInitialItems(initialData?.productionCountry)}
        onItemsChange={setProductionCountry}
        label='Production country'
      />
      <TagManager
        initialItems={handleInitialItems(initialData?.genres)}
        onItemsChange={setGenres}
        label='Genres'
      />
      <TagManager
        initialItems={handleInitialItems(initialData?.actors)}
        onItemsChange={setActors}
        label='Actors'
      />
      <TagManager
        initialItems={handleInitialItems(initialData?.director)}
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
