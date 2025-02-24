import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { action, mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getImageUrls = mutation({
  args: { storageIds: v.array(v.string()) },
  handler: async (ctx, { storageIds }) => 
    Promise.all(
      storageIds.map(async (storageId) => {
        const imageUrl = await ctx.storage.getUrl(storageId as Id<"_storage">);
        return { storageId, imageUrl: imageUrl ?? "" };
      })
    ),
});
