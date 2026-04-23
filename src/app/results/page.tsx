"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
  Code2,
  Star,
  Lightbulb,
} from "lucide-react";
import { useSession } from "next-auth/react";
interface Project {
  number: string;
  title: string;
  domain?: string;
  description: string;
  technologies: string[];
  features: string[];
  whyItFits: string;
}

const DOMAIN_LABELS: Record<string, string> = {
  frontend: "Frontend Web",
  fullstack: "Full-Stack Web",
  backend: "Backend / API",
  mobile: "Mobile Development",
  ai: "AI / Machine Learning",
  data: "Data / Analytics",
  iot: "IoT / Embedded Systems",
  desktop: "Desktop Applications",
  devops: "DevOps / Infrastructure",
  cybersecurity: "Cybersecurity",
};

function formatDomain(domain?: string): string {
  if (!domain) return "General";
  const normalized = domain.trim().toLowerCase();
  return DOMAIN_LABELS[normalized] ?? domain;
}

function getProjectsSignature(projects: Project[]): string {
  return projects
    .map((p) => {
      const title = p.title?.trim().toLowerCase() ?? "";
      const description = p.description?.trim().toLowerCase() ?? "";
      const domain = p.domain?.trim().toLowerCase() ?? "";
      return `${title}::${description}::${domain}`;
    })
    .sort()
    .join("||");
}

function parseProjects(raw: string): Project[] {
  const projects: Project[] = [];

  const blocks = raw.split(/PROJECT\s+\d+\s*:/i).filter((b) => {
    const trimmed = b.trim();
    return trimmed.length > 0 && !/^-+$/.test(trimmed);
  });

  blocks.forEach((block, index) => {
    const lines = block
      .trim()
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const title = lines[0] || `Project ${index + 1}`;

    const getSection = (label: string): string => {
      const idx = lines.findIndex((l) =>
        l
          .replace(/\s*:\s*/, ":")
          .toUpperCase()
          .startsWith(label.toUpperCase()),
      );
      if (idx === -1) return "";

      const sectionLines: string[] = [];
      for (let i = idx + 1; i < lines.length; i++) {
        if (
          /^(DOMAIN|DESCRIPTION|TECHNOLOGIES USED|KEY FEATURES|WHY IT FITS YOU)\s*:/i.test(
            lines[i],
          )
        )
          break;

        if (/^-{2,}$/.test(lines[i])) break;
        sectionLines.push(lines[i]);
      }
      const headerLine = lines[idx];
      const inlineContent = headerLine.replace(/^[^:]+:\s*/, "").trim();
      if (inlineContent) sectionLines.unshift(inlineContent);
      return sectionLines.join(" ").trim();
    };

    const domain = getSection("DOMAIN:");
    const description = getSection("DESCRIPTION:");
    const technologiesRaw = getSection("TECHNOLOGIES USED:");
    const featuresRaw = getSection("KEY FEATURES:");
    const whyItFits = getSection("WHY IT FITS YOU:");

    const reposRaw = getSection("SIMILAR GITHUB REPOS:");

    const technologies = technologiesRaw
      .split(/[,\n•\-]/)
      .map((t) => t.replace(/\(.*?\)/g, "").trim())
      .filter((t) => t.length > 1 && t.length < 40);

    const features = featuresRaw
      .split(/[•\n\-]/)
      .map((f) => f.trim())
      .filter((f) => f.length > 3);

    projects.push({
      number: String(index + 1),
      title: title.replace(/^PROJECT\s*\d*:?\s*/i, "").trim(),
      domain,
      description,
      technologies,
      features,
      whyItFits,
    });
  });

  return projects;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `
${project.title}

${project.description}

Technologies: ${project.technologies.join(", ")}

Key Features:
${project.features.map((f) => `• ${f}`).join("\n")}

Why it fits: ${project.whyItFits}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colors = [
    {
      bg: "bg-teal-50",
      border: "border-teal-200",
      badge: "bg-teal-100 text-teal-700",
      accent: "text-teal-600",
      bar: "bg-teal-400",
    },
    {
      bg: "bg-blue-50",
      border: "border-blue-200",
      badge: "bg-blue-100 text-blue-700",
      accent: "text-blue-600",
      bar: "bg-blue-400",
    },
    {
      bg: "bg-violet-50",
      border: "border-violet-200",
      badge: "bg-violet-100 text-violet-700",
      accent: "text-violet-600",
      bar: "bg-violet-400",
    },
  ];

  const color = colors[index % colors.length];

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white overflow-hidden hover:shadow-md transition-shadow duration-200 ${color.border}`}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${color.bar}`} />

      {/* Card header */}
      <div className={`px-6 pt-5 pb-4 ${color.bg}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold uppercase tracking-widest ${color.accent}`}
            >
              {formatDomain(project.domain)}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mt-2 leading-snug">
          {project.title}
        </h2>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-5 px-6 py-5 flex-1">
        {/* Description */}
        {project.description && (
          <p className="text-sm text-gray-500 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Technologies */}
        {project.technologies.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Code2 className={`w-4 h-4 ${color.accent}`} />
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Technologies
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border ${color.badge} border-transparent`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Key Features */}
        {project.features.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Star className={`w-4 h-4 ${color.accent}`} />
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Key Features
              </span>
            </div>
            <ul className="flex flex-col gap-1.5">
              {project.features.slice(0, 4).map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span
                    className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${color.bar}`}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Why it fits */}
        {project.whyItFits && (
          <div className={`rounded-xl p-4 ${color.bg} border ${color.border}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Lightbulb className={`w-4 h-4 ${color.accent}`} />
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Why it fits you
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {project.whyItFits}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [raw, setRaw] = useState<string>("");
  const [parseError, setParseError] = useState(false);
  const saveInFlightRef = useRef(false);

  const { data: session } = useSession();

  useEffect(() => {
    const stored = sessionStorage.getItem("projectSuggestions");
    if (!stored) {
      router.push("/project-generator");
      return;
    }
    setRaw(stored);
    try {
      const parsed = parseProjects(stored);
      const selectedDomain = (
        sessionStorage.getItem("projectDomain") ?? ""
      ).trim();
      const valid = parsed
        .filter((p) => p.title && p.description)
        .slice(0, 3)
        .map((p) => ({
          ...p,
          domain: p.domain?.trim() || selectedDomain || undefined,
        }));

      if (valid.length === 0) {
        setParseError(true);
      } else {
        setProjects(valid);

        if (session) {
          autoSave(valid);
        }
      }
    } catch {
      setParseError(true);
    }
  }, [session]);

  const autoSave = async (projectsToSave: Project[]) => {
    if (saveInFlightRef.current) {
      return;
    }

    const signature = getProjectsSignature(projectsToSave);
    if (sessionStorage.getItem("lastSavedProjectsSignature") === signature) {
      return;
    }

    try {
      saveInFlightRef.current = true;
      const domain = sessionStorage.getItem("projectDomain") ?? "";

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: projectsToSave, domain }),
      });

      if (!res.ok) {
        throw new Error("Failed to save projects");
      }

      sessionStorage.setItem("projectsSaved", "true");
      sessionStorage.setItem("lastSavedProjectsSignature", signature);
    } catch (error) {
      console.error("Auto-save failed:", error);
      sessionStorage.removeItem("projectsSaved");
      sessionStorage.removeItem("lastSavedProjectsSignature");
    } finally {
      saveInFlightRef.current = false;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page title */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-teal-500" />
            <span className="text-sm font-semibold text-teal-600 uppercase tracking-widest">
              AI Generated
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Your project suggestions
          </h1>
          <p className="text-gray-500 mt-2">
            Here are 3 ideas tailored to your profile. Click copy to save any of
            them.
          </p>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem("projectSuggestions");
            sessionStorage.removeItem("projectDomain");
            sessionStorage.removeItem("projectsSaved");
            sessionStorage.removeItem("lastSavedProjectsSignature");
            router.push("/project-generator");
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-teal-200 bg-teal-50 text-teal-700 font-medium text-sm hover:bg-teal-100 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate
        </button>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {parseError ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              Raw suggestions from AI:
            </p>
            <pre className="text-sm text-gray-500 whitespace-pre-wrap leading-relaxed">
              {raw}
            </pre>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.number}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
