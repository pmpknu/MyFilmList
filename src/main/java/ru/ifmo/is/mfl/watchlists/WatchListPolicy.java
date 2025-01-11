package ru.ifmo.is.mfl.watchlists;

import org.springframework.stereotype.Component;
import ru.ifmo.is.mfl.common.framework.CrudPolicy;
import ru.ifmo.is.mfl.users.User;

@Component
public class WatchListPolicy extends CrudPolicy<WatchList> {

  @Override
  public User getCreator(WatchList object) {
    return object.getUser();
  }

  @Override
  public String getPolicySubject() {
    return "watch-lists";
  }
}
