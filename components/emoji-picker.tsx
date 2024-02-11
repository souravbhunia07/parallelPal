// Importing necessary components and utilities
"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

// Defining the properties for the EmojiPicker component
interface EmojiPickerProps {
    onChange: (value: string) => void; // Callback function triggered on emoji selection
}

// EmojiPicker Component: Displays a smiley icon that opens an emoji picker on click
export const EmojiPicker = ({
    onChange
} : EmojiPickerProps) => {
    // Using the next-themes hook to get the resolved theme (light or dark)
    const { resolvedTheme } = useTheme();

    return (
        <Popover>
            {/* Trigger for the popover - Smile icon */}
            <PopoverTrigger>
                <Smile 
                    // Styling for the Smile icon based on theme and interaction states
                    className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                />
            </PopoverTrigger>

            {/* Content of the popover - Emoji picker */}
            <PopoverContent 
                side="right" 
                sideOffset={40}
                // Styling for the popover content
                className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
            >
                <Picker 
                    // Providing the resolved theme to the Emoji picker component
                    theme={resolvedTheme}
                    // Providing emoji data to the Emoji picker component
                    data={data}
                    // Handling emoji selection and calling the onChange callback
                    onEmojiSelect={(emoji: any) => onChange(emoji.native)}
                />
            </PopoverContent>
        </Popover>
    );
}
