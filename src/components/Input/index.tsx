"use client";

import clsx from "clsx";
import { FC } from "react";

import { Controller, UseFormSetValue, useFormContext } from "react-hook-form";

type Props = {
  label?: string; // The label text for the input field
  icon?: React.ReactNode; // The icon element to display
  iconRight?: React.ReactNode; // The icon element to display
  containerClassName?: string;
  name: string;
  setValue?: UseFormSetValue<any>;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input: FC<Props> = ({
  label,
  icon,
  iconRight,
  name,
  disabled,
  containerClassName,
  className,
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name] ? errors[name]?.message : "";

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <div
            className={clsx(
              "flex flex-col space-y-0.5 text-black-text",
              containerClassName
            )}
          >
            <label htmlFor={name} className="text-body-2 font-medium">
              {label}
            </label>
            <div className="flex relative items-center">
              {icon && (
                <span className="absolute left-1 z-50 bottom-1">{icon}</span>
              )}
              {iconRight && (
                <span className="absolute right-1 z-50 bottom-1">
                  {iconRight}
                </span>
              )}
              <input
                {...props}
                {...field}
                disabled={disabled}
                value={field?.value}
                onChange={(e) => {
                  field.onChange(e);
                  // Add customize onchange here
                }}
                className={clsx(
                  "flex-1 text-body-1",
                  icon && "pl-9",
                  disabled && "text-grey-2",
                  className
                )}
              />
            </div>
            {error && (
              <div className="text-body-2 text-error">{error.toString()}</div>
            )}
          </div>
        );
      }}
    ></Controller>
  );
};

export default Input;
