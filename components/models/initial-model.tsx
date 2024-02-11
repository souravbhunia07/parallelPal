"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader, 
    DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { FileUpload } from "../file-upload";
import axios from "axios";
import { useRouter } from 'next/navigation';

// Define the validation schema for the form using Zod.
const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required."
    })
});

// Define the component for the initial modal.
export const InitialModal = () => {

    // State to track if the component is mounted.
    const [isMounted, setIsMounted] = useState(false);

    // Next.js router hook for navigation.
    const router = useRouter();

    // Effect to set isMounted to true after component mounting.
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Create a form using react-hook-form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    });

    // Check if the form is currently submitting.
    const isLoading = form.formState.isSubmitting;

    // Define the form submission function.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Make a POST request to the server API with form values.
            await axios.post("/api/servers", values);
            
            // Reset the form after successful submission.
            form.reset();

            // Refresh the Next.js router to update the page.
            router.refresh();

            // Reload the entire window to ensure any client-side changes take effect.
            window.location.reload(); // Reloads the current URL, like the Refresh button
        } catch (error) {
            // Log any errors that occur during form submission.
            console.log(error);
        }
    }

    // If the component is not yet mounted, return null to avoid hydration errors.
    if(!isMounted) {
        return null;
    }

    // Render the modal dialog with form inputs.
    return (
        <Dialog open={true}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your server! 
                    </DialogTitle>
                    <DialogDescription>
                        Give your server a personality with a name and an image. You can always change it later!
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                {/* File upload input for server image */}
                                <FormField 
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload 
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Form field for server name */}
                            <FormField 
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Server name
                                        </FormLabel>
                                        <FormControl>
                                            {/* Input for entering server name */}
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible::ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter Server Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* Form submission button */}
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
