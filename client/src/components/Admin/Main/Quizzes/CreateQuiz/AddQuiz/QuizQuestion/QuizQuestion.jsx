import React, { useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";

const QuizQuestion = ({ question, index, updateDetails, deleteQuestion }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <>
      <div className="d-flex" key={index}>
        <div
          className="p-2 px-4 quiz-ques mr-auto d-flex m-1 flex-column"
          style={{ width: "90%", wordWrap: "break-word" }}
          onClick={() => setIsActive(!isActive)}
        >
          <span>{`${index + 1}) ${question.statement}`}</span>
          <span>Correct Option : {question.options.correctOption}</span>
        </div>
        <div className="edit-add-quiz p-2 d-flex align-items-end justify-content-end">
          <IconButton onClick={() => deleteQuestion(question)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => updateDetails(question)}>
            <EditIcon />
          </IconButton>
        </div>
      </div>
      {isActive ? (
        <div className="quiz-options d-flex flex-wrap">
          <div className="d-flex col-md-6">
            <div className="option-add-quiz position-absolute mr-2">A.</div>
            <div
              className={`answer-add-quiz text-left m-1 p-2 d-flex align-items-center justify-content-center ${
                question.options.correctOption === "A"
                  ? "crt-option"
                  : "mcq-option"
              }`}
            >
              <span className="px-2 text-justify">{question.options.A}</span>
            </div>
          </div>
          <div className="d-flex col-md-6">
            <div className="option-add-quiz position-absolute mr-2">B.</div>
            <div
              className={`answer-add-quiz text-left m-1 p-2 d-flex align-items-center justify-content-center ${
                question.options.correctOption === "B"
                  ? "crt-option"
                  : "mcq-option"
              }`}
            >
              <span className="px-2 text-justify">{question.options.B}</span>
            </div>
          </div>
          <div className="d-flex col-md-6">
            <div className="option-add-quiz position-absolute mr-2">C.</div>
            <div
              className={`answer-add-quiz text-left m-1 p-2 d-flex align-items-center justify-content-center ${
                question.options.correctOption === "C"
                  ? "crt-option"
                  : "mcq-option"
              }`}
            >
              <span className="px-2 text-justify">{question.options.C}</span>
            </div>
          </div>
          <div className="d-flex col-md-6">
            <div className="option-add-quiz position-absolute mr-2">D.</div>
            <div
              className={`answer-add-quiz text-left m-1 p-2 d-flex align-items-center justify-content-center ${
                question.options.correctOption === "D"
                  ? "crt-option"
                  : "mcq-option"
              }`}
            >
              <span className="px-2 text-justify">{question.options.D}</span>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default QuizQuestion;
