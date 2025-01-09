package ru.ifmo.is.mfl.comments;

import lombok.*;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import ru.ifmo.is.mfl.common.framework.CrudEntity;
import ru.ifmo.is.mfl.movies.Movie;
import ru.ifmo.is.mfl.users.User;
import ru.ifmo.is.mfl.watchlists.WatchList;
import ru.ifmo.is.mfl.reviews.Review;

import java.time.Instant;

@Entity
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comments")
public class Comment extends CrudEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "comments_id_seq")
  @SequenceGenerator(name = "comments_id_seq", sequenceName = "comments_id_seq", allocationSize = 1)
  @Column(name="id", nullable=false, unique=true)
  private int id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id", referencedColumnName = "id")
  private User user;

  @JsonIgnore
  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumn(name = "review_id", referencedColumnName = "id")
  private Review review;

  @JsonIgnore
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "watchlist_id", referencedColumnName = "id")
  private WatchList watchList;

  @JsonIgnore
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "movie_id", referencedColumnName = "id")
  private Movie movie;

  @Column(name = "visible", nullable = false)
  private boolean visible;

  @Column(name = "text", nullable = false)
  private String text;

  @Column(name = "date", nullable = false)
  private Instant date;
}
