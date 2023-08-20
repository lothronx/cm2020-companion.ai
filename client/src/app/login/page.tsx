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
    <main style={{ display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    height: '50vh',}}>
      <h1 class="font-bold">Welcome back to Companion.ai</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input class="input input-bordered input-xs max-w-xs" {...register("email")} type="text" name="email" id="email" />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input class="input input-bordered input-xs max-w-xs" {...register("password")} type="password" name="password" id="password" />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div>
          {loginErr && <p>{loginErr}</p>}
          <button class="btn btn-primary" type="submit" disabled={isSubmitting}>
            Log in
          </button>
          <button class="btn btn-primary"><Link href="/register">I am a new user</Link></button>
        </div>
      </form>
    </main>
  );
}
