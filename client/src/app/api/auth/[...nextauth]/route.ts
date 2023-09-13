import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

// user authentication handler
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // the authentication provider: credentials
      name: "Credentials",

      // credentials contain email and password
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // authorize function
      async authorize(credentials, req) {
        // send the credentials to the backend for authentication
        const user = await fetch("http://127.0.0.1:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        }).then((res) => res.json());

        // if the user is authenticated, return the user object
        // otherwise, return null
        if (user.status === "success") {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
