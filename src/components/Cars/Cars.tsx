import CarsTable from "@/components/Cars/CarsTable";
import { Modal } from "@/components/Modal/Modal";
import EditForm from "@/components/Cars/Form";
import { ModalButton } from "@/components/Cars/ModalButton";
import prisma from "@/lib/prisma";

const Cars = async () => {
  const cars = await prisma.cars.findMany();

  const formattedCars = cars.map((car) => ({
    ...car,
    price: car.price.toNumber(), // Convert Decimal to number
  }));

  return (
    <>
      <ModalButton />

      <Modal>
        <EditForm car={null} />
      </Modal>

      <CarsTable initialCars={formattedCars} />
    </>
  );
};

export default Cars;
