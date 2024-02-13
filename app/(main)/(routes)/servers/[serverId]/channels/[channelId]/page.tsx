// Importing necessary components and utilities
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

// Define the props interface for the ChannelIdPage component
interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    }
}

// Define the ChannelIdPage component as an asynchronous function
const ChannelIdPage = async ({
    params
} : ChannelIdPageProps) => {

    // Retrieve the current user's profile
    const profile = await currentProfile();

    // Check if the user is not logged in, and redirect to sign-in page if not
    if (!profile) {
        return redirectToSignIn();
    }

    // Retrieve the channel based on the provided channelId
    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        },
    });

    // Retrieve the member based on the provided serverId and user's profileId
    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        }
    });

    // Check if the channel or member does not exist, and redirect to the home page if not
    if (!channel || !member) {
        redirect("/");
    }

    // Render the ChannelIdPage component with ChatHeader, message display area, and ChatInput
    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            {/* Display the chat header with channel/server information */}
            <ChatHeader 
                name={channel.name}
                serverId={channel.serverId}
                type="channel"
            />

            {channel.type === ChannelType.Text && (
                <>
                    <ChatMessages 
                        name={channel.name}
                        member={member}
                        chatId={channel.id}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages" 
                        socketQuery={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                    />

                    {/* Display the chat input component for sending messages */}
                    <ChatInput 
                        name={channel.name}
                        type="channel"
                        apiUrl="/api/socket/messages"
                        query={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                    />
                </>
            )}
            {channel.type === ChannelType.AUDIO && (
                <MediaRoom 
                    chatId = {channel.id}
                    video = {false}
                    audio = {true}
                />
            )}
            {channel.type === ChannelType.VIDEO && (
                <MediaRoom 
                    chatId = {channel.id}
                    video = {true}
                    audio = {true}
                />
            )}
        </div>
    );
}

// Export the ChannelIdPage component as the default export
export default ChannelIdPage;
