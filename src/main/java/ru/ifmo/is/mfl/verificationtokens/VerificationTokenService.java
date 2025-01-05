package ru.ifmo.is.mfl.verificationtokens;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ru.ifmo.is.mfl.common.errors.TokenExpiredException;
import ru.ifmo.is.mfl.users.User;
import ru.ifmo.is.mfl.users.UserRepository;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VerificationTokenService {

  @Value("${app.auth.verification_token.ttl}")
  private String verificationTokenTtl;

  @Value("${app.auth.verification_token.length}")
  private String verificationTokenLength;

  private final VerificationTokenRepository repository;
  private final UserRepository userRepository;

  public Optional<VerificationToken> findByToken(String token) {
    return repository.findByToken(token);
  }

  public Optional<VerificationToken> findByUser(User user) {
    return repository.findByUser(user);
  }

  public VerificationToken createVerificationToken(User user) {
    var token = generateToken(Integer.parseInt(verificationTokenLength));
    var verificationToken = VerificationToken.builder()
      .user(user)
      .expiryDate(Instant.now().plusMillis(Long.parseLong(verificationTokenTtl)))
      .token(token)
      .build();

    return repository.save(verificationToken);
  }

  public VerificationToken verifyExpiration(VerificationToken token) {
    if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
      repository.delete(token);
      throw new TokenExpiredException("Verification token was expired. Please make a new confirmation request");
    }

    return token;
  }

  @Transactional
  public void deleteByUser(User user) {
    repository.deleteByUser(user);
  }

  private String generateToken(int length) {
    var random = new SecureRandom();
    byte[] bytes = new byte[length];
    random.nextBytes(bytes);
    var encoder = Base64.getUrlEncoder().withoutPadding();
    return encoder.encodeToString(bytes).substring(0, length);
  }
}
