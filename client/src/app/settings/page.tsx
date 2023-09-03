"use client";

import Link from "next/link";
import { useState } from "react";
import { getSession, signOut } from "next-auth/react";
import { MdOutlineArrowForwardIos } from "react-icons/md";

export default function Settings() {
  // use state to handle the Open API modal
  const [isAPIModalOpen, setIsAPIModalOpen] = useState(false);
  // use state to handle the Open API key
  const [apiKey, setApiKey] = useState("");

  // handle form submission
  const handleApiKey = async () => {
    const session = await getSession();

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
    <div className=" bg-gradient-to-r from-purple-500/50 to-pink-500/50">
      <div className="h-screen flex flex-col md:container md:mx-auto shadow-lg rounded-lg p-10 bg-gradient-to-r from-purple-500 to-pink-500">
        <header className="navbar flex justify-between">
          <h1 className="text-white font-bold text-4xl">Settings</h1>
          <Link href="/chat">
            <MdOutlineArrowForwardIos className="text-5xl text-white" />
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
  
            {/* The Open API Modal*/}
            {isAPIModalOpen && (
              <div className=" my-3 cotainer shadow-lg bg-base-100/50 rounded-lg px-2 py-2">
                <div>
                  <input
                    className="input input-bordered sm:input-xs md:input-sm w-full "
                    type="text"
                    placeholder="Enter your OpenAI API key here"
                    value={apiKey}
                    onChange={(event) => setApiKey(event.target.value)}
                  />
                </div>
                
                <div className="grid grid-flow-row-dense grid-cols-2 place-items-center gap-1 ">
                  <button 
                    className=" btnS btn-accent sm:btn-sm md:btn-md lg:btn-lg font-bold "
                    onClick={handleApiKey}>Submit</button>
                  <button
                    className=" btnS btn-accent sm:btn-sm md:btn-md lg:btn-lg font-bold "
                    onClick={() => {
                      setIsAPIModalOpen(false);
                    }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
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
  
        <footer className="flex flex-col justify-center footer-center text-xs font-semibold">
          Companion.ai is powered by OpenAI. <br />
          Everything AI says is not real.
        </footer>
      </div>
    </div>
  );
}
