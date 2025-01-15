package ru.ifmo.is.mfl.movies;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ru.ifmo.is.mfl.common.framework.CrudRepository;

import java.util.List;

public interface MovieRepository extends CrudRepository<Movie> {

  @Query(value = "SELECT * FROM recommend_movies(:currentUserId, :limit, :offset)", nativeQuery = true)
  List<Movie> findRecommendedMovies(
    @Param("currentUserId") Integer currentUserId,
    @Param("limit") int limit,
    @Param("offset") int offset
  );
}
