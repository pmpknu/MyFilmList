package ru.ifmo.is.mfl.movies;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import ru.ifmo.is.mfl.common.errors.ResourceNotFoundException;
import ru.ifmo.is.mfl.common.framework.ApplicationService;
import ru.ifmo.is.mfl.common.search.SearchDto;
import ru.ifmo.is.mfl.common.search.SearchMapper;
import ru.ifmo.is.mfl.common.utils.images.ImageProcessor;
import ru.ifmo.is.mfl.movies.dto.*;
import ru.ifmo.is.mfl.movies.query.MovieWithAdditionalInfoQuery;
import ru.ifmo.is.mfl.storage.StorageService;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MovieService extends ApplicationService {

  private static final Logger logger = LoggerFactory.getLogger(MovieService.class);

  private final MovieMapper mapper;
  private final MoviePolicy policy;
  private final MovieRepository repository;
  private final MovieWithAdditionalInfoQuery query;

  private final SearchMapper<Movie> searchMapper;

  private final StorageService storageService;
  private final ImageProcessor imageProcessor;

  public Optional<Movie> findById(int id) {
    return repository.findById(id);
  }

  public Page<MovieWithAdditionalInfoDto> getAll(Pageable pageable) {
    policy.showAll(currentUser());

    return currentUser() == null
      ? repository.findAll(pageable).map(mapper::mapAdditionalInfo)
      : query.getMoviesWithAdditionalInfo(null, pageable, currentUser()).map(mapper::map);
  }

  public Page<MovieWithAdditionalInfoDto> findBySearchCriteria(SearchDto searchData, Pageable pageable) {
    policy.search(currentUser());

    return currentUser() == null
      ? repository.findAll(searchMapper.map(searchData), pageable).map(mapper::mapAdditionalInfo)
      : query.getMoviesWithAdditionalInfo(searchMapper.map(searchData), pageable, currentUser()).map(mapper::map);
  }

  @Transactional
  public MovieDto create(MovieCreateDto dto) {
    policy.create(currentUser());

    var movie = mapper.map(dto);
    repository.save(movie);
    return mapper.map(movie);
  }

  public MovieWithAdditionalInfoDto getById(int id) {
    var movie = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
    policy.show(currentUser(), movie);

    if (currentUser() != null) {
      return mapper.map(query.getMovieWithAdditionalInfo(movie, currentUser()));
    }

    return mapper.mapAdditionalInfo(movie);
  }

  @Transactional
  public MovieDto update(MovieUpdateDto objData, int id) {
    var movie = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
    policy.update(currentUser(), movie);

    mapper.update(objData, movie);
    repository.save(movie);

    return mapper.map(movie);
  }

  @Transactional(isolation = Isolation.REPEATABLE_READ)
  public boolean delete(int id) {
    var movie = repository.findById(id);
    return movie.map(o -> {
        policy.delete(currentUser(), o);
        if (o.getPoster() != null) {
          try {
            storageService.delete(o.getPoster());
          } catch (Exception e) {
            throw new RuntimeException(e);
          }
        }
        repository.delete(o);
        return true;
      }).orElse(false);
  }

  @Transactional
  public MovieDto upload(int id, String filename, byte[] bytes, String contentType) throws Exception {
    var movie = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));

    if (!imageProcessor.checkImage(bytes) || !imageProcessor.checkContentType(contentType)) {
      throw new IOException("Bad image");
    }

    var image = imageProcessor.createMagickImageFromBytes(filename, bytes);
    var bais = imageProcessor.save(image, contentType);

    // Upload poster
    var newImageName = "movies-poster-" + UUID.randomUUID() + imageProcessor.getImageExtension(contentType);
    try {
      storageService.create(newImageName, contentType, bais, (long) bais.available());
    } catch (Exception e) {
      throw new RuntimeException("Failed to upload new image: " + e.getMessage(), e);
    }

    // Delete old poster if exists
    if (movie.getPoster() != null) {
      try {
        var oldFileName = movie.getPoster();
        storageService.delete(oldFileName);
      } catch (Exception e) {
        logger.error("Failed to delete old poster for movie {}: {}", movie.getId(), e.getMessage());
      }
    }

    movie.setPoster(newImageName);
    return mapper.map(repository.save(movie));
  }
}
