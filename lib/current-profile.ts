// Import the 'auth' object from the Clerk Next.js package to handle authentication.
import { auth } from "@clerk/nextjs";

// Import the 'db' object from the custom 'db' module located in the '@/lib' directory.
import { db } from "@/lib/db";

/**
 * Retrieves the current user's profile from the database.
 *
 * @returns {Object | null} The user's profile object if authenticated, otherwise null.
 */

export const currentProfile = async () => {
    // Extract the userId from the authentication information provided by Clerk.
    const { userId } = auth();

    // Check if the userId is not available, indicating that the user is not authenticated.
    if (!userId) {
        // Return null if the user is not authenticated.
        return null;
    }

    // Retrieve the user's profile from the database using the userId.
    const profile = await db.profile.findUnique({
        where: {
            userId
        }
    });

    // Return the user's profile object.
    return profile;
}
