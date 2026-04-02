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

  const dynamicStepsConfig = useMemo((): StepConfig[] => {
    return stepsConfig.map((step) => {
      if (step.answerKey === "technologies" && answers.domain) {
        return {
          ...step,
          options: getTechnologiesForDomain(answers.domain),
        };
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
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      sessionStorage.setItem("projectSuggestions", data.result);
      router.push("/results");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = Math.round((currentStep / TOTAL_STEPS) * 100);

  const currentStepConfig = dynamicStepsConfig[currentStep - 1];

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto">
      {/* Left Column - Form */}
      <div className="flex-1">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 h-auto p-0"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Gallery
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Unlock Your Next Project
          </h1>
          <p className="text-muted-foreground">
            Answer a few questions to unlock suggestions of suitable projects
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <span className="text-sm text-muted-foreground">
              {progressPercentage}% complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="p-6 mb-8">
          <Step
            config={currentStepConfig}
            value={answers[currentStepConfig.answerKey]}
            onChange={(value) =>
              handleAnswerChange(currentStepConfig.answerKey, value)
            }
          />
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {error && <p className="text-red-500">{error}</p>}

          {currentStep === 11 ? (
            <Button
              onClick={() => handleSubmit(answers as FormAnswers)}
              disabled={isLoading}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate Ideas"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={currentStep === TOTAL_STEPS || !isCurrentStepValid}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Right Column - Live Preview */}
      <div className="lg:w-80">
        <LivePreview answers={answers} stepsConfig={dynamicStepsConfig} />
      </div>
    </div>
  );
}
