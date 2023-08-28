"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { MdOutlineArrowBackIos, MdArrowCircleUp } from "react-icons/md";
import { AiOutlineRobot } from "react-icons/ai";

interface Message {
  id: number;
  content: string;
  role: string;
  timestamp: string;
  emotion: string;
}

export default function Chat() {
  // useState
  const [messages, setMessages] = useState([
    {
      id: 1,
      content:
        "Hi, I am your ai companion who can detect your emotions. How are you feeling today?",
      role: "bot",
      timestamp: "2020-10-10 10:10:10",
      emotion: "",
    },
    {
      id: 2,
      content: "Hi, I am feeling good",
      role: "user",
      timestamp: "2020-10-10 10:10:10",
      emotion: "😄",
    },
    {
      id: 3,
      content: "What did you do today",
      role: "bot",
      timestamp: "2020-10-10 10:10:10",
      emotion: "",
    },
  ]);
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
        const response = await fetch("http://127.0.0.1:5000/api/chat", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const recentMessageHistory: Message[] = await response.json();

        setMessages((messages) => [
          ...messages,
          ...recentMessageHistory.map((message) => ({
            id: message.id,
            content: message.content,
            role: message.role,
            timestamp: message.timestamp,
            emotion: message.emotion,
          })),
        ]);
      } catch (err) {
        console.log(err);
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
        },
        body: JSON.stringify(data),
      });

      const newMessages: Message[] = await response.json();

      setIsTyping(false);

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
    <>
      <header className="navbar bg-base-100 h-10px">
        <Link className="navbar-start " href="/settings">
          <MdOutlineArrowBackIos />
        </Link>
        <div className="navbar-end">
          <AiOutlineRobot />
          <p className="  text-primary font-bold text-2xl mx-1">Compaion.ai</p>
        </div>
      </header>

      <main>
        <section>
          <header className="flex flex-col justify-center footer-center h-1/2vh text-xs">
            Companion.ai is powered by OpenAI. <br />
            Everything AI says is not real.
          </header>
          <ul>
            {messages.map((message) => (
              <li
                key={message.id}
                className={`text-s
                 ${
                   message.role == "user" ? "text-primary bg-base-100" : "bg-primary text-base-100"
                 }`}>
                <p>{message.content}</p>
                <p>{message.emotion}</p>
              </li>
            ))}
            <li>{isTyping && "AI is typing..."}</li>
          </ul>
        </section>
        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
            reset();
          })}>
          <input
            {...register("content")}
            type="text"
            name="content"
            id="content"
            placeholder="Type your message here..."
          />
          <button type="submit" disabled={isSubmitting || isTyping}>
            <MdArrowCircleUp />
          </button>
        </form>
      </main>
    </>
  );
}
