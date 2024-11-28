package com.businessapi.repository;




import com.businessapi.entity.PassCard;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface PassCardRepository extends JpaRepository<PassCard,Long > {


    Optional<PassCard> findByCardNumber(String cardNumber);
}
