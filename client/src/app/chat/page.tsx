"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { MdOutlineArrowBackIos, MdArrowCircleUp } from "react-icons/md";
import { AiOutlineRobot } from "react-icons/ai";
import { useSession } from "next-auth/react";

interface Message {
  id: number;
  content: string;
  role: string;
  timestamp: string;
  emotion: string;
}

export default function Chat() {
  const { data: session } = useSession();

  // useState
  const [messages, setMessages] = useState([] as Message[]);
  const [isTyping, setIsTyping] = useState(false);

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<{ content: string }>();

  // useEffect
  useEffect(() => {
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
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, []);

  // onSubmit
  const onSubmit: SubmitHandler<{ content: string }> = async (data) => {
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

    setIsTyping(true);

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
      console.log(newMessages);
      // setIsTyping(false);

      // setMessages((messages) => [
      //   ...messages.slice(0, -1),
      //   ...newMessages.map((message) => ({
      //     id: message.id,
      //     content: message.content,
      //     role: message.role,
      //     timestamp: message.timestamp,
      //     emotion: message.emotion,
      //   })),
      // ]);
    } catch (err) {
      console.log(err);
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen md:container md:mx-auto shadow-lg rounded-lg">
      <header className="grid grid-cols-3 content-center bg-primary text-base-100 px-10 py-2">
        <Link href="/settings" className="justify-self-start grid content-center">
          <MdOutlineArrowBackIos className="text-3xl" />
        </Link>
        <div className="flex flex-col items-center">
          <AiOutlineRobot className="text-5xl" />
          <p className="mx-1">Compaion.ai</p>
        </div>
      </header>

      <main className="bg-base-100 px-4 h-5/6">
        <section className="flex flex-col w-full h-full overflow-auto">
          <header className="text-center text-xs text-primary my-3">
            Companion.ai is powered by OpenAI. <br />
            Everything AI says is not real.
          </header>
          <ul className="w-full space-y-1.5 grid grid-cols-6">
            {messages.map((message) => (
              <li
                key={message.id}
                className={`text-s px-4 py-2 break-words rounded-xl border border-dashed border-primary
                 ${
                   message.role == "user"
                     ? " text-primary bg-base-10 text-right col-start-3 col-end-7 justify-self-end"
                     : " bg-primary text-base-100 text-left col-start-1 col-end-5 justify-self-start"
                 }`}>
                <p>{message.content}</p>
                <p>{message.emotion}</p>
              </li>
            ))}
            <li className="text-slate-600 text-xs px-4 py-2 col-start-1 col-end-5 justify-self-start">
              {isTyping && "AI is typing..."}
            </li>
          </ul>
        </section>
        <form
          className="relative w-full h-10 p-2"
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
            reset();
          })}>
          <input
            className="w-full rounded p-4 text-sm"
            {...register("content")}
            type="text"
            name="content"
            id="content"
            placeholder="Type your message here..."
          />
          <button
            className="absolute inset-y-0 right-0 p-4"
            type="submit"
            disabled={isSubmitting || isTyping}>
            <MdArrowCircleUp className="text-4xl text-primary" />
          </button>
        </form>
      </main>
    </div>
  );
}
