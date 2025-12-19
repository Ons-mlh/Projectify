"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { StepConfig } from "./step-config"

interface StepProps {
  config: StepConfig
  value?: string | string[]
  onChange: (value: string | string[]) => void
}

export default function Step({ config, value, onChange }: StepProps) {
  const { stepNumber, title, subtitle, options, type, required } = config

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : []
    if (checked) {
      onChange([...currentValues, optionId])
    } else {
      onChange(currentValues.filter((v) => v !== optionId))
    }
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-semibold">
            {stepNumber}
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            {title}
            {required && <span className="text-red-500 ml-1">*</span>}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground ml-8">
          {subtitle}
          {required && <span className="text-red-500 ml-1">(Required)</span>}
        </p>
      </div>

      {type === "single" && (
        <RadioGroup value={(value as string) || ""} onValueChange={(val) => onChange(val)}>
          <div className="space-y-3">
            {options.map((option) => (
              <div
                key={option.id}
                className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem value={option.id} id={`${stepNumber}-${option.id}`} className="mt-1" />
                <Label htmlFor={`${stepNumber}-${option.id}`} className="flex-1 cursor-pointer">
                  <p className="font-medium text-foreground">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      )}

      {type === "multiple" && (
        <div className="space-y-3">
          {options.map((option) => {
            const isChecked = Array.isArray(value) && value.includes(option.id)
            return (
              <div
                key={option.id}
                className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleCheckboxChange(option.id, !isChecked)}
              >
                <Checkbox
                  id={`${stepNumber}-${option.id}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => handleCheckboxChange(option.id, checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor={`${stepNumber}-${option.id}`} className="flex-1 cursor-pointer">
                  <p className="font-medium text-foreground">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </Label>
              </div>
            )
          })}
        </div>
      )}

      {type === "text" && (
        <Textarea
          placeholder="Enter any additional constraints, requirements, or notes..."
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-32 resize-none"
        />
      )}
    </div>
  )
}