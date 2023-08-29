import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      user_id: string;
      username: string;
      access_token: string;
    };
  }
}
