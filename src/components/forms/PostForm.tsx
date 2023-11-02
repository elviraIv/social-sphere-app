import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { useToast } from "@/components/ui/use-toast"

import { Input } from "../ui/input";
import { PostValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

type PostFormProps = {
    post?: Models.Document,
}

const PostForm = ({ post }: PostFormProps) => {
    const {mutateAsync: createPost, isPending: isLoadingCreate} = useCreatePost();
    const { toast } = useToast();
    const { user } = useUserContext();
    const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
        caption: post? post?.caption : "",
        file: [],
        location: post ? post?.location : "",
        tags: post? post.tags.join(',') : "",

    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    const newPost = await createPost({
        ...values,
        userId: user.id,
    })

    if(!newPost){
        toast({
            title:'Please try again...'
        })
    }

    navigate('/');
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  placeholder="Add your caption here..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader 
                fieldChange={field.onChange}
                mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" 
                className="shad-input"
                placeholder="Add your location here..."
                {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags (separated by comma " , ")</FormLabel>
              <FormControl>
                <Input type="text" 
                className="shad-input"
                placeholder="Design, Software, Games..."
                {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">

        <Button type="button" className="shad-button_dark_4">Cancel</Button>
        <Button type="submit" className="shad-button_primary whitespace-nowrap">Submit</Button>

        </div>
      </form>
    </Form>
  );
};

export default PostForm;
