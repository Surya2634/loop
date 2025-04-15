import React, { useEffect, useState } from "react";
import "./Quiz.css";
import { useParams, useHistory } from "react-router-dom";
import TimerImg from "../../../../../../images/timer.webp";
import Male from "../../../../../../images/man.webp";
import Timer from "../../Timer/Timer";
import { useContext } from "react";
import { AuthContext } from "../../../../../../contexts/AuthContext";
import helperService from "../../../../../../services/helperService";
import CustomButton from "../../../../../Reducer/CustomButton/CustomButton";
import GoBack from "../../../../../Reducer/GoBack/GoBack";
import DialogBox from "../../../../../Reducer/DialogBox/DialogBox";
import AllInclusiveRoundedIcon from "@material-ui/icons/AllInclusiveRounded";
import SkipNextRoundedIcon from "@material-ui/icons/SkipNextRounded";
const Quiz = ({ setSideToggle, snackBar }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const location = useParams();
  const history = useHistory();
  const [authState] = useContext(AuthContext);
  const findQuiz = () => {
    let obj = authState?.contest?.quizzes.find(
      (quiz) => quiz._id === location.questionId
    );
    return obj || {};
  };
  const [quiz] = useState(findQuiz());
  let [currentQuestion, setCurrentQuestion] = useState({});
  const [status, setStatus] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizOpen, setQuizOpen] = useState(false);
  const handleOpenQuiz = () => setQuizOpen(true);
  const quizRedirect = () => history.goBack();
  const handleCloseQuiz = () => setQuizOpen(false);
  const parseQuiz = () => JSON.parse(localStorage.getItem(quiz?.name) || "[]");
  let [currentQuestionNumber, setCurrentQuestionNumber] = useState(
    parseQuiz().length
  );
  useEffect(async () => {
    await initComponent();
  }, []);

  let isLast = currentQuestionNumber === quiz?.total_mcqs;
  const initComponent = async () => {
    setSideToggle(true);
    let [mcqs] = await getQuestions();
    setCurrentQuestion(mcqs);
    setCurrentQuestionNumber(
      isLast ? currentQuestionNumber : currentQuestionNumber + 1
    );
  };
  const getQuestions = async () => {
    try {
      const {
        status,
        data: { mcqs },
      } = await helperService.getQuizQuestions(
        {
          id: location.questionId,
          page: isLast ? currentQuestionNumber : currentQuestionNumber + 1,
        },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 200) return mcqs;
    } catch (err) {
      snackBar(err.message, "error");
    }
    return [];
  };
  let answers = parseQuiz();
  const handleNext = async () => {
    if (!status) {
      snackBar("Choose an option!", "info");
      return;
    }
    let obj = {
      id: currentQuestion.id,
      option: selectedAnswer,
    };
    answers.push(obj);
    localStorage.setItem(quiz?.name, JSON.stringify(answers));
    if (!isLast) {
      let [mcqs] = await getQuestions();
      setCurrentQuestion(mcqs);
      setCurrentQuestionNumber(currentQuestionNumber + 1);
    }
    setStatus(false);
    setSelectedAnswer("");
  };
  const answerHandler = (ans) => {
    let option = String.fromCharCode(65 + ans);
    if (isLast) {
      let obj = {
        id: currentQuestion.id,
        option,
      };
      if (currentQuestionNumber - 1 === answers.length) answers.push(obj);
      else answers[answers.length - 1] = obj;
      localStorage.setItem(quiz?.name, JSON.stringify(answers));
    }
    setSelectedAnswer(option);
    setStatus(true);
  };
  const submitQuiz = () => {
    let quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    quizzes.push(quiz?.name);
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
    history.push(`/codekata/${location.id}`);
  };
  return (
    <div
      className="container-fluid p-0 Quiz-question-container"
      style={{ height: "100vh", overflowY: "scroll" }}
    >
      <div className="d-flex">
        <div className="mr-auto mt-3 ml-4">
          <GoBack onClickHandler={handleOpenQuiz} />
          <DialogBox
            open={quizOpen}
            bodyMsg={`Are you sure do you want to exit from ${quiz?.name}`}
            handleClose={handleCloseQuiz}
            handleOpen={quizRedirect}
          />
        </div>
        <div className="mr-auto">
          <p className="text-left mb-0 mt-4 problem-article">{quiz?.name}</p>
        </div>
        <div className="user-info position-relative">
          <div className="d-flex mx-4 pt-3 user-det justify-content-end">
            <div className="gender-info mr-3">
              <img src={Male} alt="male" height="50" width="50" />
            </div>
            <div className="user-profile d-flex flex-column">
              <span className="user-name">{authState?.user?.name}</span>
              <span className="register-no">{authState?.user?.regno}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex p-2" style={{ marginTop: "40px" }}>
        <div className="col-md-8 p-3 pl-5">
          <div className="col p-0">
            <div className="col question-outoff p-0">
              <span className="question-order p-2 bg-dark text-white">
                Question {currentQuestionNumber || 0}/{quiz?.total_mcqs || 0}
              </span>
            </div>
            <div className="hr mt-2">
              <hr className="co pl-0" />
            </div>
            <div className="col question-outoff p-0 mb-3">
              <span className="text-muted">
                Note: Choosen answer boxes are turned into thick Green color
              </span>
            </div>
          </div>
          <div className="d-flex flex-column quizzes pt-4 pb-4">
            <div className="d-flex">
              <div className="numberCircle ml-3">{currentQuestionNumber}</div>
              <div className="question-up ml-3">
                <pre className="span-question">
                  {currentQuestion?.statement}
                </pre>
              </div>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center mt-3">
              <div className="d-flex p-2 w-100 individual-question flex-wrap">
                {Object.values(currentQuestion?.options || []).map(
                  (option, index) => {
                    return (
                      <button
                        style={{ cursor: "pointer" }}
                        key={option}
                        className={`${
                          status &&
                          selectedAnswer === String.fromCharCode(index + 65)
                            ? `correct-option text-left p-2 m-2`
                            : `option-1 text-left p-2 m-2 individual-options`
                        }`}
                        onClick={() => answerHandler(index)}
                      >
                        {option}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
            {!isLast ? (
              <div className="my-2 d-flex justify-content-end mr-4">
                <CustomButton
                  className="btn-hover color-11 d-flex align-items-center py-2 px-3"
                  onClickHandler={handleNext}
                  disabled={isLast}
                >
                  <SkipNextRoundedIcon /> NEXT
                </CustomButton>
              </div>
            ) : null}
          </div>
        </div>
        <div className="col-md-4 py-2">
          <div className="d-flex flex-column my-2 pt-1">
            <div className="d-flex justify-content-end my-3 mx-2">
              <CustomButton
                className="btn-hover color-11 mt-3 d-flex align-items-center py-2 px-3"
                onClickHandler={handleOpen}
              >
                <AllInclusiveRoundedIcon />
                <span className="ml-2">SUBMIT QUIZ</span>
              </CustomButton>
              <DialogBox
                headerMsg={"This is a warning message !"}
                bodyMsg={`Are you sure do you want to exit from the ${quiz?.name}`}
                open={open}
                handleClose={handleClose}
                handleOpen={submitQuiz}
              />
            </div>
            <div className="d-flex flex-column quizzes align-items-center justify-content-center mt-2 mb-2 p-3">
              <img
                src={TimerImg}
                alt="timer"
                height="100"
                width="100"
                className="img-fluid mt-2"
              />
              <span className="text-left dash-title-category">Timer</span>
              <h2 className="timer-text">
                <Timer />
              </h2>
              <p className="font-weight-bolder">remaining</p>
              <div className="d-flex">
                <span className="timer-hand mr-2 ml-3 font-weight-bolder">
                  Days
                </span>
                <span className="timer-hand mr-2 ml-3 font-weight-bolder">
                  Hours
                </span>
                <span className="timer-hand mr-2 ml-3 font-weight-bolder">
                  Minutes
                </span>
                <span className="timer-hand mr-2 ml-3 font-weight-bolder">
                  Seconds
                </span>
              </div>
            </div>
            <div
              className="d-flex mt-2 mb-2 p-3 flex-column align-items-center quizzes"
              style={{ height: "300px", overflowY: "scroll" }}
            >
              <span className="span-question mt-2 mb-3">Question Path</span>
              <div className="d-flex flex-wrap">
                {Array.apply(0, Array(quiz?.total_mcqs || 0)).map((x, i) => {
                  return (
                    <button
                      key={x}
                      className={`${
                        currentQuestionNumber - 1 === i
                          ? `correct ml-3 mb-2 text-center`
                          : `que-path ml-3 mb-3 text-center`
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
