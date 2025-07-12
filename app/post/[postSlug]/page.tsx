import PostView from "@/components/Posts/PostView/PostView";
import { notFound } from "next/navigation";
import { Dock } from "@/components/Dock";

interface PostPageProps {
  params: {
    postSlug: string;
  };
}

// todo dynamically generate metadata

export default async function PostPage({ params }: PostPageProps) {
  const slug = params.postSlug;
  if (slug.length < 6) {
    return notFound();
  }

  const postID = slug.substring(slug.length - 6);
  return (
    <>
      <PostView  postID={postID} />
      <Dock />
    </>
  );
}
