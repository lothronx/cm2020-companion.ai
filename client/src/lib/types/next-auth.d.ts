import NextAuth from "next-auth";

// define the type for the session object
// when the user is authenticated, the backend will return the following information to the frontend:
// user id, username, and access token
declare module "next-auth" {
  interface Session {
    user: {
      user_id: string;
      username: string;
      access_token: string;
    };
  }
}
