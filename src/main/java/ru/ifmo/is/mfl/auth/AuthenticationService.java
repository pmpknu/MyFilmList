package ru.ifmo.is.mfl.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ru.ifmo.is.mfl.auth.dto.AuthenticationDto;
import ru.ifmo.is.mfl.auth.dto.SignInDto;
import ru.ifmo.is.mfl.auth.dto.SignUpDto;
import ru.ifmo.is.mfl.common.errors.TokenRefreshException;
import ru.ifmo.is.mfl.refreshtokens.RefreshToken;
import ru.ifmo.is.mfl.refreshtokens.RefreshTokenService;
import ru.ifmo.is.mfl.refreshtokens.dto.RefreshDto;
import ru.ifmo.is.mfl.users.User;
import ru.ifmo.is.mfl.users.UserMapper;
import ru.ifmo.is.mfl.users.UserService;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserService userService;
  private final UserMapper mapper;
  private final JwtService jwtService;
  private final RefreshTokenService refreshService;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;

  /**
   * Регистрация пользователя
   *
   * @param request данные пользователя
   * @return токен
   */
  @Transactional
  public AuthenticationDto signUp(SignUpDto request) {
    var user = User.builder()
      .username(request.getUsername())
      .email(request.getEmail())
      .password(passwordEncoder.encode(request.getPassword()))
      .build();

    userService.create(user);

    var jwt = jwtService.generateToken(user);
    var refreshToken = refreshService.createRefreshToken(user.getId());
    return new AuthenticationDto(jwt, refreshToken.getToken(), mapper.map(user));
  }

  /**
   * Аутентификация пользователя
   *
   * @param request данные пользователя
   * @return токен
   */
  @Transactional
  public AuthenticationDto signIn(SignInDto request) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
      request.getUsername(),
      request.getPassword()
    ));

    var userDetails = userService
      .userDetailsService()
      .loadUserByUsername(request.getUsername());

    var user = userService.getByUsername(userDetails.getUsername());

    var jwt = jwtService.generateToken(userDetails);
    var refreshToken = refreshService.createRefreshToken(user.getId());
    return new AuthenticationDto(jwt, refreshToken.getToken(), mapper.map(user));
  }

  /**
   * Обновление токенов доступа пользователя
   *
   * @param request refresh token
   * @return новая пара токенов
   */
  @Transactional
  public AuthenticationDto refresh(RefreshDto request) {
    return refreshService.findByToken(request.getRefreshToken())
      .map(refreshService::verifyExpiration)
      .map(RefreshToken::getUser)
      .map(user -> {
        var accessToken = jwtService.generateToken(user);
        var newRefreshToken = refreshService.createRefreshToken(user.getId());
        return new AuthenticationDto(accessToken, newRefreshToken.getToken(), mapper.map(user));
      })
      .orElseThrow(() -> new TokenRefreshException("No such refresh token"));
  }

  /**
   * Выйти из аккаунта
   */
  @Transactional
  public void signOut(boolean onAllDevices) {
    var user = userService.getCurrentUser();

    if (onAllDevices) {
      refreshService.deleteByUserId(user.getId());
    }
  }
}
