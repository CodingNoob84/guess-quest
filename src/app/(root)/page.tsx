import { AdminLink } from "@/components/layouts/admin-link";
import { PostList } from "@/components/posts/post-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col m-2 gap-2">
      <div className="flex flex-row gap-5 justify-end items-center">
        <AdminLink />
        <Button asChild>
          <Link href="/create-post">Create Post</Link>
        </Button>
      </div>
      <PostList />
    </div>
  );
}
