package ru.ifmo.is.mfl.reports;

import java.sql.Timestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import ru.ifmo.is.mfl.comments.Comment;
import ru.ifmo.is.mfl.common.framework.CrudEntity;
import ru.ifmo.is.mfl.reviews.Review;
import ru.ifmo.is.mfl.users.User;

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
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "review_id", nullable = false)
  private Review review;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "comment_id", nullable = false)
  private Comment comment;

  @NotNull
  @Column(name = "text", nullable = false)
  private String text;

  @Column(name = "issue", length = 127)
  private String issue;

  @NotNull
  @Column(name = "date", nullable = false)
  private Timestamp date;
}