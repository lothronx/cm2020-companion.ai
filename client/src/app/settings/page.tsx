"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { MdOutlineArrowForwardIos } from "react-icons/md";

export default function Settings() {
  const [isAPIModalOpen, setIsAPIModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const handleOpenAPI = () => {
    console.log("API key submitted:", apiKey);
    setIsAPIModalOpen(false);
  };

  return (
    <>
      <main>
        <h1>Settings</h1>
        <Link href="/chat">
          <MdOutlineArrowForwardIos />
        </Link>
        <ul>
          <li>
            <button onClick={() => setIsAPIModalOpen(true)}>OpenAI API</button>
          </li>
          <li>
            <button>Documentation</button>
          </li>
          <li>
            <Link href="mailto:companionai@gmail.com">Contact Us</Link>
          </li>
          <li>
            <button onClick={() => signOut({ callbackUrl: "http://localhost:3000/" })}>
              Sign out
            </button>
          </li>
        </ul>
      </main>
      <footer>
        Companion.ai is powered by OpenAI. <br />
        Everything AI says is not real.
      </footer>

      {/* The Open API Modal*/}
      {isAPIModalOpen && (
        <div>
          <div>
            <p>Enter your OpenAI API Key</p>
            <input
              type="text"
              placeholder="Enter your API key..."
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
            <button onClick={handleOpenAPI}>Submit</button>
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
