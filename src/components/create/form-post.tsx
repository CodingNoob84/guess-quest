"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { useToast } from "@/hooks/use-toast";
import { data64ToFile } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../convex/_generated/api";
import ImageUploader from "./add-images";
import TagInput from "./add-tags";
import AnswerInput from "./answer-input";
import SelectType from "./select-type";

const createPostSchema = z.object({
  type: z.string().min(1, "Please select a type"),
  answers: z.array(z.string()).min(1, "At least one answer is required"),
  images: z.array(
    z.object({
      url: z.string().url("Please enter a valid URL"),
      id: z.string().optional(),
    })
  ),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});
export type createPostFormSchema = z.infer<typeof createPostSchema>;

export type FormProps = { form: UseFormReturn<createPostFormSchema> };

export default function CreatePostForm() {
  const { toast } = useToast();
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);
  const getImageUrls = useMutation(api.upload.getImageUrls);
  const createPost = useMutation(api.posts.createPost);
  const form = useForm<createPostFormSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      type: "",
      answers: [],
      images: [],
      tags: [],
    },
  });

  const isLoading = form.formState.isSubmitting;

  const getImageStorageId = async (image: string) => {
    const imageFile = data64ToFile(image);
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": imageFile!.type },
      body: imageFile,
    });
    const { storageId } = await result.json();
    return storageId;
  };

  const onSubmit = async (values: createPostFormSchema) => {
    //console.log("values", values);
    try {
      const storageIds = await Promise.all(
        values.images.map(async (image) => {
          return await getImageStorageId(image.url);
        })
      );

      //console.log("Storage IDs:", storageIds);
      const updatedImages = await getImageUrls({ storageIds });
      //console.log("updatedimages", updatedImages);
      const postData = {
        ...values,
        images: updatedImages,
        userUpdated: Date.now(),
      };

      // Simulate API call
      await createPost(postData);
      toast({
        title: "Success!",
        description: "Your post has been created.",
      });
      form.setValue("type", "");
      form.reset();
    } catch (error) {
      console.log("error", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
    }
  };

  const type = form.watch("type");

  useEffect(() => {
    let newTag = "";
    if (type === "moviename") {
      newTag = "moviename";
    } else if (type === "personname") {
      newTag = "personname";
    } else if (type === "word") {
      newTag = "word";
    }
    if (newTag) {
      form.setValue("tags", [newTag]);
    }
  }, [type, form]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-teal-50 p-4 md:p-6">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-4 shadow-lg md:p-6">
        <div className="flex items-center mb-8">
          <Button variant={"ghost"} className="p-2" asChild>
            <Link href="/">
              <ChevronLeft />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-center flex-grow">
            Create New Post
          </h1>
          <div className="w-10"></div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <SelectType form={form} />
            <AnswerInput form={form} />
            <ImageUploader form={form} />
            <TagInput form={form} />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Creating..." : "Create Post"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
