package ru.ifmo.is.mfl;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class MyFilmListApplication {
  public static void main(String[] args) {
    SpringApplication.run(MyFilmListApplication.class, args);
  }
}
