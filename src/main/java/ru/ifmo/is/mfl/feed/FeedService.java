package ru.ifmo.is.mfl.feed;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import ru.ifmo.is.mfl.common.application.ApplicationService;
import ru.ifmo.is.mfl.feed.query.FeedQuery;
import ru.ifmo.is.mfl.movies.MovieMapper;
import ru.ifmo.is.mfl.movies.dto.MovieDto;
import ru.ifmo.is.mfl.watchlists.WatchListMapper;
import ru.ifmo.is.mfl.watchlists.dto.WatchListDto;

@Service
@RequiredArgsConstructor
public class FeedService extends ApplicationService {

  private final FeedQuery query;
  private final FeedPolicy policy;

  private final MovieMapper movieMapper;
  private final WatchListMapper watchListMapper;

  public Page<MovieDto> getRecommendedMovies(Pageable pageable) {
    policy.showAll(currentUser());

    var movies = query.getRecommendedMovies(pageable, currentUser());
    return movies.map(movieMapper::map);
  }

  public Page<WatchListDto> getRecommendedWatchLists(Pageable pageable) {
    policy.showAll(currentUser());

    var movies = query.getRecommendedWatchLists(pageable, currentUser());
    return movies.map(watchListMapper::map);
  }
}
