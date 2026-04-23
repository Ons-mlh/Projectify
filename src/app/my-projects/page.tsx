"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Search,
  Code2,
  Star,
  Lightbulb,
  Sparkles,
  ChevronDown,
} from "lucide-react";

interface SavedProject {
  _id: string;
  number: string;
  title: string;
  description: string;
  technologies: string[];
  features: string[];
  whyItFits: string;
  domain: string;
  createdAt: string;
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

export default function MyProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [domains, setDomains] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    if (status === "authenticated") {
      fetchProjects();
    }
  }, [status]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      const projectList: SavedProject[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.projects)
          ? data.projects
          : [];

      setProjects(projectList);

      const uniqueDomains = [
        ...new Set(projectList.map((p) => p.domain).filter(Boolean)),
      ] as string[];
      setDomains(uniqueDomains);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some((t) =>
        t.toLowerCase().includes(search.toLowerCase()),
      );

    const matchesDomain =
      domainFilter === "" ||
      p.domain?.toLowerCase() === domainFilter.toLowerCase();

    return matchesSearch && matchesDomain;
  });

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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">
          Loading your projects...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-5 h-5 text-teal-500" />
          <span className="text-sm font-semibold text-teal-600 uppercase tracking-widest">
            My Projects
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Saved Projects</h1>
        <p className="text-gray-500 mt-2">
          {projects.length} project{projects.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, description or technology..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 bg-white transition-all"
            />
          </div>

          {/* Domain filter */}
          {domains.length > 0 && (
            <div className="relative w-full sm:w-64">
              <select
                value={domainFilter}
                onChange={(e) => {
                  setDomainFilter(e.target.value); 
                }}
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 bg-white appearance-none cursor-pointer transition-all hover:border-gray-300"
              >
                <option value="">All domains</option>
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {formatDomain(d)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No projects found</p>
            <p className="text-gray-400 text-sm mt-1">
              {projects.length === 0
                ? "Generate and save your first project!"
                : "Try a different search or filter"}
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => router.push("/project-generator")}
                className="mt-4 text-sm text-teal-600 hover:underline"
              >
                Go to project generator →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => {
              const color = colors[index % colors.length];
              return (
                <div
                  key={project._id}
                  className={`relative flex flex-col rounded-2xl border bg-white overflow-hidden hover:shadow-md transition-shadow duration-200 ${color.border}`}
                >
                  {/* Top accent bar */}
                  <div className={`h-1 w-full ${color.bar}`} />

                  {/* Card header */}
                  <div className={`px-6 pt-5 pb-4 ${color.bg}`}>
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`text-xs font-bold uppercase tracking-widest ${color.accent}`}
                      >
                        {formatDomain(project.domain)}
                      </span>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mt-2 leading-snug">
                      {project.title}
                    </h2>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col gap-5 px-6 py-5 flex-1">
                    {project.description && (
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {project.description}
                      </p>
                    )}

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

                    {project.whyItFits && (
                      <div
                        className={`rounded-xl p-4 ${color.bg} border ${color.border}`}
                      >
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
            })}
          </div>
        )}
      </div>
    </main>
  );
}
