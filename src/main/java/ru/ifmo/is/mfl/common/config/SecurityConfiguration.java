package ru.ifmo.is.mfl.common.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import ru.ifmo.is.mfl.auth.JwtAuthenticationFilter;
import ru.ifmo.is.mfl.users.UserService;

import java.util.Arrays;
import java.util.List;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
  private final JwtAuthenticationFilter jwtAuthenticationFilter;
  private final UserService userService;

  private static final List<String> crudResources = Arrays.asList(
    "movies"
  );

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
      // Отключаем CORS
      .cors(cors -> cors.configurationSource(request -> {
        var corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5000"));
        corsConfiguration.setAllowedMethods(List.of(
          "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD", "CONNECT", "OPTIONS")
        );
        corsConfiguration.setAllowedHeaders(List.of("*"));
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setMaxAge(10L);
        corsConfiguration.addExposedHeader("X-Response-Uuid");
        corsConfiguration.addExposedHeader("X-Total-Count");
        return corsConfiguration;
      }))

      .authorizeHttpRequests(request -> {
        request
          // WebSockets
          .requestMatchers("/ws/**").permitAll()
          .requestMatchers("/ws").permitAll()

          // Выйти из аккаунта может только зарегистрированный пользователь
          .requestMatchers("/api/auth/sign-out").authenticated()
          .requestMatchers("/api/auth/resend-confirmation").authenticated()
          // Доступ к методам /api/auth/** открыт для всех
          .requestMatchers("/api/auth/**").permitAll()

          // Доступ к Swagger UI (для документации)
          .requestMatchers("/swagger-ui/**", "/swagger-resources/*", "/v3/api-docs/**").permitAll()

          // Доступ к данным пользователей
          .requestMatchers(HttpMethod.POST, "/api/users/photo").authenticated()
          .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll()
          .requestMatchers(HttpMethod.POST, "/api/users/search").permitAll()
          .requestMatchers(HttpMethod.PATCH, "/api/users/**").authenticated()
          .requestMatchers(HttpMethod.DELETE, "/api/users/**").authenticated();

        crudResources.forEach(resource ->
          request
            // Доступ к данным ресурса
            .requestMatchers(HttpMethod.GET, "/api/" + resource + "/**").permitAll() // все пользователи могут читать данные
            .requestMatchers(HttpMethod.POST, "/api/" + resource + "/search").permitAll() // все пользователи могут искать данные
            .requestMatchers(HttpMethod.POST, "/api/" + resource + "/**").authenticated() // только авторизованные могут создавать данные
            .requestMatchers(HttpMethod.PUT, "/api/" + resource + "/**").authenticated() // обновление доступно только авторам или администраторам
            .requestMatchers(HttpMethod.PATCH, "/api/" + resource + "/**").authenticated() // обновление доступно только авторам или администраторам
            .requestMatchers(HttpMethod.DELETE, "/api/" + resource + "/**").authenticated() // удаление доступно только авторам или администраторам
        );

        request
          // Любой другой запрос должен быть аутентифицирован
          .anyRequest().authenticated();
      })
      .sessionManagement(manager -> manager.sessionCreationPolicy(STATELESS))
      .authenticationProvider(authenticationProvider())
      .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  @Bean
  public PasswordEncoder encoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userService.userDetailsService());
    authProvider.setPasswordEncoder(encoder());
    return authProvider;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }
}
