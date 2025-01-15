package ru.ifmo.is.mfl.watchlists;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ru.ifmo.is.mfl.common.framework.CrudRepository;
import ru.ifmo.is.mfl.users.User;

import java.util.List;
import java.util.Optional;

public interface WatchListRepository extends CrudRepository<WatchList> {

  Optional<WatchList> findByNameAndUser(String name, User user);

  @Query(value = "SELECT * FROM recommend_watch_lists(:currentUserId, :limit, :offset)", nativeQuery = true)
  List<WatchList> findRecommendedWatchLists(
    @Param("currentUserId") Integer currentUserId,
    @Param("limit") int limit,
    @Param("offset") int offset
  );
}
