import { ServerCar } from "@/models/cars";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function getCars(): Promise<ServerCar[]> {
  const res = await fetch("/cars");
  if (!res.ok) {
    throw new Error("Failed to fetch cars");
  }
  return res.json();
}

async function addCar(formData: FormData): Promise<any> {
  const response = await fetch("/cars", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to add car");
  }

  return response.json();
}

const deleteImage = async (imageId: number) => {
  const response = await fetch(`/cars/${imageId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete image");
  }

  return response.json();
};

export const useGetCars = () => {
  return useQuery({
    queryKey: ["cars"],
    queryFn: getCars,
  });
};

const updateCar = async (id: number, formData: FormData) => {
  const response = await fetch(`/cars/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update car");
  }

  return response.json();
};

export const useAddCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCar,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cars"],
      });
    },
  });
};

export const useEditCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateCar(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cars"],
      });
    },
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cars"],
      });
    },
    onError: (error) => {
      console.error("Error deleting image:", error);
    },
  });
};
