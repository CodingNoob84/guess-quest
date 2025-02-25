import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import * as React from "react";
import { FormProps } from "./form-post";

export default function AnswerInput({ form }: FormProps) {
  const [currentAnswer, setCurrentAnswer] = React.useState("");

  const getAnswerDescription = (type: string) => {
    switch (type) {
      case "moviename":
        return "Enter movie name as your answer. Also add a few possible misspelled answers";
      case "personname":
        return "Enter person name as your answer. Also add a few possible misspelled answers";
      case "word":
        return "Enter word as your answer. Also add a few possible misspelled answers";
      default:
        return "Enter your answers";
    }
  };

  const addAnswer = () => {
    const trimmedAnswer = currentAnswer.trim();
    if (trimmedAnswer) {
      const answers = form.getValues("answers");
      if (!answers.includes(trimmedAnswer)) {
        form.setValue("answers", [...answers, trimmedAnswer]);
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAnswer();
                }
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAnswer();
                }
              }}
              onBlur={addAnswer} // Ensures input is added when focus is lost (for mobile users)
              enterKeyHint="done" // Improves mobile keyboard UX
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
