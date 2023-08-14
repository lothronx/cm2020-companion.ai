"use client";

import axios, { CanceledError } from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { MdOutlineArrowBackIos, MdArrowCircleUp } from "react-icons/md";
import { AiOutlineRobot } from "react-icons/ai";

export default function Chat() {
  // useState
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello, I'm Alex, your AI companion. How are you feeling today?", isUser: false },
    { text: "I'm doing great! How about you?", isUser: true },
    { text: "I'm doing great too!", isUser: false },
  ]);

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<{ message: string }>();

  // useEffect
  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);

    axios
      .get("/api/chat", { signal: controller.signal })
      .then((res) => {
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  // onSubmit
  const onSubmit: SubmitHandler<{ message: string }> = (data) => {
    setMessages((messages) => [...messages, { text: data.message, isUser: true }]);
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
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        <section>
          {messages.map((message, index) => (
            <p
              key={index}
              className={`chat-message ${message.isUser ? "user-message" : "bot-message"}`}>
              {message.text}
            </p>
          ))}
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
          <button type="submit" disabled={isSubmitting}>
            <MdArrowCircleUp />
          </button>
        </form>
      </main>
    </>
  );
}
