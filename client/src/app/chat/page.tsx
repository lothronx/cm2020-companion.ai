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
  timestamp: number;
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
      timestamp: Date.now(),
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
  } = useForm<{ message: string }>();

  // useEffect
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/chat", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const fetchedMessages: Message[] = await response.json();

      setMessages((messages) => [
        ...messages,
        ...fetchedMessages.map((message) => ({
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

  // onSubmit
  const onSubmit: SubmitHandler<{ message: string }> = async (data) => {
    setMessages((messages) => [
      ...messages,
      {
        id: messages[messages.length - 1].id + 1,
        content: data.message,
        role: "user",
        timestamp: Date.now(),
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

      const fetchedMessage: Message = await response.json();

      setIsTyping(false);

      setMessages((messages) => [
        ...messages.slice(0, -1),
        { ...messages[messages.length - 1], emotion: fetchedMessage.emotion },
        {
          id: fetchedMessage.id,
          content: fetchedMessage.content,
          role: "bot",
          timestamp: fetchedMessage.timestamp,
          emotion: "",
        },
      ]);
    } catch (err) {
      console.log(err);
      setIsTyping(false);
    }
  };

  return (
    <>
      <header>
        <Link href="/settings">
          <MdOutlineArrowBackIos />
        </Link>
        <AiOutlineRobot />
        <p>Compaion.ai</p>
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
                className={`chat-message ${
                  message.role == "user" ? "user-message" : "bot-message"
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
            {...register("message")}
            type="text"
            name="message"
            id="message"
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
