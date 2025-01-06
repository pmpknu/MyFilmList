package ru.ifmo.is.mfl.userroles;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ifmo.is.mfl.users.User;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserRoleService {

  private final UserRoleRepository repository;

  @Transactional
  public User addRole(User user, Role role) {
    var userRole = UserRole.builder().user(user).role(role).build();
    var roles = user.getRoles();

    if (!roles.contains(userRole) && roles.add(userRole)) {
      repository.save(userRole);
    }

    return user;
  }

  @Transactional
  public User addRoles(User user, Set<UserRole> newRoles) {
    var roles = user.getRoles();
    roles.addAll(newRoles);
    user.setRoles(roles);
    repository.saveAll(roles);
    return user;
  }

  @Transactional
  public User deleteRole(User user, Role role) {
    var userRole = UserRole.builder().user(user).role(role).build();
    var roles = user.getRoles();

    if (roles.remove(userRole)) {
      repository.delete(userRole);
    }

    return user;
  }
}
