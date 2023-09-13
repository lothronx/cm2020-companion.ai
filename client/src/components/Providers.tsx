"use client";

import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

// Wraps the entire app with the next-auth session provider
const Providers = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Providers;
