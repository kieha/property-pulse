import NextAuth, { Account, type Profile, type Session } from "next-auth";
import Google from "next-auth/providers/google";
import Mailgun from "next-auth/providers/mailgun"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import connectDB from "@/config/database";
import User from "@/models/User";
import client from "./lib/db";
import { sendVerificationRequest } from "./lib/authSendVerificationEmail";

const providers = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    allowDangerousEmailAccountLinking: true,
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    },
  }),
  Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    from: process.env.MAILGUN_EMAIL_FROM,
    region: "EU",
    sendVerificationRequest,
  }),
];

export const providerMap = providers
  .map((provider) => {
    return { id: provider.id, name: provider.name };
  });

export const authOptions = {
  adapter: MongoDBAdapter(client),
  providers,
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    // Invoked on successful signin
    async signIn({ profile, email, account }: { profile?: Profile | undefined, email?: { verificationRequest?: boolean; }, account?: Account | null }) {
      let userExists;
      // 1. Connect to database
      await connectDB();
      // 2. Check if this is using the Email or OAuth provider
      if (account?.type === "email") {
        // if this is the first call, return true to continue with the flow
        if (email?.verificationRequest) return true;
        // if not, check if the user exists in the database
        userExists = await User.findOne({ email: account.providerAccountId });
      } else {
        // Continue with OAuth provider; check if the user exists in the database
        userExists = await User.findOne({ email: profile?.email });
      }
      // 4. If the user does not exist, then add them to database
      if (!userExists) {
        // Truncate user name if too long
        let userInfo = {};
        if (account?.type === "email") {
          userInfo = {
            email: account.providerAccountId,
          };
        } else {
          const username = profile?.name?.slice(0, 20);
          userInfo = {
            email: profile?.email,
            username,
            image: profile?.picture,
          }
        }
        userExists = await User.create(userInfo);
      }
      // 5. If the user exists but has no image, keep their record up to date
      if (!userExists.image && profile?.picture) {
        await User.findOneAndUpdate({ email: profile.email }, { image: profile.picture }, { timestamps: true })
      }
      // 6. Return true to allow sign in
      return true;
    },
    async session({ session }: { session: Session }) {
      // 1. Connect to database
      await connectDB();
      // 2. Get user from database
      const user = await User.findOne({ email: session.user.email });
      // 3. Assign the user id to the session;
      session.user.id = user._id.toString();
      return session;
    },
    async authorized({ auth }: { auth: Session | null }) {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);