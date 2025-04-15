import React, { useEffect } from "react";
import "./Roadmap.css";
const Roadmap = (props) => {
  useEffect(() => {
    props.setSideToggle(false);
  });
  return (
    <div>
      <div className="container roadmap-timeline p-3">
        <div className="row">
          <div className="col-md-12">
            <div className="main-timeline">
              <div className="timeline">
                <div className="timeline-icon">
                  <img
                    src="https://img.icons8.com/color/96/000000/html-5--v1.png"
                    alt="HTML"
                  />
                </div>
                <div className="timeline-content">
                  <h3 className="title">HYPERTEXT MARKUP LANGUAGE </h3>
                  <p className="description">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Cupiditate ducimus officiis quod! Aperiam eveniet nam
                    nostrum odit quasi ullam voluptatum.
                  </p>
                </div>
              </div>
              <div className="timeline">
                <div className="timeline-icon">
                  <img
                    src="https://img.icons8.com/color/96/000000/css3.png"
                    alt="CSS"
                  />
                </div>
                <div className="timeline-content">
                  <h3 className="title">CASADING STYLE SHEET</h3>
                  <p className="description">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Cupiditate ducimus officiis quod! Aperiam eveniet nam
                    nostrum odit quasi ullam voluptatum.
                  </p>
                </div>
              </div>
              <div className="timeline">
                <div className="timeline-icon">
                  <img
                    src="https://img.icons8.com/color/96/000000/javascript--v1.png"
                    alt="JS"
                  />
                </div>
                <div className="timeline-content">
                  <h3 className="title">JAVASCRIPT</h3>
                  <p className="description">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Cupiditate ducimus officiis quod! Aperiam eveniet nam
                    nostrum odit quasi ullam voluptatum.
                  </p>
                </div>
              </div>
              <div className="timeline">
                <div className="timeline-icon">
                  <img
                    src="https://img.icons8.com/ios-filled/96/000000/jquery.png"
                    alt="JQUERY"
                  />
                </div>
                <div className="timeline-content">
                  <h3 className="title">JQUERY</h3>
                  <p className="description">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Cupiditate ducimus officiis quod! Aperiam eveniet nam
                    nostrum odit quasi ullam voluptatum.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
