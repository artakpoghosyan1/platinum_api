"use client";

import CarsTable from "@/components/Cars/CarsTable";
import { Modal } from "@/components/Modal/Modal";
import EditForm from "@/components/Cars/Form";
import { Car, ServerCar } from "@/models/cars";
import { FC, useCallback, useEffect, useState } from "react";
import { useGetCars } from "@/services/carsApi";

const Cars: FC = () => {
  const [currentCarId, setCurrentCarId] = useState<number | null>(null);
  const [editableCar, setEditableCar] = useState<Car | null>(null);

  const { data: cars, isLoading, isError } = useGetCars();

  const openModal = useCallback(() => {
    (document.getElementById("my_modal_1") as HTMLDialogElement)?.showModal();
  }, []);

  const closeModal = useCallback(() => {
    setEditableCar(null);
    setCurrentCarId(null);
    (document.getElementById("my_modal_1") as HTMLDialogElement)?.close();
  }, []);

  useEffect(() => {
    const fetchImages = async (car: ServerCar) => {
      const files = await Promise.all(
        car.images.map(async ({ url, id }) => {
          const response = await fetch(url);
          const blob = await response.blob();
          const file = new File([blob], url.split("/").pop() || "image.jpg", {
            type: blob.type,
          });
          (file as any).id = id; // Attach the id to the file object
          return file;
        }),
      );
      return { ...car, images: files };
    };

    if (currentCarId) {
      const currentCar = cars?.find((car) => car.id === currentCarId) ?? null;
      if (currentCar) {
        fetchImages(currentCar).then((carData) => {
          setEditableCar(carData);
        });

        openModal();
      }
    } else {
      setEditableCar(null);
    }
  }, [currentCarId, cars, setEditableCar, openModal]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading cars</div>;

  return (
    <>
      <button
        className="mb-6 inline-flex items-center justify-center rounded-md bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        onClick={openModal}
      >
        Add new car
      </button>

      <Modal onClose={closeModal}>
        <EditForm car={editableCar} onCloseModal={closeModal} />
      </Modal>

      <CarsTable cars={cars as ServerCar[]} setCurrentCarId={setCurrentCarId} />
    </>
  );
};

export default Cars;
