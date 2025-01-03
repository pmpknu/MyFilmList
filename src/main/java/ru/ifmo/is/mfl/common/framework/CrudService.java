package ru.ifmo.is.mfl.common.framework;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import ru.ifmo.is.mfl.common.caching.RequestCache;
import ru.ifmo.is.mfl.common.errors.ResourceNotFoundException;
import ru.ifmo.is.mfl.common.framework.dto.CrudDto;
import ru.ifmo.is.mfl.common.search.SearchDto;
import ru.ifmo.is.mfl.common.search.SearchMapper;
import ru.ifmo.is.mfl.users.User;
import ru.ifmo.is.mfl.users.UserService;

@AllArgsConstructor
public abstract class CrudService<
  T extends CrudEntity,
  TRepository extends CrudRepository<T>,
  TMapper extends CrudMapper<T, TDto, TCreateDto, TUpdateDto>,
  TPolicy extends CrudPolicy<T>,
  TDto extends CrudDto,
  TCreateDto,
  TUpdateDto
  > {

  protected TRepository repository;
  private TMapper mapper;
  private TPolicy policy;
  private SearchMapper<T> searchMapper;
  private UserService userService;

  public Page<TDto> getAll(Pageable pageable) {
    policy.showAll(currentUser());

    var objs = repository.findAll(pageable);
    return objs.map(mapper::map);
  }

  public Page<TDto> findBySearchCriteria(SearchDto searchData, Pageable pageable) {
    policy.search(currentUser());

    var objs = repository.findAll(searchMapper.map(searchData), pageable);
    return objs.map(mapper::map);
  }

  @Transactional
  public TDto create(TCreateDto objData) {
    preAction();

    try {
      policy.create(currentUser());

      var obj = mapper.map(objData);

      validateCreate(obj, objData);

      obj.setUser(currentUser());
      repository.save(obj);

      return mapper.map(obj);
    } finally {
      postAction();
    }
  }

  public TDto getById(int id) {
    var obj = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
    policy.show(currentUser(), obj);

    return mapper.map(obj);
  }

  @Transactional
  public TDto update(TUpdateDto objData, int id) {
    preAction();

    try {
      var obj = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Not Found: " + id));
      policy.update(currentUser(), obj);

      validateUpdate(obj, objData);

      mapper.update(objData, obj);
      repository.save(obj);

      return mapper.map(obj);
    } finally {
      postAction();
    }
  }

  @Transactional(isolation = Isolation.REPEATABLE_READ)
  public boolean delete(int id) {
    preAction();

    try {
      var obj = repository.findById(id);
      return obj.map(o -> {
          policy.delete(currentUser(), o);
          repository.delete(o);
          return true;
        }).orElse(false);
    } finally {
      postAction();
    }
  }

  @RequestCache
  private User currentUser() {
    try {
      return userService.getCurrentUser();
    } catch (UsernameNotFoundException _ex) {
      return null;
    }
  }

  protected void preAction() {
  }

  protected void postAction() {
  }

  public void validateCreate(T obj, TCreateDto objData) {
  }

  public void validateUpdate(T obj, TUpdateDto objData) {
  }
}
