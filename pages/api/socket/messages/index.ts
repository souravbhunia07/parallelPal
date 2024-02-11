// Importing necessary modules and functions
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

// Defining the main API endpoint handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Checking if the HTTP method is not POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Retrieving the current user's profile using the provided request
        const profile = await currentProfilePages(req);

        // Destructuring the request body and query parameters
        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;

        // Handling authentication and missing parameters
        if (!profile) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!serverId) {
            return res.status(401).json({ error: "Server ID Missing" });
        }

        if (!channelId) {
            return res.status(401).json({ error: "Channel ID Missing" });
        }

        if (!content) {
            return res.status(401).json({ error: "Content Missing" });
        }

        // Retrieving the server information based on the provided serverId
        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true,
            }
        });

        // Handling cases where the server is not found
        if (!server) {
            return res.status(404).json({ message: "Server not found!" });
        }

        // Retrieving the channel information based on the provided channelId and serverId
        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            }
        });

        // Handling cases where the channel is not found
        if (!channel) {
            return res.status(404).json({ message: "Channel not found!" });
        }

        // Retrieving the member information based on the profileId within the server
        const member = server.members.find((member) => member.profileId === profile.id);

        // Handling cases where the member is not found
        if (!member) {
            return res.status(404).json({ message: "Member not found!" });
        }

        // Creating a new message in the database
        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    }
                }
            }
        });

        // Broadcasting the new message to all clients in the channel
        const channelKey = `chat:${channelId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, message);

        // Returning success response
        return res.status(200).json({ message: "Internal Error" });

    } catch (error) {
        // Logging and handling internal errors
        console.log("[MESSAGES_POST]", error);
        return res.status(500).json({ message: "Internal Error" });
    }
}
