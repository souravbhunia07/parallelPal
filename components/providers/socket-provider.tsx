"use client";

import { 
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { io as ClientIO } from "socket.io-client";

// Define the shape of the context value
type SocketContextType = {
  socket: any | null; // The Socket.IO instance or null if not connected
  isConnected: boolean; // Indicates whether the socket is currently connected
};

// Create the SocketContext with initial values
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

// Custom hook to conveniently access the SocketContext value
export const useSocket = () => {
  return useContext(SocketContext);
};

// SocketProvider component to manage the Socket.IO connection and provide the context
export const SocketProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  // State to manage the socket instance and connection status
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create a new Socket.IO instance with the provided configuration
    const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    // Event handler for successful connection
    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    // Event handler for disconnection
    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    // Set the socket instance in the state
    setSocket(socketInstance);

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      socketInstance.disconnect();
    }
  }, []); // The effect runs only once when the component mounts

  // Provide the SocketContext value to the children components
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
