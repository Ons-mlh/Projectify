"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Step from "./steps/step";
import {
  stepsConfig,
  getTechnologiesForDomain,
  type FormAnswers,
  type StepConfig,
} from "./steps/step-config";
import LivePreview from "./live-preview";

const TOTAL_STEPS = stepsConfig.length;

export default function PromptBuilder() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Partial<FormAnswers>>({});
  const [showPreview, setShowPreview] = useState(false);

  const dynamicStepsConfig = useMemo((): StepConfig[] => {
    return stepsConfig.map((step) => {
      if (step.answerKey === "technologies" && answers.domain) {
        return { ...step, options: getTechnologiesForDomain(answers.domain) };
      }
      return step;
    });
  }, [answers.domain]);

  const isCurrentStepValid = useMemo(() => {
    const currentStepConfig = dynamicStepsConfig[currentStep - 1];
    if (!currentStepConfig.required) return true;
    const currentValue = answers[currentStepConfig.answerKey];
    if (currentStepConfig.type === "multiple") {
      return Array.isArray(currentValue) && currentValue.length > 0;
    }
    if (currentStepConfig.type === "text") {
      return typeof currentValue === "string" && currentValue.trim().length > 0;
    }
    return !!currentValue;
  }, [currentStep, answers, dynamicStepsConfig]);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleAnswerChange = (
    key: keyof FormAnswers,
    value: string | string[],
  ) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [key]: value };
      if (key === "domain" && prev.domain !== value) {
        newAnswers.technologies = [];
      }
      return newAnswers;
    });
  };

  const handleSubmit = async (answers: FormAnswers) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (response.status === 429) {
        setError(
          "All AI models are busy right now. Please wait a minute and try again.",
        );
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      sessionStorage.setItem("projectSuggestions", data.result);
      router.push("/results");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = Math.round((currentStep / TOTAL_STEPS) * 100);
  const currentStepConfig = dynamicStepsConfig[currentStep - 1];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
        {/* Left Column - Form */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent mb-4"
              onClick={() => router.push("/")}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          
            <h1 className="text-2xl sm:text-3xl font-bold text-teal-600 leading-tight mb-1">
              Unlock Your Next Project
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Answer a few questions to unlock suggestions of suitable projects
            </p>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm font-medium text-foreground">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {progressPercentage}% complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {currentStepConfig.title}
            </p>
          </div>

          {/* Mobile Preview Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs font-medium text-teal-600 border border-teal-200 rounded-lg px-3 py-1.5 hover:bg-teal-50 transition-colors"
            >
              {showPreview ? "Hide preview" : "Show preview"}
            </button>
          </div>

          {/* Mobile Preview — collapsible */}
          {showPreview && (
            <div className="lg:hidden mb-6">
              <LivePreview answers={answers} stepsConfig={dynamicStepsConfig} />
            </div>
          )}

          {/* Step Content */}
          <Card className="p-4 sm:p-6 mb-6">
            <Step
              config={currentStepConfig}
              value={answers[currentStepConfig.answerKey]}
              onChange={(value) =>
                handleAnswerChange(currentStepConfig.answerKey, value)
              }
              customValue={currentStep === 3 ? answers.customTechnologies : undefined}
              onCustomChange={
                currentStep === 3 ?
                (val) => setAnswers((prev) => ({...prev, customTechnologies: val})) 
                : undefined
              }
            />
          </Card>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep === TOTAL_STEPS ? (
              <Button
                onClick={() => handleSubmit(answers as FormAnswers)}
                disabled={isLoading}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Ideas"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isCurrentStepValid}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Right Column - Live Preview (desktop only) */}
        <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
          <LivePreview answers={answers} stepsConfig={dynamicStepsConfig} />
        </div>
      </div>
    </div>
  );
}
