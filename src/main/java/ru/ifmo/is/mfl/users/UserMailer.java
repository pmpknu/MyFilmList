package ru.ifmo.is.mfl.users;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import ru.ifmo.is.mfl.verificationtokens.VerificationToken;

import java.util.Date;
import java.util.Locale;

@Component
@RequiredArgsConstructor
public class UserMailer {

  @Value("${app.mail.links.confirm_user}")
  private final String confirmationLinkTemplate;

  @Value("${spring.mail.username}")
  private final String sender;

  private final MessageSource messages;
  private final JavaMailSender mailSender;

  @Async
  public void sendConfirmationLink(User user, Locale locale, VerificationToken verificationToken) {
    var recipientAddress = user.getEmail();
    var confirmationUrl = confirmationLinkTemplate + verificationToken.getToken();

    var subject = messages.getMessage("message.confirmation.title", null, locale);
    var message = messages.getMessage("message.confirmation.description", null, locale);

    var email = new SimpleMailMessage();

    email.setFrom(sender);
    email.setTo(recipientAddress);
    email.setSentDate(new Date());

    email.setSubject(subject);
    email.setText(message + "\r\n" + confirmationUrl);

    mailSender.send(email);
  }
}
