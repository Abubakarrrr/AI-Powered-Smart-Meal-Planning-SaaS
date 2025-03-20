import React, { useEffect } from "react";
import { useForumStore } from "../../store/forumStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router";

export const PostDetail: React.FC = () => {
  const { id }= useParams();
  const { currentPost, loading, error, fetchPost, addComment, toggleLikePost } =
    useForumStore();
  const [comment, setComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id, fetchPost]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!id) return;
    if (!comment.trim()) return;
    try {
      setIsSubmitting(true);
      await addComment(id, comment);
      setComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !currentPost) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!currentPost) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Post not found</p>
          <Button onClick={() => navigate("/forum")} className="mt-4">
            Back to Forum
          </Button>
        </CardContent>
      </Card>
    );
  }

   console.log(currentPost)
  return (
  
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/forum")}
        className="flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Forum
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={currentPost.author?.avatar}
                  alt={currentPost.author?.name}
                />
                <AvatarFallback>
                  {currentPost.author?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{currentPost.author?.name}</p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(currentPost?.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <Badge>{currentPost.category}</Badge>
          </div>
          <CardTitle className="text-2xl mt-2">{currentPost.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p>{currentPost?.content}</p>
          </div>
          <div className="flex flex-wrap gap-1 mt-4">
            {currentPost?.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => toggleLikePost(currentPost._id)}
            >
              <Heart
                className={`h-4 w-4 ${
                  currentPost.likes.includes("current-user")
                    ? "fill-red-500 text-red-500"
                    : ""
                }`}
              />
              <span>{currentPost?.likes?.length}</span>
            </Button>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{currentPost.comments?.length || 0}</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add a Comment</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmitComment}>
          <CardContent>
            <Textarea
              placeholder="Share your thoughts..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-24"
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !comment.trim()}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {currentPost.comments && currentPost.comments.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Comments ({currentPost.comments.length})
          </h3>
          <Separator />
          {currentPost.comments.map((comment) => (
            <Card key={comment._id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={comment.author.avatar}
                      alt={comment.author.name}
                    />
                    <AvatarFallback>
                      {comment.author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{comment.author.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>{comment.content}</p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Heart className="h-4 w-4" />
                  <span>{comment.likes.length}</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
