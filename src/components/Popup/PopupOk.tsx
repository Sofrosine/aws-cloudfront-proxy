"use client";

import Image from "next/image";
import { FC } from "react";

interface Props {
  title: string;
  description: string;
  imageSrc?: string;
  onClose: () => void;
}

const PopupOk: FC<Props> = ({ title, description, imageSrc, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-md text-center flex flex-col items-center  border-2 border-primary-white">
        <Image
          src={imageSrc || "/icons/IcEnvelopeCircle.svg"}
          alt=""
          height={64}
          width={64}
        />
        <p className="text-center font-bold text-subtitle-3 text-primary mb-2 mt-4">
          {title}
        </p>
        <p className="mb-8 text-center text-body-1 text-grey">{description}</p>
        <button className="w-1/2 py-2" onClick={() => onClose && onClose()}>
          Ok
        </button>
      </div>
    </div>
  );
};

PopupOk.defaultProps = {
  imageSrc: "/icons/IcEnvelopeCircle.svg",
};

export default PopupOk;
