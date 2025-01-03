package ru.ifmo.is.mfl.users;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import ru.ifmo.is.mfl.common.caching.RequestCache;
import ru.ifmo.is.mfl.common.errors.UserWithThisUsernameAlreadyExists;
import ru.ifmo.is.mfl.userroles.Role;
import ru.ifmo.is.mfl.userroles.UserRole;
import ru.ifmo.is.mfl.userroles.UserRoleRepository;

import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class UserService {

  private static final Logger logger = LoggerFactory.getLogger(UserService.class);
  private final UserRepository repository;
  private final UserRoleRepository roleRepository;

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

    var roles = new HashSet<UserRole>();
    roles.add(UserRole.builder().role(Role.ROLE_USER).user(user).build());

    if (repository.count() == 1) {
      logger.info("Creating first user with MODERATOR and ADMIN roles");
      roles.add(UserRole.builder().role(Role.ROLE_MODERATOR).user(user).build());
      roles.add(UserRole.builder().role(Role.ROLE_ADMIN).user(user).build());
    }
    user.setRoles(roles);

    roleRepository.saveAll(roles);
    return save(user);
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
}
