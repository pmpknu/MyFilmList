package ru.ifmo.is.mfl.auth.events;

import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import ru.ifmo.is.mfl.users.UserMailer;
import ru.ifmo.is.mfl.verificationtokens.VerificationTokenService;

@Component
@RequiredArgsConstructor
public class RegistrationListener implements
  ApplicationListener<OnRegistrationCompleteEvent> {

  private final UserMailer userMailer;
  private final VerificationTokenService tokenService;

  @Override
  public void onApplicationEvent(@NotNull OnRegistrationCompleteEvent event) {
    this.confirmRegistration(event);
  }

  private void confirmRegistration(OnRegistrationCompleteEvent event) {
    var user = event.getUser();
    var token = tokenService.createVerificationToken(user);
    userMailer.sendConfirmationLink(user, event.getLocale(), token);
  }
}
