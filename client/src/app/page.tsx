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
    <main className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-primary font-bold text-2xl">Companion.ai</h1>
      <p className="font-light mb-5">The AI Companion who can detect your emotions</p>
      <Link className="centered-main btn btn-primary sm:btn-sm md:btn-md lg:btn-lg" href="/register">
        Register
      </Link>
      <Link className="centered-main btn btn-primary sm:btn-sm md:btn-md lg:btn-lg" href="/login">
        Log in
      </Link>
    </main>
  );
}
