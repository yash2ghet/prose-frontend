"use client";

import { useState } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleSubmit, control } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (
          error.code === "INVALID_CREDENTIALS" ||
          error.message?.toLowerCase().includes("credentials") ||
          error.message?.toLowerCase().includes("not found")
        ) {
          toast.error(
            "Invalid email or password. Please check your credentials or sign up."
          );
        } else {
          toast.error(error.message || "Login failed.");
        }

        return;
      }

      toast.success("Login successful!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[25rem]">
      <div className="mb-7 flex items-center gap-[0.5625rem]">
        <span className="inline-flex size-[1.625rem] items-center justify-center rounded-[0.3125rem] bg-primary text-[0.8125rem] font-bold text-accent">
          P
        </span>

        <span className="text-base font-semibold text-text">
          Prose CMS
        </span>
      </div>

      <div className="rounded-lg border border-border bg-surface p-7">
        <h1 className="mb-1.5 text-[1.375rem] font-semibold tracking-wide text-text">
          Welcome back
        </h1>

        <p className="mb-6 text-sm text-text-muted tracking-wide">
          Sign in to manage articles and categories.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-0">
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  aria-invalid={fieldState.invalid}
                  className="gap-0"
                >
                  <FieldLabel
                    htmlFor={field.name}
                    className="mb-[0.4375rem] text-[0.8125rem] font-medium text-text tracking-wide"
                  >
                    Email
                  </FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@company.com"
                    required
                    autoFocus
                    autoComplete="email"
                    className="h-10 rounded-md px-3 text-sm placeholder:text-muted-foreground/70"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="h-[0.875rem]" />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  aria-invalid={fieldState.invalid}
                  className="gap-0"
                >
                  <div className="mb-[0.4375rem] flex w-full items-center justify-between">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-[0.8125rem] font-medium text-text tracking-wide"
                    >
                      Password
                    </FieldLabel>

                  </div>

                  <div className="flex h-10 items-center gap-2 rounded-md border border-border px-3 focus-within:ring-2 focus-within:ring-ring/30">
                    <Input
                      {...field}
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="h-full flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="shrink-0 bg-transparent text-xs font-medium text-text-muted hover:text-text"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field className="mt-5">
              <Button
                type="submit"
                disabled={loading}
                className="h-[2.625rem] w-full gap-[0.5625rem] rounded-md text-[0.90625rem] font-medium"
              >
                {loading && <Spinner className="size-4" />}
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>

      <p className="mt-[1.125rem] text-center text-[0.78125rem] text-text-subtle">
        Accounts are provisioned by an administrator.
      </p>
    </div>
  );
}