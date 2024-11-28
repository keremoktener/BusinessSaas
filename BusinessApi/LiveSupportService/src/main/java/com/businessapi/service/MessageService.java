package com.businessapi.service;

import com.businessapi.dto.response.Conversation;
import com.businessapi.entity.Message;
import com.businessapi.repository.MessageRepository;
import com.businessapi.util.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> getMessages(String conversationId) {
        Long authId = SessionManager.getIdFromAuthenticatedUser();
        return messageRepository.findByReceiverIdOrSenderIdAndConversationId(authId, authId, conversationId);
    }

    public List<Conversation> getConversationsWithAllMessagesStatusTrue() {
        List<String> conversationIds = messageRepository.findConversationIdsWithAllMessagesStatusTrue();
        List<Message> messages = messageRepository.findMessagesByConversationIds(conversationIds);

        return messages.stream()
                .collect(Collectors.groupingBy(Message::getConversationId))
                .entrySet().stream()
                .map(entry -> new Conversation(entry.getKey(), entry.getValue().getFirst().getSenderId(), entry.getValue()))
                .collect(Collectors.toList());
    }

}