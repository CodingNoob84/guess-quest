"use client";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { PostCard } from "./post-card";

export const PostList = () => {
  const {
    results: posts,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.posts.getAllPostsWithAnswers,
    {},
    { initialNumItems: 2 }
  );

  if (status === "LoadingFirstPage") {
    return (
      <div className="flex justify-between items-center">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto mb-6">
          <div className="p-4 space-y-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col ">
      {posts.length === 0 ? (
        <div>No posts available</div>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}
      <div className="flex justify-center items-center">
        {status === "CanLoadMore" && (
          <button
            onClick={() => loadMore(5)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};
