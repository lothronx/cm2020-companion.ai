"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  if (session && session.user) {
    redirect("/chat");
  }

  return (
    <main>
      <h1>Companion.ai</h1>
      <p>The AI Companion who can detect your emotions</p>
      <Link href="/register">Register</Link>
      <Link href="/login">Log in</Link>
    </main>
  );
}
