import React from "react";

const CustomButton = ({
  children,
  className,
  id,
  onClickHandler,
  onKeyPressHandler,
  disabled,
}) => {
  return (
    <button
      disabled={disabled}
      className={className}
      id={id}
      onClick={onClickHandler}
      onKeyPress={onKeyPressHandler}
    >
      {children}
    </button>
  );
};

export default CustomButton;
