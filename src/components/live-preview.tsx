"use client"

import { Card } from "@/components/ui/card"
import type { StepConfig, FormAnswers } from "./steps/step-config"

interface LivePreviewProps {
  answers: Partial<FormAnswers>
  stepsConfig: StepConfig[]
}

export default function LivePreview({ answers, stepsConfig }: LivePreviewProps) {
  const answeredQuestions = stepsConfig
    .filter((step) => {
      const val = answers[step.answerKey]
      if (Array.isArray(val)) return val.length > 0
      return Boolean(val)
    })
    .map((step) => {
      const val = answers[step.answerKey]

      if (Array.isArray(val)) {
        // Multi-select: show all selected options
        const selectedTitles = val.map((id) => step.options.find((opt) => opt.id === id)?.title || id).join(", ")
        return { label: step.title, value: selectedTitles }
      }

      if (step.type === "text") {
        return { label: step.title, value: val as string }
      }

      const selectedOption = step.options.find((opt) => opt.id === val)
      return { label: step.title, value: selectedOption?.title || (val as string) }
    })

  const allQuestions = stepsConfig.map((step) => step.title)

  const isStepAnswered = (index: number): boolean => {
    const val = answers[stepsConfig[index].answerKey]
    if (Array.isArray(val)) return val.length > 0
    return Boolean(val)
  }

  return (
    <Card className="p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Live Preview</h3>
      <p className="text-sm text-muted-foreground mb-6">Watch your personalized project evolve with each answer!</p>

      {answeredQuestions.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground italic">
            Start answering questions to see your project ideas grow...
          </p>
        </div>
      ) : (
        <div className="bg-muted/50 rounded-lg p-4 mb-6 space-y-2 max-h-48 overflow-y-auto">
          {answeredQuestions.map((question, index) => (
            <p key={index} className="text-sm text-foreground">
              <span className="font-medium">{question.label}:</span>{" "}
              <span className="text-muted-foreground">{question.value}</span>
            </p>
          ))}
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Answered Questions</h4>
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {allQuestions.map((question, index) => {
            const answered = isStepAnswered(index)
            return (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${answered ? "bg-teal-500" : "bg-muted-foreground/50"}`}
                />
                <span className="truncate">{question}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </Card>
  )
}