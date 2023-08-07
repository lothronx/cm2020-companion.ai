"use client";

import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// form validation schema using zod
const schema = z
  .object({
    username: z.string().min(1, "Username is required").max(128, "Username is too long"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(256, "Password is too long"),
  })
// infer the type from the schema
type schemaType = z.infer<typeof schema>;

/**
 * Login page
 * @returns {JSX.Element} Login page
 */
export default function Login() {
  // use react-hook-form to handle form state
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<schemaType>({
    resolver: zodResolver(schema),
  });

  // handle form submission
  const onSubmit: SubmitHandler<schemaType> = (data) => {
    console.log(data);
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
