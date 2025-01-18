'use client';

import React from "react";
import { Role } from "@/interfaces/role/model/UserRole";
import { RootState } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import InputMovieInfo from "./schemas/InputMovieForm";
import { ScrollArea } from "@/components/ui/scroll-area"
import { MovieCreateDto } from "@/interfaces/movie/dto/MovieCreateDto";
import { useSelector } from "react-redux";
import { MovieDto } from "@/interfaces/movie/dto/MovieDto";
import MovieService from "@/services/MovieService";

export default function MovieCreateForm({ className, ...props }: React.ComponentProps<'div'>) {
  const isUserAuthenticated : boolean = useSelector((state: RootState) => state.auth.isAuthenticated)
  const isUserAdmin : boolean = useSelector(
    (state: RootState) =>
      !!(state.auth.user?.roles.includes(Role.ROLE_ADMIN))
  )

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  useEffect(() => {
    if (!isUserAdmin) {
      toast.error('У вас недостаточно прав для создания фильма');
      router.push(callbackUrl ?? '/');
    } else if (!isUserAuthenticated) {
      toast.error('Для создания фильма необходимо войти в аккаунт');
      router.push(callbackUrl ?? '/auth/sign-in');
    }
    console.log('User is admin:', isUserAdmin);
    console.log('User is auth-ed:', isUserAuthenticated);
  }, [router, isUserAuthenticated, isUserAdmin]);

  const [movie, setMovie] = React.useState<MovieDto>();

  const handleMovieSubmit = (data: MovieCreateDto) => {
    console.log("Submitting data:", data);
    MovieService.createMovie(data)
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error("Failed to create movie", error);
      });
  };

  return (
    <>
      <ScrollArea className="h-[66vh] rounded-md border">
        <InputMovieInfo 
          onSubmit={handleMovieSubmit}
        />
      </ScrollArea>
    </>
  );
}
