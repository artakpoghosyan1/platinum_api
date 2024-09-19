import React, { useState } from "react";

interface ImageUploadProps {
  images: File[];
  setImages: (images: File[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, setImages }) => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Update preview images
    const updatedPreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file),
    );

    setPreviewImages([...previewImages, ...updatedPreviews]);
    setImages([...images, ...selectedFiles]);
  };

  return (
    <div className="flex flex-col space-y-2">
      <input
        type="file"
        multiple
        accept="image/*"
        className="file-input w-full max-w-xs"
        onChange={handleImageChange}
      />
      <div className="flex space-x-2">
        {previewImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Preview"
            className="h-16 w-16 object-cover"
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
