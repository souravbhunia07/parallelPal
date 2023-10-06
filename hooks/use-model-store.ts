import { create } from "zustand";

export type ModalType = "createServer";

interface ModalStore {
    type: ModalType | null;
    isOpen: boolean;
    onOpen: (type: ModalStore) => void;
    onClose: () => void;
}

// Create a store
export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    onOpen: (type) => set({ isOpen: true, type }),
    onClose: () => set({ type: null, isOpen: false })
}));