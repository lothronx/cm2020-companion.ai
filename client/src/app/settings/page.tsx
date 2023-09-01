"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { MdOutlineArrowForwardIos } from "react-icons/md";

export default function Settings() {
  // load the next-auth session
  const { data: session } = useSession();

  // use state to handle the Open API modal
  const [isAPIModalOpen, setIsAPIModalOpen] = useState(false);

  // use state to handle the Open API key
  const [apiKey, setApiKey] = useState("");

  // handle form submission
  const handleApiKey = async () => {
    const result = await fetch("http://127.0.0.1:5000/api/settings/openapi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.access_token as string}`,
      },
      body: JSON.stringify({ apiKey: apiKey }),
    }).then((res) => res.json());

    if (result.status !== "success") {
      alert(result.message);
      return;
    }

    setIsAPIModalOpen(false);
  };

  return (
    <div className=" h-screen flex flex-col md:container md:mx-auto shadow-lg rounded-lg p-10">
      <header className="navbar bg-base-100 flex justify-between">
        <h1 className="text-primary font-bold text-4xl">Settings</h1>
        <Link href="/chat">
          <MdOutlineArrowForwardIos className="text-3xl" />
        </Link>
      </header>

      <main className="h-full flex flex-col justify-center items-center">
        <ul>
          <li>
            <button
              className="centered-main btn btn-primary sm:btn-sm md:btn-md lg:btn-lg"
              onClick={() => setIsAPIModalOpen(true)}>
              OpenAI API
            </button>
          </li>
          <li>
            <button className="centered-main btn btn-primary sm:btn-sm md:btn-md lg:btn-lg">
              Documentation
            </button>
          </li>
          <li>
            <Link
              className="centered-main btn btn-primary sm:btn-sm md:btn-md lg:btn-lg"
              href="mailto:companionai@gmail.com">
              Contact Us
            </Link>
          </li>
          <li>
            <button
              className="centered-main btn btn-primary sm:btn-sm md:btn-md lg:btn-lg"
              onClick={() => signOut({ callbackUrl: "http://localhost:3000/" })}>
              Sign out
            </button>
          </li>
        </ul>
      </main>

      <footer className="flex flex-col justify-center footer-center text-xs">
        Companion.ai is powered by OpenAI. <br />
        Everything AI says is not real.
      </footer>

      {/* The Open API Modal*/}
      {isAPIModalOpen && (
        <div>
          <div>
            <input
              type="text"
              placeholder="Enter your OpenAI API key here"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
            <button onClick={handleApiKey}>Submit</button>
            <button
              onClick={() => {
                setIsAPIModalOpen(false);
              }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
