"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/lib/actions/auth/auth.action";
import { LoginInput, loginSchema } from "@/lib/schemas/auth.schema";
import { ROSE } from "@/styles/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

export default function LoginForm() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [show, setShow] = useState(false);

  const onSubmit = (data: LoginInput) => {
    console.log(data);
    startTransition(async () => {
      const { code, message } = await loginAction(data);
      if (code === "INVALID_CREDENTIALS") {
        setError("root", { message });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-6">
        {/* ALert error message */}
        {errors.root && (
          <Alert
            variant="destructive"
            className="bg-destructive/15 border-destructive"
          >
            <AlertCircle />
            <AlertTitle>{errors.root.message}</AlertTitle>
          </Alert>
        )}

        {/* Eamil address */}
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
              <Input
                type="email"
                placeholder="a@mail.com"
                id={field.name}
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Input
                  placeholder="••••••••"
                  type={show ? "text" : "password"}
                  id={field.name}
                  {...field}
                  aria-invalid={fieldState.invalid}
                  style={{ width: "100%", paddingRight: "30px" }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShow(!show);
                  }}
                  style={{
                    position: "absolute",
                    right: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#5a7a99",
                  }}
                  tabIndex={-1}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* Submit button */}
        <Field>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ backgroundColor: ROSE }}
            variant="outline"
          >
            {isPending ? "Logging you in ..." : "Log in"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
