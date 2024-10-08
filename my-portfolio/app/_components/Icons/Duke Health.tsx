import React, { ComponentPropsWithoutRef } from "react";

export const DukeHealth = (
  props: ComponentPropsWithoutRef<"svg"> & { size?: number }
) => {
  return (
    <svg
      height={props.size}
      {...props}
      viewBox="3 4 25 25"
      fill="currentColor"
      style={{ display: "inline" }} // Added inline style for display
    >
      <g xmlns="http://www.w3.org/2000/svg">
        <path
          className="st0"
          d="M21.6,22.5c-2.2,1.6-5.3,2.5-5.6,2.5v0c0.2-0.1,2.8-1.4,4-2.5c0.5-0.5,1-1.3,1.3-2      c-0.1,0.1-0.2,0.3-1.6,1.1c-1.3,0.7-3.5,1.5-3.7,1.5v0c0.2-0.1,1.7-1,2.7-2c0.6-0.6,1-1.2,1.2-1.8c-1.1,0.9-3.7,1.8-3.9,1.9v0      c0.1-0.1,1.1-0.7,1.9-1.6c0.6-0.7,0.6-1.1,0.7-1.4c-1.2,1-2.4,1.1-2.6,1.2v0c0.2-0.1,1.2-0.8,1.2-2.3c-0.9,0.9-1.8,0.6-2.1,0.2      c-0.4-0.3-0.4-1.1-0.4-1.1v-10h-1.3v0.9h-1.7V6.2h-1.3v0.9H8.8V6.2H7.5v11.5c0,0,0,3.3,3,5.7c2.1,1.7,5.5,3.4,5.5,3.4      c0.3-0.1,3.5-1.7,4.8-2.9c1-0.9,1.5-1.5,1.8-2.2C22.3,21.9,22,22.2,21.6,22.5z"
        />
        <g>
          <path
            className="st0"
            d="M19.9,15.2V7.1h-1.2v9.6c0,0,0,0.7-0.2,1.4C20.1,17.2,19.9,15.2,19.9,15.2z"
          />
          <path
            className="st0"
            d="M21.4,16.2v-10h-1.2v11.4c0,0,0,0.8-0.3,1.7C21.4,18.1,21.4,16.2,21.4,16.2z"
          />
          <path
            className="st0"
            d="M22.9,16.8V7.1h-1.2v11.1c0,0-0.1,1.5-0.5,2.2C22.9,19.5,22.9,16.8,22.9,16.8z"
          />
          <path
            className="st0"
            d="M24.4,17.6V6.2h-1.2v13.1c0,0-0.1,1.2-0.6,2.4C24.4,19.9,24.4,17.6,24.4,17.6z"
          />
          <path
            className="st0"
            d="M18.4,14.5V6.2h-1.2V16c0,0,0,0.7,0,1C18.6,15.9,18.4,14.5,18.4,14.5z"
          />
        </g>
      </g>{" "}
    </svg>
  );
};
