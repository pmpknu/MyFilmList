package ru.ifmo.is.mfl.reports;

import java.sql.Timestamp;

import org.hibernate.annotations.BatchSize;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;
import ru.ifmo.is.mfl.common.framework.CrudEntity;
import ru.ifmo.is.mfl.users.User;
import ru.ifmo.is.mfl.comments.Comment;
import java.util.Set;
import java.util.HashSet;

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

  @Column(name = "user_id")
  private Integer userId;

  @Column(name = "review_id")
  private Integer reviewId;

  @Column(name = "comment_id")
  private Integer commentId;

  @Column(name = "text", nullable = false)
  private String text;

  @Column(name = "issue", length = 127)
  private String issue;

  @Column(name = "date", nullable = false)
  private Timestamp date;

  @JsonManagedReference
  @BatchSize(size = 50)
  @OneToMany(mappedBy = "report", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  private Set<Comment> comments = new HashSet<>();

  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;
}
