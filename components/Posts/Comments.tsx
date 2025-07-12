"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VoteCounter from "@/components/Posts/VoteCounter";
import ReportContent from "@/components/Posts/ReportContent";
import DOMPurify from "isomorphic-dompurify";
import { parseISO } from "date-fns";
import {
  MessageCircle,
  MinusCircleIcon,
  PlusCircleIcon,
  Spline,
  X,
  User,
  Check,
} from "lucide-react";
import { useState, useCallback, useMemo, Suspense } from "react";
import { Comment as CommentType, Gif } from "@/lib/models";
import { createComment } from "@/lib/actions/createComment";
import { markAsAccepted } from "@/lib/actions/markAsAccepted";
import { unmarkAsAccepted } from "@/lib/actions/unmarkAsAccepted";
import { CommentInput } from "./CommentInput";
import { useToast } from "@/hooks/use-toast";
// import GifInput from "./GiphyPicker";
import { SortDropdown } from "../SortDropdown";
import { IGif } from "@giphy/js-types";
import { GiphyPicker } from "./GiphyPicker";
import { GiphyAttribution } from "@/components/GiphyAttribution";
import { getAgoDuration } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { trimBodyContent } from "./Post";
import rehypeRaw from "rehype-raw";
import { EditorComp } from "../PostCreator";
import AnimatedLoader from "../AnimatedLoader";
import Link from "next/link";

type ReturnedComment = CommentType & { timestamp: string };

interface CommentNodeType extends ReturnedComment {
  replies: CommentNodeType[];
}

interface SingleCommentProps {
  comment: CommentNodeType;
  postID: string;
  onReply: (commentId: string) => void;
  replyingTo: string | null;
  onSubmitReply: (body: string, gif: Gif | null) => Promise<void>;
  onCancelReply: () => void;
  canMarkAsAccepted: boolean;
  onMarkAsAccepted: (commentId: string) => Promise<void>;
  onUnmarkAsAccepted: (commentId: string) => Promise<void>;
}

const SingleComment: React.FC<SingleCommentProps> = ({
  comment,
  postID,
  onReply,
  replyingTo,
  onSubmitReply,
  onCancelReply,
  canMarkAsAccepted,
  onMarkAsAccepted,
  onUnmarkAsAccepted,
}) => {
  const [replyText, setReplyText] = useState("");
  const isReplying = replyingTo === comment.id;
  const [subCommentVisible, setSubCommentVisible] = useState(true);
  const [disableReplyInput, setDisableReplyInput] = useState(false);
  const [replyCooldown, setReplyCooldown] = useState(0);

  const [showGiphyPicker, setShowGiphyPicker] = useState(false);
  const [selectedGif, setSelectedGif] = useState<IGif | null>(null);
  const handleGifSelect = (gif: IGif) => {
    setSelectedGif(gif);
    setShowGiphyPicker(false);
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() && !selectedGif) return;

    setDisableReplyInput(true);
    setReplyCooldown(5);

    const gifData = selectedGif
      ? {
          src: selectedGif?.images.original.webp || "",
          alt: selectedGif?.alt_text || "",
          height: selectedGif?.images.original.height || 0,
          width: selectedGif?.images.original.width || 0,
        }
      : null;
    await onSubmitReply(replyText, gifData);
    setReplyText("");

    const countdownInterval = setInterval(() => {
      setReplyCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setDisableReplyInput(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="w-full group">
      <Card
        className={`relative w-full border-none ${"bg-primary/[0.0225]"}`}
        id={comment.id}
      >
        <div
          className={`absolute top-0 -left-6 flex items-center justify-center ${
            comment.parent_id != null ? "block" : "hidden"
          }`}
        >
          <Spline
            strokeDasharray="1 3"
            strokeDashoffset={0.8}
            className="-rotate-90 w-8 text-border"
            strokeLinecap="square"
          />
        </div>
        <CardContent className="p-3">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{comment.author}</span>
            </div>
            <span>{getAgoDuration(new Date(comment.timestamp))}</span>
            {comment.is_accepted && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                <Check size={12} />
                <span>Accepted Answer</span>
              </div>
            )}
          </div>
          <div className="rounded-lg bg-primary/[0.015] p-3 mb-3 ">
            {/* <p className="text-sm text-foreground whitespace-pre-wrap break-words">
              {comment.body}
            </p> */}
            <ReactMarkdown
              className="line-clamp-3 sm:line-clamp-4"
              components={{
                a: (props) => (
                  <a className="text-primary hover:underline" {...props} />
                ),
              }}
              rehypePlugins={[rehypeRaw]}
            >
              {DOMPurify.sanitize(trimBodyContent(comment.body))}
            </ReactMarkdown>
            {comment.gif && (
              <div className="flex flex-col gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={comment.gif.src}
                  className="object-cover mt-2"
                  alt={comment.gif.alt}
                  width={comment.gif.width}
                  height={comment.gif.height}
                  loading="lazy"
                />
                <GiphyAttribution />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-2 sm:space-y-0">
            <div className="flex items-center justify-between gap-3">
              {comment.replies.length > 0 ? (
                <div
                  className="rounded-3xl p-2 bg-primary/10 text-white/40 cursor-pointer"
                  onClick={() => setSubCommentVisible((prev) => !prev)}
                >
                  {/* For show and hidden feature of comments */}
                  {subCommentVisible ? (
                    <MinusCircleIcon className="size-[1.2rem]" />
                  ) : (
                    <PlusCircleIcon className="size-[1.2rem]" />
                  )}
                </div>
              ) : null}

              <VoteCounter
                upVotes={comment.upvotes}
                downVotes={comment.downvotes}
                commentID={comment.id}
                postID={postID}
              />
            </div>
            <div className="flex items-center justify-end space-x-2 w-full sm:w-auto">
              {canMarkAsAccepted && !comment.is_accepted && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-green-600 w-max flex items-center justify-center hover:bg-green-100/50 dark:hover:bg-green-950/30 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onMarkAsAccepted(comment.id)}
                >
                  <Check size={18} className="mr-1" />
                  <div>
                    <span className="sr-only">Mark as accepted answer</span>
                    Accept
                  </div>
                </Button>
              )}
              {canMarkAsAccepted && comment.is_accepted && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:text-red-600 w-max flex items-center justify-center hover:bg-red-100/50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onUnmarkAsAccepted(comment.id)}
                >
                  <X size={18} className="mr-1" />
                  <div>
                    <span className="sr-only">Remove accepted status</span>
                    Unmark
                  </div>
                </Button>
              )}
              {comment.is_accepted && !canMarkAsAccepted && (
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <Check size={18} className="mr-1" />
                  <span>Accepted</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary w-max flex items-center justify-center hover:bg-primary/10"
                onClick={() => onReply(comment.id)}
              >
                <MessageCircle size={18} className="mr-1" />
                <div>
                  <span className="sr-only">Reply to comment</span>
                  Reply
                </div>
              </Button>
              <ReportContent
                postID={postID}
                commentID={comment.id}
                className="relative"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isReplying && (
        <div className="mt-2 space-y-2 mb-4">
          <div className="p-1">
            {/* <textarea
              className="w-full bg-primary/[0.07] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
            /> */}

            <Suspense fallback={<AnimatedLoader />}>
              <EditorComp
                markdown={replyText}
                onChange={(value) => setReplyText(value)}
              />
            </Suspense>
          </div>
          {selectedGif && (
            <div className="relative size-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedGif.images.original.webp || "/placeholder.svg"}
                className="object-cover "
                alt={selectedGif.alt_text}
                width={selectedGif.images.original.width}
                height={selectedGif.images.original.height}
              />
              <Button
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full size-6"
                onClick={() => setSelectedGif(null)}
              >
                <X />
              </Button>
            </div>
          )}
          <div className="flex justify-start space-x-2">
            <Button onClick={() => setShowGiphyPicker(!showGiphyPicker)}>
              {showGiphyPicker ? "Hide GIFs" : "Add GIF"}
            </Button>
            <Button
              disabled={
                (!replyText.trim() && !selectedGif) ||
                disableReplyInput ||
                replyText.length > 500
              }
              onClick={handleSubmitReply}
            >
              {disableReplyInput ? `Wait ${replyCooldown}s...` : "Submit Reply"}
            </Button>
            {/* <GifInput /> */}
            <Button
              variant="outline"
              onClick={onCancelReply}
              className="hover:bg-primary/5"
            >
              Cancel
            </Button>
          </div>
          {showGiphyPicker && <GiphyPicker onGifSelect={handleGifSelect} />}
        </div>
      )}

      {comment.replies.length > 0 && subCommentVisible && (
        <div className="pl-8 relative h-max pt-4 space-y-4">
          <div className="w-[1px] h-full rounded-full bg-transparent border absolute left-[0.8rem] top-0 overflow-hidden border-dashed" />
          {comment.replies.map((reply) => (
            <SingleComment
              key={reply.id}
              comment={reply}
              postID={postID}
              onReply={onReply}
              replyingTo={replyingTo}
              onSubmitReply={onSubmitReply}
              onCancelReply={onCancelReply}
              canMarkAsAccepted={canMarkAsAccepted}
              onMarkAsAccepted={onMarkAsAccepted}
              onUnmarkAsAccepted={onUnmarkAsAccepted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

type CommentSortByType =
  | "upvotes"
  | "downvotes"
  | "oldest"
  | "comment_count"
  | "newest";

const commentSortOptions: { title: string; value: CommentSortByType }[] = [
  {
    title: "Popular",
    value: "upvotes",
  },
  {
    title: "Newest",
    value: "newest",
  },
  {
    title: "Oldest",
    value: "oldest",
  },
  {
    title: "Engaging",
    value: "comment_count",
  },
  {
    title: "Controversial",
    value: "downvotes",
  },
];

export default function Comments({
  postID,
  initialComments,
  canMarkAsAccepted,
}: {
  postID: string;
  initialComments: ReturnedComment[];
  canMarkAsAccepted: boolean;
}) {
  const [comments, setComments] = useState<ReturnedComment[]>(initialComments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { toast } = useToast();
  const [commentSort, setCommentSort] = useState<CommentSortByType>("upvotes");

  // Convert flat comments array to nested structure
  const commentTree = useMemo(() => {
    const commentMap = new Map<string, CommentNodeType>();
    const rootComments: CommentNodeType[] = [];

    // Initialize all comments with empty replies array
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Build the tree structure
    comments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parent_id === null) {
        rootComments.push(commentWithReplies);
      } else {
        const parentComment = commentMap.get(comment.parent_id);
        if (parentComment) {
          parentComment.replies.push(commentWithReplies);
        }
      }
    });

    // Sort root comments and their replies by timestamp
    const sortByTimestampOldest = (a: CommentNodeType, b: CommentNodeType) =>
      parseISO(a.timestamp).getTime() - parseISO(b.timestamp).getTime();

    const sortByTimestampNewest = (a: CommentNodeType, b: CommentNodeType) =>
      parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime();

    const sortByUpvotes = (a: CommentNodeType, b: CommentNodeType) =>
      b.upvotes - a.upvotes;

    const sortByDownvotes = (a: CommentNodeType, b: CommentNodeType) =>
      b.downvotes - a.downvotes;

    const sortByCommentCount = (a: CommentNodeType, b: CommentNodeType) =>
      b.replies.length - a.replies.length;

    const sortCommentsRecursively = (comments: CommentNodeType[]) => {
      switch (commentSort) {
        case "upvotes":
          comments.sort(sortByUpvotes);
          break;
        case "downvotes":
          comments.sort(sortByDownvotes);
          break;
        case "oldest":
          comments.sort(sortByTimestampOldest);
          break;
        case "newest":
          comments.sort(sortByTimestampNewest);
          break;
        case "comment_count":
          comments.sort(sortByCommentCount);
          break;
        default:
          comments.sort(sortByUpvotes);
          break;
      }

      comments.forEach((comment) => {
        if (comment.replies.length > 0) {
          sortCommentsRecursively(comment.replies);
        }
      });
    };

    sortCommentsRecursively(rootComments);
    return rootComments;
  }, [comments, commentSort]);

  const handleReply = useCallback((commentId: string) => {
    setReplyingTo(commentId);
  }, []);

  const handleSubmitReply = useCallback(
    async (body: string, gif: Gif | null) => {
      if (!replyingTo) return;

      const parentComment = comments.find((c) => c.id === replyingTo);
      if (!parentComment) return;

      const resp = await createComment({
        body,
        postID,
        parentID: replyingTo,
        level: parentComment.level + 1,
        gif,
      });

      if (!resp.success) {
        toast({
          title: "Reply couldn't be submitted",
          description:
            resp.errors!.body ||
            (resp.errors as Record<string, string>)?.server ||
            "An unknown error occurred",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Reply submitted",
        description: "Your reply has been submitted successfully",
      });
      setComments((prevComments) => [
        ...prevComments,
        resp.data! as ReturnedComment,
      ]);
      setReplyingTo(null);
    },
    [replyingTo, comments, postID, toast]
  );

  const handleMarkAsAccepted = useCallback(
    async (commentId: string) => {
      const resp = await markAsAccepted({
        commentID: commentId,
        postID,
      });

      if (!resp.success) {
        toast({
          title: "Could not mark comment as accepted",
          description:
            (resp.errors as Record<string, string>)?.server ||
            "An unknown error occurred",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Comment marked as accepted",
        description: "This comment has been marked as the accepted answer",
      });

      // Update the comments state to reflect the change
      setComments((prevComments) =>
        prevComments.map((comment) => ({
          ...comment,
          is_accepted: comment.id === commentId ? 1 : 0,
        }))
      );
    },
    [postID, toast]
  );

  const handleUnmarkAsAccepted = useCallback(
    async (commentId: string) => {
      const resp = await unmarkAsAccepted({
        commentID: commentId,
        postID,
      });

      if (!resp.success) {
        toast({
          title: "Could not unmark comment as accepted",
          description:
            (resp.errors as Record<string, string>)?.server ||
            "An unknown error occurred",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Comment unmarked as accepted",
        description: "This comment is no longer marked as the accepted answer",
      });

      // Update the comments state to reflect the change
      setComments((prevComments) =>
        prevComments.map((comment) => ({
          ...comment,
          is_accepted: comment.id === commentId ? 0 : comment.is_accepted,
        }))
      );
    },
    [postID, toast]
  );

  const submitTopLevelComment = useCallback(
    async (commentBody: string, gif: Gif | null) => {
      const resp = await createComment({
        body: commentBody,
        postID,
        parentID: null,
        level: 0,
        gif,
      });

      if (!resp.success) {
        toast({
          title: "Comment could not be posted",
          description:
            resp.errors!.body ||
            (resp.errors as Record<string, string>)?.server ||
            "An unknown error occurred",
          variant: "destructive",
          action: (
            <Link href="/login">
              <Button variant="outline" className="hover:bg-primary/5">
                Login
              </Button>
            </Link>
          ),
        });
        return;
      }
      toast({
        title: "Comment submitted",
        description: "Your comment has been submitted successfully",
      });
      setComments((prevComments) => [
        ...prevComments,
        resp.data! as ReturnedComment,
      ]);
    },
    [postID, toast]
  );

  return (
    <div className="space-y-4 mb-36 md:mb-10  min-h-[50vh]" id="comments">
      <CommentInput onSubmit={submitTopLevelComment} />
      {commentTree.length > 0 && (
        <SortDropdown
          value={commentSort}
          options={commentSortOptions}
          onValueChange={(value: string) =>
            setCommentSort(value as CommentSortByType)
          }
        />
      )}
      {commentTree.map((comment) => (
        <SingleComment
          key={comment.id}
          comment={comment}
          postID={postID}
          onReply={handleReply}
          replyingTo={replyingTo}
          onSubmitReply={handleSubmitReply}
          onCancelReply={() => setReplyingTo(null)}
          canMarkAsAccepted={canMarkAsAccepted}
          onMarkAsAccepted={handleMarkAsAccepted}
          onUnmarkAsAccepted={handleUnmarkAsAccepted}
        />
      ))}
    </div>
  );
}
