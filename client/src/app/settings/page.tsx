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
