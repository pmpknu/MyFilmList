package ru.ifmo.is.mfl.auth;

import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import ru.ifmo.is.mfl.auth.dto.AuthenticationDto;
import ru.ifmo.is.mfl.auth.dto.SignInDto;
import ru.ifmo.is.mfl.auth.dto.SignUpDto;
import ru.ifmo.is.mfl.refreshtokens.dto.RefreshDto;
import ru.ifmo.is.mfl.common.context.ApplicationLockBean;
import ru.ifmo.is.mfl.verificationtokens.dto.VerificationDto;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthenticationController {
  private final ApplicationLockBean applicationLockBean;
  private final AuthenticationService authenticationService;

  @Operation(summary = "Регистрация пользователя")
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping("/sign-up")
  public ResponseEntity<AuthenticationDto> signUp(@RequestBody @Valid SignUpDto request) {
    applicationLockBean.getImportLock().lock();
    try {
      return ResponseEntity.status(HttpStatus.CREATED).body(authenticationService.signUp(request));
    } finally {
      applicationLockBean.getImportLock().unlock();
    }
  }

  @Operation(summary = "Авторизация пользователя")
  @PostMapping("/sign-in")
  public ResponseEntity<AuthenticationDto> signIn(@RequestBody @Valid SignInDto request) {
    return ResponseEntity.ok(authenticationService.signIn(request));
  }

  @Operation(summary = "Обновление токена доступа")
  @PostMapping("/refresh")
  public ResponseEntity<AuthenticationDto> refresh(@RequestBody @Valid RefreshDto request) {
    return ResponseEntity.ok(authenticationService.refresh(request));
  }

  @Operation(summary = "Подтверждение электронной почты")
  @PostMapping("/confirm")
  public ResponseEntity<AuthenticationDto> confirm(@RequestBody @Valid VerificationDto request) {
    return ResponseEntity.ok(authenticationService.confirm(request));
  }

  @Operation(summary = "Повторно отправить письмо с подтверждением", security = @SecurityRequirement(name = "bearerAuth"))
  @PostMapping("/resend-confirmation")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<AuthenticationDto> resendConfirmation() {
    authenticationService.resendConfirmation();
    return ResponseEntity.noContent().build();
  }

  @Operation(summary = "Выйти из аккаунта", security = @SecurityRequirement(name = "bearerAuth"))
  @PostMapping("/sign-out")
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<Void> signOut(@RequestParam(defaultValue = "false") boolean onAllDevices) {
    authenticationService.signOut(onAllDevices);
    return ResponseEntity.noContent().build();
  }
}
