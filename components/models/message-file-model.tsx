"use client";

// Importing necessary components and utilities
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
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { FileUpload } from "../file-upload";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useModal } from "@/hooks/use-model-store";
import qs from "query-string";

// Define the Zod schema for form validation
const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "Attachment is required."
    })
});

// React component for handling the file attachment modal
export const MessageFileModel = () => {
    // Destructure modal state and functions
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    // Check if the modal type is 'messageFile'
    const isModelOpen = isOpen && type === "messageFile";

    // Destructure API URL and query parameters from modal data
    const { apiUrl, query } = data;

    // Set up form using react-hook-form
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        }
    });

    // Function to close the modal and reset form
    const handleClose = () => {
        form.reset();
        onClose();
    }

    // Check if the form is currently submitting
    const isLoading = form.formState.isSubmitting;

    // Function to handle form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Construct the API URL with query parameters
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            });

            // Send a POST request to the specified API endpoint
            await axios.post(url, {
                ...values,
                content: values.fileUrl,
            });

            // Reset form, refresh router, and close the modal upon successful submission
            form.reset();
            router.refresh();
            handleClose();
        } catch (error) {
            // Log any errors that occur during the submission process
            console.error(error);
        }
    }

    return (
        // Modal structure using Dialog, DialogContent, etc.
        <Dialog open={isModelOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Send a file as a message!
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                {/* FileUpload component integrated with react-hook-form */}
                                <FormField 
                                    control={form.control}
                                    name="fileUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload 
                                                    endpoint="messageFile"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        {/* Modal footer with a submit button */}
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
