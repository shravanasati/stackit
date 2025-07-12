"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Share from "@/components/Posts/Share";
import ReportContent from "@/components/Posts/ReportContent";
import VoteCounter from "@/components/Posts/VoteCounter";
import "@/app/scrollbar.css";
import ReactMarkdown from "react-markdown";
import { getPostSlug, getAgoDuration } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";
import rehypeRaw from "rehype-raw";
import { useEffect, useState } from "react";
import getPost from "@/lib/actions/getPost";
import { Post as PostType } from "@/lib/models";
import NotFound from "@/app/not-found";
import { Unauthorized } from "@/components/Unauthorized";
import { LoadingPost } from "@/components/LoadingPost";
import { MoveLeft, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostData {
  id: string;
  title: string;
  content: string;
  upVotes: number;
  downVotes: number;
  author: string;
  tags: Array<{ id: string; text: string }>;
  timestamp: string;
}

export default function PerPost({ postID }: { postID: string }) {
  const [postData, setPostData] = useState<PostData | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);
  const [error, setError] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const storedPostData = sessionStorage.getItem(postID);
      if (storedPostData) {
        const parsedData: PostType = JSON.parse(storedPostData);
        setPostData({
          id: parsedData.id,
          title: parsedData.title,
          content: parsedData.body,
          upVotes: parsedData.upvotes,
          downVotes: parsedData.downvotes,
          author: parsedData.author!,
          tags: parsedData.tags || [],
          timestamp: parsedData.timestamp,
        });
        setPostSlug(getPostSlug(parsedData.id, parsedData.title));
      } else {
        const fetchedData = await getPost(postID);
        if (fetchedData.status === 200) {
          setPostData({
            id: fetchedData.data!.id,
            title: fetchedData.data!.title,
            content: fetchedData.data!.body,
            upVotes: fetchedData.data!.upvotes,
            downVotes: fetchedData.data!.downvotes,
            author: fetchedData.data!.author!,
            tags: fetchedData.data!.tags || [],
            timestamp: fetchedData.data!.timestamp,
          });
          setPostSlug(
            getPostSlug(fetchedData.data!.id, fetchedData.data!.title)
          );
          sessionStorage.setItem(postID, JSON.stringify(fetchedData.data));
        } else if (fetchedData.status === 404) {
          setIsNotFound(true);
        } else if (fetchedData.status === 403 || fetchedData.status === 401) {
          setIsForbidden(true);
        } else {
          console.error(fetchedData);
          setError("An error occurred while fetching the post");
        }
      }
    };

    fetchData();
  }, [postID]);

  if (isNotFound) {
    return <NotFound />;
  } else if (isForbidden) {
    return <Unauthorized />;
  } else if (error) {
    return <div>{error}</div>;
  }

  if (!postData) {
    return <LoadingPost />;
  }

  return (
    <Card className="w-full flex flex-col border-0  bg-primary/[0.015] rounded-md">
      <CardHeader className="relative space-y-1 md:py-3 md:px-4 px-3 py-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <MoveLeft
              className="size-8 text-primary p-2 rounded-full hover:bg-primary/40 transition-colors duration-200 cursor-pointer"
              onClick={() => {
                router.back();
              }}
            />
            <CardTitle className="text-xl sm:text-2xl font-bold break-words md:max-w-fit max-w-80">
              {postData.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground ml-10">
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>{postData.author}</span>
            </div>
            <span>{getAgoDuration(new Date(postData.timestamp))}</span>
          </div>
          {postData.tags && postData.tags.length > 0 && (
            <div className="flex flex-wrap ml-10">
              {postData.tags.map((tag) => (
                <p
                  key={tag.id}
                  className="text-xs w-max sm:text-sm text-primary mt-2 hover:text-primary/80 transition-colors duration-200 whitespace-nowrap mr-2 bg-primary/10 px-2 py-0.5 rounded-full"
                >
                  {tag.text}
                </p>
              ))}
            </div>
          )}
        </div>
        <ReportContent
          postID={postData.id}
          className="absolute top-6 right-5"
        />
      </CardHeader>
      <CardContent className="333">
        <div className="mb-3 sm:mb-4 h-fit overflow-y-scroll py-6 px-2 stackit-scroll rounded-md bg-primary/[0.025]">
          <ReactMarkdown
            components={{
              a: (props) => <a className="text-primary" {...props} />,
            }}
            rehypePlugins={[rehypeRaw]}
          >
            {DOMPurify.sanitize(postData.content)}
          </ReactMarkdown>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <VoteCounter
            upVotes={postData.upVotes}
            downVotes={postData.downVotes}
            postID={postData.id}
          />
          <Share postLink={postSlug} />
        </div>
      </CardContent>
    </Card>
  );
}
