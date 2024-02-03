// Import necessary modules from the standard HTTP library and Socket.IO
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io"; 

// Import the modified type definitions from types.ts
import { NextApiResponseServerIo } from "@/types";

// Disable built-in Next.js body parser for this API route
export const config = {
    api: {
        bodyparser: false,
    },
};

// Define a handler for the Socket.IO connection
const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    // Check if Socket.IO instance is not already attached to the server
    if (!res.socket.server.io) {
        // Define the path for the Socket.IO connection
        const path = "/api/socket/io";

        // Get the HTTP server from the Next.js response socket
        const httpServer: NetServer = res.socket.server as any;

        // Create a new instance of Socket.IO and attach it to the HTTP server
        const io = new ServerIO(httpServer, {
            path: path,
            // @ts-ignore
            addTrailingSlash: false,  // Ensure trailing slashes are not added to the path
        });

        // Attach the Socket.IO instance to the server to reuse it on subsequent requests
        res.socket.server.io = io;
    }

    // End the response since Socket.IO setup is complete
    res.end();
}

// Export the Socket.IO handler as the default export of this module
export default ioHandler;
