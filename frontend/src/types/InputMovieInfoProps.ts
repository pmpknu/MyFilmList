export type InputMovieInfoProps<T> = {
    onSubmit: (data: T) => void;
    initialData?: T;
  };
