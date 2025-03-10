import React from "react";
import PropTypes from "prop-types";

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-400 ${className}`}
      {...props}
    />
  );
});

Input.propTypes = {
  className: PropTypes.string,
};

Input.displayName = "Input";
