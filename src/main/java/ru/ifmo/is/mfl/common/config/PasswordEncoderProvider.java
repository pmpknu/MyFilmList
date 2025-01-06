package ru.ifmo.is.mfl.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordEncoderProvider {
  @Bean
  public PasswordEncoder encoder() {
    return new BCryptPasswordEncoder();
  }
}
