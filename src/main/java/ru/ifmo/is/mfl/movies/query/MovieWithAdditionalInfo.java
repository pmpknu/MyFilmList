package ru.ifmo.is.mfl.movies.query;

import lombok.*;
import jakarta.validation.constraints.*;
import ru.ifmo.is.mfl.movies.Movie;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MovieWithAdditionalInfo extends Movie {

  private Integer currentUserRating;
  private Boolean currentUserViewed;

  public MovieWithAdditionalInfo(Movie movie, Integer currentUserRating, Boolean currentUserViewed) {
    this(
      movie.getId(),
      movie.getTitle(),
      movie.getDescription(),
      movie.getPoster(),
      movie.getReleaseDate(),
      movie.getDuration(),
      movie.getRating(),
      movie.getCategories(),
      movie.getTags(),
      movie.getProductionCountry(),
      movie.getGenres(),
      movie.getActors(),
      movie.getDirector(),
      movie.getSeasons(),
      movie.getSeries(),
      movie.getViewedCounter(),
      movie.getRatedCounter(),
      movie.getReviewedCounter(),
      movie.getCommentsCounter(),
      currentUserRating,
      currentUserViewed
    );
  }

  public MovieWithAdditionalInfo(
    int id,
    @NotNull @NotBlank @Size(max = 127) String title,
    String description,
    @Size(max = 255) String poster,
    LocalDate releaseDate,
    Integer duration,
    Float rating,
    @Size(max = 127) String categories,
    @Size(max = 127) String tags,
    @Size(max = 63) String productionCountry,
    @Size(max = 127) String genres,
    String actors,
    @Size(max = 127) String director,
    Integer seasons,
    Integer series,
    int viewedCounter,
    int ratedCounter,
    int reviewedCounter,
    int commentsCounter,
    Integer currentUserRating,
    Boolean currentUserViewed
  ) {
    super(
      id,
      title,
      description,
      poster,
      releaseDate,
      duration,
      rating,
      categories,
      tags,
      productionCountry,
      genres,
      actors,
      director,
      seasons,
      series,
      viewedCounter,
      ratedCounter,
      reviewedCounter,
      commentsCounter
    );
    this.currentUserRating = currentUserRating;
    this.currentUserViewed = currentUserViewed;
  }
}
