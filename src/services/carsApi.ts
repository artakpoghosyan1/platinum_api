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
  const response = await fetch(`/images/${imageId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete image");
  }

  return response.json();
};

const deleteCar = async (carId: number) => {
  const response = await fetch(`/cars/${carId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete car");
  }

  return response.json();
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

const addAboutData = async (data: { about: string; phoneNumber: string }) => {
  try {
    const response = await fetch("/about/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("About Us content saved successfully");
    } else {
      console.error("Failed to save content");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

async function getAboutData(): Promise<any> {
  const res = await fetch("/about/api");

  if (!res.ok) {
    throw new Error("Failed to fetch about data");
  }

  return res.json();
}

/********* hooks *********/

export const useGetCars = () => {
  return useQuery({
    queryKey: ["cars"],
    queryFn: getCars,
  });
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

export const useDeleteCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cars"],
      });
    },
    onError: (error) => {
      console.error("Error deleting car:", error);
    },
  });
};

export const useAboutData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAboutData,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["about"],
      });
    },
  });
};

export const useGetAboutData = () => {
  return useQuery({
    queryKey: ["about"],
    queryFn: getAboutData,
  });
};
