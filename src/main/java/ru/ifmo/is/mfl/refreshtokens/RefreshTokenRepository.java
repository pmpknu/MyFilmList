package ru.ifmo.is.mfl.refreshtokens;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import ru.ifmo.is.mfl.users.User;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
  Optional<RefreshToken> findByToken(String token);
  Optional<RefreshToken> findTopByUserOrderByExpiryDateDesc(User user);

  @Modifying
  void deleteByUser(User user);
}
