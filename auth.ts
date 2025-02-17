import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { IAccountDoc } from "./database/account.model";
import { api } from "./lib/api";

// Initialize NextAuth with GitHub and Google as OAuth providers and custom callbacks.
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],

  callbacks: {
    // Enrich the session with the user's unique ID from the JWT token.
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },

    // Update the JWT token during sign-in to include the user ID from the backend.
    async jwt({ token, account }) {
      if (account) {
        // Retrieve existing account info from the backend using either email or provider ID.
        const { data: existingAccount, success } =
          (await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email! // For credentials-based logins.
              : account.providerAccountId // For OAuth logins.
          )) as ActionResponse<IAccountDoc>;

        // If the account is found, store its userId in the token.
        if (success && existingAccount) {
          const userId = existingAccount.userId;
          if (userId) token.sub = userId.toString();
        }
      }
      return token;
    },

    // Handle sign-in for OAuth, syncing user data with the backend.
    async signIn({ user, profile, account }) {
      // For credentials-based auth, no further processing is needed.
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      // Prepare user information to send to the backend.
      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === "github"
            ? (profile?.login as string) // GitHub uses the login name.
            : (user.name?.toLowerCase() as string), // For Google, use a lowercase version of the name.
      };

      // Sync with the backend; allow sign-in only if successful.
      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      })) as ActionResponse;

      return success;
    },
  },
});
