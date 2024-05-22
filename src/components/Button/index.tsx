import clsx from "clsx";
import React, { FC } from "react";

type Props = {
  children: React.ReactNode;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<Props> = ({
  children,
  loading,
  className,
  disabled,
  onClick,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        loading && "flex justify-center",
        disabled &&
          "bg-primary-white hover:bg-primary-white hover:cursor-not-allowed",
        className
      )}
      onClick={(e) => {
        if (!disabled && !loading) {
          onClick && onClick(e);
        }
      }}
    >
      {loading ? (
        <div
          className="circular-progress"
          style={{
            border: "3px solid white",
            width: "24px",
            height: "24px",
          }}
        />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
