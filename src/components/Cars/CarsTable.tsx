"use client";

import { FC, ReactNode } from "react";
import { Car } from "@/models/cars";
import { useGetCars } from "@/services/carsApi";

interface Props {
  initialCars: Car[];
}

const COLUMNS: { id: string; label: string }[] = [
  { id: "make", label: "Make" },
  { id: "model", label: "Model" },
  { id: "year", label: "Year" },
  { id: "mileAge", label: "MileAge" },
  { id: "color", label: "Color" },
  { id: "vinCode", label: "Vin Code" },
  { id: "engine", label: "Engine" },
  { id: "bodyType", label: "Body type" },
  { id: "actions", label: "Actions" },
];

const CarsTable: FC<Props> = ({ initialCars }) => {
  const { data: cars, isLoading, isError } = useGetCars(initialCars);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading cars</div>;

  return (
    <div className="h-full rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="h-full max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {COLUMNS.map((col, index) => (
                <th
                  key={col.id}
                  className={`${index === COLUMNS.length - 1 && "flex justify-end"} px-4 py-4 font-medium text-black dark:text-white xl:pl-11`}
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
                    className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"
                  >
                    {col.id !== "images" && (
                      <>
                        {index === 0 && car.images && (
                          <img
                            src={car.images[0].url}
                            alt={car.images[0].filename}
                            className="max-w-14"
                          />
                        )}
                        {car[col.id as keyof Car] as ReactNode}
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
