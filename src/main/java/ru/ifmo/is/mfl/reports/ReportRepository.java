package ru.ifmo.is.mfl.reports;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import ru.ifmo.is.mfl.common.framework.CrudRepository;

public interface ReportRepository extends CrudRepository<Report> {
  Page<Report> findAllByResolved(boolean resolved, Pageable pageable);
}
