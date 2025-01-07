package ru.ifmo.is.mfl.watchlists;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import ru.ifmo.is.mfl.common.framework.CrudEntity;
import ru.ifmo.is.mfl.users.User;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "watch_lists", uniqueConstraints = {@UniqueConstraint(columnNames = {"name", "user_id"})})
public class WatchList extends CrudEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "watch_lists_id_seq")
  @SequenceGenerator(name = "watch_lists_id_seq", sequenceName = "watch_lists_id_seq", allocationSize = 1)
  @Column(name = "id", nullable = false, unique = true)
  private int id;

  @NotNull
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id", nullable = true)
  private User user;

  @NotNull
  @NotBlank
  @Size(max = 127)
  @Column(name = "name", nullable = false)
  private String name;

  @NotNull
  @Column(name = "visibility", nullable = false)
  private boolean visibility;
}
