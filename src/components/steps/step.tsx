"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { StepConfig } from "./step-config";

interface StepProps {
  config: StepConfig;
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  customValue?: string;
  onCustomChange?: (value: string) => void;
}

export default function Step({
  config,
  value,
  onChange,
  customValue,
  onCustomChange,
}: StepProps) {
  const { stepNumber, title, subtitle, options, type, required } = config;

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (checked) {
      onChange([...currentValues, optionId]);
    } else {
      onChange(currentValues.filter((v) => v !== optionId));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
            {stepNumber}
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-foreground leading-snug">
              {title}
              {required && <span className="text-red-500 ml-1">*</span>}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {subtitle}
              {required && (
                <span className="text-red-500 ml-1">(Required)</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Single select */}
      {type === "single" && (
        <RadioGroup
          value={(value as string) || ""}
          onValueChange={(val) => onChange(val)}
        >
          <div className="space-y-2">
            {options.map((option) => (
              <div
                key={option.id}
                className="flex items-start gap-3 p-3 sm:p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem
                  value={option.id}
                  id={`${stepNumber}-${option.id}`}
                  className="mt-0.5 flex-shrink-0"
                />
                <Label
                  htmlFor={`${stepNumber}-${option.id}`}
                  className="flex-1 cursor-pointer min-w-0"
                >
                  {/* ✅ Stack title and description vertically always */}
                  <p className="font-medium text-sm sm:text-base text-foreground">
                    {option.title}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {option.description}
                  </p>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      )}

      {/* Multiple select */}
      {type === "multiple" && (
        <div className="space-y-2">
          {options.map((option) => {
            const isChecked = Array.isArray(value) && value.includes(option.id);
            return (
              <div
                key={option.id}
                className="flex items-start gap-3 p-3 sm:p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleCheckboxChange(option.id, !isChecked)}
              >
                <Checkbox
                  id={`${stepNumber}-${option.id}`}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(option.id, checked as boolean)
                  }
                  className="mt-0.5 flex-shrink-0"
                />
                <Label
                  htmlFor={`${stepNumber}-${option.id}`}
                  className="flex flex-col cursor-pointer min-w-0 gap-0.5"
                >
                  <p className="font-medium text-sm text-foreground">
                    {option.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </Label>
              </div>
            );
          })}

          {onCustomChange && (
            <div className="mt-4 pt-4 border-t border-border">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Other technologies{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. Prisma, Redis, GraphQL..."
                value={customValue || ""}
                onChange={(e) => onCustomChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate multiple technologies with commas
              </p>
            </div>
          )}
        </div>
      )}

      {/* Text input */}
      {type === "text" && (
        <Textarea
          placeholder="Enter any additional constraints, requirements, or notes..."
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-32 resize-none text-sm"
        />
      )}
    </div>
  );
}
