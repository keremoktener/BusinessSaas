package com.bilgeadam.businessapi.utility;

import java.util.List;
import java.util.Optional;

public interface IService <T, ID> {
    T save(T t);
    List<T> saveAll(Iterable<T> entities);
    T update (T t);
    void delete(T t);
    void deleteById(ID id);

    Optional<T> findById(ID id);
    List<T> findAll();
}
