package ru.ifmo.is.mfl.reports;

import lombok.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;
import ru.ifmo.is.mfl.comments.Comment;
import ru.ifmo.is.mfl.common.framework.CrudEntity;
import ru.ifmo.is.mfl.reviews.Review;
import ru.ifmo.is.mfl.users.User;

import java.time.Instant;

@Entity
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reports")
public class Report extends CrudEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reports_id_seq")
  @SequenceGenerator(name = "reports_id_seq", sequenceName = "reports_id_seq", allocationSize = 1)
  @Column(name="id", nullable=false, unique=true)
  private int id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id")
  private User user;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "review_id")
  private Review review;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "comment_id")
  private Comment comment;

  @NotNull
  @Length(min= 1, max = 127)
  @Column(name = "issue", nullable = false)
  private String issue;

  @Column(name = "text")
  private String text;

  @NotNull
  @Column(name = "date", nullable = false)
  private Instant date;
}
