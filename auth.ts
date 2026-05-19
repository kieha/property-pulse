import NextAuth, { type Profile, type Session } from "next-auth";
import Google from "next-auth/providers/google";
import connectDB from "@/config/database";
import User from "@/models/User";

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    // Invoked on successful signin
    async signIn({ profile }: { profile?: Profile | undefined }) {
      // 1. Connect to database
      await connectDB();
      // 2. Check if user exists
      const userExists = await User.findOne({ email: profile?.email });
      // 3. If not, then add user to database
      if (!userExists) {
        // Truncate user name if too long
        const username = profile?.name?.slice(0, 20);

        await User.create({
          email: profile?.email,
          username,
          image: profile?.image,
        })
      }
      // 4. Return true to allow sign in
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
      console.log({ auth });
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  }
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);