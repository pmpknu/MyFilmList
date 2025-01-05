package ru.ifmo.is.mfl.users;

import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import ru.ifmo.is.mfl.auth.events.OnRegistrationCompleteEvent;
import ru.ifmo.is.mfl.common.caching.RequestCache;
import ru.ifmo.is.mfl.common.errors.ResourceNotFoundException;
import ru.ifmo.is.mfl.common.errors.UserWithThisUsernameAlreadyExists;
import ru.ifmo.is.mfl.common.search.SearchDto;
import ru.ifmo.is.mfl.common.search.SearchMapper;
import ru.ifmo.is.mfl.common.utils.images.ImageProcessor;
import ru.ifmo.is.mfl.storage.StorageService;
import ru.ifmo.is.mfl.userroles.Role;
import ru.ifmo.is.mfl.userroles.UserRole;
import ru.ifmo.is.mfl.userroles.UserRoleRepository;
import ru.ifmo.is.mfl.users.dto.UserDto;
import ru.ifmo.is.mfl.users.dto.UserUpdateDto;

import java.io.IOException;
import java.util.HashSet;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

  private static final Logger logger = LoggerFactory.getLogger(UserService.class);

  private final UserMapper mapper;
  private final UserPolicy policy;
  private final SearchMapper<User> searchMapper;
  private final UserRepository repository;
  private final UserRoleRepository roleRepository;

  private final StorageService storageService;
  private final ImageProcessor imageProcessor;

  private final HttpServletRequest httpRequest;
  private final ApplicationEventPublisher eventPublisher;

  /**
   * Сохранение пользователя
   *
   * @return сохраненный пользователь
   */
  @Transactional
  public User save(User user) {
    return repository.save(user);
  }

  /**
   * Создание пользователя
   *
   * @return созданный пользователь
   */
  @Transactional
  public User create(User user) {
    if (repository.existsByUsername(user.getUsername())) {
      throw new UserWithThisUsernameAlreadyExists("Пользователь с таким именем уже существует");
    }

    if (repository.existsByEmail(user.getEmail())) {
      throw new UserWithThisUsernameAlreadyExists("Этот email уже зарегистрирован");
    }

    user = save(user);
    if (repository.count() == 1) {
      var roles = new HashSet<UserRole>();
      logger.info("Creating first user with MODERATOR and ADMIN roles");
      roles.add(UserRole.builder().role(Role.ROLE_USER).user(user).build());
      roles.add(UserRole.builder().role(Role.ROLE_MODERATOR).user(user).build());
      roles.add(UserRole.builder().role(Role.ROLE_ADMIN).user(user).build());
      return addRoles(user, roles);
    }

    eventPublisher.publishEvent(
      new OnRegistrationCompleteEvent(user, httpRequest.getLocale())
    );

    return user;
  }

  /**
   * Подтверждение аккаунта пользователя
   *
   * @return подтвержденный пользователь
   */
  @Transactional
  public User confirm(User user) {
    var roles = new HashSet<UserRole>();
    roles.add(UserRole.builder().role(Role.ROLE_USER).user(user).build());
    return addRoles(user, roles);
  }

  /**
   * Получение пользователя по имени пользователя
   *
   * @return пользователь
   */
  @RequestCache
  public User getByUsername(String username) {
    return repository.findByUsername(username)
      .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));
  }

  /**
   * Получение пользователя по имени пользователя
   * <p>
   * Нужен для Spring Security
   *
   * @return пользователь
   */
  public UserDetailsService userDetailsService() {
    return this::getByUsername;
  }

  /**
   * Получение текущего пользователя
   *
   * @return текущий пользователь
   */
  @RequestCache
  public User getCurrentUser() {
    // Получение имени пользователя из контекста Spring Security
    var username = getCurrentUsername();
    return getByUsername(username);
  }

  /**
   * Получение имени текущего пользователя
   *
   * @return имя текущего пользователь
   */
  @RequestCache
  public String getCurrentUsername() {
    // Получение имени пользователя из контекста Spring Security
    return SecurityContextHolder.getContext().getAuthentication().getName();
  }

  public Page<UserDto> getAll(Pageable pageable) {
    policy.showAll(currentUser());

    var objs = repository.findAll(pageable);
    return objs.map(mapper::map);
  }

  public Page<UserDto> findBySearchCriteria(SearchDto searchData, Pageable pageable) {
    policy.search(currentUser());

    var objs = repository.findAll(searchMapper.map(searchData), pageable);
    return objs.map(mapper::map);
  }

  public UserDto getById(int id) {
    var obj = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
    policy.show(currentUser(), obj);

    return mapper.map(obj);
  }

  @Transactional
  public UserDto update(UserUpdateDto objData, int id) {
    var obj = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
    policy.update(currentUser(), obj);

    // TODO: Check updating email or password
    // TODO: Error if both email and password changed

    mapper.update(objData, obj);
    repository.save(obj);

    return mapper.map(obj);
  }

  @Transactional(isolation = Isolation.REPEATABLE_READ)
  public boolean delete(int id) {
    var obj = repository.findById(id);
    return obj.map(o -> {
      policy.delete(currentUser(), o);
      repository.delete(o);
      return true;
    }).orElse(false);
  }

  @Transactional
  public UserDto upload(String filename, byte[] bytes, long fileSize, String contentType)
    throws Exception {

    if (!imageProcessor.checkImage(bytes) || !imageProcessor.checkContentType(contentType)) {
      throw new IOException("Bad image");
    }

    // Crop image
    var image = imageProcessor.createMagickImageFromBytes(filename, bytes);
    var bais = imageProcessor.cropToSquare(image, contentType);

    // Upload new image
    var newImageName = UUID.randomUUID() + imageProcessor.getImageExtension(contentType);
    try {
      storageService.create(newImageName, contentType, bais, (long) bais.available());
    } catch (Exception e) {
      throw new RuntimeException("Failed to upload new image: " + e.getMessage(), e);
    }

    // Delete old image if exists
    var currentUser = getCurrentUser();
    if (currentUser.getPhoto() != null) {
      try {
        var oldFileName = currentUser.getPhoto();
        storageService.delete(oldFileName);
      } catch (Exception e) {
        logger.error("Failed to delete old image for user {}: {}", currentUser.getId(), e.getMessage());
      }
    }

    currentUser.setPhoto(newImageName);
    return mapper.map(save(currentUser));
  }

  @Transactional
  public User addRoles(User user, HashSet<UserRole> newRoles) {
    var roles = user.getRoles();
    roles.addAll(newRoles);
    user.setRoles(roles);
    roleRepository.saveAll(roles);
    return save(user);
  }

  @RequestCache
  private User currentUser() {
    try {
      return getCurrentUser();
    } catch (UsernameNotFoundException _ex) {
      return null;
    }
  }
}
