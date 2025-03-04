"use client";

import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { MdOutlineArrowBackIos, MdArrowCircleUp } from "react-icons/md";
import { AiOutlineRobot, AiOutlineLoading3Quarters } from "react-icons/ai";

// Define the Message type
// Each message has an id, content, role, timestamp, and emotion
interface Message {
  id: number;
  content: string;
  role: string;
  timestamp: string;
  emotion: number;
}

/**
 * Chat page
 */
export default function Chat() {
  // define some state hooks we'll use later
  // an array of messages
  const [messages, setMessages] = useState([] as Message[]);
  // whether the AI is currently generating a response
  const [isTyping, setIsTyping] = useState(false);
  // whether the page is still loading the message history from the server
  const [isLoading, setIsLoading] = useState(true);

  //=================== Functionality 1 ===================
  // scroll to the bottom of the chat box whenever the "messages" state changes
  const chatBox = useRef<HTMLDivElement>(null);
  useEffect(() => chatBox.current!.scrollIntoView(false), [messages]);

  //=================== Functionality 2 ===================
  // after the page loads, fetch the recent message history from the server and store it in "messages" state
  const fetchMessages = async () => {
    try {
      // get the current active session
      const session = await getSession();

      // send a request to the server to get the message history
      const response = await fetch("http://127.0.0.1:5000/api/chat_history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.access_token as string}`,
        },
      });

      const messageHistory: Message[] = await response.json();

      // update the "messages" state with the response
      setMessages(
        messageHistory.map((message) => ({
          id: message.id,
          content: message.content,
          role: message.role,
          timestamp: message.timestamp,
          emotion: message.emotion,
        }))
      );

      // set "isLoading" to false to hide the loading icon
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // call the fetchMessages function after the page loads
  useEffect(() => {
    fetchMessages();
  }, []);

  //=================== Functionality 3 ===================
  // when the user submits a message, send it to the server, get the response, and update the "messages" state
  // handle form state
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
        emotion: -1,
      },
    ]);

    // set the "isTyping" state to true to display the "AI is typing..." message and disable the submit button
    setIsTyping(true);

    try {
      // get the the current active session
      const session = await getSession();

      // send the user's message to the server and get the response
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

  //=================== Functionality 4 ===================
  // translate the emotion from numbers to emojis for frontend display
  const toEmoji = (emotion: number) => {
    switch (emotion) {
      case 0:
        return "💜";
      case 1:
        return "⚾️";
      case 2:
        return "😄";
      case 3:
        return "😞";
      case 4:
        return "🍴";
      default:
        return "";
    }
  };

  //======================================
  return (
    <div className="bg-gradient-to-r from-purple-500/50 to-pink-500/50">
      <main className="h-screen flex flex-col md:container md:mx-auto shadow-lg rounded-lg">
        {/* Header: the link to the settings page, the ai name and avatar */}
        <header className="grid grid-cols-3 content-center bg-primary text-base-100 px-10 py-2 rounded-t-lg bg-gradient-to-r from-purple-500 to-pink-500">
          <Link href="/settings" className="justify-self-start grid content-center">
            <MdOutlineArrowBackIos className="text-3xl  text-primary" />
          </Link>
          <div className="flex flex-col items-center">
            <AiOutlineRobot className="text-5xl  text-primary" />
            <p className="mx-1 font-medium  text-primary">companion.ai</p>
          </div>
        </header>

        {/* Chat box: the message history */}
        <section className="grow bg-violet-100/30 w-full h-full px-4 overflow-auto">
          <div className="flex flex-col" ref={chatBox}>
            {/* The disclaimer */}
            <header className="text-center text-xs text-blue-900 my-3">
              Companion.ai is powered by OpenAI. <br />
              Everything AI says is not real.
            </header>

            {/* The loading icon */}
            {isLoading && (
              <AiOutlineLoading3Quarters className="self-center text-2xl text-primary mt-10" />
            )}

            {/* The message history (a list of messages) */}
            <ul>
              {messages.map((message) => (
                <li key={message.id} className="w-full space-y-1.5 grid grid-cols-6 py-2">
                  <p
                    className={`text-s break-words rounded-xl border border-dashed border-primary px-4 py-2
                     ${
                       message.role == "user"
                         ? "text-primary bg-base-100/70 col-start-2 col-end-7 justify-self-end"
                         : "bg-violet-500/80 text-base-100 col-start-1 col-end-6 justify-self-start"
                     }`}>
                    {message.content}
                  </p>
                  {message.emotion != null && message.emotion != -1 && (
                    <p className="text-xs text-primary text-right col-start-1 col-end-7 pb-1">
                      Emotion detected: {toEmoji(message.emotion)}
                    </p>
                  )}
                </li>
              ))}

              {/* The "AI is typing..." message */}
              <li className="text-slate-600 text-xs px-4 py-2 col-start-1 col-end-5 justify-self-start">
                {isTyping && "AI is typing..."}
              </li>
            </ul>
          </div>
        </section>

        {/* Input box: the message input box */}
        <form
          className="flex w-full py-2 px-4 rounded-b-lg bg-gradient-to-r from-purple-500 to-pink-500"
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
            reset();
          })}>
          <input
            className="w-full h-full input-bordered input-primary rounded px-4 py-6 text-sm"
            {...register("content")}
            type="text"
            name="content"
            id="content"
            placeholder="Type your message here..."
          />
          {/* 
          =================== Functionality 5 ===================
          The submit button: the button will be disabled when:
          1. the page is still loading the message history from the server
          2. the user just submitted a message the system is still processing it
          3. the submission is empty or dirty 
          */}
          <button
            className="pl-4 py-2"
            type="submit"
            disabled={isLoading || isSubmitting || isTyping || !isDirty || !isValid}>
            <MdArrowCircleUp className="text-4xl text-primary" />
          </button>
        </form>
      </main>
    </div>
  );
}
