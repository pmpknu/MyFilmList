package ru.ifmo.is.mfl.ratings;

import lombok.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import ru.ifmo.is.mfl.common.framework.CrudEntity;
import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.users.User;

@Entity
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ratings")
public class Rating extends CrudEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ratings_id_seq")
  @SequenceGenerator(name = "ratings_id_seq", sequenceName = "ratings_id_seq", allocationSize = 1)
  @Column(name="id", nullable=false, unique=true)
  private int id;

  @NotNull
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @NotNull
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "movie_id", nullable = false)
  private Movie movie;

  @NotNull
  @Column(name = "value", nullable = false)
  @Min(1)
  @Max(10)
  private int value;
}
