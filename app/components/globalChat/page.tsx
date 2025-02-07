"use client"
import Chat from "./Chat/page"
import { SocketProvider } from "../provider/SocketProvider"

const ChatComponent = () => {
  return (<SocketProvider>
    <Chat />
  </SocketProvider>
  );

}

export default ChatComponent