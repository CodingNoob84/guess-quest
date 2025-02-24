import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.float64()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.union(v.literal("user"), v.literal("admin"))),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),
  posts: defineTable({
    userId: v.id("users"),
    answers: v.array(v.string()),
    images: v.array(
      v.object({
        storageId: v.string(),
        imageUrl: v.string(),
      })
    ),
    type: v.string(),
    tags: v.array(v.string()),
    successCount: v.number(),
    failureCount: v.number(),
    userUpdated: v.optional(v.number()),
    isVerified: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["type"]),

  answers: defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
    answers: v.array(v.string()),
    attempts: v.number(),
    isAnswered: v.boolean(),
  })
    .index("by_post", ["postId"])
    .index("by_userId", ["userId"])
    .index("by_post_user", ["postId", "userId"]),
});

export default schema;
