"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import * as z from "zod";
import { TypeOf } from "zod/v3";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function page() {
  const route = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast.error("incorrect username or password");
    }

    if (result?.url) {
      route.replace("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen text-foreground">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl mb-4">Join Mystery Message</h1>
          <p className="mb-3">Sign in to start your anonymous adventure</p>
        </div>

        <Card>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="identifier"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Email/Username</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Email/Username"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Password</FieldLabel>
                      <Input
                        type="password"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Button type="submit">Sign in</Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <div className="text-center mt-4">
          <p>
            Not a member yet?
            <Link
              href="/sign-up"
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default page;
