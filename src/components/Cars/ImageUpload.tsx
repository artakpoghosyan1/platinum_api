import React, { ChangeEvent, useEffect, useState } from "react";
import { useDeleteImage } from "@/services/carsApi";

interface ImageUploadProps {
  images: File[];
  setImages: (images: File[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, setImages }) => {
  const [previewImages, setPreviewImages] = useState<
    { url: string; id?: number }[]
  >([]);
  console.log("images", images);
  console.log("previewImages", previewImages);
  const deleteImageMutation = useDeleteImage();

  useEffect(() => {
    const updatedPreviews = images.map((file) => ({
      url: URL.createObjectURL(file),
      id: (file as any)["id"],
    }));
    setPreviewImages(updatedPreviews);
    setImages(images);
  }, [images]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Update preview images
    const updatedPreviews = selectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
    }));

    setPreviewImages([...previewImages, ...updatedPreviews]);
    setImages([...images, ...selectedFiles]);
  };

  const handleDeleteImage = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
    imageId?: number,
  ) => {
    e.preventDefault();

    if (imageId) {
      deleteImageMutation.mutate(imageId, {
        onError: (error) => {
          console.error("Failed to delete image:", error);
        },
      });
    }

    const handleFilter = (prevImages: any[]) => {
      return prevImages.filter((_, i) => i !== index);
    };

    // @ts-ignore
    setImages(handleFilter);
    setPreviewImages(handleFilter);
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
        {previewImages.map(({ url, id }, index) => (
          <>
            <img
              key={index}
              src={url}
              alt="Preview"
              className="h-16 w-16 object-cover"
            />
            <button
              className="delete-button"
              onClick={(e) => handleDeleteImage(e, index, id)}
            >
              🗑
            </button>
          </>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
