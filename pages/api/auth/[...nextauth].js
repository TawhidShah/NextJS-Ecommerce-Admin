import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb.js";
import { Admin } from "@/models/Admin";
import { mongooseConnect } from "@/lib/mongoose";

export const getAdminEmails = async () => {
  mongooseConnect();

  const adminEmailsResult = await Admin.find({});

  const adminEmails = adminEmailsResult.map((admin) => admin.email);

  return adminEmails;

};

const adminEmails = await getAdminEmails();

export const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  secret: process.env.NEXT_AUTH_SECRET,

  adapter: MongoDBAdapter(clientPromise),

  callbacks: {
    async signIn({ user, account, profile }) {
      const isAdmin = adminEmails.includes(user?.email);
      if (!isAdmin) {
        return "/";
      }
      return true;
    },
  },
};

export const isAdminReq = async (req, res) => {
  const session = await getServerSession(req, res, options);
  if (!adminEmails.includes(session?.user?.email)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default NextAuth(options);
