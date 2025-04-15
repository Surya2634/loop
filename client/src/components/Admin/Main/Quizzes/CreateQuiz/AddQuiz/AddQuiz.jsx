import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../../../../../contexts/AuthContext";
import helperService from "../../../../../../services/helperService";
import CustomButton from "../../../../../Reducer/CustomButton/CustomButton";
import GoBack from "../../../../../Reducer/GoBack/GoBack";
import InputReducer from "../../../../../Reducer/InputReducer";
import SelectReducer from "../../../../../Reducer/SelectReducer/SelectReducer";
import "./AddQuiz.css";
import QuizQuestion from "./QuizQuestion/QuizQuestion";
import { useHistory } from "react-router-dom";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import UpdateIcon from "@material-ui/icons/Update";
import Pagination from "@material-ui/lab/Pagination";
const AddQuiz = (props) => {
  const history = useHistory();
  const questionTemplate = {
    statement: "",
    options: {
      A: "",
      B: "",
      C: "",
      D: "",
      correctOption: "",
    },
    type_id: "mcq",
  };
  const [question, setQuestion] = useState(questionTemplate);

  const [updateFlag, setUpdateFlag] = useState(false);

  const [authState] = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [limit] = useState(10);
  const { id } = useParams();
  const handlePagination = (e, value) => {
    if (page !== value) {
      setPage(value);
      fetchQuizzes(value);
    }
  };
  const fetchQuizzes = async (page = 1) => {
    try {
      const {
        status,
        data: { mcqs, message, total_mcqs },
      } = await helperService.getQuizQuestions(
        { id, page },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 200) {
        setQuestions(mcqs);
        setTotal(total_mcqs);
        props.snackBar(message, "success");
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    }
  };
  const createQuestion = async () => {
    if (question.statement.length === 0) {
      props.snackBar("Question is Empty", "error");
      return;
    }
    if (question.options.A === "") {
      props.snackBar("A Option is Empty", "error");
      return;
    }
    if (question.options.B === "") {
      props.snackBar("B Option is Empty", "error");
      return;
    }
    if (question.options.C === "") {
      props.snackBar("C Option is Empty", "error");
      return;
    }
    if (question.options.D === "") {
      props.snackBar("D Option is Empty", "error");
      return;
    }
    if (question.options.correctOption === "") {
      props.snackBar("Correct Option is Not selected", "error");
      return;
    }
    try {
      const {
        data: { mcq, message },
        status,
      } = await helperService.createQuizQuestion(
        { quiz_id: id, ...question },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 201) {
        props.snackBar(message, "success");
        setQuestions([...questions, mcq]);
        setQuestion(questionTemplate);
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    }
  };
  const deleteQuestion = async (question) => {
    try {
      const {
        status,
        data: { message },
      } = await helperService.deleteQuestion(
        { ...question, quiz_id: id, type_id: "mcq" },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 202) {
        props.snackBar(message, "success");
        setQuestions(
          questions.filter((ques) => ques.question_id !== question.question_id)
        );
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    }
  };
  const updateQuestion = async () => {
    try {
      const {
        status,
        data: { message },
      } = await helperService.updateQuestion(
        { ...question, quiz_id: id },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 200) {
        props.snackBar(message, "success");
        setQuestions(
          questions.map((ques) => {
            if (ques.question_id === question.question_id) return question;
            return ques;
          })
        );
      }
    } catch (err) {
      props.snackBar(err.data, "error");
    } finally {
      setUpdateFlag(false);
      setQuestion({
        statement: "",
        options: {
          A: "",
          B: "",
          C: "",
          D: "",
          correctOption: "",
        },
        type_id: "mcq",
      });
    }
  };

  const updateDetails = async (question) => {
    setUpdateFlag(true);
    setQuestion({ ...question, type_id: "mcq" });
  };
  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div style={{ height: "100vh", overflowY: "scroll" }}>
      <div className="d-flex m-2 p-2">
        <GoBack className="mt-2" onClickHandler={() => history.goBack()} />
      </div>
      <div className="container mb-3">
        <p className="text-left dash-title-category pb-2">Add Quiz</p>
        <span className="create-con-text mt-1">
          By adding the quiz name you can add Multiple Choice Questions (MCQ's)
        </span>
        <InputReducer
          id="outlined-multiline-static"
          label="Enter Question"
          className="mt-3"
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          value={question.statement}
          onClickHandler={(value) =>
            setQuestion({ ...question, statement: value })
          }
        />
        <div className="d-flex">
          <div className="col-md-6">
            <InputReducer
              id="outlined-multiline-static"
              label="A"
              className="mt-3"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={question.options.A}
              onClickHandler={(value) =>
                setQuestion({
                  ...question,
                  options: { ...question.options, A: value },
                })
              }
            />
          </div>
          <div className="col-md-6">
            <InputReducer
              id="outlined-multiline-static"
              label="B"
              className="mt-3"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={question.options.B}
              onClickHandler={(value) =>
                setQuestion({
                  ...question,
                  options: { ...question.options, B: value },
                })
              }
            />
          </div>
        </div>
        <div className="d-flex">
          <div className="col-md-6">
            <InputReducer
              id="outlined-multiline-static"
              label="C"
              className="mt-3"
              fullWidth
              multiline
              rows={2}
              value={question.options.C}
              onClickHandler={(value) =>
                setQuestion({
                  ...question,
                  options: { ...question.options, C: value },
                })
              }
            />
          </div>
          <div className="col-md-6">
            <InputReducer
              id="outlined-multiline-static"
              label="D"
              className="mt-3"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={question.options.D}
              onClickHandler={(value) =>
                setQuestion({
                  ...question,
                  options: { ...question.options, D: value },
                })
              }
            />
          </div>
        </div>
        <div className="d-flex">
          <div className="col-md-4 mr-auto">
            <SelectReducer
              array={["A", "B", "C", "D"]}
              className="w-100 mt-3"
              name="Correct Option"
              value={question.options.correctOption}
              handleSelect={(e) =>
                setQuestion({
                  ...question,
                  options: {
                    ...question.options,
                    correctOption: e.target.value,
                  },
                })
              }
            />
          </div>
          <CustomButton
            className="btn-hover color-11 mt-4 float-right d-flex align-items-center py-2 px-3"
            onClickHandler={updateFlag ? updateQuestion : createQuestion}
          >
            {updateFlag ? (
              <>
                <span>UPADTE QUIZ</span>
                <UpdateIcon />
              </>
            ) : (
              <>
                <span>ADD QUIZ</span>
                <AddCircleIcon />
              </>
            )}
          </CustomButton>
        </div>
        <div className="quiz-accordian mt-4 d-flex flex-column">
          {questions.map((question, index) => {
            return (
              <QuizQuestion
                key={question._id}
                question={question}
                index={index}
                updateDetails={updateDetails}
                deleteQuestion={deleteQuestion}
              />
            );
          })}
          {console.log(total, limit)}
          {total > limit && (
            <Pagination
              count={Math.floor(total / limit) + (total % limit !== 0 ? 1 : 0)}
              color="primary"
              variant="text"
              className="mt-5 d-flex justify-content-center"
              onChange={(e, value) => handlePagination(e, value)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddQuiz;
