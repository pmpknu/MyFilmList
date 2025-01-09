package ru.ifmo.is.mfl.userroles;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import ru.ifmo.is.mfl.common.errors.ResourceNotFoundException;
import ru.ifmo.is.mfl.common.framework.ApplicationService;
import ru.ifmo.is.mfl.userroles.dto.UserRoleCreateDto;
import ru.ifmo.is.mfl.users.UserMapper;
import ru.ifmo.is.mfl.users.dto.UserDto;

@RestController
@RequestMapping("/api/users/{id}/roles")
@RequiredArgsConstructor
@Tag(name = "User Roles")
public class UserRoleController extends ApplicationService {

  private final UserRoleService service;

  private final UserMapper userMapper;

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
  @Operation(summary = "Добавление роли пользователю", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<UserDto> create(@PathVariable int id, @RequestBody @Valid UserRoleCreateDto request) {
    var user = userService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
    user = service.add(user, currentUser(), request);
    return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.map(userService.save(user)));
  }

  @DeleteMapping
  @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
  @Operation(summary = "Удаление роли пользователя", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<UserDto> delete(@PathVariable int id, @RequestBody @Valid UserRoleCreateDto request) {
    var user = userService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
    user = service.remove(user, currentUser(), request);
    return ResponseEntity.ok(userMapper.map(userService.save(user)));
  }
}
