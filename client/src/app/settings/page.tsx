"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { MdOutlineArrowForwardIos } from "react-icons/md";

export default function Settings() {
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
    <>
      <header className="navbar bg-base-100 h-10px">
        <h1 className="text-primary font-bold text-2xl">Settings</h1>
        <Link className="centered-main btn btn-outline btn-info" href="/chat">
          <MdOutlineArrowForwardIos />
        </Link>
      </header>
      
      <main className="flex flex-col justify-center items-center h-screen">
        <ul>
          <li>
            <button className="centered-main btn btn-primary sm:btn-sm md:btn-md lg:btn-lg" onClick={() => setIsAPIModalOpen(true)}>OpenAI API</button>
          </li>
          <li>
            <button className="centered-main btn btn-primary sm:btn-sm md:btn-md lg:btn-lg" >Documentation</button>
          </li>
          <li>
            <Link className="centered-main btn btn-primary sm:btn-sm md:btn-md lg:btn-lg" href="mailto:companionai@gmail.com">Contact Us</Link>
          </li>
          <li>
            <button className="centered-main btn btn-primary sm:btn-sm md:btn-md lg:btn-lg" onClick={() => signOut({ callbackUrl: "http://localhost:3000/" })}>
              Sign out
            </button>
          </li>
        </ul>
      </main>
      <footer  className="flex flex-col justify-center footer-center h-1/2vh text-xs">
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
    </>
  );
}
