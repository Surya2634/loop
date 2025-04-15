import React from "react";
import "./TeamCard.css";
export const TeamCard = (props) => {
  return (
    <div className="d-flex align-items-center justify-content-center flex-column">
      <img
        src={props.src}
        className="team-circle-img img-fluid"
        height={100}
        width={100}
      />
      <div className="my-3 d-flex flex-column align-items-center justify-content-center">
        <span className="person-name my-1">{props.name}</span>
        <span className="person-designation">{props.designation}</span>
      </div>
    </div>
  );
};
