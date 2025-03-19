import React, { useEffect } from "react";
import { useForumStore } from "../../store/forumStore";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

export const PostsList: React.FC = () => {
  const { posts, loading, error, filter, setFilter, fetchPosts } =
    useForumStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={fetchPosts} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No posts found</p>
          <Link to="/forum/new">
            <Button className="mt-4">Create First Post</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Community Forum</h1>
        <Select
          value={filter.sort}
          onValueChange={(value) =>
            setFilter({ sort: value as "newest" | "popular" })
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {posts &&
          posts?.map((post) => (
            <Card key={post._id}>
              <CardHeader>
                <div className="flex justify-between">
                  <Link to={`/forum/post/${post._id}`}>
                    <CardTitle className="text-lg cursor-pointer hover:text-blue-600">
                      {post.title}
                    </CardTitle>
                  </Link>
                  <Badge>{post.category}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={post.author.avatar}
                      // alt={post.author.name}
                    />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{post.author.name}</span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{post.content}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => setFilter({ tag })}
                    >
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
                    //   onClick={() => toggleLikePost(post._id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        post.likes.includes("current-user")
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                    <span>{post.likes.length}</span>
                  </Button>
                  <Link to={`/forum/post/${post._id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments?.length || 0}</span>
                    </Button>
                  </Link>
                  <Link to={`/forum/post/${post._id}`}>
                    <Button variant="ghost" size="sm">
                      Read More
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
};
