"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

// form validation schema using zod
const schema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(128, "The username you entered is too long"),
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
  const { data: session } = useSession();

  if (session && session.user) {
    redirect("/chat");
  }

  // use react-hook-form to handle form state
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<schemaType>({
    resolver: zodResolver(schema),
  });

  // handle form submission
  const onSubmit: SubmitHandler<schemaType> = async (data) => {
    // hash the password
    await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: true,
      callbackUrl: "/chat",
    });
  };

  return (
    <main>
      <h1>Welcome back to Companion.ai</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Username</label>
          <input {...register("username")} type="text" name="username" id="username" />
          {errors.username && <p>{errors.username.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input {...register("password")} type="password" name="password" id="password" />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          Log in
        </button>
        <Link href="/register">I am a new user</Link>
      </form>
    </main>
  );
}
