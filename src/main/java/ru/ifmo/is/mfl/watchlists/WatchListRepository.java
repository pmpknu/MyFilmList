package ru.ifmo.is.mfl.watchlists;

import ru.ifmo.is.mfl.common.framework.CrudRepository;
import ru.ifmo.is.mfl.users.User;

import java.util.Optional;

public interface WatchListRepository extends CrudRepository<WatchList> {
  Optional<WatchList> findByNameAndUser(String name, User user);
}
