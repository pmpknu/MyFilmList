package ru.ifmo.is.mfl.movieviews;

import jakarta.persistence.*;
import lombok.*;

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
@Table(name = "movie_views")
public class MovieView extends CrudEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "movie_views_id_seq")
  @SequenceGenerator(name = "movie_views_id_seq", sequenceName = "movie_views_id_seq", allocationSize = 1)
  @Column(name="id", nullable=false, unique=true)
  private int id;

  @NonNull
  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
  private User user;

  @NonNull
  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumn(name = "movie_id", referencedColumnName = "id", nullable = false)
  private Movie movie;

  @NonNull
  @Column(name = "watch_date", nullable = false)
  private Instant watchDate;
}
