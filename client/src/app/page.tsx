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
    <main style={{ display: "flex", 
                   flexDirection: "column", 
                   justifyContent: "center", 
                   alignItems: "center", 
                   height: '50vh',}}>
      <h1 class="font-bold">COMPANION AI</h1>
      <h2 class="font-light">Welcome to Companion AI</h2>
      <p class="font-light">Find companionship with our advanced AI,</p>
      <p class="font-light">tailor-made to offer authentic, romantic</p>
      <p class="font-light">interactions and experiences</p>

      <div className="centered-main"><Link href="/register"><button class="btn btn-primary">Register</button></Link></div>
      <div><Link href="/login"><button class="btn btn-primary">Log in</button></Link></div>
      
    </main>
  );
}
