import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function ImageToRecipe() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Image Selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show image preview
    }
  };

  // Handle API Call
  const handleUpload = async () => {
    if (!image) {
      // Trigger file input if no image selected
      fileInputRef.current?.click();
      return;
    }
  
    setLoading(true);
    setResponse(null); // Reset response
  
    const formData = new FormData();
    formData.append("image", image);
  
    try {
      console.log("Uploading image...");
      
      const res = await fetch("http://127.0.0.1:8000/generate-recipe", {
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) throw new Error(`Server Error: ${res.status}`);
  
      const data = await res.json();
      console.log("API Response:", data);
      
      setResponse(data);
    } catch (error) {
      console.error("Error:", error);
      setResponse("❌ Error fetching recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Button click handler
  const handleButtonClick = () => {
    if (!image) {
      fileInputRef.current?.click();
    } else {
      handleUpload();
    }
  };

  // Remove image handler
  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h1 className="text-2xl font-bold text-center mb-4">🍽️ Image to Recipe</h1>

      {/* Hidden File Input */}
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageChange} 
        className="hidden" 
        ref={fileInputRef}
      />

      {/* Image Preview */}
      {preview && (
        <div className="mb-4 relative">
          <img src={preview} alt="Preview" className="h-80 w-full object-cover rounded-md shadow" />
          <button 
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleButtonClick}
        className="w-full bg-[rgb(251,113,22)] text-white py-2 px-4 rounded-md "
        disabled={loading}
      >
        {loading ? "⏳ Generating Recipe..." : image ? "📤 Upload & Get Recipe" : "📷 Select Image"}
      </button>

      {/* Markdown Response */}
      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}