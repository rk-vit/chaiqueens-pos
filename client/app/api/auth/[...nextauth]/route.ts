import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import db from "../../../lib/db";
import bcrypt from "bcryptjs";

type AppUser = {
  id: number;
  email: string;
  role: string;
};

const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        const { email, password, role } = credentials;

        console.log("User role is:", role);
        console.log("User name is :-",email)

        let result;
        if (role === "cashier") {
          result = await db.query("SELECT * FROM cashier WHERE username=$1", [email]);
        } else if (role === "admin") {
          result = await db.query("SELECT * FROM admin WHERE username=$1", [email]);
        } else {
          console.log("Unknown role");
          return null;
        }

        const account = result.rows[0];
        if (!account) {
          console.log("No account found");
          return null;
        }

        const isValid = await bcrypt.compare(password, account.password);
        if (!isValid) {
          console.log("Invalid password");
          return null;
        }

        return {
          id: account.id,
          email: account.email,
          role: account.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
    error:"/"
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.role = user.role;
      token.email = user.email;
      token.id = Number(user.id);
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.role = token.role;
      session.user.email = token.email;
      session.user.id = token.id;
    }
    return session;
  },
},

};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
