import React from "react";
import NoMatch from "../../../images/PageNotFound.webp";
const PageNotFound = () => {
  return (
    <div className="container d-flex align-items-center justify-content-center h-100">
      <img src={NoMatch} alt="PageNotFound" className="img-fluid" />
    </div>
  );
};

export default PageNotFound;
