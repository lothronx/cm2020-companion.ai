"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    username: z
      .string()
      .min(4, "Username must be at least 4 characters long")
      .max(128, "Username is too long"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(256, "Password is too long"),
    confirmPassword: z.string().min(6, "Passwords do not match"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type schemaType = z.infer<typeof schema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<schemaType>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<schemaType> = (data) => {
    console.log(data);
  };
  return (
    <main>
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
        <button type="submit" disabled={isSubmitting}>
          Sign up
        </button>
      </form>
    </main>
  );
}
