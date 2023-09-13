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
  // email must be a valid email address
  email: z.string().email(),
  // password must be at least 1 character long and no more than 256 characters long and can only contain letters and numbers
  password: z
    .string()
    .min(1, "Password is required")
    .max(256, "The password you entered is too long")
    .regex(/^[A-Za-z0-9]+$/, "Password can only contain letters and numbers"),
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

  //=================== Functionality 1 ===================
  // handle form state
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<schemaType>({
    resolver: zodResolver(schema),
  });

  // the state to store the error message returned by the server
  const [loginErr, setLoginErr] = useState("");

  // the function to handle form submission
  const onSubmit: SubmitHandler<schemaType> = async (data) => {
    // send the user submitted email and password to the next-auth api
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: "/chat",
    });

    // if the api responds with an error, set the error message
    result?.error && setLoginErr("Invalid email or password");
  };

  //===================
  return (
    <main className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-pink-500">
      {/* The page title */}
      <h1 className="text-primary font-bold text-4xl mb-5">Welcome back to Companion.ai</h1>

      {/* The login form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="grid grid-flow-row-dense grid-cols-2 grid-rows-2">
          <label className="font-semibold text-lg text-blue-900" htmlFor="email">
            Email
          </label>
          <input
            className="input input-bordered input-primary input-xs max-w-xs"
            {...register("email")}
            type="text"
            name="email"
            id="email"
          />
          {errors.email && (
            <p className=" text-xs col-span-2 text-blue-800">{errors.email.message}</p>
          )}
        </div>
        {/* Password */}
        <div className="grid grid-flow-row-dense grid-cols-2 grid-rows-2">
          <label className="font-semibold text-lg text-blue-900" htmlFor="password">
            Password
          </label>
          <input
            className="input input-bordered input-primary input-xs max-w-xs"
            {...register("password")}
            type="password"
            name="password"
            id="password"
          />
          {errors.password && (
            <p className=" text-xs col-span-2 text-blue-800">{errors.password.message}</p>
          )}
        </div>
        <div>
          {loginErr && <p>{loginErr}</p>}
          {/* Submit button */}
          <button
            className="btn btn-primary sm:btn-sm md:btn-md lg:btn-lg"
            type="submit"
            disabled={isSubmitting}>
            Log in
          </button>
          {/* Link to the register page */}
          <Link className="btn text-primary sm:btn-sm md:btn-md lg:btn-lg" href="/register">
            I am a new user
          </Link>
        </div>
      </form>
    </main>
  );
}
