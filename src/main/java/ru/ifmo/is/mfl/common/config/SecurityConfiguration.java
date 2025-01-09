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
  private final PasswordEncoderProvider passwordEncoderProvider;
  private final UserService userService;

  private static final List<String> crudResources = Arrays.asList(
    "watchlists"
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

          // Feed
          .requestMatchers(HttpMethod.GET, "/api/feed/**").authenticated() // Every registered user can view news feed

          // Reports
          .requestMatchers(HttpMethod.POST, "/api/reviews/*/reports").hasRole("USER") // User can report review
          .requestMatchers(HttpMethod.POST, "/api/comments/*/reports").hasRole("USER") // User can report comment
          .requestMatchers(HttpMethod.GET, "/api/reports/**").hasAnyRole("ADMIN", "MODERATOR") // Admin can view all report
          .requestMatchers(HttpMethod.GET, "/api/reports/pending").hasAnyRole("ADMIN", "MODERATOR") // Admin can view pending report
          .requestMatchers(HttpMethod.PATCH, "/api/reports/**").hasAnyRole("ADMIN", "MODERATOR") // Admin can update reports

          // Movie views
          .requestMatchers(HttpMethod.GET, "/api/users/*/views").permitAll() // Get all user's viewed movies
          .requestMatchers(HttpMethod.GET, "/api/movies/*/views").permitAll() // Get all movie's viewers
          .requestMatchers(HttpMethod.POST, "/api/movies/*/views").hasRole("USER") // Mark movie as viewed
          .requestMatchers(HttpMethod.DELETE, "/api/movies/*/views").hasRole("USER") // Unmark viewed movie

          // Comments
          .requestMatchers(HttpMethod.GET, "/api/movies/*/comments").permitAll() // Get all movie comments
          .requestMatchers(HttpMethod.GET, "/api/reviews/*/comments").permitAll() // Get all review comments
          .requestMatchers(HttpMethod.GET, "/api/watchlists/*/comments").permitAll() // Get all watchlist comments
          .requestMatchers(HttpMethod.POST, "/api/movies/*/comments").hasRole("USER") // Add comment to movie
          .requestMatchers(HttpMethod.POST, "/api/reviews/*/comments").hasRole("USER") // Add comment to review
          .requestMatchers(HttpMethod.POST, "/api/watchlists/*/comments").hasRole("USER") // Add comment to watchlist
          .requestMatchers(HttpMethod.PATCH, "/api/comments/**").hasRole("USER") // Change comment by ID
          .requestMatchers(HttpMethod.DELETE, "/api/comments/**").hasRole("USER") // Delete comment by ID

          // Ratings
          .requestMatchers(HttpMethod.GET, "/api/movies/*/ratings").hasRole("USER") // Current user's rating
          .requestMatchers(HttpMethod.POST, "/api/movies/*/ratings").hasRole("USER") // Add movie's rating by current user
          .requestMatchers(HttpMethod.PATCH, "/api/movies/*/ratings").hasRole("USER") // Change movie's rating by current user
          .requestMatchers(HttpMethod.DELETE, "/api/movies/*/ratings").hasRole("USER") // Delete movie's rating by current user

          // Reviews
          .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll() // Get all reviews
          .requestMatchers(HttpMethod.POST, "/api/reviews/search").permitAll() // Search review
          .requestMatchers(HttpMethod.PATCH, "/api/reviews/**").hasRole("USER") // Change review by ID
          .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").hasRole("USER") // Delete review by ID
          .requestMatchers(HttpMethod.GET, "/api/movies/*/reviews").permitAll() // Get all movie's reviews
          .requestMatchers(HttpMethod.GET, "/api/users/*/reviews").permitAll() // Get all user's reviews
          .requestMatchers(HttpMethod.POST, "/api/movies/*/reviews").hasRole("USER") // Add review to movie

          // Movies
          .requestMatchers(HttpMethod.GET, "/api/movies/**").permitAll()
          .requestMatchers(HttpMethod.POST, "/api/movies/search").permitAll()
          .requestMatchers(HttpMethod.POST, "/api/movies/**").hasRole("ADMIN")
          .requestMatchers(HttpMethod.PATCH, "/api/movies/**").hasRole("ADMIN")
          .requestMatchers(HttpMethod.POST, "/api/movies/*/poster").hasRole("ADMIN")
          .requestMatchers(HttpMethod.DELETE, "/api/movies/**").hasRole("ADMIN")

          // Watchlists
          .requestMatchers(HttpMethod.POST, "/api/watchlists/*/movies/**").hasRole("USER") // Add movie to watchlist
          .requestMatchers(HttpMethod.DELETE, "/api/watchlists/*/movies/**").hasRole("USER") // Delete movie from watchlist

          // Users
          .requestMatchers(HttpMethod.POST, "/api/users/photo").authenticated()
          .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll()
          .requestMatchers(HttpMethod.POST, "/api/users/search").permitAll()
          .requestMatchers(HttpMethod.PATCH, "/api/users/**").authenticated()
          .requestMatchers(HttpMethod.DELETE, "/api/users/**").authenticated()

          // User roles
          .requestMatchers(HttpMethod.POST, "/api/users/*/roles").hasAnyRole("ADMIN", "MODERATOR")
          .requestMatchers(HttpMethod.DELETE, "/api/users/*/roles").hasAnyRole("ADMIN", "MODERATOR");

        crudResources.forEach(resource ->
          request
            // Доступ к данным ресурса
            .requestMatchers(HttpMethod.GET, "/api/" + resource + "/**").permitAll() // все пользователи могут читать данные
            .requestMatchers(HttpMethod.POST, "/api/" + resource + "/search").permitAll() // все пользователи могут искать данные
            .requestMatchers(HttpMethod.POST, "/api/" + resource + "/**").hasRole("USER") // только авторизованные могут создавать данные
            .requestMatchers(HttpMethod.PUT, "/api/" + resource + "/**").hasRole("USER") // обновление доступно только авторам или администраторам
            .requestMatchers(HttpMethod.PATCH, "/api/" + resource + "/**").hasRole("USER") // обновление доступно только авторам или администраторам
            .requestMatchers(HttpMethod.DELETE, "/api/" + resource + "/**").hasRole("USER") // удаление доступно только авторам или администраторам
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
  public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userService.userDetailsService());
    authProvider.setPasswordEncoder(passwordEncoderProvider.encoder());
    return authProvider;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }
}
