"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

/*
 * Home page
 */
export default function Home() {
  // If the user is logged in, redirect them to the chat page
  const { data: session } = useSession();
  if (session && session.user) {
    redirect("/chat");
  }

  // Otherwise, display the home page which can direct the user to the login or register page
  return (
    <main className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-pink-500">
      <h1 className="text-blue-800 font-bold text-6xl py-2">Companion.ai</h1>
      <p className="font-medium text-xl text-blue-900 mb-4">
        The AI Companion who can detect your emotions
      </p>
      <Link
        className="centered-main btn btn-primary sm:btn-sm md:btn-md lg:btn-lg"
        href="/register">
        Register
      </Link>
      <Link className="centered-main btn btn-primary sm:btn-sm md:btn-md lg:btn-lg" href="/login">
        Log in
      </Link>
      <Link
        className="centered-main btn text-primary sm:btn-sm md:btn-md lg:btn-lg"
        href="/documentation">
        Help
      </Link>
    </main>
  );
}
