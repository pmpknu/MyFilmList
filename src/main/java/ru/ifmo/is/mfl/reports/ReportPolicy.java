package ru.ifmo.is.mfl.reports;

import org.springframework.stereotype.Component;

import ru.ifmo.is.mfl.common.framework.CrudPolicy;
import ru.ifmo.is.mfl.users.User;

@Component
public class ReportPolicy extends CrudPolicy<Report> {

  @Override
  public boolean canShowAll(User user) {
    return canManage(user, null);
  }

  @Override
  public boolean canSearch(User user) {
    return canManage(user, null);
  }

  @Override
  public boolean canShow(User user, Report object) {
    return canManage(user, object);
  }

  @Override
  public boolean canDelete(User user, Report object) {
    return user.isAdmin();
  }

  @Override
  public boolean canUpdate(User user, Report object) {
    return canManage(user, object);
  }

  @Override
  protected boolean canManage(User user, Report object) {
    return user != null && (user.isAdmin() || user.isModerator());
  }

  @Override
  public User getCreator(Report object) {
    return object.getUser();
  }

  @Override
  public String getPolicySubject() {
    return "reports";
  }
}
