"use client";

import { useErrorStore } from "@/store/errorStore";
import Image from "next/image";
import { FC } from "react";

interface Props {}

const PopupError: FC<Props> = ({}) => {
  const errorStore = useErrorStore();

  return errorStore?.message ? (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-md text-center flex flex-col items-center border border-error min-w-[20vw]">
        <Image src={"/icons/IcRemoveRed.svg"} alt="" height={64} width={64} />
        <p className="text-center font-bold text-subtitle-3 text-error mb-8 mt-4">
          {errorStore?.message}
        </p>
        <button
          className="w-1/2 py-2 bg-error hover:bg-error"
          onClick={() => {
            errorStore?.setMessage("");
          }}
        >
          Ok
        </button>
      </div>
    </div>
  ) : (
    <div />
  );
};

PopupError.defaultProps = {};

export default PopupError;
