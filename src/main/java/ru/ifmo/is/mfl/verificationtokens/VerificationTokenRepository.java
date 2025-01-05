package ru.ifmo.is.mfl.verificationtokens;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import ru.ifmo.is.mfl.users.User;

import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
  Optional<VerificationToken> findByToken(String token);
  Optional<VerificationToken> findByUser(User user);
  Optional<VerificationToken> findTopByUserOrderBySentAtDesc(User user);

  @Modifying
  void deleteByUser(User user);
}
