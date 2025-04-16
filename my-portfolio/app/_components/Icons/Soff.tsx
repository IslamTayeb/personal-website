import React, { ComponentPropsWithoutRef } from "react";

export const Soff = (
  props: ComponentPropsWithoutRef<"svg"> & { size?: number, height?: number, width?: number }
) => {
  return (
    <svg
      height={props.height}
      width={props.width}
      {...props}
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 600"
      fill="currentColor"
      style={{ display: "inline" }}
      className="scale-[1.5] p-0.5"
    >
      <path d="M501,179c-7.47,18.92-14.3,38.36-22.53,56.97-13.32,30.09-34.88,53.03-67.84,61.16-39.64,9.78-82.38-12.94-104.8,33.2l-36.83,91.67H100c15.08-34.44,23.04-76.34,54.08-100.42,14.39-11.16,34.18-19.22,52.43-20.57,35.42-2.62,68.25,9.79,87.98-29.02l37.51-92.99h169Z" />
    </svg>
  );
};
