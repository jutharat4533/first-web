import z from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string("First name must be a string.")
      .min(1, "First name is required.")
      .trim(),
    lastName: z
      .string("Last name must be a string.")
      .min(1, "Last name is required.")
      .trim(),
    dob: z.date("Invalid date."),
    gender: z.enum(
      ["FEMALE", "MALE"],
      "Gender must be one of the following values: FEMALE, MALE,",
    ),
    email: z.email("Invalid email address."),
    password: z
      .string("Password must be a string.")
      .trim()
      .regex(
        /^[0-9a-zA-Z]{6,}$/,
        "Password can only contains a letter or number and must have at least 6 characters.",
      ),
    confirmPassword: z
      .string("Password must be a string.")
      .trim()
      .regex(
        /^[0-9a-zA-Z]{6,}$/,
        "Password can only contains a letter or number and must have at least 6 characters.",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Invalid email address."),
  password: z
    .string("Password must be a string.")
    .trim()
    .min(1, "Password is required."),
});

export type LoginInput = z.infer<typeof loginSchema>;
