'use server'
// import { TagList } from "../boards"
import { z } from "zod"
import { getAuthUser } from "@/lib/user"
import { savePost } from "@/lib/firebase/posts"
import { getPostSlug } from "@/lib/utils"


const createPostSchema = z.strictObject({
  title: z.string().min(1, "Title cannot be empty").max(100, "Title is too long. It must be within 100 characters"),
  body: z.string().min(1, "Post cannot be empty").max(4000, "Post is too long. It must be within 4000 characters"),
  tags: z.array(
    z.object({
      id: z.string(),
      text: z.string().min(1, "Tag text cannot be empty").max(30, "Tag is too long")
    })
  ).min(1, "At least one tag is required")
});

export async function createPost(values: z.infer<typeof createPostSchema>) {
  const user = await getAuthUser()
  if (!user) {
    return { success: false, errors: { server: "You must be logged in to create a post" } }
  }

  const result = createPostSchema.safeParse(values)
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors }
  }

  try {
    const data = result.data
    // if (data.board === "Development".toLowerCase() && user.role !== "admin") {
    //   return { success: false, errors: { server: "You do not have permission to post in this board" } }
    // }
    const postID = await savePost(user.token!, data.title, data.body, data.tags)
    return { success: true, slug: getPostSlug(postID, data.title) }
  } catch (error) {
    console.error(error)
    return { success: false, errors: { server: "An error occurred. Please try again later." } }
  }

}