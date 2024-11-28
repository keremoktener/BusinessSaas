package com.businessapi.dto.response;

import com.businessapi.entity.Message;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Conversation {
    private String conversationId;
    private Long userId;
    private List<Message> messages;
}
