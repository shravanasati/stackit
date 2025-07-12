import { Dock } from "@/components/Dock";
import { InfiniteScrollingPosts } from "@/components/InfiniteScrollingPosts";
import { getPostsFeed } from "@/lib/database/posts";
import { cookies } from "next/headers";

export default async function Feed() {
  // todo get preferences from local storage
  const orderByField = cookies().get("orderByField")?.value || "timestamp";
  const resp = await getPostsFeed(orderByField);
  const data = JSON.stringify(resp);
  return (
    <div className="min-h-screen bg-background relative">
      <Dock />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6 everynyan-scroll">
          <InfiniteScrollingPosts boardName={null} data={data} />
        </div>
      </main>
    </div>
  );
}
