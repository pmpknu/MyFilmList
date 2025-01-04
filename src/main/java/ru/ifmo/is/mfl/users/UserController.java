package ru.ifmo.is.mfl.users;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import ru.ifmo.is.mfl.common.search.SearchDto;
import ru.ifmo.is.mfl.users.dto.UserDto;
import ru.ifmo.is.mfl.users.dto.UserUpdateDto;

@RestController
@RequestMapping(value = "/api/users", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Tag(name = "Users")
public class UserController {
  private final UserService service;

  @GetMapping
  @Operation(summary = "Получить всех пользователей")
  public ResponseEntity<Page<UserDto>> index(@PageableDefault(size = 20) Pageable pageable) {
    var objs = service.getAll(pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(objs.getTotalElements()))
      .body(objs);
  }

  @PostMapping("/search")
  @Operation(summary = "Поиск и фильтрация пользователей")
  public ResponseEntity<Page<UserDto>> search(
    @PageableDefault(size = 20) Pageable pageable,
    @RequestBody(required = false) SearchDto request
  ) {
    var objs = service.findBySearchCriteria(request, pageable);
    return ResponseEntity.ok()
      .header("X-Total-Count", String.valueOf(objs.getTotalElements()))
      .body(objs);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Получить пользователя по ID")
  public ResponseEntity<UserDto> show(@PathVariable int id) {
    var obj = service.getById(id);
    return ResponseEntity.ok(obj);
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Обновить пользователя по ID", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<UserDto> update(@PathVariable int id, @Valid @RequestBody UserUpdateDto request) {
    var obj = service.update(request, id);
    return ResponseEntity.ok(obj);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('USER')")
  @Operation(summary = "Удалить пользователя по ID", security = @SecurityRequirement(name = "bearerAuth"))
  public ResponseEntity<Void> delete(@PathVariable int id) {
    if (service.delete(id)) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }
}
