package ru.ifmo.is.mfl.common.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import ru.ifmo.is.mfl.common.caching.RequestCache;
import ru.ifmo.is.mfl.users.User;
import ru.ifmo.is.mfl.users.UserService;

public abstract class ApplicationService {

  @Autowired
  protected UserService userService;

  @RequestCache
  protected User currentUser() {
    try {
      return userService.getCurrentUser();
    } catch (UsernameNotFoundException _ex) {
      return null;
    }
  }
}
