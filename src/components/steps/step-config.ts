export interface StepOption {
  id: string
  title: string
  description: string
}

export interface StepConfig {
  stepNumber: number
  title: string
  subtitle: string
  answerKey: keyof FormAnswers
  options: StepOption[]
  type: "single" | "multiple" | "text"
  required?: boolean
}

export interface FormAnswers {
  domain: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  technologies: string[]
  timeAvailable: string
  projectType?: string
  goal?: string
  targetAudience?: string
  industryDomain?: string
  collaborationLevel?: "Solo" | "SmallTeam" | "LargeTeam"
  features?: string[]
  additionalConstraints?: string
}

export const TECHNOLOGIES_BY_DOMAIN: Record<string, StepOption[]> = {
  frontend: [
    { id: "react", title: "React", description: "Component-based UI library" },
    { id: "vue", title: "Vue.js", description: "Progressive frontend framework" },
    { id: "svelte", title: "Svelte", description: "Compiler-based UI framework" },
    { id: "tailwind", title: "Tailwind CSS", description: "Utility-first CSS framework" },
  ],
  fullstack: [
    { id: "nextjs", title: "Next.js", description: "Full-stack React framework" },
    { id: "nestjs", title: "NestJS", description: "Scalable backend framework" },
    { id: "firebase", title: "Firebase", description: "Backend-as-a-Service" },
    { id: "postgresql", title: "PostgreSQL", description: "Relational database" },
  ],
  backend: [
    { id: "nodejs", title: "Node.js", description: "JavaScript backend runtime" },
    { id: "express", title: "Express.js", description: "Minimal backend framework" },
    { id: "fastapi", title: "FastAPI", description: "High-performance Python API" },
    { id: "django", title: "Django", description: "Batteries-included backend" },
  ],
  mobile: [
    { id: "flutter", title: "Flutter", description: "Cross-platform mobile apps" },
    { id: "react-native", title: "React Native", description: "JavaScript mobile apps" },
    { id: "swift", title: "Swift", description: "iOS development" },
    { id: "kotlin", title: "Kotlin", description: "Android development" },
  ],
  ai: [
    { id: "python", title: "Python", description: "Core AI language" },
    { id: "pytorch", title: "PyTorch", description: "Deep learning framework" },
    { id: "tensorflow", title: "TensorFlow", description: "ML framework" },
    { id: "opencv", title: "OpenCV", description: "Computer vision" },
  ],
  data: [
    { id: "pandas", title: "Pandas", description: "Data manipulation" },
    { id: "numpy", title: "NumPy", description: "Numerical computing" },
    { id: "powerbi", title: "Power BI", description: "Data visualization" },
    { id: "sql", title: "SQL", description: "Data querying" },
  ],
  iot: [
    { id: "arduino", title: "Arduino", description: "Microcontroller platform" },
    { id: "esp32", title: "ESP32", description: "IoT microcontroller" },
    { id: "raspberrypi", title: "Raspberry Pi", description: "Single-board computer" },
    { id: "mqtt", title: "MQTT", description: "IoT messaging protocol" },
  ],
  desktop: [
    { id: "electron", title: "Electron", description: "Cross-platform desktop apps" },
    { id: "tauri", title: "Tauri", description: "Lightweight desktop apps" },
    { id: "javafx", title: "JavaFX", description: "Java desktop UI" },
  ],
  devops: [
    { id: "docker", title: "Docker", description: "Containerization" },
    { id: "kubernetes", title: "Kubernetes", description: "Container orchestration" },
    { id: "github-actions", title: "GitHub Actions", description: "CI/CD pipelines" },
    { id: "aws", title: "AWS", description: "Cloud infrastructure" },
  ],
  cybersecurity: [
    { id: "python", title: "Python", description: "Scripting and automation" },
    { id: "wireshark", title: "Wireshark", description: "Network traffic analysis" },
    { id: "nmap", title: "Nmap", description: "Network scanning" },
    { id: "metasploit", title: "Metasploit", description: "Penetration testing framework" },
    { id: "burpsuite", title: "Burp Suite", description: "Web security testing" },
    { id: "splunk", title: "Splunk", description: "Security monitoring and logs" },
  ],
}

export function getTechnologiesForDomain(domain: string): StepOption[] {
  return TECHNOLOGIES_BY_DOMAIN[domain] || []
}

export const stepsConfig: StepConfig[] = [
  {
    stepNumber: 1,
    title: "What domain are you building in?",
    subtitle: "Choose the primary domain of your project",
    answerKey: "domain",
    type: "single",
    required: true,
    options: [
      { id: "frontend", title: "Frontend Web", description: "User interfaces, dashboards, and web experiences" },
      { id: "fullstack", title: "Full-Stack Web", description: "Frontend + backend web applications" },
      { id: "backend", title: "Backend / API", description: "APIs, authentication, business logic" },
      { id: "mobile", title: "Mobile Development", description: "Android and iOS applications" },
      { id: "ai", title: "AI / Machine Learning", description: "ML models, NLP, computer vision" },
      { id: "data", title: "Data / Analytics", description: "Data analysis, dashboards, pipelines" },
      { id: "iot", title: "IoT / Embedded Systems", description: "Hardware-connected applications" },
      { id: "desktop", title: "Desktop Applications", description: "Cross-platform or native desktop apps" },
      { id: "devops", title: "DevOps / Infrastructure", description: "CI/CD, cloud, monitoring" },
      { id: "cybersecurity", title: "Cybersecurity", description: "Security, ethical hacking, and defense systems" },
    ],
  },
  {
    stepNumber: 2,
    title: "What's your experience level?",
    subtitle: "Select your proficiency level for this project",
    answerKey: "difficulty",
    type: "single",
    required: true,
    options: [
      { id: "Beginner", title: "Beginner", description: "New to development or this technology" },
      { id: "Intermediate", title: "Intermediate", description: "Comfortable with fundamentals" },
      { id: "Advanced", title: "Advanced", description: "Expert-level knowledge and experience" },
    ],
  },
  {
    stepNumber: 3,
    title: "Which technologies do you want to use?",
    subtitle: "Technologies based on your selected domain",
    answerKey: "technologies",
    type: "multiple",
    required: true,
    options: [], // Dynamically populated based on selected domain
  },
  {
    stepNumber: 4,
    title: "How much time can you dedicate?",
    subtitle: "Choose a realistic time range for completing the project",
    answerKey: "timeAvailable",
    type: "single",
    required: true,
    options: [
      { id: "2-4-hours", title: "2–4 hours", description: "Tiny prototype, script, or proof of concept" },
      { id: "1-2-days", title: "1–2 days", description: "Small focused project or MVP feature" },
      { id: "3-5-days", title: "3–5 days", description: "Mini-project with core functionality" },
      { id: "1-2-weeks", title: "1–2 weeks", description: "Well-scoped project with multiple features" },
      { id: "3-4-weeks", title: "3–4 weeks", description: "Portfolio-ready project with polish" },
      { id: "1-3-months", title: "1–3 months", description: "Large, production-like application" },
    ],
  },
  {
    stepNumber: 5,
    title: "How will you work on this project?",
    subtitle: "This affects architecture and tooling",
    answerKey: "collaborationLevel",
    type: "single",
    required : true,
    options: [
      { id: "Solo", title: "Solo", description: "One developer" },
      { id: "SmallTeam", title: "Small Team (2–4)", description: "Shared responsibilities" },
      { id: "LargeTeam", title: "Large Team (5+)", description: "Structured collaboration" },
    ],
  },
  {
    stepNumber: 6,
    title: "What kind of project do you want to build?",
    subtitle: "Choose the format that best fits your idea",
    answerKey: "projectType",
    type: "single",
    options: [
      { id: "tool", title: "Tool / Utility", description: "Solves a specific problem or task" },
      { id: "dashboard", title: "Dashboard / Control Panel", description: "Data visualization or admin interface" },
      { id: "platform", title: "Platform", description: "Multi-user system or ecosystem" },
      { id: "automation", title: "Automation", description: "Scripts, bots, or workflow automation" },
      { id: "product", title: "Digital Product", description: "SaaS, paid service, or subscription app" },
      { id: "showcase", title: "Showcase / Demo", description: "Portfolio or demo-focused project" },
    ],
  },
  {
    stepNumber: 7,
    title: "What is your primary goal?",
    subtitle: "This determines depth, quality, and scope",
    answerKey: "goal",
    type: "single",
    options: [
      { id: "learning", title: "Learning & Practice", description: "Focus on understanding concepts" },
      { id: "experiment", title: "Experiment / Research", description: "Try an idea or technology" },
      { id: "mvp", title: "MVP", description: "Test a real-world idea quickly" },
      { id: "portfolio", title: "Portfolio Project", description: "Impress recruiters" },
      { id: "production", title: "Production-Ready", description: "Stable, scalable, and documented" },
      { id: "client", title: "Client / Commercial", description: "Deliverable with constraints" },
    ],
  },
  {
    stepNumber: 8,
    title: "Who will use this project?",
    subtitle: "Define the primary users",
    answerKey: "targetAudience",
    type: "single",
    options: [
      { id: "general", title: "General Users", description: "Non-technical end users" },
      { id: "technical", title: "Technical Users", description: "Developers or engineers" },
      { id: "business", title: "Business Users", description: "Teams, managers, or companies" },
      { id: "students", title: "Students", description: "Educational use" },
      { id: "internal", title: "Internal Team", description: "Company or organization only" },
    ],
  },
  {
    stepNumber: 9,
    title: "Which industry or context?",
    subtitle: "Optional but helps make the project realistic",
    answerKey: "industryDomain",
    type: "single",
    options: [
      { id: "tech", title: "Technology", description: "Software & IT" },
      { id: "finance", title: "Finance", description: "Fintech, trading, banking" },
      { id: "health", title: "Healthcare", description: "Medical & wellness" },
      { id: "education", title: "Education", description: "Learning platforms" },
      { id: "security", title: "Cybersecurity", description: "Defense & monitoring" },
      { id: "iot", title: "IoT / Embedded", description: "Connected devices" },
      { id: "other", title: "Generic / Other", description: "No specific industry" },
    ],
  },
  
  {
    stepNumber: 10,
    title: "Which features should be included?",
    subtitle: "Select only what fits your time & goal",
    answerKey: "features",
    type: "multiple",
    options: [
      { id: "auth", title: "Authentication", description: "Users & roles" },
      { id: "data", title: "Data Storage", description: "Database or persistence" },
      { id: "realtime", title: "Real-Time", description: "Live updates or sockets" },
      { id: "automation", title: "Automation", description: "Background jobs or scripts" },
      { id: "integration", title: "Integrations", description: "APIs or third-party services" },
      { id: "security", title: "Security", description: "Permissions, validation, hardening" },
      { id: "analytics", title: "Analytics", description: "Metrics & monitoring" },
    ],
  },
  {
    stepNumber: 11,
    title: "Any constraints or preferences?",
    subtitle: "Examples: offline-only, no cloud, open-source, low budget",
    answerKey: "additionalConstraints",
    type: "text",
    options: [],
  },
]
