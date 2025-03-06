import type React from "react";
import { useState, useRef, type ChangeEvent } from "react";
import { X, Upload, Loader2 } from "lucide-react";
type ImageUploaderProps = {
  maxImages?: number;
  onImagesChange?: (images: string[]) => void;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
};
const BASE_URL = import.meta.env.VITE_API_URL;

const ImageUploader: React.FC<ImageUploaderProps> = ({
  maxImages = 5,
  onImagesChange,
  images,
  setImages,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cloudName = "dpw7usnrg";
  const uploadPreset = "saas-meal";

  const getCloudinaryPublicId = (url: string): string | null => {
    if (!url) return null;

    const parts = url.split("/");
    const filename = parts.pop(); // Get last part (image_name.jpg)

    if (!filename) return null;

    const nameWithoutExtension = filename.split(".")[0]; // Remove ".jpg" or ".png"
    return nameWithoutExtension;
  };
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the maximum
    if (images.length + files.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images`);
      return;
    }

    setIsUploading(true);
    setError(null);

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Update progress for UI feedback
      setUploadProgress(Math.round((i / files.length) * 50));

      try {
        // Upload to Cloudinary
        const imageData = await uploadToCloudinary(file);
        setImages((prevImages) => [...prevImages, imageData.secure_url]);
        // Update progress
        setUploadProgress(Math.round((i / files.length) * 100));
      } catch (err) {
        setError("Failed to upload image. Please try again.");
        console.error("Upload error:", err);
        break;
      }
    }

    setIsUploading(false);
    setUploadProgress(0);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Notify parent component if callback provided
    if (onImagesChange) {
      onImagesChange(images);
    }
  };

  const handleRemoveImage = async (imageToRemove: string) => {
    try {
      const imageId = getCloudinaryPublicId(imageToRemove);
      if (!imageId) return;
      const publicId = `saas-meal/${imageId}`;
      try {
        console.log(publicId);
        const response = await fetch(`${BASE_URL}/api/meal/v1/delete-image`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        });
        const responseData = await response.json();
        console.log(responseData);
      } catch (error) {
        console.log(error);
      }

        const updatedImages = images.filter((img) => img !== imageToRemove);
        setImages(updatedImages);

      //   if (onImagesChange) {
      //     onImagesChange(updatedImages);
      //   }
    } catch (err) {
      setError("Failed to remove image. Please try again.");
      console.error("Delete error:", err);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
        handleFileSelect({
          target: { files: e.dataTransfer.files },
        } as ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to upload image to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload to Cloudinary");
    }

    return await response.json();
  };


  return (
    <div className="w-full space-y-4">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8
          ${
            isUploading
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary dark:border-gray-700 dark:hover:border-primary"
          }
          transition-colors duration-200 ease-in-out
          flex flex-col items-center justify-center cursor-pointer
          min-h-[200px]
        `}
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDrop={handleDrop} 
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Uploading... {uploadProgress}%
            </div>
            <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-10 w-10 text-gray-400 dark:text-gray-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Drag and drop your meal images here
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              or click to browse (max {maxImages} images)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-500 dark:text-red-400 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Uploaded Images ({images.length}/{maxImages})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
              <div
                key={image}
                className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800"
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt="Meal"
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(image);
                  }}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4 " />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
