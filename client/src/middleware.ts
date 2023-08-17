export { default } from "next-auth/middleware";

// everything in "/chat" route and "/settings" route needs authentication
export const config = {
  matcher: ["/chat/:path*", "/settings/:path*"],
};
