import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator, PaginationResult } from "convex/server";

export const createPost = mutation({
  args: {
    type: v.string(),
    answers: v.array(v.string()),
    images: v.array(
      v.object({
        storageId: v.string(),
        imageUrl: v.string(),
      })
    ),
    tags: v.array(v.string()),
    userUpdated: v.number(),
  },
  handler: async (ctx, { type, answers, images, tags, userUpdated }) => {
    // Ensure the user is authenticated
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const userRecord = await ctx.db.get(userId);

    if (!userRecord) throw new Error("User record not found");

    // Set isVerified based on user's role
    const isVerified = userRecord.role === "admin";

    // Insert the new post
    const newPost = await ctx.db.insert("posts", {
      userId: userId, // Authenticated user ID
      type,
      answers,
      images,
      tags,
      successCount: 0,
      failureCount: 0,
      userUpdated,
      isVerified, // Automatically set based on user role
    });

    return { success: true, postId: newPost };
  },
});

// Define User Type
export type User = {
  _id: Id<"users">;
  name?: string;
  email?: string;
  image?: string;
  role?: "user" | "admin";
};

// Define Post Type
export type Post = {
  _id: Id<"posts">;
  userId: Id<"users">;
  answers: string[];
  images: { storageId: string; imageUrl: string | null }[]; // ✅ Corrected type
  type: string;
  tags: string[];
  successCount: number;
  failureCount: number;
  userUpdated?: number;
  isVerified: boolean;
};


export type Answer = {
  _id: Id<"answers">; // Unique ID of the answer
  postId: Id<"posts">; // Associated post ID
  userId: Id<"users">; // User who answered
  answers: string[]; // The submitted answer
  attempts: number; // Number of attempts
  isAnswered: boolean; // Whether the answer is correct or not
};

export type getPostTypes = Post & {
  user: User | null;
};

export type getAllPostWithAnswersTypes = Post & {
  user: User | null;
  useranswers: Answer | null;
};



export const submitAnswer = mutation({
  args: {
    postId: v.id("posts"),
    answer: v.string(),
    isAnswered: v.boolean(),
  },
  handler: async (ctx, { postId, answer, isAnswered }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    // Check if the user already has an entry for this post
    const existingAnswer = await ctx.db
      .query("answers")
      .withIndex("by_post_user", (q) => q.eq("postId", postId).eq("userId", userId))
      .first(); // Get the latest attempt

    let attemptNumber =1;
    
    if (existingAnswer) {
      // If answer exists, update it by appending the new answer
      attemptNumber = existingAnswer.attempts + 1;

      await ctx.db.patch(existingAnswer._id, {
        answers: [...existingAnswer.answers, answer], // Push new answer into array
        attempts: attemptNumber, // Increment attempt count
        isAnswered, // Update correctness
      });
    } else {
      // First attempt, create a new record
      await ctx.db.insert("answers", {
        postId,
        userId,
        answers: [answer], // Store answer as an array
        attempts: attemptNumber,
        isAnswered,
      });
    }

    // Fetch the post to update counts
    const post = await ctx.db.get(postId);
    if (!post) throw new Error("Post not found!");

    // Update successCount or failureCount in posts table
    await ctx.db.patch(postId, {
      successCount: isAnswered ? (post.successCount || 0) + 1 : post.successCount,
      failureCount: !isAnswered ? (post.failureCount || 0) + 1 : post.failureCount,
    });

    return {
      success: true,
      message: isAnswered
        ? `Correct answer on attempt ${attemptNumber}!`
        : `Wrong answer, attempt ${attemptNumber}, try again.`,
    };
  },
});

export type getAllPostWithAnswersResponse = PaginationResult<getAllPostWithAnswersTypes>;

export const getAllPostsWithAnswers = query({
  args: { paginationOpts: paginationOptsValidator  },
  handler: async (ctx, { paginationOpts }): Promise<getAllPostWithAnswersResponse> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { page: [], continueCursor:"", isDone:true }; // Return empty pagination if not authenticated

    // Fetch paginated posts (ordered by latest first)
    const postsPage = await ctx.db.query("posts").order("desc").paginate(paginationOpts);

    if (!postsPage.page.length) return { page: [], continueCursor:"", isDone:true }; // Return if no posts exist

    // Fetch unique users to avoid redundant lookups
    const uniqueUserIds = [...new Set(postsPage.page.map((post) => post.userId))];
    const userRecords: (User | null)[] = await Promise.all(uniqueUserIds.map((id) => ctx.db.get(id)));

    // Create a lookup map for user details
    const userMap: Record<string, User | null> = Object.fromEntries(
      userRecords.map((user) => [user?._id, user])
    );

    // Fetch authenticated user's answers for all posts
    const userAnswers = await ctx.db
      .query("answers")
      .withIndex("by_userId", (q) => q.eq("userId", userId as Id<"users">))
      .collect();

    // Map answers to their corresponding posts
    const answerMap: Record<string, Answer | null> = {};
    userAnswers.forEach((answer) => {
      answerMap[answer.postId] = answer;
    });

    // Transform paginated posts by attaching user details & user answers
    return {
      ...postsPage, // Keep pagination metadata (continueCursor)
      page: postsPage.page.map((post) => ({
        ...post,
        user: userMap[post.userId] || null, // Attach post owner details
        useranswers: answerMap[post._id] || null, // Attach user’s answer history
      })),
    };
  },
});