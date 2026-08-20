"use client";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { useState } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

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
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="mb-9 flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
        <span className="text-lg font-semibold text-accent">
          P
        </span>
      </div>

      <span className="text-lg font-semibold text-text">
        Prose CMS
      </span>
    </div>
    
    <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in to manage articles and categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="m@example.com"
                        required
                        autoFocus
                        autoComplete="email"
                        className="placeholder:text-muted-foreground/70" />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )} />

                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <div className="flex items-center justify-between w-full">
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Link
                          href="/forgot-password"
                          className="text-xs underline-offset-2 hover:underline ml-auto"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <Input
                        {...field}
                        id={field.name}
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                        className="placeholder:text-muted-foreground/70" />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )} />

                <Field>
                  <Button type="submit" disabled={loading}>
                    {loading && <Spinner className="w-4 h-4" />}
                    {loading ? "Signing in..." : "Login"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground">
          Accounts are provisioned by an administrator.
        </p>
      </div></>
  )
}
