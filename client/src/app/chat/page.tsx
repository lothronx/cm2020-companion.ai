"use client";

import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MdOutlineArrowBackIos, MdArrowCircleUp } from "react-icons/md";
import { AiOutlineRobot, AiOutlineLoading3Quarters } from "react-icons/ai";

// Define the Message type
// Each message has an id, content, role, timestamp, and emotion
interface Message {
  id: number;
  content: string;
  role: string;
  timestamp: string;
  emotion: string;
}

export default function Chat() {
  // load the next-auth session
  const { data: session } = useSession();

  // define some state hooks we'll use later
  // an array of messages
  const [messages, setMessages] = useState([] as Message[]);
  // whether the AI is currently generating a response
  const [isTyping, setIsTyping] = useState(false);
  // whether the page is still loading the message history from the server
  const [isLoading, setIsLoading] = useState(true);

  // scroll to the bottom of the chat box whenever the "messages" state changes
  const chatBox = useRef<HTMLDivElement>(null);
  useEffect(() => chatBox.current!.scrollIntoView(false), [messages]);

  // after the page loads, fetch the recent message history from the server and store it in "messages" state
  const fetchMessages = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/chat_history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.access_token as string}`,
        },
      });

      const recentMessageHistory: Message[] = await response.json();

      setMessages(
        recentMessageHistory.map((message) => ({
          id: message.id,
          content: message.content,
          role: message.role,
          timestamp: message.timestamp,
          emotion: message.emotion,
        }))
      );

      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, []);

  // when the user submits a message, send it to the server, get the response, and update the "messages" state
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm<{ content: string }>();

  const onSubmit: SubmitHandler<{ content: string }> = async (data) => {
    // after the user submits a message, add it to the "messages" state immediately for frontend display
    setMessages((messages) => [
      ...messages,
      {
        id: messages[messages.length - 1].id + 1,
        content: data.content,
        role: "user",
        timestamp: "",
        emotion: "",
      },
    ]);

    // set the "isTyping" state to true to display the "AI is typing..." message and disable the submit button
    setIsTyping(true);

    // send the user's message to the server and get the response
    try {
      const response = await fetch("http://127.0.0.1:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.access_token as string}`,
        },
        body: JSON.stringify(data),
      });

      const newMessages: Message[] = await response.json();

      // after the server responds, set "isTyping" to false to hide the "AI is typing..." message and re-enable the submit button
      setIsTyping(false);

      // update the "messages" state with the response
      setMessages((messages) => [
        ...messages.slice(0, -1),
        ...newMessages.map((message) => ({
          id: message.id,
          content: message.content,
          role: message.role,
          timestamp: message.timestamp,
          emotion: message.emotion,
        })),
      ]);
    } catch (err) {
      console.log(err);
      setIsTyping(false);
    }
  };

  return (
    <main className="h-screen flex flex-col md:container md:mx-auto shadow-lg rounded-lg">
      <header className="grid grid-cols-3 content-center bg-primary text-base-100 px-10 py-2">
        <Link href="/settings" className="justify-self-start grid content-center">
          <MdOutlineArrowBackIos className="text-3xl" />
        </Link>
        <div className="flex flex-col items-center">
          <AiOutlineRobot className="text-5xl" />
          <p className="mx-1">Compaion.ai</p>
        </div>
      </header>

      <section className="grow bg-base-100 w-full h-full px-4 overflow-auto">
        <div className="flex flex-col" ref={chatBox}>
          <header className="text-center text-xs text-primary my-3">
            Companion.ai is powered by OpenAI. <br />
            Everything AI says is not real.
          </header>
          {isLoading && (
            <AiOutlineLoading3Quarters className="self-center text-2xl text-primary mt-10" />
          )}
          <ul>
            {messages.map((message) => (
              <li key={message.id} className="w-full space-y-1.5 grid grid-cols-6 py-2">
                <p
                  className={`text-s break-words rounded-xl border border-dashed border-primary px-4 py-2
                   ${
                     message.role == "user"
                       ? "text-primary bg-base-100 col-start-2 col-end-7 justify-self-end"
                       : "bg-primary text-base-100 col-start-1 col-end-6 justify-self-start"
                   }`}>
                  {message.content}
                </p>
                {message.emotion && (
                  <p className="text-xs text-primary text-right col-start-1 col-end-7 pb-1">
                    Emotion detected: {message.emotion}
                  </p>
                )}
              </li>
            ))}
            <li className="text-slate-600 text-xs px-4 py-2 col-start-1 col-end-5 justify-self-start">
              {isTyping && "AI is typing..."}
            </li>
          </ul>
        </div>
      </section>

      <form
        className="flex w-full py-2 px-4"
        onSubmit={handleSubmit((data) => {
          onSubmit(data);
          reset();
        })}>
        <input
          className="w-full h-full rounded px-4 py-6 text-sm"
          {...register("content")}
          type="text"
          name="content"
          id="content"
          placeholder="Type your message here..."
        />
        <button
          className="pl-4 py-2"
          type="submit"
          disabled={isSubmitting || isTyping || !isDirty || !isValid}>
          <MdArrowCircleUp className="text-4xl text-primary" />
        </button>
      </form>
    </main>
  );
}
