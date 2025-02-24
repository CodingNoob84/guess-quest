import { ATTEMPTS_OVER, MAX_ATTEMPTS, SUCCESS_MSG } from "@/contants";
import { useToast } from "@/hooks/use-toast"; // Import toast hook
import { cn, isAcceptableAnswer } from "@/lib/utils";
import { useMutation } from "convex/react";
import { ChevronUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Answer } from "../../../convex/posts";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const GuessInput = ({
  postId,
  type,
  postAnswers,
  userAnswers,
}: {
  postId: Id<"posts">;
  type: string;
  postAnswers: string[];
  userAnswers: Answer | null;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Track submission state
  const submitAnswer = useMutation(api.posts.submitAnswer);
  const { toast } = useToast(); // Toast hook

  const userAnswersCount = userAnswers?.answers.length || 0;
  const remainingAttempts = MAX_ATTEMPTS - userAnswersCount;
  const isAnswered = userAnswers?.isAnswered ?? false;

  const handleView = () => setIsExpanded((prev) => !prev);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast({
        title: "Error",
        description: "Please enter a guess.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Submitted Guess:", answer);
      const isAcceptable = isAcceptableAnswer(answer, postAnswers, type);
      console.log("final-answer", isAcceptable);

      await submitAnswer({ postId, answer, isAnswered: isAcceptable });

      toast({
        title: isAcceptable ? "🎉 Correct!" : "❌ Incorrect!",
        description: isAcceptable ? "You got it right!" : "Try again!",
        variant: isAcceptable ? "success" : "destructive",
      });

      setAnswer(""); // Reset input field after submission
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit. Try again.",
        variant: "destructive",
      });
      console.error("Error submitting answer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAnswers = () => (
    <div className="flex flex-col gap-2 my-2 transition-opacity duration-200 ease-in-out">
      {userAnswersCount === 0 ? (
        <div className="text-center text-sm text-gray-500">
          No guesses in history
        </div>
      ) : (
        userAnswers?.answers.map((answer, i) => {
          const isLast = i === userAnswers.answers.length - 1;
          return (
            <div
              key={i}
              className={cn(
                "text-sm px-3 py-1.5 rounded-md",
                userAnswers.isAnswered
                  ? isLast
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              <span className="font-medium">{answer}</span>
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <>
      {isAnswered ? (
        <div className="flex flex-col">
          {isExpanded && renderAnswers()}
          <div className="flex flex-row justify-between gap-2">
            <div className="flex-1 text-center py-2 px-4 bg-green-100 text-green-800 rounded-md">
              <p className="font-medium">{SUCCESS_MSG}</p>
            </div>
            <ChevronUp
              className={isExpanded ? "rotate-180" : ""}
              onClick={handleView}
            />
          </div>
        </div>
      ) : remainingAttempts > 0 ? (
        <div className="flex flex-col">
          {isExpanded && renderAnswers()}
          <div className="flex flex-row justify-between gap-2">
            <div className="flex-1 flex flex-row">
              <Input
                placeholder={`Your guess... (${remainingAttempts} attempt${
                  remainingAttempts !== 1 ? "s" : ""
                } left)`}
                className="flex-grow"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={isLoading} // Disable input while loading
              />
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={handleSubmit}
                disabled={isLoading} // Disable button while loading
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
            <ChevronUp
              className={isExpanded ? "rotate-180" : ""}
              onClick={handleView}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          {isExpanded && renderAnswers()}
          <div className="flex flex-row">
            <div className="flex-1 text-center py-2 px-4 bg-red-200 rounded-md">
              <p className="font-medium text-muted-foreground">
                {ATTEMPTS_OVER}
              </p>
            </div>
            <ChevronUp
              className={isExpanded ? "rotate-180" : ""}
              onClick={handleView}
            />
          </div>
        </div>
      )}
    </>
  );
};
