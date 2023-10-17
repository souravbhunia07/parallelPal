"use client";

import { useEffect, useState } from "react";
import { CreateServerModal } from "../models/create-server-modal";
import { InviteModal } from "../models/invite-modal";
import { EditServerModal } from "../models/edit-server-modal";
import { MembersModal } from "../models/members-modal";

export const ModalProvider = () => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!isMounted)
    {
        return null;
    }

    return(
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal />
            <MembersModal />
        </>
    )
}