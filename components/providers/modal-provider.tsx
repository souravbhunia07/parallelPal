// Importing necessary modules from React
"use client";
import { useEffect, useState } from "react";

// Importing modal components
import { CreateServerModal } from "../models/create-server-modal";
import { InviteModal } from "../models/invite-modal";
import { EditServerModal } from "../models/edit-server-modal";
import { MembersModal } from "../models/members-modal";
import { CreateChannelModal } from "../models/create-channel-modal";
import { LeaveServerModal } from "../models/leave-server-modal";
import { DeleteServerModal } from "../models/delete-server-modal";
import { DeleteChannelModal } from "../models/delete-channel-modal";
import { EditChannelModal } from "../models/edit-channel-modal";
import { MessageFileModel } from "../models/message-file-model";
import { DeleteMessageModal } from "../models/delete-message-model";

/**
 * ModalProvider Component
 * 
 * This component serves as a container for various modal components used in the application.
 * It ensures that modals are mounted only after the component itself has been mounted.
 */
export const ModalProvider = () => {
    // State to track whether the component is mounted
    const [isMounted, setIsMounted] = useState(false);

    // useEffect hook to set isMounted to true after the component is mounted
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // If the component is not mounted, return null
    if (!isMounted) {
        return null;
    }

    // Rendering various modal components
    return (
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal />
            <MembersModal />
            <CreateChannelModal />
            <LeaveServerModal />
            <DeleteServerModal />
            <DeleteChannelModal />
            <EditChannelModal />
            <MessageFileModel />
            <DeleteMessageModal />
        </>
    );
}
