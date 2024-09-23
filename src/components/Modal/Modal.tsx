"use client";

import { FC, ReactNode, RefObject, useEffect, useRef } from "react";

interface Props {
  children: ReactNode;
  onClose: () => void;
}

export const Modal: FC<Props> = ({ children, onClose }) => {
  const modalRef: RefObject<HTMLDialogElement> = useRef(null);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && modalRef.current?.open) {
        modalRef.current.close();
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  return (
    <dialog id="my_modal_1" className="modal" ref={modalRef}>
      <div className="modal-box relative w-11/12 max-w-5xl">
        <button className="absolute right-5 top-5" onClick={onClose}>
          <svg
            className="text-gray-800 h-6 w-6 dark:text-white"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
        {children}
      </div>
    </dialog>
  );
};
