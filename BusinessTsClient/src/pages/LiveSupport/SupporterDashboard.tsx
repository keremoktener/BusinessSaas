import React, { useEffect, useRef, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    AppBar,
    Toolbar,
    TextField,
    Button,
    Paper,
    Grid,
    Divider,
} from '@mui/material';
import getAuthIdFromToken from '../../util/getAuthIdFromToken';
import { IMessage, IConversation, fetchFindAllConversation } from '../../store/feature/liveSupportSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchUserInformationById } from '../../store/feature/userSlice';
import { Send } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const SupporterChat: React.FC = () => {
    const { t } = useTranslation();
    const [conversationList, setConversationList] = useState<IConversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const clientRef = useRef<ReturnType<typeof Stomp.over> | null>(null); ""
    const token = localStorage.getItem('token');
    const authId = getAuthIdFromToken(token ?? "");
    const dispatch = useDispatch<AppDispatch>();
    const messageEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to the bottom when a new message arrives
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConversation?.messages]);

    const getConversations = () => {
        dispatch(fetchFindAllConversation()).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                const conversations = result.payload as IConversation[];

                // Fetch user information for each conversation and wait for all to complete
                Promise.all(conversations.map(async (conversation) => {
                    const userId = conversation.userId;
                    const userResult: any = await dispatch(fetchUserInformationById(userId));
                    if (userResult.meta.requestStatus === "fulfilled") {
                        // Return a new conversation object with user information added
                        return {
                            ...conversation,
                            firstName: userResult.payload.data.firstName,
                            lastName: userResult.payload.data.lastName,
                            email: userResult.payload.data.email
                        };
                    }
                    return conversation; // In case of an error, return the original conversation
                })).then((updatedConversations) => {
                    // Update the state with the array containing the updated conversations
                    setConversationList(updatedConversations);
                });
            }
        });
    }
    useEffect(() => {
        getConversations();
        clientRef.current = Stomp.over(new WebSocket('ws://localhost:9088/ws'));
        clientRef.current.connect({}, (frame: string) => {
            console.log('Connected: ' + frame);
            clientRef.current?.subscribe('/queue/messages/' + authId, (stompMessage) => {
                const newMessage: IMessage = JSON.parse(stompMessage.body);
                if (selectedConversation && newMessage.conversationId === selectedConversation.conversationId) {
                    setSelectedConversation(prev => ({
                        ...prev!,
                        messages: [...(prev?.messages || []), newMessage]
                    }));
                }
                getConversations();
            });
        });

        return () => {
            clientRef.current?.disconnect();
        };
    }, [authId, dispatch, selectedConversation]);

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleSelectConversation = (conversation: IConversation) => {
        setSelectedConversation(conversation);
    };

    const handleSendMessage = () => {
        if (clientRef.current && selectedConversation) {
            const message: Partial<IMessage> = {
                senderId: authId,
                receiverId: selectedConversation.userId,
                conversationId: selectedConversation.conversationId,
                messageContent: newMessage,
                status: true
            };
            clientRef.current.send('/app/sendMessage', {}, JSON.stringify(message));
            setNewMessage('');
        }
    };

    return (
        <Grid container spacing={3} padding={3} height="calc(100vh - 100px)">
            {/* Conversation List */}
            <Box width="30%" borderRight="1px solid #ddd" p={2} bgcolor="white" display="flex" flexDirection="column">
                <Typography variant="h6" gutterBottom>{t('liveSupport.conversations')}</Typography>
                <Box flex={1} overflow="auto" maxHeight="80vh">
                    <List>
                        {conversationList.map((conversation) => (
                            <ListItemButton
                                key={conversation.conversationId}
                                onClick={() => handleSelectConversation(conversation)}
                                selected={selectedConversation?.conversationId === conversation.conversationId}
                            >
                                <ListItemText primary={conversation.firstName + ' ' + conversation.lastName} secondary={conversation.email} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Box>

            {/* Message Feed */}
            <Box maxHeight={'100%'} flex={1} p={2} display="flex" flexDirection="column" bgcolor="white">
                <Typography variant="h6" gutterBottom>{t('liveSupport.messages')}</Typography>
                <Divider />
                <Box flex={1} overflow="scroll" my={2} p={1} style={{ backgroundColor: '#f9f9f9' }}>
                    <List>
                        {selectedConversation?.messages?.map((msg, id) => (
                            <ListItem
                                key={id}
                                sx={{
                                    justifyContent: msg.status
                                        ? (msg.senderId === authId ? 'flex-end' : 'flex-start')
                                        : 'center'
                                }}
                            >
                                <ListItemText
                                    primary={msg.messageContent}
                                    secondary={formatTimestamp(msg.timestamp)}
                                    sx={{
                                        bgcolor: msg.status
                                            ? (msg.senderId === authId ? '#d1e7dd' : '#cfe2ff')
                                            : 'transparent',
                                        borderRadius: 1,
                                        padding: 1,
                                        maxWidth: '75%',
                                        overflowWrap: 'break-word',
                                        whiteSpace: 'normal',
                                        textAlign: msg.status
                                            ? (msg.senderId === authId ? 'right' : 'left')
                                            : 'center',
                                    }}
                                />
                            </ListItem>
                        ))}
                        <div ref={messageEndRef} />
                    </List>
                </Box>
                {/* Message Input */}
                <Box display="flex" alignItems="center" mt={2}>
                    <TextField
                        fullWidth
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('liveSupport.type')}
                        variant="outlined"
                    />
                    <Button variant="contained" color="primary" onClick={handleSendMessage} style={{ marginLeft: '0.5rem' }}>
                        <Send />
                    </Button>
                </Box>
            </Box>
        </Grid>
    );
};

export default SupporterChat;