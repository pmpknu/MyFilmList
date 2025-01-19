'use client';

import React from "react";
import { Role } from "@/interfaces/role/model/UserRole";
import { RootState } from "@/store";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import InputMovieInfo from "./schemas/InputMovieForm";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSelector } from "react-redux";
import { MovieDto } from "@/interfaces/movie/dto/MovieDto";
import MovieService from "@/services/MovieService";
import { MovieUpdateDto } from "@/interfaces/movie/dto/MovieUpdateDto";

export default function MovieUpdateForm({ className, ...props }: React.ComponentProps<'div'>) {
  const isUserAuthenticated : boolean = useSelector((state: RootState) => state.auth.isAuthenticated)
  const isUserAdmin : boolean = useSelector(
    (state: RootState) =>
      !!(state.auth.user?.roles.includes(Role.ROLE_ADMIN))
  )

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (!isUserAdmin) {
      toast.error('У вас недостаточно прав для обновления фильма');
      router.push(callbackUrl ?? '/');
    } else if (!isUserAuthenticated) {
      toast.error('Для обновления фильма необходимо войти в аккаунт');
      router.push(callbackUrl ?? '/auth/sign-in');
    }
    console.log('User is admin:', isUserAdmin);
    console.log('User is auth-ed:', isUserAuthenticated);
  }, [router, isUserAuthenticated, isUserAdmin]);

  useEffect(() => {
    if (!id) return;
    const movieId = parseInt(String(id));
    if (!movieId) return;
    
    setLoading(true);
    MovieService.getMovieById(movieId)
    .then((response) => {
      setMovie(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Failed to fetch movie details', error);
      setLoading(false);
    });
  }, [id]);


  const [movie, setMovie] = React.useState<MovieDto>();

  const handleMovieSubmit = (data: MovieUpdateDto) => {
    console.log("Submitting data:", data);
    if (!id) return;
    const movieId = parseInt(String(id));
    if (!movieId) return;
    MovieService.updateMovie(movieId, data)
      .then((response) => {
        setMovie(response.data);
        router.push(`/movies/update/${movieId}/poster`);
        toast.success("Фильм успешно обновлен");
      })
      .catch((error) => {
        console.error("Failed to create movie", error);
        toast.error("Не удалось обновить фильм");
      });
  };

  if (!movie) {
    toast.error('Фильм не найден');
    return (
      <div className="text-center">
        <h2>Фильм не найден</h2>
      </div>
    );
  } 

  return (
    <>
      <ScrollArea className="h-[66vh] rounded-md border">
        <InputMovieInfo
          onSubmit={handleMovieSubmit}
          initialData={movie}
        />
      </ScrollArea>
    </>
  );
}
