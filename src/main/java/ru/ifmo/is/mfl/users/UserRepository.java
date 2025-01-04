package ru.ifmo.is.mfl.users;

import org.springframework.stereotype.Repository;

import ru.ifmo.is.mfl.common.framework.CrudRepository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User> {
  Optional<User> findByUsername(String username);
  Optional<User> findByEmail(String email);
  Optional<User> findByPassword(String password);
  boolean existsByUsername(String username);
  boolean existsByEmail(String email);
}
