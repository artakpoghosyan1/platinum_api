"use client";

import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { Car, ServerCar } from "@/models/cars";
import { TableActions } from "@/components/Cars/TableActions";

interface Props {
  cars: ServerCar[];
  setCurrentCarId: Dispatch<SetStateAction<number | null>>;
}

const COLUMNS: { id: string; label: string }[] = [
  { id: "name", label: "Name" },
  { id: "year", label: "Year" },
  { id: "mileage", label: "Mile age" },
  { id: "color", label: "Color" },
  { id: "vinCode", label: "Vin Code" },
  { id: "engine", label: "Engine" },
  { id: "bodyType", label: "Body type" },
  { id: "actions", label: "Actions" },
];

const CarsTable: FC<Props> = ({ cars, setCurrentCarId }) => {
  return (
    <div className="h-full rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="h-full max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {COLUMNS.map((col, index) => (
                <th
                  key={col.id}
                  className={`${index === COLUMNS.length - 1 && "flex justify-end"} p-4 font-medium text-black dark:text-white`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                {COLUMNS.map((col, index) => (
                  <td
                    key={`${col.id}-${index}`}
                    className="border-b border-[#eee] p-4 dark:border-strokedark"
                  >
                    {col.id !== "images" && (
                      <>
                        {col.id === "name" && `${car.make} ${car.model}`}

                        {index === 0 && car.images && (
                          <img
                            src={car.images[0].url}
                            alt={car.images[0].filename}
                            className="mt-3 max-w-14"
                          />
                        )}

                        {car[col.id as keyof Car] as ReactNode}

                        {col.id === "actions" && (
                          <TableActions
                            id={car.id!}
                            setCurrentCarId={setCurrentCarId}
                          />
                        )}
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarsTable;
