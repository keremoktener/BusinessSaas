package com.businessapi.controller;

import com.businessapi.dto.response.Conversation;
import com.businessapi.entity.Message;
import com.businessapi.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

import static com.businessapi.constants.Endpoints.*;

@RequiredArgsConstructor
@RestController
@CrossOrigin("*")
@RequestMapping(ROOT+MESSAGE)
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    @MessageMapping(SEND_MESSAGE)
    @SendToUser(QUEUE_MESSAGES)
    public Message sendMessage(Message message) {
        message.setTimestamp(LocalDateTime.now());
        messageService.saveMessage(message);
        messagingTemplate.convertAndSend(QUEUE_MESSAGES+"/"+message.getReceiverId(), message);
        messagingTemplate.convertAndSend(QUEUE_MESSAGES+"/"+message.getSenderId(), message);
        return message;
    }
    @PostMapping(FIND_ALL)
    @PreAuthorize("hasAnyAuthority('MEMBER','SUPPORTER')")
    @Operation(summary = "Find all messages", security = @SecurityRequirement(name = "bearerAuth"))
    public List<Message> getMessages(@RequestParam String conversationId) {
        return messageService.getMessages(conversationId);
    }

    @PostMapping(FIND_ALL_CONVERSATION)
    @PreAuthorize("hasAnyAuthority('MEMBER','SUPPORTER')")
    @Operation(summary = "Find all conversations", security = @SecurityRequirement(name = "bearerAuth"))
    public List<Conversation> getAllConversations() {
        return messageService.getConversationsWithAllMessagesStatusTrue();
    }

}