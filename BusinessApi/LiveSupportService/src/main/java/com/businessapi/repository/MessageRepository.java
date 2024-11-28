package com.businessapi.repository;

import com.businessapi.dto.response.Conversation;
import com.businessapi.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE (m.receiverId = :receiverId OR m.senderId = :senderId) AND m.conversationId = :conversationId")
    List<Message> findByReceiverIdOrSenderIdAndConversationId(
            @Param("receiverId") Long receiverId,
            @Param("senderId") Long senderId,
            @Param("conversationId") String conversationId);

    @Query("SELECT DISTINCT m.conversationId FROM Message m " +
            "WHERE m.conversationId NOT IN (SELECT m2.conversationId FROM Message m2 WHERE m2.status = false)")
    List<String> findConversationIdsWithAllMessagesStatusTrue();

    @Query("SELECT m FROM Message m WHERE m.conversationId IN :conversationIds")
    List<Message> findMessagesByConversationIds(@Param("conversationIds") List<String> conversationIds);
}
