"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";

// form validation schema using zod
const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(1, "Password is required")
    .max(256, "The password you entered is too long"),
});

// infer the type from the schema
type schemaType = z.infer<typeof schema>;

/**
 * Login page
 */
export default function Login() {
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
  const [loginErr, setLoginErr] = useState("");
  const onSubmit: SubmitHandler<schemaType> = async (data) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: "/chat",
    });
    result?.error && setLoginErr("Invalid email or password");
  };

  return (
    <main className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-pink-500">
      <h1 className="text-primary font-bold text-4xl mb-5">Welcome back to Companion.ai</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-flow-row-dense grid-cols-2 grid-rows-2">
          <label className="font-semibold text-lg text-blue-900" htmlFor="email">Email</label>
          <input
            className="input input-bordered input-primary input-xs max-w-xs"
            {...register("email")}
            type="text"
            name="email"
            id="email"
          />
          {errors.email && <p className=" text-xs col-span-2 text-blue-800">{errors.email.message}</p>}
        </div>
        <div className="grid grid-flow-row-dense grid-cols-2 grid-rows-2">
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
        <div>
          {loginErr && <p>{loginErr}</p>}
          <button className="btn btn-primary sm:btn-sm md:btn-md lg:btn-lg" type="submit" disabled={isSubmitting}>
            Log in
          </button>
          <Link className="btn text-primary sm:btn-sm md:btn-md lg:btn-lg" href="/register">
            I am a new user
          </Link>
        </div>
      </form>
    </main>
  );
}
