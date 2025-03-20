import { create } from "zustand";
import { Post, Comment } from "@/types/index";

interface ForumState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  filter: {
    category: string | null;
    tag: string | null;
    sort: "newest" | "popular";
  };

  setFilter: (filter: Partial<ForumState["filter"]>) => void;
  fetchPosts: () => Promise<void>;
  createPost: (postData: Partial<Post>) => Promise<Post>;
  fetchPost: (id: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<Comment>;
  toggleLikePost: (postId: string) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useForumStore = create<ForumState>((set, get) => ({
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  filter: {
    category: null,
    tag: null,
    sort: "newest",
  },

  setFilter: (newFilter) => {
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    }));
    get().fetchPosts();
  },

  fetchPosts: async () => {
    try {
      set({ loading: true, error: null });
      const { filter } = get();

      const queryParams = new URLSearchParams();
      if (filter.category) queryParams.append("category", filter.category);
      if (filter.tag) queryParams.append("tag", filter.tag);
      if (filter.sort) queryParams.append("sort", filter.sort);

      const response = await fetch(
        `${API_URL}/api/forum/v1/posts?${queryParams.toString()}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      console.log(data);
      set({ posts: data.posts, loading: false });
    } catch (error) {
      console.log(error);
      set({ error: error as Error["message"], loading: false });
    }
  },

  fetchPost: async (id: string) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${API_URL}/api/forum/v1/post/${id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }

      const data = await response.json();
      set({ currentPost: data.post, loading: false });
    } catch (error) {
      set({ error: error as Error["message"], loading: false });
    }
  },

  createPost: async (postData) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${API_URL}/api/forum/v1/create-post`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();
      set((state) => ({ posts: [data, ...state.posts], loading: false }));
      return data;
    } catch (error) {
      set({ error: error as Error["message"], loading: false });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addComment: async (postId: string, content: string) => {
    try {
      const response = await fetch(`${API_URL}/api/forum/v1/comment/${postId}`, {
        method: "POST",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newComment = await response.json();
      set((state) => {
        if (state.currentPost && state.currentPost._id === postId) {
          return {
            currentPost: {
              ...state.currentPost,
              comments: [newComment, ...(state.currentPost.comments || [])],
            },
          };
        }
        return state;
      });

      return newComment;
    } catch (error) {
      set({ error: error as Error["message"] });
      throw error;
    }
  },

  toggleLikePost: async (postId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/forum/v1/toggle-like/${postId}`, {
        method: "POST", 
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }

      const data = await response.json();
      const { likes, userLiked } = data;

      set((state) => {
        // Update in posts list
        const updatedPosts = state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: userLiked
                  ? [...post.likes, "current-user"]
                  : post.likes.filter((id) => id !== "current-user"),
              }
            : post
        );

        // Update current post if it's the one being liked
        let updatedCurrentPost = state.currentPost;
        if (state.currentPost && state.currentPost._id === postId) {
          updatedCurrentPost = {
            ...state.currentPost,
            likes: userLiked
              ? [...state.currentPost.likes, "current-user"]
              : state.currentPost.likes.filter((id) => id !== "current-user"),
          };
        }

        return {
          posts: updatedPosts,
          currentPost: updatedCurrentPost,
        };
      });

    } catch (error) {
      set({ error: error as Error["message"] });
    }
  },

}));
