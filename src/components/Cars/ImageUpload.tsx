import React, { ChangeEvent, useEffect, useState } from "react";
import { useDeleteImage } from "@/services/carsApi";
import Image from "next/image";

interface ImageUploadProps {
  images: File[];
  setFieldValue: (field: string, value: any) => any;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, setFieldValue }) => {
  const [previewImages, setPreviewImages] = useState<
    { url: string; id?: number }[]
  >([]);
  const deleteImageMutation = useDeleteImage();

  useEffect(() => {
    const updatedPreviews = images.map((file) => ({
      url: URL.createObjectURL(file),
      id: (file as any)["id"],
    }));
    setPreviewImages(updatedPreviews);
    setFieldValue("images", images);
  }, [images, setPreviewImages, setFieldValue]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Update preview images
    const updatedPreviews = selectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
    }));

    setPreviewImages([...previewImages, ...updatedPreviews]);
    setFieldValue("images", [...images, ...selectedFiles]);
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

    // @ts-ignore
    setFieldValue(
      "images",
      images.filter((_, i) => i !== index),
    );
    setPreviewImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col">
      <input
        type="file"
        name="images"
        multiple
        accept="image/*"
        className="file-input mb-6 w-full max-w-xs"
        onChange={handleImageChange}
      />

      <div className="flex space-x-4">
        {previewImages.map(({ url, id }, index) => (
          <div className="relative" key={url}>
            <Image
              width="64"
              height="64"
              src={url}
              alt="Preview"
              className="h-16 w-16 object-cover"
            />
            <button
              className="dark:bg-gray-800 border-gray-800 absolute -right-3 -top-3 rounded-full border bg-white p-1"
              onClick={(e) => handleDeleteImage(e, index, id)}
            >
              <svg
                className="text-gray-800 dark:text-white"
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
