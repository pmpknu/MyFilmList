import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardBody, CardHeader, Spacer, Chip, Spinner } from "@nextui-org/react";
import WatchListService from "@/services/WatchListService";
import { WatchListDto } from "@/interfaces/watchlist/dto/WatchListDto";
import { MovieWithAdditionalInfoDto } from "@/interfaces/movie/dto/MovieWithAdditionalInfoDto";
import MoviePoster from "@/components/MoviePoster";

const WatchListDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [watchList, setWatchList] = useState<WatchListDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingW, setLoadingW] = useState(true);
  const [movies, setMovies] = useState<MovieWithAdditionalInfoDto[]>([]);

  useEffect(() => {
    if (!id) return;
    const watchListId = parseInt(String(id));
    if (!watchListId) return;

    setLoading(true);

    WatchListService.getWatchListById(watchListId)
      .then((response) => {
        setWatchList(response.data);
        setLoadingW(false);
      })
      .catch((error) => {
        console.error("Failed to fetch watchlist movies", error);
        setLoadingW(false);
      });
    WatchListService.getMoviesInWatchList(watchListId)
      .then((response) => {
        setMovies(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch watchlist movies", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spinner color="warning" label="Loading..." />;

  if (!watchList) return <div>No watchlist found</div>;

  return (
    <Card>
      <CardHeader>
        <h2>{watchList.name}</h2>
      </CardHeader>
      <CardBody>
        <p>
          Visibility: {watchList.visibility ? "Public" : "Private"}
        </p>
        <Spacer y={1} />
        <h3>Movies in Watchlist:</h3>
        {movies && movies.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {movies.map((movie, index) => (
              <MoviePoster
                key={index}
                posterUrl={movie.poster}
                title={movie.title}
                handleFunction={() => router.push(`/movie/${movie.id}`)}
              />
            ))}
          </div>
        )} : {(
          <p>No movies added yet.</p>
        )}
      </CardBody>
    </Card>
  );
};

export default WatchListDetail;
