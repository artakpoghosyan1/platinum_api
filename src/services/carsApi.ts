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
