"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { SquareCheck, SquareX } from "lucide-react";
import Image from "next/image";
import { getAllPostWithAnswersTypes } from "../../../convex/posts";
import { GuessInput } from "./guess-input";
import { VerifyBadge } from "./verify-badge";

export function PostCard({ post }: { post: getAllPostWithAnswersTypes }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full mx-auto mb-6">
      <div className="p-4 space-y-4">
        {/* User Info Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.user?.image} alt={post.user?.name} />
              <AvatarFallback>{post.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">{post.user?.name}</h3>
              <p className="text-xs text-gray-500">{post.user?.email}</p>
            </div>
          </div>
          <VerifyBadge isVerified={post.isVerified} />
        </div>

        <div className="flex flex-row gap-2">
          {post.tags.map((tag, i) => (
            <Badge key={i}>{tag}</Badge>
          ))}
        </div>

        {/* Timer Row */}
        {/* <div className="flex items-center space-x-2 text-sm">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{formatTime(timeLeft)}</span>
          <Progress value={(timeLeft / 5000) * 100} className="flex-grow" />
        </div> */}

        {/* Images Row */}
        <div className="flex flex-wrap justify-center gap-1">
          {post.images.map((image, index) => (
            <div
              key={index}
              className="w-28 h-28 relative overflow-hidden rounded-md"
            >
              <Image
                src={image.imageUrl || ""}
                alt={`Scene ${index + 1}`}
                width={128} // Fixed width
                height={128} // Fixed height
                className="object-cover rounded-md"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-sm">
            <span className="flex items-center">
              <SquareCheck className="w-5 h-5 mr-1 text-green-500" />
              {post.successCount}
            </span>
            <span className="flex items-center">
              <SquareX className="w-5 h-5 mr-1 text-red-500" />
              {post.failureCount}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {timeAgo(post.userUpdated!)}
          </span>
        </div>
        <GuessInput
          postId={post._id}
          type={post.type}
          postAnswers={post.answers}
          userAnswers={post.useranswers}
        />
      </div>
    </div>
  );
}
