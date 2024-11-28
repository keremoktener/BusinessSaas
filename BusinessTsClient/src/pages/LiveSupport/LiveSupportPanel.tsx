import React, { useEffect, useRef, useState } from 'react';
import getAuthIdFromToken from '../../util/getAuthIdFromToken';
import { Stomp } from '@stomp/stompjs';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    AppBar,
    Toolbar,
    TextField,
    Button,
    Paper,
} from '@mui/material';
import { IMessage } from '../../store/feature/liveSupportSlice';
import { Send, Close } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';



interface WebSocketProps {
    messages: IMessage[];
    clientRef: React.MutableRefObject<ReturnType<typeof Stomp.over> | null>;
    isChatVisible: boolean;
    setIsChatVisible: React.Dispatch<React.SetStateAction<boolean>>;
    endConversation: () => void;
    conversationId: string | null;
}

const LiveChat: React.FC<WebSocketProps> = ({ messages, clientRef, endConversation, setIsChatVisible, conversationId }: WebSocketProps) => {
    const { t } = useTranslation();
    const [messageContent, setMessageContent] = useState<string>('');
    const token = localStorage.getItem('token');
    const authId = getAuthIdFromToken(token ?? "");
    const messageEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to the bottom when a new message arrives
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (endMessage?: string, endConversation?: boolean) => {
        console.log('Preparing to send message...');
        if (clientRef.current) {
            const message: Partial<IMessage> = {
                senderId: authId,
                receiverId: 4,
                conversationId,
                messageContent: endMessage ? endMessage : messageContent,
                status: endConversation ? false : true
            };
            console.log('Sending message:', message);
            clientRef.current.send('/app/sendMessage', {}, JSON.stringify(message));
            setMessageContent('');
        } else {
            console.log('Failed to send message. WebSocket not open.');
        }
    };
    const handleSendMessage = () => {
        sendMessage();
    }

    const handleClose = () => {
        setIsChatVisible(false);
        sendMessage('Chat has been ended.', true);
        endConversation();
    }

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">{t('liveSupport.liveSupport')}</Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
                <ListItem
                    sx={{
                        justifyContent: 'space-around'
                    }}
                >
                    <ListItemText
                        primary={t('liveSupport.infoPrimary')}
                        secondary={t('liveSupport.infoSecondary')}
                        sx={{
                            bgcolor: grey,
                            borderRadius: 1,
                            padding: 1,
                            maxWidth: '75%',
                            overflowWrap: 'break-word',
                            whiteSpace: 'normal',
                            textAlign: 'center'
                        }}
                    />
                </ListItem>
                <List>
                    {messages.map((msg) => (
                        <ListItem
                            key={msg.id}
                            sx={{
                                justifyContent: msg.senderId === authId ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <ListItemText
                                primary={msg.messageContent}
                                secondary={formatTimestamp(msg.timestamp)}
                                sx={{
                                    bgcolor: msg.senderId === authId ? '#d1e7dd' : '#cfe2ff',
                                    borderRadius: 1,
                                    padding: 1,
                                    maxWidth: '75%',
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'normal',
                                    textAlign: msg.senderId === authId ? 'right' : 'left',
                                }}
                            />
                        </ListItem>
                    ))}
                    <div ref={messageEndRef} />
                </List>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, borderTop: '1px solid #ccc' }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder={t('liveSupport.type')}
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    sx={{ mr: 1 }}
                />
                <Button sx={{ mr: 1 }} variant="contained" color="primary" onClick={handleSendMessage}>
                    <Send />
                </Button>
                <Button variant="contained" color="primary" onClick={handleClose}>
                    <Close />
                </Button>
            </Box>
        </Paper>
    );
};

export default LiveChat;
