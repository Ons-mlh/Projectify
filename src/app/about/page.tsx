"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Lightbulb, Zap, Heart, Github } from "lucide-react";
import { Bot, LaptopMinimalCheck } from 'lucide-react';

export const FloatingIcons = () => (
    <>
        <div className="fixed left-6 top-1/3 -translate-y-1/2 text-teal-500 opacity-20 pointer-events-none">
            <Bot className="w-24 h-24 animate-bounce" />
        </div>
        <div className="fixed right-6 top-1/2 -translate-y-1/2 text-teal-500 opacity-20 pointer-events-none">
            <LaptopMinimalCheck className="w-24 h-24 animate-bounce" style={{ animationDelay: "0.5s" }} />
        </div>
    </>
);


const values = [
  {
    icon: <Lightbulb className="w-5 h-5" />,
    title: "Ideas over overwhelm",
    description:
      "Starting a new project is hard. The blank page is intimidating. Projectify exists to remove that friction and get you building faster.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Tailored, not generic",
    description:
      "Generic project lists are everywhere. We use AI to analyze your exact profile — your stack, your level, your time — and suggest something that actually fits.",
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: "Built by a developer, for developers",
    description:
      "Projectify was built as a learning project to explore how LLMs can be integrated into real products. Everything here is open and honest about that.",
  },
];

const techStack = [
  { name: "Next.js", role: "Frontend & API routes" },
  { name: "TypeScript", role: "Type safety across the app" },
  { name: "Tailwind CSS", role: "Styling and layout" },
  { name: "OpenRouter", role: "LLM API gateway" },
  { name: "Gemma 3 27B", role: "AI model for suggestions" },
  { name: "shadcn/ui", role: "UI component library" },
];

const faqs = [
  {
    q: "Is Projectify free to use?",
    a: "Yes, completely free. We use free-tier AI models through OpenRouter, so there is no cost to generate project ideas.",
  },
  {
    q: "How are the project ideas generated?",
    a: "Your form answers are turned into a detailed prompt and sent to an LLM model (Gemma 3 27B via OpenRouter). The model analyzes your profile and returns 3 tailored project suggestions.",
  },
  {
    q: "Will I get different results if I fill the form twice?",
    a: "Likely yes. LLMs are non-deterministic, meaning they can return different suggestions even for the same input. This is actually useful — you can generate multiple times to explore more ideas.",
  },
  {
    q: "Can I save my generated projects?",
    a: "Not yet. Saving projects is on the roadmap. For now you can copy them manually from the results page.",
  },
  {
    q: "Which domains are supported?",
    a: "Frontend, Full-Stack, Backend/API, Mobile, AI/ML, Data Analytics, IoT, Desktop, DevOps, and Cybersecurity — 10 domains in total.",
  },
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white">

    <FloatingIcons/>
      <section className="relative overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#e6faf3_0%,_transparent_55%)]" />
        <div className="relative max-w-3xl mx-auto px-6 py-24">
          <div className="max-w-2xl gap-10">
            <span className="inline-block text-s font-bold tracking-widest text-teal-600 uppercase mb-6">
              About Projectify
            </span>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
              A tool built to spark{" "}
              <span className="text-teal-600">developer creativity</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed">
              Projectify helps developers who know what they want to build with,
              but not what to build. Fill out a short form, and let AI do the
              thinking for you.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">The story</h2>
            <div className="flex flex-col gap-4 text-gray-500 leading-relaxed">
              <p>
                Projectify started as a personal learning project: a way to
                understand how to integrate LLMs into a real product for the
                first time. The core question was simple: can I take user input,
                craft a smart prompt, and return something genuinely useful?
              </p>
              <p>
                The answer turned out to be yes. The project evolved into a
                full-featured tool with a multi-step form, dynamic tech stack
                selection, and AI-generated suggestions tailored to the user's
                exact preferences.
              </p>
              <p>
                It's still growing. The goal is to keep it simple, honest, and
                useful for any developer staring at a blank page.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "10", label: "Domains supported" },
              { value: "11", label: "Form steps" },
              { value: "3", label: "Project ideas per run" },
              { value: "1", label: "LLM powering it all" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-1 p-6 rounded-2xl bg-gray-50 border border-gray-100"
              >
                <span className="text-4xl font-bold text-teal-500">
                  {stat.value}
                </span>
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">
            What we believe
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-gray-100 hover:border-teal-200 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          How it's built
        </h2>
        <p className="text-gray-500 mb-10 max-w-lg">
          Projectify is a Next.js application using OpenRouter to access free
          LLM models. Here's the full tech stack:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {techStack.map((t) => (
            <div
              key={t.name}
              className="flex items-center justify-between px-5 py-4 rounded-xl border border-gray-100 bg-white hover:border-teal-200 transition-colors"
            >
              <span className="font-semibold text-gray-900 text-sm">
                {t.name}
              </span>
              <span className="text-xs text-gray-400">{t.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">
            Frequently asked questions
          </h2>
          <div className="flex flex-col gap-6">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="p-6 rounded-2xl bg-white border border-gray-100"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-teal-500 px-10 py-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#0f766e_0%,_transparent_60%)]" />
          <div className="relative flex flex-col items-center gap-6">
            <h2 className="text-3xl font-bold text-white">
              Ready to find your next project?
            </h2>
            <p className="text-teal-100 max-w-sm">
              It takes less than 2 minutes. No account needed.
            </p>
            <button
              onClick={() => router.push("/project-generator")}
              className="inline-flex items-center gap-2 bg-white text-teal-600 hover:bg-teal-50 font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm"
            >
              Try it now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}
