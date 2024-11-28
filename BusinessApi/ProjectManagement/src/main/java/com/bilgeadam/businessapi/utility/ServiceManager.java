package com.bilgeadam.businessapi.utility;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public class ServiceManager<T,ID> implements IService<T,ID>{

    private final JpaRepository<T,ID> jpaRepository;

    public ServiceManager(JpaRepository<T, ID> jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public T save(T t) {
        return jpaRepository.save(t); //t nin içerisinde id değeri yok ise save yapar.
    }

    @Override
    public List<T> saveAll(Iterable<T> entities) {
        return jpaRepository.saveAll(entities);
    }

    @Override
    public T update(T t) {
        return jpaRepository.save(t); //t nin içerisinde id değeri var ise güncelleme yapar.
    }

    @Override
    public void delete(T t) {
        jpaRepository.delete(t);
    }

    @Override
    public void deleteById(ID id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public Optional<T> findById(ID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<T> findAll() {
        return jpaRepository.findAll();

    }
}

