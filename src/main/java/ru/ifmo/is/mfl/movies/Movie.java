package ru.ifmo.is.mfl.movies;

import lombok.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import ru.ifmo.is.mfl.common.framework.CrudEntity;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "movies")
public class Movie extends CrudEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "movies_id_seq")
  @SequenceGenerator(name = "movies_id_seq", sequenceName = "movies_id_seq", allocationSize = 1)
  @Column(name="id", nullable=false, unique=true)
  private int id;

  @NotNull
  @NotBlank
  @Size(max = 127)
  @Column(name = "title", nullable = false)
  private String title;

  @Column(name = "description")
  private String description;

  @Size(max = 255)
  @Column(name = "poster")
  private String poster;

  @Column(name = "release_date")
  private LocalDate releaseDate;

  @Column(name = "duration")
  private Integer duration;

  @Column(name = "rating")
  private Float rating;

  @Size(max = 127)
  @Column(name = "categories")
  private String categories;

  @Size(max = 127)
  @Column(name = "tags")
  private String tags;

  @Size(max = 63)
  @Column(name = "production_country")
  private String productionCountry;

  @Size(max = 127)
  @Column(name = "genres")
  private String genres;

  @Column(name = "actors")
  private String actors;

  @Size(max = 127)
  @Column(name = "director")
  private String director;

  @Column(name = "seasons")
  private Integer seasons;

  @Column(name = "series")
  private Integer series;

  @NotNull
  @Column(name = "viewed_counter", nullable = false)
  private int viewedCounter;

  public void incrementViewedCounter() {
    viewedCounter++;
  }

  public void decrementViewedCounter() {
    viewedCounter--;
  }

  @NotNull
  @Column(name = "rated_counter", nullable = false)
  private int ratedCounter;

  public void incrementRatedCounter() {
    ratedCounter++;
  }

  public void decrementRatedCounter() {
    ratedCounter--;
  }

  @NotNull
  @Column(name = "reviewed_counter", nullable = false)
  private int reviewedCounter;

  public void incrementReviewedCounter() {
    reviewedCounter++;
  }

  public void decrementReviewedCounter() {
    reviewedCounter--;
  }

  @NotNull
  @Column(name = "comments_counter", nullable = false)
  private int commentsCounter;

  public void incrementCommentsCounter() {
    commentsCounter++;
  }

  public void decrementCommentsCounter() {
    commentsCounter--;
  }
}
