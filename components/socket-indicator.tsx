// Importing the necessary modules from the application
"use client";
import { useSocket } from "./providers/socket-provider";
import { Badge } from "./ui/badge";

/**
 * Socketindicator component is responsible for displaying a badge indicating the current connection status
 * with a socket. It dynamically renders different badges based on the connection state.
 */
export const Socketindicator = () => {
    // Retrieve the connection status from the useSocket hook
    const { isConnected } = useSocket();

    // Render a fallback badge if the socket is not connected
    if (!isConnected) {
        return (
            <Badge variant="outline" className="bg-yellow-600 text-white border-none">
                Fallback: polling every 1s
            </Badge>
        );
    }

    // Render a live badge if the socket is connected
    return (
        <Badge variant="outline" className="bg-emerald-600 text-white border-none">
            Live: Real Updates
        </Badge>
    );
}
