import PostView from "@/components/Posts/PostView/PostView";
import { notFound } from "next/navigation";
import { Dock } from "@/components/Dock";
import { getUserFromToken } from "@/lib/database/firestore";
import { getAuthUser } from "@/lib/user";
import { getPostByID } from "@/lib/database/posts";

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

  let canMarkAsAccepted = false;
  const postID = slug.substring(slug.length - 6);
  const user = await getAuthUser();
  if (user && user.token) {
    const username = (await getUserFromToken(user.token))?.username;
    const post = await getPostByID(postID)
    if (username === post.author) {
      canMarkAsAccepted = true;
    }
  }

  return (
    <>
      <PostView canMarkAsAccepted={canMarkAsAccepted} postID={postID} />
      <Dock />
    </>
  );
}
