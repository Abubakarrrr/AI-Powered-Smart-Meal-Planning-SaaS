import React, { useState } from "react";
import { useForumStore } from "../../store/forumStore";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { useNavigate } from "react-router";
import { Post } from "@/types";
type PostFormData = Omit<Post, "_id" | "author" | "likes" | "createdAt" | "comments">;


export const CreatePostForm: React.FC = () => {
  const { createPost } = useForumStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    category: "recipe",
    tags: [] as string[],
  });
  const [tag, setTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCategoryChange = (value: "recipe" | "tip" | "question") => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tag.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tag.trim()],
        }));
      }
      setTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsSubmitting(true);
      const newPost = await createPost(formData);
      toast({
        title: "Success",
        description: "Your post has been created successfully.",
      });
    //   router.push(`/forum/post/${newPost._id}`);
    } catch (error) {
        console.log(error)
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Write a descriptive title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your recipe, tip, or question..."
              className="min-h-32"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <RadioGroup
              value={formData.category}
              onValueChange={handleCategoryChange}
            >
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recipe" id="recipe" />
                  <Label htmlFor="recipe">Recipe</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tip" id="tip" />
                  <Label htmlFor="tip">Cooking Tip</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="question" id="question" />
                  <Label htmlFor="question">Question</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags (press Enter to add)"
            />
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((t) => (
                  <div
                    key={t}
                    className="flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md"
                  >
                    <span className="text-sm">{t}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleRemoveTag(t)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/forum")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Post"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
