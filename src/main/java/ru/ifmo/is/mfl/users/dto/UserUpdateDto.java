package ru.ifmo.is.mfl.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.openapitools.jackson.nullable.JsonNullable;

@Data
public class UserUpdateDto {
  @NotNull
  private JsonNullable<String> username;

  @NotNull
  private JsonNullable<String> password;

  @NotNull
  @Email(
    message = "Email is not valid",
    regexp = "[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?"
  )
  private JsonNullable<String> email;

  @NotNull
  private JsonNullable<String> bio;
}
