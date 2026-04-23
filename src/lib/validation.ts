import { z } from "zod";

const domainValues = [
  "frontend",
  "fullstack",
  "backend",
  "mobile",
  "ai",
  "data",
  "iot",
  "desktop",
  "devops",
  "cybersecurity",
] as const;

const timeValues = [
  "2-4-hours",
  "1-2-days",
  "3-5-days",
  "1-2-weeks",
  "3-4-weeks",
  "1-3-months",
] as const;

const collaborationValues = ["Solo", "SmallTeam", "LargeTeam"] as const;

const projectTypeValues = [
  "tool",
  "dashboard",
  "platform",
  "automation",
  "product",
  "showcase",
] as const;

const goalValues = [
  "learning",
  "experiment",
  "mvp",
  "portfolio",
  "production",
  "client",
] as const;

const audienceValues = [
  "general",
  "technical",
  "business",
  "students",
  "internal",
] as const;

const industryValues = [
  "tech",
  "finance",
  "health",
  "education",
  "security",
  "iot",
  "other",
] as const;

const featureValues = [
  "auth",
  "data",
  "realtime",
  "automation",
  "integration",
  "security",
  "analytics",
] as const;

const technologyValues = [
  "react",
  "vue",
  "svelte",
  "tailwind",
  "nextjs",
  "nestjs",
  "firebase",
  "postgresql",
  "nodejs",
  "express",
  "fastapi",
  "django",
  "flutter",
  "react-native",
  "swift",
  "kotlin",
  "python",
  "pytorch",
  "tensorflow",
  "opencv",
  "pandas",
  "numpy",
  "powerbi",
  "sql",
  "arduino",
  "esp32",
  "raspberrypi",
  "mqtt",
  "electron",
  "tauri",
  "javafx",
  "docker",
  "kubernetes",
  "github-actions",
  "aws",
  "wireshark",
  "nmap",
  "metasploit",
  "burpsuite",
  "splunk",
] as const;

export const FormAnswersSchema = z
  .object({
  domain: z.enum(domainValues, {
    message: "Invalid domain selected",
  }),

  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"], {
     message: "Invalid difficulty level" ,
  }),

  technologies: z
    .array(z.enum(technologyValues))
    .max(10, "Too many technologies selected"),

  timeAvailable: z.enum(timeValues, {
    message: "Invalid time range selected" ,
  }),

  collaborationLevel: z.enum(collaborationValues, {
    message: "Invalid collaboration level" ,
  }),

  projectType: z.enum(projectTypeValues).optional(),

  goal: z.enum(goalValues).optional(),

  targetAudience: z.enum(audienceValues).optional(),

  industryDomain: z.enum(industryValues).optional(),

  features: z
    .array(z.enum(featureValues))
    .max(7, "Too many features selected")
    .optional(),

  additionalConstraints: z
    .preprocess(
      (value) =>
        typeof value === "string" && value.trim() === "" ? undefined : value,
      z
        .string()
        .max(300, "Keep constraints under 300 characters")
        .regex(
          /^[a-zA-Z0-9\s,.\-_!?()\/]+$/,
          "Only letters, numbers and basic punctuation allowed"
        )
        .optional()
    ),

  customTechnologies: z
    .preprocess(
      (value) =>
        typeof value === "string" && value.trim() === "" ? undefined : value,
      z
        .string()
        .max(300, "Too long")
        .regex(/^[a-zA-Z0-9,.\s\-_#@+/]*$/, "Invalid characters detected")
        .optional()
    ),
})
  .superRefine((data, ctx) => {
    const hasSelectedTechnologies = data.technologies.length > 0;
    const hasCustomTechnologies =
      typeof data.customTechnologies === "string" &&
      data.customTechnologies.trim().length > 0;

    if (!hasSelectedTechnologies && !hasCustomTechnologies) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["technologies"],
        message: "Select at least one technology or provide custom technologies",
      });
    }
  });

export const signUpSchema = z.object({
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "At least 1 uppercase letter")
    .regex(/[a-z]/, "At least 1 lowercase letter")
    .regex(/[0-9]/, "At least 1 number")
    .regex(/[^A-Za-z0-9]/, "At least 1 special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const passwordRequirementSchemas = {
  minLength: z.string().min(8),
  upper: z.string().regex(/[A-Z]/),
  lower: z.string().regex(/[a-z]/),
  number: z.string().regex(/[0-9]/),
  special: z.string().regex(/[^A-Za-z0-9]/),
} as const;

export function getPasswordChecks(password: string) {
  return {
    minLength: passwordRequirementSchemas.minLength.safeParse(password).success,
    upper: passwordRequirementSchemas.upper.safeParse(password).success,
    lower: passwordRequirementSchemas.lower.safeParse(password).success,
    number: passwordRequirementSchemas.number.safeParse(password).success,
    special: passwordRequirementSchemas.special.safeParse(password).success,
  };
}

export const signInSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
})

export type ValidatedFormAnswers = z.infer<typeof FormAnswersSchema>