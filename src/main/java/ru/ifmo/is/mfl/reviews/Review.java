package ru.ifmo.is.mfl.reviews;

import lombok.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import ru.ifmo.is.mfl.common.framework.CrudEntity;
import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.users.User;

import java.time.Instant;

@Entity
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reviews")
public class Review extends CrudEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reviews_id_seq")
  @SequenceGenerator(name = "reviews_id_seq", sequenceName = "reviews_id_seq", allocationSize = 1)
  @Column(name="id", nullable=false, unique=true)
  private int id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id", referencedColumnName = "id")
  private User user;

  @NotNull
  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumn(name = "movie_id", referencedColumnName = "id", nullable = false)
  private Movie movie;

  @NotNull
  @Column(name = "visible", nullable = false)
  private boolean visible;

  @NotNull
  @Column(name = "text", nullable = false)
  private String text;

  @NotNull
  @Column(name = "rating", nullable = false)
  @Min(1)
  @Max(10)
  private int rating;

  @NotNull
  @Column(name = "date", nullable = false)
  private Instant date;
}
