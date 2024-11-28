import React, { useState, useEffect, useRef } from 'react';
import { Client, Stomp } from '@stomp/stompjs';

interface GreetingMessage {
    content: string;
}

interface FarewellMessage {
    content: string;
}

const WebSocketComponent: React.FC = () => {

    const [connected, setConnected] = useState<boolean>(false);
    const [greetings, setGreetings] = useState<string[]>([]);
    const [farewell, setFarewell] = useState<string[]>([]);
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        // Create and configure the STOMP client
        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                setConnected(true);
                console.log('Connected to WebSocket');
                // Subscribe to the topic
                stompClient.subscribe('/topic/greetings', (message) => {
                    const greetingMessage: GreetingMessage = JSON.parse(message.body);
                    showGreeting(greetingMessage.content);
                });

                stompClient.subscribe('/topic/farewells', (message) => {
                    const farewellMessage: FarewellMessage = JSON.parse(message.body);
                    showFarewell(farewellMessage.content);
                });
            },
            onDisconnect: () => {
                setConnected(false);
                console.log('Disconnected from WebSocket');
            },
            onStompError: (frame) => {
                console.error('STOMP Error', frame);
            },
            onWebSocketError: (error) => {
                console.error('WebSocket Error', error);
            },
        });

        // Activate the STOMP client
        stompClient.activate();
        setClient(stompClient);

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, []);

    const showGreeting = (message: string) => {
        setGreetings((prevGreetings) => [...prevGreetings, message]);
    };

    const showFarewell = (message: string) => {
        setFarewell((prevFarewells) => [...prevFarewells, message]);
    };

    const sendName = (name: string) => {
        if (client && connected) {
            client.publish({ destination: '/app/hello', body: JSON.stringify({ name }) });
        }
    };

    const sendNameToFarewell = (name: string) => {
        if (client && connected) {
            client.publish({ destination: '/app/goodbye', body: JSON.stringify({ name }) });
        }
    };

    return (
        <div>
            <div>
                <button onClick={() => sendName('Emir')} disabled={!connected}>
                    Send Hi
                </button>
                <button
                    onClick={() => {
                        if (client) {
                            client.deactivate();
                            setConnected(false);
                        }
                    }}
                    disabled={!connected}
                >
                    Disconnect
                </button>
            </div>
            <div>
                <h2>Greetings:</h2>
                <ul>
                    {greetings.map((greeting, index) => (
                        <li key={index}>{greeting}</li>
                    ))}
                </ul>
            </div>
            <button onClick={() => sendNameToFarewell('Emir')} disabled={!connected}>
                Send Bye
            </button>
            <div>
                <h2>Farewell:</h2>
                <ul>
                    {farewell.map((farewell, index) => (
                        <li key={index}>{farewell}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WebSocketComponent;