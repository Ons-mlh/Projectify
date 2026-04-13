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

export const FormAnswersSchema = z.object({
  domain: z.enum(domainValues, {
    message: "Invalid domain selected",
  }),

  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"], {
     message: "Invalid difficulty level" ,
  }),

  technologies: z
    .array(z.enum(technologyValues))
    .min(1, "Select at least one technology")
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
  .string()
  .max(300, "Keep constraints under 300 characters")
  .regex(
    /^[a-zA-Z0-9\s,.\-_!?()\/]+$/,
    "Only letters, numbers and basic punctuation allowed"
  )
  .optional(),

  customTechnologies: z
    .string()
    .max(300, "Too long")
    .regex(/^[a-zA-Z0-9,.\s\-_#@+/]*$/, "Invalid characters detected")
    .optional(),
});

export type ValidatedFormAnswers = z.infer<typeof FormAnswersSchema>