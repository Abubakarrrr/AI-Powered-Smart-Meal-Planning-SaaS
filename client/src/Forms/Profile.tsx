import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { X } from "lucide-react";
import dummy from "@/assets/dummy.jpg";
const BASE_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { toast } = useToast();
  const { user, setAvatar } = useAuthStore();
  const [uploading, setUploading] = useState(false);

  const getCloudinaryPublicId = (url: string): string | null => {
    if (!url) return null;

    const parts = url.split("/");
    const filename = parts.pop(); // Get last part (image_name.jpg)

    if (!filename) return null;

    const nameWithoutExtension = filename.split(".")[0]; // Remove ".jpg" or ".png"
    return nameWithoutExtension;
  };

  //   const fileInputRef = useRef<HTMLInputElement | null>(null);
  //   const handleChooseFile = () => {
  //     fileInputRef.current?.click();
  //   };

  // Upload image on "Edit Profile" click

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please choose an image first.",
      });
      return;
    }

    try {
      setUploading(true);

      // Prepare data for Cloudinary
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "saas-meal");
      data.append("cloud_name", "dpw7usnrg");

      // Upload to Cloudinary
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dpw7usnrg/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const uploadedImage = await res.json();
      console.log(uploadedImage.secure_url);

      if (uploadedImage.secure_url) {
        // Call backend API to store Cloudinary URL in the user model
        const response = await fetch(`${BASE_URL}/api/auth/upload-avatar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?._id,
            avatar: uploadedImage.secure_url,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          // Update user avatar state
          const user = data.user;
          setAvatar(user);
          toast({
            title: "Profile updated!",
            description: "Your profile picture has been updated.",
          });
        } else {
          toast({
            title: "Error",
            description: data.error || "Something went wrong",
          });
        }
      }

      //   setSelectedFile(null);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Something went wrong. Try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!user?.avatar) return;
    const publicId = getCloudinaryPublicId(user.avatar);
    if (!publicId) {
      toast({ title: "Error", description: "Invalid image URL" });
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/auth/delete-avatar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?._id, publicId }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(data.user);
        setAvatar(data.user);
        toast({ title: "Image removed successfully" });
      } else {
        toast({ title: "Error", description: data.error });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove image" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg p-6">
        <CardContent className="flex flex-col items-center gap-4">
          {/* User Avatar */}
          <div className="relative">
            {uploading ? (
              <Skeleton className="w-24 h-24 rounded-full" />
            ) : (
              <>
                <img
                  src={user?.avatar || dummy}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
                />
                {/* Cross Button for Removing Image */}
                {user?.avatar && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-red-500 hover:text-white"
                  >
                    <X className="w-4 h-4" /> {/* Cross icon */}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Upload Button */}
          <Label
            className="text-sm font-medium text-gray-700"
            // onClick={handleChooseFile}
          >
            {user?.avatar ? "" : "Upload Picture"}
          </Label>

          {!user?.avatar && (
            <Input
              // ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="w-full"
            />
          )}

          {/* User Info */}
          <div className="w-full mt-4">
            <Label>Name</Label>
            <Input
              type="text"
              value={user?.name}
              disabled
              className="bg-gray-100"
            />
          </div>

          <div className="w-full mt-4">
            <Label>Email</Label>
            <Input
              type="email"
              value={user?.email}
              disabled
              className="bg-gray-100"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          {/* <Button
            variant="outline"
            onClick={handleEditProfile}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Update Profile"} */}
          {/* </Button> */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
