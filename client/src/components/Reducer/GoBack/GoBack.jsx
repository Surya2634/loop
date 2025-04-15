import React from "react";
const GoBack = (props) => {
  return (
    <div className="back-btn mt-3 ml-4" onClick={props.onClickHandler}>
      <div className="triangle"></div>
      <div className="halfcircle"></div>
    </div>
  );
};

export default GoBack;
