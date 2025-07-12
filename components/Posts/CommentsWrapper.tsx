import { getPostComments } from "@/lib/database/comments";
import { convertTimestamp } from "@/lib/utils";
import Comments from "./Comments";

export default async function CommentsWrapper({ postID }: { postID: string }) {
  const comments = await getPostComments(postID);

  const formattedComments = comments.map((comment) => ({
    ...comment,
    timestamp: convertTimestamp(comment.timestamp),
  }));

  return (
    <div className="flex-grow overflow-auto everynyan-scroll">
      <Comments postID={postID} initialComments={formattedComments} />
    </div>
  );
}
