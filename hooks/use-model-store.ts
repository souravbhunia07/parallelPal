// Importing necessary types from the Prisma client and Zustand library
import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

// Defining a type for different modal types
export type ModalType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | "leaveServer" | "deleteServer" | "deleteChannel" | "editChannel" | "messageFile" | "deleteMessage";

// Defining the data structure for the modal, including optional properties related to servers, channels, and API URLs
interface ModalData {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
  apiUrl?: string;
  query?: Record<string, any>;
}

// Defining the structure of the modal store using Zustand
interface ModalStore {
  // Type of the current modal or null if no modal is open
  type: ModalType | null;

  // Data associated with the current modal
  data: ModalData;

  // Flag indicating whether the modal is currently open
  isOpen: boolean;

  // Function to open a modal with specified type and optional data
  onOpen: (type: ModalType, data?: ModalData) => void;

  // Function to close the currently open modal
  onClose: () => void;
}

// Creating the Zustand store for managing modals
export const useModal = create<ModalStore>((set) => ({
  // Initial state with no modal open
  type: null,
  data: {},
  isOpen: false,

  // Function to open a modal with specified type and optional data
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),

  // Function to close the currently open modal
  onClose: () => set({ type: null, isOpen: false }),
}));

// Explanation of the code above:

// - Importing necessary types from Prisma client and Zustand library.
// - Defining a type 'ModalType' which represents different modal types.
// - Creating an interface 'ModalData' to define the structure of data associated with the modals.
// - Defining the 'ModalStore' interface, which represents the structure of the modal store using Zustand.
// - Creating the 'useModal' store using Zustand with initial state, 'onOpen' function to open modals, and 'onClose' function to close modals.
// - Adding comments to explain the purpose and usage of each part of the code for better understanding.
