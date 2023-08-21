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
      .regex(
        /^[a-zA-Z0-9]+(?=.*[a-zA-Z])(?=.*[0-9])$/,
        "Password must be a combination of letters and numbers"
      ),
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
    <main>
      <h1>Welcome to Companion.ai</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Username</label>
          <input {...register("username")} type="text" name="username" id="username" />
          {errors.username && <p>{errors.username.message}</p>}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input {...register("email")} type="email" name="email" id="email" />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input {...register("password")} type="password" name="password" id="password" />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            {...register("confirmPassword")}
            type="password"
            name="confirmPassword"
            id="confirmPassword"
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>
        <div>
          {registerErr && <p>{registerErr}</p>}
          <button type="submit" disabled={isSubmitting}>
            Sign up
          </button>
          <Link href="/login">Already registered</Link>
        </div>
      </form>
    </main>
  );
}
