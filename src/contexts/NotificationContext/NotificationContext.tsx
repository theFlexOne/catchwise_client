import { createContext, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client, over } from 'stompjs';

const socket = new SockJS('http://localhost:8080/api/v1/ws');
let stompClient: Client | null = null;

export const NotificationsContext = createContext<any | null>(null);

export const NotificationsProvider = ({ children }: any) => {

  useEffect(() => {
    const connect = () => {
      stompClient = over(socket);
      stompClient.connect({}, () => {
        if (!stompClient) return console.error("Stomp client is null");
        stompClient.subscribe('/topic/notifications', (message: any) => {
          console.log(message);
        });
      });
    };

    connect();
  }, []);

  return (
    <NotificationsContext.Provider value={{}}>
      {children}
    </NotificationsContext.Provider>
  );
}

