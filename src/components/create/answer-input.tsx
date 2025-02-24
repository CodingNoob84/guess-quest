import * as React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { X } from "lucide-react";
import { FormProps } from "./form-post";

export default function AnswerInput({ form }: FormProps) {
  const [currentAnswer, setCurrentAnswer] = React.useState("");

  const getAnswerDescription = (type: string) => {
    switch (type) {
      case "moviename":
        return "Enter movie name as your answer. Also add few possible misspelled answers";
      case "personname":
        return "Enter person name as your answer. Also add few possible misspelled answers";
      case "word":
        return "Enter word as your answer. Also add few possible misspelled answers";
      default:
        return "Enter your answers";
    }
  };

  const addAnswer = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentAnswer.trim()) {
      e.preventDefault();
      const answers = form.getValues("answers");
      if (!answers.includes(currentAnswer.trim())) {
        form.setValue("answers", [...answers, currentAnswer.trim()]);
        setCurrentAnswer("");
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name="answers"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Answer</FormLabel>
          <FormDescription>
            {getAnswerDescription(form.watch("type"))}
          </FormDescription>
          <FormControl>
            <Input
              placeholder="Type and press Enter to add"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={addAnswer}
            />
          </FormControl>
          <div className="flex flex-wrap gap-2 pt-2">
            {field.value.map((answer, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-sm text-rose-700"
              >
                {answer}
                <button
                  type="button"
                  onClick={() => {
                    const answers = [...field.value];
                    answers.splice(index, 1);
                    form.setValue("answers", answers);
                  }}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
