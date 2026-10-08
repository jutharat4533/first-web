"use client";

import DatePickerInput from "@/components/shared/DatePickerInput";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerAction } from "@/lib/actions/auth/auth.action";
import { registerSchema, RegisterInput } from "@/lib/schemas/auth.schema";
import { ROSE } from "@/styles/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

export default function RegisterForm() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: undefined,
      gender: undefined,
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [show, setShow] = useState(false);

  const onSubmit = (data: RegisterInput) => {
    startTransition(async () => {
      const { code, message } = await registerAction(data);
      if (code === "EMAIL_ALREADY_EXISTS") {
        setError("email", { message });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-6">
        {/* ALert error message */}
        {/* /////////////////// */}
        {errors.root && (
          <Alert
            variant="destructive"
            className="bg-destructive/15 border-destructive"
          >
            <AlertCircle />
            <AlertTitle>{errors.root.message}</AlertTitle>
          </Alert>
        )}
        <div className="grid grid-cols-2 gap-4">
          {/* First name */}
          <Controller
            control={control}
            name="firstName"
            render={({ field, fieldState }) => (
              <Field className="gap-1" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>First name</FieldLabel>
                <Input
                  placeholder="ชื่อ"
                  id={field.name}
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Last name */}
          <Controller
            control={control}
            name="lastName"
            render={({ field, fieldState }) => (
              <Field className="gap-1" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Last name</FieldLabel>
                <Input
                  placeholder="นามสกุล"
                  id={field.name}
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Date of birth */}
        <Controller
          control={control}
          name="dob"
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Date of birth</FieldLabel>
              <DatePickerInput
                id={field.name}
                isInValid={fieldState.invalid}
                value={field.value}
                onValueChange={field.onChange}
              />
            </Field>
          )}
        />

        {/* Gender */}
        <Controller
          control={control}
          name="gender"
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Gender</FieldLabel>
              <Select
                name={field.name}
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="MALE">Male</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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
        {/* Confirm Password */}
        <Controller
          control={control}
          name="confirmPassword"
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
            {isPending ? <Loader2 className="animate-spin" size={18} /> : null}
            {isPending ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
