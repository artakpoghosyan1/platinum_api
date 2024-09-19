"use client";

import { FC, ReactNode, RefObject, useRef } from "react";

interface Props {
  children: ReactNode;
}

export const Modal: FC<Props> = ({ children }) => {
  const modalRef: RefObject<HTMLDialogElement> = useRef(null);

  return (
    <dialog id="my_modal_1" className="modal" ref={modalRef}>
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="text-lg font-bold">Hello!</h3>

        {children}
      </div>
    </dialog>
  );
};
