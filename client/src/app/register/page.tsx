"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";

// form validation schema
const schema = z
  .object({
    username: z
      .string()
      .min(4, "Username must be at least 4 characters long")
      .max(128, "Username is too long")
      .regex(/^[A-Za-z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email(),
    password: z
      .string()
      .min(4, "Password must be at least 4 characters long")
      .max(256, "Password is too long")
      .regex(/^[A-Za-z0-9]+$/, "Password can only contain letters and numbers"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// infer the type from the schema
type schemaType = z.infer<typeof schema>;

/**
 * Register page
 */
export default function Register() {
  // if the user is already logged in, redirect to the chat page
  const { data: session } = useSession();
  if (session && session.user) {
    redirect("/chat");
  }

  // handle form state
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<schemaType>({
    resolver: zodResolver(schema),
  });

  // handle form submission
  const [registerErr, setRegisterErr] = useState("");
  const onSubmit: SubmitHandler<schemaType> = async (data) => {
    const res = await fetch("http://127.0.0.1:5000/api/new_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    if (!res.user_id) {
      setRegisterErr(res.message);
      return;
    }

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl: "/chat",
    });
  };

  return (
    <main className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-pink-500">
      <h1 className="text-primary font-bold text-4xl mb-5">Welcome to Companion.ai</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-flow-row-dense grid-cols-2 grid-rows-2">
          <label className="font-semibold text-lg text-blue-900" htmlFor="username">Username</label>
          <input
            className="input input-bordered input-primary input-xs max-w-xs"
            {...register("username")}
            type="text"
            name="username"
            id="username"
          />
          {errors.username && <p className=" text-xs col-span-2 text-blue-800">{errors.username.message}</p>}
        </div>
        <div className="grid grid-flow-row-dense grid-cols-2 grid-rows-2">
          <label className="font-semibold text-lg text-blue-900" htmlFor="email">Email</label>
          <input
            className="input input-bordered input-primary input-xs max-w-xs"
            {...register("email")}
            type="email"
            name="email"
            id="email"
          />
          {errors.email && <p className=" text-xs col-span-2 text-blue-800">{errors.email.message}</p>}
        </div>
        <div  className="grid grid-flow-row-dense grid-cols-2 grid-rows-2">
          <label className="font-semibold text-lg text-blue-900" htmlFor="password">Password</label>
          <input
            className="input input-bordered input-primary input-xs max-w-xs"
            {...register("password")}
            type="password"
            name="password"
            id="password"
          />
          {errors.password && <p className=" text-xs col-span-2 text-blue-800">{errors.password.message}</p>}
        </div>
        <div className="grid grid-flow-row-dense grid-cols-2 grid-rows-2">
          <label className="font-semibold text-lg text-blue-900" htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="input input-bordered input-primary input-xs max-w-xs"
            {...register("confirmPassword")}
            type="password"
            name="confirmPassword"
            id="confirmPassword"
          />
          {errors.confirmPassword && <p className=" text-xs col-span-2 text-blue-800">{errors.confirmPassword.message}</p>}
        </div>
        <div>
          {registerErr && <p>{registerErr}</p>}
          <button className="btn btn-primary sm:btn-sm md:btn-md lg:btn-lg" type="submit" disabled={isSubmitting}>
            Sign up
          </button>
          <Link className="btn text-primary sm:btn-sm md:btn-md lg:btn-lg" href="/login">
            Already registered
          </Link>
        </div>
      </form>
    </main>
  );
}
