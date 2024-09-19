"use client";

import { FC } from "react";

export const ModalButton: FC = () => {
  return (
    <button
      className="mb-6 inline-flex items-center justify-center rounded-md bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
      onClick={() =>
        (
          document.getElementById("my_modal_1") as HTMLDialogElement
        )?.showModal()
      }
    >
      Add new car
    </button>
  );
};
