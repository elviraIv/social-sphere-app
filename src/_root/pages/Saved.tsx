import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queries"
import { Models } from "appwrite";

const Saved = () => {
  const { data: currentUser} = useGetCurrentUser();

  const savePosts = currentUser?.save.map((savePost:Models.Document) => (
    {
      ...savePost.post,
      creator:{
        imageUrl: currentUser.imageUrl
      }
    }
  ))
  .reverse()

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl ">
        
         <h2 className="h3-bold md:h2-bold text-left w-full text-primary-500">Saved Posts</h2>
      </div>

      {!currentUser ? (
        <Loader />) : (
          <ul className="w-full flex justify-center max-w-5xl gap-9">

            {savePosts.length === 0 ? (
              <p className="text-light-4">No saved posts</p>
            ) : (
              <GridPostList posts={savePosts} showStats={false}  />
            )}
          </ul>
        
      )}

    </div>
  )
}

export default Saved