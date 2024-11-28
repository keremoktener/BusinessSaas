import { useRef, useState } from "react";
import Header from "./components_authorised_pages/Header";
import { CssBaseline, Box, useMediaQuery, Fab } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";
import { useSwipeable } from 'react-swipeable';
import ChatIcon from '@mui/icons-material/Chat'; 
import LiveSupportPanel from "../../pages/LiveSupport/LiveSupportPanel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "../../store";
import { Stomp } from '@stomp/stompjs';
import {fetchFindAllMessages, IMessage} from "../../store/feature/liveSupportSlice";
import getAuthIdFromToken from "../../util/getAuthIdFromToken";
import { v4 as uuidv4 } from 'uuid';

const drawerWidth = 240;

const EasyStyleMain = styled("main", {
    shouldForwardProp: (prop) => prop !== "open",
})<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const EasyStyleDrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

interface PostAuthTemplateProps {
    children: ReactNode;
}

function PostAuthTemplate({ children }: PostAuthTemplateProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [drawerState, setDrawerState] = useState(false);
    const [isChatVisible, setIsChatVisible] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const userRoles = useSelector((state: RootState) => state.userSlice.userRoleList);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const clientRef = useRef<ReturnType<typeof Stomp.over> | null>(null);
    const token = localStorage.getItem('token');
    const authId = getAuthIdFromToken(token ?? "");
    const [conversationId, setConversationId] = useState<string | null>(null);
    const handleDrawerStateChange = (newState: boolean) => {
        setDrawerState(newState);
    };

    const handleDrawerClose = () => {
        setDrawerState(false);
    };

    const handleDrawerOpen = () => {
        setDrawerState(true);
    };

    const handlers = useSwipeable({
        onSwipedRight: handleDrawerOpen,  
        onSwipedLeft: handleDrawerClose,  
        trackMouse: false, 
    });


    const startConversation = () => {
        const newConversationId = uuidv4();
        setConversationId(newConversationId);
        return newConversationId;
    };

    const handleChatButtonClick = () => {
        if (conversationId) {
            dispatch(fetchFindAllMessages(conversationId)).then((result) => {
                if (result.meta.requestStatus === "fulfilled") {
                    setMessages(result.payload);
                }
            })
        }
        if(!clientRef.current){
            const conversationId = startConversation();
            clientRef.current = Stomp.over(new WebSocket('ws://localhost:9088/ws'));
            clientRef.current.connect({}, (frame: string) => {
                console.log('Connected: ' + frame);
    
                clientRef.current?.subscribe('/queue/messages/'+authId, (stompMessage) => {
                    const newMessage: IMessage = JSON.parse(stompMessage.body);
                    console.log('New message received:', newMessage);
                    dispatch(fetchFindAllMessages(conversationId)).then((result) => {
                        if (result.meta.requestStatus === "fulfilled") {
                            setMessages(result.payload);
                        }
                    })
                });
            });
        }
        setIsChatVisible(!isChatVisible);
    };

    const endConversation = () => {
        if (clientRef.current) {
            setMessages([])
            setConversationId(null);
            clientRef.current.disconnect();
            clientRef.current = null;
        }
    };

    return (
        <>
            <Box sx={{ display: "flex" }} {...handlers}>
                <CssBaseline />
                <Header
                    drawerState={drawerState}
                    setDrawerState={handleDrawerStateChange}
                />
                <EasyStyleMain open={drawerState} sx={{ minHeight: "100vh" }} onClick={() => isSmallScreen && setDrawerState(false)}>
                    <EasyStyleDrawerHeader />
                    {children} 
                    {!userRoles.includes("SUPPORTER") && (
                        <Fab 
                        id="chat-button"
                        color="primary" 
                        aria-label="chat" 
                        sx={{
                            position: 'fixed',
                            bottom: 16,
                            right: 16,
                        }}
                        onClick={handleChatButtonClick}
                    >
                        <ChatIcon />
                    </Fab>
                    )}
                    {isChatVisible && (
                        <Box
                            id="chat-box"
                            sx={{
                                position: 'fixed',
                                bottom: 80,
                                right: 16,
                                width: isSmallScreen ? '90%' : 400,
                                height: 500, 
                                boxShadow: 3,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                zIndex: 1300,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <LiveSupportPanel
                                messages={messages}
                                clientRef={clientRef} 
                                isChatVisible={isChatVisible}
                                setIsChatVisible={setIsChatVisible}
                                endConversation={endConversation}
                                conversationId={conversationId}
                            />  
                        </Box>
                    )}
                </EasyStyleMain>
            </Box>
        </>
    );
}

export default PostAuthTemplate;
