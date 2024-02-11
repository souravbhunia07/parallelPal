// Importing necessary dependencies and components
"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Plus, Smile } from "lucide-react";
import axios from "axios";
import { useModal } from "@/hooks/use-model-store";
import { EmojiPicker } from "../emoji-picker";
import { useRouter } from "next/navigation";

// Defining the props interface for the ChatInput component
interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: "conversation" | "channel";
}

// Defining the form schema using Zod for validation
const formSchema = z.object({
    content: z.string().min(1),
});

// ChatInput component function
export const ChatInput = ({
    apiUrl,
    query,
    name,
    type,
}: ChatInputProps) => {
    const { onOpen } = useModal();
    const router = useRouter();

    // Initializing the useForm hook with Zod resolver and default values
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        },
    });

    // Extracting loading state from the form
    const isLoading = form.formState.isSubmitting;

    // Handling form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Creating the URL with apiUrl and query parameters using query-string
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });

            // Making a POST request using axios with the formed URL and form values
            await axios.post(url, values);

            form.reset();
            router.refresh();
        } catch (error) {
            console.log(error);
        }
    };

    // Rendering the ChatInput component
    return (
        <Form {...form}>
            {/* Wrapping the input field in a form for submission */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Using FormField to encapsulate the input control */}
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                {/* Styling and structure for the input field */}
                                <div className="relative p-4 pb-6">
                                    {/* Button for the upload popup */}
                                    <button
                                        type="button"
                                        onClick={() => onOpen("messageFile", { apiUrl, query })}
                                        className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                                    >
                                        <Plus className="text-white dark:text-[#313338] " />
                                    </button>
                                    {/* Input field for user messages */}
                                    <Input
                                        disabled={isLoading}
                                        className="px-14 py-6 bg-zinc-700/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                        placeholder={`Message ${
                                            type == "conversation"
                                                ? name
                                                : "#" + name
                                        }`}
                                        {...field}
                                    />
                                    {/* Emoji button */}
                                    <div className="absolute top-7 right-8">
                                        <EmojiPicker 
                                            onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};
