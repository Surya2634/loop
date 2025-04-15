import React from "react";

const ContestCard = ({ image, question, routeQuestion }) => {
  return (
    <div
      className="dcard mr-5 mb-5 position-relative d-flex align-items-center justify-content-center ml-5"
      onClick={() =>
        routeQuestion(
          question._id,
          question.name,
          question.type_id ? "problem" : "quiz"
        )
      }
    >
      <div className="trigger position-absolute d-block"></div>
      <div className="trigger position-absolute d-block"></div>
      <div className="trigger position-absolute d-block"></div>
      <div className="trigger position-absolute d-block"></div>
      <div className="trigger position-absolute d-block"></div>
      <div className="trigger position-absolute d-block"></div>
      <div className="trigger position-absolute d-block"></div>
      <div className="trigger position-absolute d-block"></div>
      <div className="trigger position-absolute d-block"></div>

      <div
        className={`card position-relative ${
          question.type_id ? "card-blue" : "card-green"
        }`}
      >
        <img
          src={image}
          className="question-card-image position-absolute img-fluid"
          alt="someImage"
          height="150px"
          width="150px"
        />
        <div className="frame position-absolute bg-white text-dark">
          <div className="d-flex flex-column ml-4 mt-2 pt-0">
            <span
              className={`question-name-span ${
                question.type
                  ? "question-warm-span font-weight-bolder"
                  : "question-blue-span font-weight-bolder"
              }`}
            >
              {question.name}
            </span>
            {question.type_id ? (
              <span>
                Max Score : <b>{question?.max_score}</b>
              </span>
            ) : (
              <span>
                No. of questions : <b>{question?.total_mcqs}</b>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
