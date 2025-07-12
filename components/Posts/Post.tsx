import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import VoteCounter from "@/components/Posts/VoteCounter";
import CommentCount from "@/components/Posts/CommentCount";
import Share from "@/components/Posts/Share";
import ReportContent from "@/components/Posts/ReportContent";
import Link from "next/link";
import { Post as PostType } from "@/lib/models";
import ReactMarkdown from "react-markdown";
import DOMPurify from "isomorphic-dompurify";
import rehypeRaw from "rehype-raw";
import { getPostSlug, getAgoDuration } from "@/lib/utils";
import { User } from "lucide-react";

export function trimBodyContent(content: string) {
  if (content.length > 50) {
    return content.substring(0, 50) + "...";
  }
  return content;
}

export default function Post({
  id,
  title,
  body,
  upvotes,
  downvotes,
  comment_count,
  author,
  tags,
  timestamp,
}: PostType) {
  const postSlug = getPostSlug(id, title);
  return (
    <Card className="relative w-full min-h-[12rem] my-2 rounded-md bg-primary/[0.015] border-none py-2">
      <Link href={`/post/${postSlug}`} className="absolute z-0 w-full h-full" />
      <CardHeader className="p-3 sm:p-4 relative w-full">
        <ReportContent postID={id} className="top-4 right-4" />
        <div className="flex flex-col w-max space-y-2 ">
          <Link
            href={`/post/${postSlug}`}
            className="md:max-w-96 max-w-72 text-base sm:text-lg md:text-xl font-bold line-clamp-1 flex-grow hover:underline"
          >
            {title}
          </Link>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{author}</span>
            </div>
            <span>{getAgoDuration(new Date(timestamp))}</span>
          </div>
          {tags && (
            <div className="flex flex-wrap">
              {tags.map((tag) => (
                <p
                  key={tag.id}
                  // href={`/board/${tag.text}`}
                  className="text-xs w-max sm:text-sm text-primary mt-2 hover:text-primary/80 transition-colors duration-200 whitespace-nowrap mr-2 bg-primary/10 px-2 py-0.5 rounded-full"
                >
                  {tag.text}
                </p>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 text-sm">
        <ReactMarkdown
          className="line-clamp-3 sm:line-clamp-4"
          components={{
            a: (props) => (
              <a className="text-primary hover:underline" {...props} />
            ),
          }}
          rehypePlugins={[rehypeRaw]}
        >
          {DOMPurify.sanitize(trimBodyContent(body))}
        </ReactMarkdown>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 flex flex-wrap items-center justify-start gap-2 sm:gap-3">
        <div className="w-full h-max flex flex-row items-center justify-between gap-2 sm:gap-3">
          <div className="flex-1 flex items-center justify-start gap-4 relative z-10">
            <VoteCounter upVotes={upvotes} downVotes={downvotes} postID={id} />
            <CommentCount noOfComments={comment_count} postSlug={postSlug} />
          </div>
          <div className="w-max h-max relative z-10">
            <Share postLink={postSlug} />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
