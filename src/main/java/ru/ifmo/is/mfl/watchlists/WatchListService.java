package ru.ifmo.is.mfl.watchlists;

import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import ru.ifmo.is.mfl.common.errors.ResourceAlreadyExists;
import ru.ifmo.is.mfl.common.errors.ResourceNotFoundException;
import ru.ifmo.is.mfl.common.application.ApplicationService;
import ru.ifmo.is.mfl.common.search.SearchDto;
import ru.ifmo.is.mfl.common.search.SearchMapper;
import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.movies.MovieMapper;
import ru.ifmo.is.mfl.movies.MovieRepository;
import ru.ifmo.is.mfl.movies.MovieSpecification;
import ru.ifmo.is.mfl.movies.dto.MovieWithAdditionalInfoDto;
import ru.ifmo.is.mfl.movies.query.MovieWithAdditionalInfoQuery;
import ru.ifmo.is.mfl.common.utils.images.ImageProcessor;
import ru.ifmo.is.mfl.storage.StorageService;
import ru.ifmo.is.mfl.users.User;
import ru.ifmo.is.mfl.watchlists.dto.*;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WatchListService extends ApplicationService {

  private static final Logger logger = LoggerFactory.getLogger(WatchListService.class);

  private final WatchListMapper mapper;
  private final WatchListPolicy policy;
  private final WatchListRepository repository;
  private final WatchListSpecification specification;

  private final MovieWithAdditionalInfoQuery movieQuery;
  private final MovieRepository movieRepository;
  private final MovieSpecification movieSpecification;
  private final MovieMapper movieMapper;

  private final SearchMapper<WatchList> searchMapper;
  private final StorageService storageService;
  private final ImageProcessor imageProcessor;

  public Optional<WatchList> findById(int id) {
    var watchList = repository.findById(id);
    if (watchList.isEmpty()) {
      return Optional.empty();
    }
    if (watchList.get().isVisibility() || policy.canUpdate(currentUser(), watchList.get())) {
      return watchList;
    }
    return Optional.empty();
  }

  public Page<MovieWithAdditionalInfoDto> getMovies(WatchList watchList, Pageable pageable) {
    policy.showAll(currentUser());

    var specification = movieSpecification.belongsToWatchList(watchList.getId());

    return currentUser() == null
      ? movieRepository.findAll(specification, pageable).map(movieMapper::mapAdditionalInfo)
      : movieQuery.getMoviesWithAdditionalInfo(specification, pageable, currentUser()).map(movieMapper::map);
  }

  @Transactional
  public WatchListDto addMovie(int id, Movie movie) throws Exception {
    var watchList = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
    policy.update(currentUser(), watchList);

    if (watchList.getMovies().contains(movie)) {
      throw new ResourceAlreadyExists("You already added this movie to the watch list");
    }

    if (watchList.getPhoto() == null && movie.getPoster() != null) {
      var poster = movie.getPoster();
      var moviePosterImage = storageService.getFile(poster);
      var contentType = new Tika().detect(moviePosterImage, poster);
      upload(id, UUID.randomUUID() + poster, moviePosterImage, contentType);
    }

    watchList.getMovies().add(movie);
    return mapper.map(repository.save(watchList));
  }

  @Transactional(isolation = Isolation.REPEATABLE_READ)
  public boolean removeMovie(int id, Movie movie) {
    var watchList = repository.findById(id);
    return watchList.map(w -> {
      policy.delete(currentUser(), w);
      if (!w.getMovies().contains(movie)) {
        throw new ResourceNotFoundException("No such movie in watchlist");
      }
      w.getMovies().remove(movie);
      return true;
    }).orElse(false);
  }

  public Page<WatchListDto> getAll(Pageable pageable) {
    policy.showAll(currentUser());

    // Admins and moderators can see all watchlists
    if (currentUser() != null && (currentUser().isAdmin() || currentUser().isModerator())) {
      var watchLists = repository.findAll(pageable);
      return watchLists.map(mapper::map);
    }

    var watchLists = repository.findAll(specification.visible(currentUser()), pageable);
    return watchLists.map(mapper::map);
  }

  public Page<WatchListDto> getUserWatchLists(User user, Pageable pageable) {
    policy.showAll(currentUser());

    // Admins and moderators can see all user's watchlists
    if (currentUser() != null && (currentUser().isAdmin() || currentUser().isModerator())) {
      var watchLists = repository.findAll(specification.withUser(user.getId()), pageable);
      return watchLists.map(mapper::map);
    }

    var watchLists = repository.findAll(
      specification.visible(currentUser())
        .and(specification.withUser(user.getId())),
      pageable
    );
    return watchLists.map(mapper::map);
  }

  public Page<WatchListDto> getMovieWatchLists(Movie movie, Pageable pageable) {
    policy.showAll(currentUser());

    // Admins and moderators can see all movie's watchlists
    if (currentUser() != null && (currentUser().isAdmin() || currentUser().isModerator())) {
      var watchLists = repository.findAll(specification.hasMovie(movie), pageable);
      return watchLists.map(mapper::map);
    }

    var watchLists = repository.findAll(
      specification.visible(currentUser())
        .and(specification.hasMovie(movie)),
      pageable
    );
    return watchLists.map(mapper::map);
  }

  public Page<WatchListDto> findBySearchCriteria(SearchDto searchData, Pageable pageable) {
    policy.search(currentUser());

    // Admins and moderators can search in all watchlists
    if (currentUser() != null && (currentUser().isAdmin() || currentUser().isModerator())) {
      var watchLists = repository.findAll(searchMapper.map(searchData), pageable);
      return watchLists.map(mapper::map);
    }

    var watchLists = repository.findAll(
      specification.visible(currentUser())
        .and(searchMapper.map(searchData)), pageable
    );
    return watchLists.map(mapper::map);
  }

  public WatchListDto getById(int id) {
    var watchList = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
    policy.show(currentUser(), watchList);

    // Check is visible to user
    if (watchList.isVisibility() || policy.canUpdate(currentUser(), watchList)) {
      if (watchList.isVisibility()) {
        // Update viewers count only on public watchlists
        watchList.incrementViewedCounter();
      }
      return mapper.map(repository.save(watchList));
    }

    throw new ResourceNotFoundException("Not Found: " + id);
  }

  @Transactional
  public WatchListDto create(WatchListCreateDto dto) {
    policy.create(currentUser());

    if (repository.findByNameAndUser(dto.getName(), currentUser()).isPresent()) {
      throw new ResourceAlreadyExists("You already have watchlist with name '" + dto.getName() + "'");
    }

    var watchList = mapper.map(dto);
    watchList.setUser(currentUser());
    watchList.setViewedCounter(0);

    repository.save(watchList);
    return mapper.map(watchList);
  }

  @Transactional
  public WatchListDto update(WatchListUpdateDto dto, int id) {
    var watchList = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
    policy.update(currentUser(), watchList);

    mapper.update(dto, watchList);
    repository.save(watchList);

    return mapper.map(watchList);
  }

  @Transactional(isolation = Isolation.REPEATABLE_READ)
  public boolean delete(int id) {
    var watchList = repository.findById(id);
    return watchList.map(w -> {
        policy.delete(currentUser(), w);
        if (w.getPhoto() != null) {
          try {
            storageService.delete(w.getPhoto());
          } catch (Exception e) {
            throw new RuntimeException(e);
          }
        }
        repository.delete(w);
        return true;
      }).orElse(false);
  }

  @Transactional
  public WatchListDto upload(int id, String filename, byte[] bytes, String contentType) throws Exception {
    var watchList = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
    policy.update(currentUser(), watchList);

    if (!imageProcessor.checkImage(bytes) || !imageProcessor.checkContentType(contentType)) {
      throw new IOException("Bad image");
    }

    // Crop image
    var image = imageProcessor.createMagickImageFromBytes(filename, bytes);
    var bais = imageProcessor.cropToSquare(image, contentType);

    // Upload poster
    var newImageName = "watchlists-photo-" + UUID.randomUUID() + imageProcessor.getImageExtension(contentType);
    try {
      storageService.create(newImageName, contentType, bais, (long) bais.available());
    } catch (Exception e) {
      throw new RuntimeException("Failed to upload new image: " + e.getMessage(), e);
    }

    // Delete old photo if exists
    if (watchList.getPhoto() != null) {
      try {
        var oldFileName = watchList.getPhoto();
        storageService.delete(oldFileName);
      } catch (Exception e) {
        logger.error("Failed to delete old image for watchlist {}: {}", watchList.getId(), e.getMessage());
      }
    }

    watchList.setPhoto(newImageName);
    return mapper.map(repository.save(watchList));
  }
}
