"use client";

import Image from "next/image";
import { FC } from "react";
import Button from "../Button";

interface Props {
  title: string;
  description: string;
  imageSrc?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PopupConfirmation: FC<Props> = ({
  title,
  description,
  imageSrc,
  loading,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="min-w-[25vw] bg-white p-8 rounded-md text-center flex flex-col items-center  border-2 border-primary-white">
        <Image
          src={imageSrc || "/icons/IcFileGreenCircle.svg"}
          alt=""
          height={64}
          width={64}
        />
        <p className="text-center font-bold text-subtitle-3 text-primary mb-2 mt-4">
          {title}
        </p>
        <p className="mb-8 text-center text-body-1 text-grey">{description}</p>
        {!loading ? (
          <div className="flex items-center w-full justify-between gap-8">
            <Button
              className="w-1/2 py-2 text-primary bg-white hover:bg-transparent"
              onClick={() => onClose && onClose()}
            >
              Cancel
            </Button>
            <Button
              className="w-1/2 py-2"
              onClick={() => onConfirm && onConfirm()}
            >
              Ok
            </Button>
          </div>
        ) : (
          <div>
            <div className="circular-progress" />
          </div>
        )}
      </div>
    </div>
  );
};

PopupConfirmation.defaultProps = {
  imageSrc: "/icons/IcFileGreenCircle.svg",
};

export default PopupConfirmation;
