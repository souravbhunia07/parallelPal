// Importing the `getAuth` function from the Clerk library, which is used for authentication in Next.js applications.
import { getAuth } from "@clerk/nextjs/server";

// Importing the `db` object from the `@/lib/db` module, which likely contains database-related functionality.
import { db } from "@/lib/db";

// Importing the `NextApiRequest` type from the "next" module to define the type of the `req` parameter.
import { NextApiRequest } from "next";

/**
 * Retrieves the current user's profile based on the authenticated user ID.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @returns {Promise<Profile | null>} - A promise that resolves to the user's profile or null if the user is not authenticated.
 */
export const currentProfilePages = async (req: NextApiRequest) => {
  // Extracting the user ID from the authentication token provided in the request.
  const { userId } = getAuth(req);

  // Checking if the user is not authenticated. If not, return null.
  if (!userId) {
    return null;
  }

  // Retrieving the user's profile from the database based on the extracted user ID.
  const profile = await db.profile.findUnique({
    where: {
      userId
    }
  });

  // Returning the user's profile.
  return profile;
};
