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

export default function TagInput({ form }: FormProps) {
  const [currentTag, setCurrentTag] = React.useState("");

  const addTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag) {
      const tags = form.getValues("tags");
      if (!tags.includes(trimmedTag)) {
        form.setValue("tags", [...tags, trimmedTag]);
        setCurrentTag(""); // Clear input after adding
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <FormDescription>
            Add relevant tags to help others find your post
          </FormDescription>
          <FormControl>
            <Input
              placeholder="Type and press Enter to add tags"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              onBlur={addTag} // Adds tag when user taps outside (for mobile users)
              enterKeyHint="done" // Optimizes mobile keyboard UX
            />
          </FormControl>
          <div className="flex flex-wrap gap-2 pt-2">
            {field.value.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => {
                    const tags = [...field.value];
                    tags.splice(index, 1);
                    form.setValue("tags", tags);
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
