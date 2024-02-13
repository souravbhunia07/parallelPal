// Importing necessary components from lucide-react, as well as custom components
import { Hash } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";
import { UserAvatar } from "../user-avatar";
import { Socketindicator } from "../socket-indicator";
import { ChatVideoButton } from "./chat-video-button";

// Defining the properties expected by the ChatHeader component
interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    imageUrl?: string;
}

// ChatHeader component definition
export const ChatHeader = ({
    serverId,
    name,
    type,
    imageUrl
}: ChatHeaderProps) => {
    return (
        // Container div for the entire chat header with flex layout and border
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">

            {/* MobileToggle component for toggling mobile view */}
            <MobileToggle serverId={serverId} />

            {/* Displaying Hash icon if the type is "channel" */}
            {type == "channel" && (
                <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
            )}

            {/* Displaying UserAvatar if the type is "conversation" */}
            {type === "conversation" && (
                <UserAvatar
                    src={imageUrl}
                    className="h-8 w-8 md:h-8 md:w-8 mr-2"
                />
            )}

            {/* Displaying the name of the channel or conversation */}
            <p className="font-semibold text-md text-black dark:text-white">
                {name}
            </p>

            {/* Container for Socketindicator component with right alignment */}
            <div className="ml-auto flex items-center">
                {type === "conversation" && (
                    <ChatVideoButton />
                )}
                <Socketindicator />
            </div>
        </div>
    );
};
