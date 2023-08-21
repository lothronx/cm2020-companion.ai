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
    <main className="flex flex-col justify-center items-center h-1/2vh">
      <h1 className="text-primary font-bold text-2xl">Companion.ai</h1>
      <p className="font-light">The AI Companion who can detect your emotions</p>
      <Link className="centered-main btn btn-primary" href="/register">
        Register
      </Link>
      <Link className="centered-main btn btn-primary" href="/login">
        Log in
      </Link>
    </main>
  );
}
