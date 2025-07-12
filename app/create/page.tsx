import { Dock } from "@/components/Dock";
import { PostCreator } from "@/components/PostCreator";
import { Unauthorized } from "@/components/Unauthorized";
import { getAllUsers } from "@/lib/database/firestore";
import { getAuthUser } from "@/lib/user";

export const metadata = {
  title: "Create Post",
  description: "Create a post on stackit",
};

export default async function CreatePost() {
  const user = await getAuthUser();

  if (!user) {
    return <Unauthorized />;
  }
  const usernames = await getAllUsers();
  return (
    <>
      <PostCreator role={user.role ?? "user"} usernames={usernames} /> <Dock />
    </>
  );
}
