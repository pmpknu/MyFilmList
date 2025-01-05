package ru.ifmo.is.mfl.users;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

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
  private final SpringTemplateEngine templateEngine;

  @Async
  public void sendConfirmationLink(User user, Locale locale, VerificationToken verificationToken, boolean newUser) {
    var action = newUser  ? "welcome" : "confirm_user";
    var title = messages.getMessage("message.mail." + action + ".title", null, locale);
    var confirmationUrl = confirmationLinkTemplate + verificationToken.getToken();

    var model = new Context(locale);
    model.setVariable("user", user);
    model.setVariable("confirmationLink", confirmationUrl);

    var htmlContent = templateEngine.process("auth_mail/" + action, model);
    var textContent = templateEngine.process("auth_mail/" + action + ".txt", model);
    MimeMessagePreparator preparator = mimeMessage -> {
      MimeMessageHelper message = new MimeMessageHelper(mimeMessage, true);
      message.setFrom(sender);
      message.setTo(user.getEmail());
      message.setSentDate(new Date());
      message.setSubject(title);
      message.setText(textContent, htmlContent); // text and html
    };

    mailSender.send(preparator);
  }
}
