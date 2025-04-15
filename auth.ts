import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { IAccountDoc } from "./database/account.model";
import { IUserDoc } from "./database/user.model";
import { api } from "./lib/api";
import { SignInSchema } from "./lib/validations";
import bcrypt from "bcryptjs";

// Initialize NextAuth with GitHub and Google as OAuth providers and custom callbacks.
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (validatedFields.success) {  
          const { email, password } = validatedFields.data;

          // const { data: existingAccount } = (await api.accounts.getByEmail(
          //   email
          // )) as ActionResponse<IAccountDoc>;
          const { data: existingAccount } = (await api.accounts.getByProvider(
            email
          )) as ActionResponse<IAccountDoc>;

          if (!existingAccount) return null;

          const { data: exisitingUser } = (await api.users.getById(
            existingAccount.userId.toString()
          )) as ActionResponse<IUserDoc>;

          if (!exisitingUser) return null;

          const isValidPassword = await bcrypt.compare(
            password,
            existingAccount.password!
          );

          if (isValidPassword) {
            return {
              id: exisitingUser.id,
              name: exisitingUser.name,
              email: exisitingUser.email,
              image: exisitingUser.image,
            };
          }
        }
        return null;
      },
    }),
  ],

  callbacks: {
    // Enrich the session with the user's unique ID from the JWT token.
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },

    // Update the JWT token during sign-in to include the user ID from the backend.
    async jwt({ token, account }) {
      if (account) {
       // let accountResponse;
        // if (account.type === "credentials") {
        //   // Use the email endpoint for credentials-based sign-ins.
        //   accountResponse = await api.accounts.getByEmail(token.email!);
        // } else {
        //   // Use the provider endpoint for OAuth sign-ins.
        //   accountResponse = await api.accounts.getByProvider(account.providerAccountId);
        // }
        // const { data: existingAccount, success } = accountResponse as ActionResponse<IAccountDoc>;
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
        // Add the bio if it exists in the profile
        bio:
          account.provider === "github" || account.provider === "google"
            ? (profile?.bio as string)
            : undefined,
        // Add the portfolio/website URL if it exists in the profile
        portfolio:
          account.provider === "github" || account.provider === "google"
            ? (profile?.blog as string)
            : undefined,
        // Add the location if it exists in the profile
        location:
          account.provider === "github" || account.provider === "google"
            ? (profile?.location as string)
            : undefined,
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
