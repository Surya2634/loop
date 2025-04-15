import React, { useContext, useEffect, useState } from "react";
import Male from "../../../../../images/man.webp";
import { useParams, useHistory } from "react-router-dom";
import "./ContestDetails.css";
import QuizImage from "../../../../../images/Quiz.webp";
import ProblemImage from "../../../../../images/problem.webp";
import Timer from "../Timer/Timer";
import { AuthContext, useLoader } from "../../../../../contexts/AuthContext";
import ContestCard from "./ContestCard/ContestCard";
import helperService from "../../../../../services/helperService";
import CustomButton from "../../../../Reducer/CustomButton/CustomButton";
import DialogBox from "../../../../Reducer/DialogBox/DialogBox";
import { parseCode } from "../../../../../services/utils";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import FiberManualRecordRoundedIcon from "@material-ui/icons/FiberManualRecordRounded";
const ContestDetails = ({ setSideToggle, snackBar }) => {
  const [loader, showLoader, hideLoader] = useLoader();
  const { id } = useParams();
  const history = useHistory();
  const [authState] = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [flag, setFlag] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const onBackAlert = () => history.push("/codekata");

  const handleOpen = () => setOpen(true);
  const backAlert = () => setFlag(true);
  const alertOpen = () => {
    const data = dialogBoxMessage();
    if (data.unSubmittedQuizzes.length || data.unSubmittedChallenges.length)
      setOpen1(true);
    else setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const backClose = () => setFlag(false);
  const alertClose = () => {
    setOpen1(false);
    handleOpen();
  };
  const routeQuestion = (_id, name, type) => {
    const checkQuestion = (question) => question === name;
    if (type === "problem") {
      let completedChallenges = JSON.parse(
        localStorage.getItem("challenges") || "[]"
      );
      if (completedChallenges.some(checkQuestion)) {
        snackBar("Challenge already submitted.", "info");
        return;
      }
    } else {
      let completedQuizzes = JSON.parse(
        localStorage.getItem("quizzes") || "[]"
      );
      if (completedQuizzes.some(checkQuestion)) {
        snackBar("Quiz already submitted.", "info");
        return;
      }
    }
    history.push(`/codekata/${id}/${type}/${_id}`);
  };
  const timeoutSubmit = () => {
    setIsTimeUp(true);
    history.push(`/codekata/${id}`);
    sumbitContest();
  };
  const sumbitContest = async () => {
    setOpen(false);
    showLoader();
    let payload = {
      user_id: authState?.user?._id,
      contest_id: authState?.contest?.contest._id,
    };
    let contestQuizzes = authState?.contest?.quizzes || [];
    let contestChallenges = authState?.contest?.challenges || [];
    payload.quizzes = contestQuizzes.map((quiz) => {
      let localQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
      if (!localQuizzes.find((localQuiz) => localQuiz === quiz.name)) return [];
      return JSON.parse(localStorage.getItem(quiz?.name) || "[]");
    });
    payload.challenges = contestChallenges.map((challenge) => {
      let localChallenges = JSON.parse(
        localStorage.getItem("challenges") || "[]"
      );
      if (
        !localChallenges.find(
          (localChallenge) => localChallenge === challenge.name
        )
      )
        return [];
      let localCode = JSON.parse(localStorage.getItem(challenge?.name) || "{}");
      localCode.code = parseCode(localCode.code);
      return localCode;
    });
    try {
      const {
        status,
        data: { message },
      } = await helperService.createSubmission(
        { ...payload },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 201) {
        const user = localStorage.getItem("user");
        localStorage.clear();
        localStorage.setItem("user", user);
        snackBar(message, "success");
        history.push("/codekata");
      }
    } catch (err) {
      snackBar(err.message, "error");
    } finally {
      hideLoader();
    }
  };
  useEffect(() => {
    setSideToggle(true);
  }, []);
  const dialogBoxMessage = () => {
    let completedChallenges = JSON.parse(
      localStorage.getItem("challenges") || "[]"
    );
    let completedQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    const unSubmittedChallenges = authState?.contest?.challenges
      .map((challenge) =>
        !completedChallenges.includes(challenge?.name) ? challenge?.name : null
      )
      .filter(Boolean);
    const unSubmittedQuizzes = authState?.contest?.quizzes
      .map((quiz) =>
        !completedQuizzes.includes(quiz?.name) ? quiz?.name : null
      )
      .filter(Boolean);
    return {
      unSubmittedChallenges,
      unSubmittedQuizzes,
    };
  };
  return (
    <div className="container-fluid dashboard" style={{ overflow: "hidden" }}>
      {loader}
      <div className="d-flex">
        <div className="back-btn mr-auto mt-3 ml-4" onClick={backAlert}>
          <div className="triangle"></div>
          <div className="halfcircle"></div>
        </div>
        <DialogBox
          open={flag}
          bodyMsg={`Are you sure do you want to Go Back`}
          handleClose={backClose}
          handleOpen={onBackAlert}
        />
        <div className="timer mt-4">
          {isTimeUp ? (
            <p>Time's up</p>
          ) : (
            <Timer timeoutSubmit={timeoutSubmit} />
          )}
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
      <div className="d-flex justify-content-between p-0 mt-2">
        <div className="challenge-name ml-4 font-weight-bolder">
          <h1>{authState?.contest?.contest.name}</h1>
        </div>
        <div className="mt-3 p-2 d-flex">
          <h3 className="font-weight-bolder mx-2 my-2 color-highlight">
            <StarRoundedIcon />
            Max Score :{" "}
          </h3>
          <div className="max-score d-flex align-items-center justify-content-center text-center">
            {authState?.contest?.contest?.max_score}
          </div>
        </div>
      </div>
      <div className="d-flex mt-1 mb-1">
        <div className="d-flex mr-auto">
          <p className="text-left ml-4 dash-title-category text-dark">
            ROOM CODE :{" "}
            <span className="room-code p-2 m-2 text-white">{id}</span>
          </p>
        </div>
        <CustomButton
          className="btn-hover color-11 mt-2 d-flex align-items-center py-2 px-3"
          onClickHandler={alertOpen}
        >
          <AllInclusiveIcon />
          <span className="ml-2">SUBMIT CONTEST</span>
        </CustomButton>
        <DialogBox
          open={open}
          headerMsg={"This is a warning message !"}
          bodyMsg={`Are you sure do you want to exit from the ${authState?.contest?.contest.name}`}
          handleClose={handleClose}
          handleOpen={sumbitContest}
        />
        <DialogBox
          open={open1}
          headerMsg={"This is a warning message !"}
          localData={dialogBoxMessage}
          warning={true}
          handleClose={alertClose}
        />
      </div>
      <div className="d-flex">
        <div
          className="col-md-5"
          style={{ height: "80vh", overflowY: "scroll" }}
        >
          <div className="tab-content p-2" id="pills-tabContent">
            <div className="d-flex mt-2">
              <h5 className="quiz-instruct mr-2">
                General Round – Each team - quota of 4 questions
              </h5>
            </div>
            <div className="text-justify mt-2">
              <p>There is no negative marking for wrong answer.</p>
            </div>
            <div className="instruction-div mb-2">
              <span className="quiz-instruct">Instructions :</span>
              <div className="instruction-content d-flex flex-column mt-2">
                <span className="mt-2">
                  <FiberManualRecordRoundedIcon />
                  In this round each team has its own quota of 4 questions and
                  other questions passed to it from the previous team that did
                  not answer.
                </span>
                <span className="mt-2">
                  <FiberManualRecordRoundedIcon /> In this round each team has
                  its own quota of 4 questions and other questions passed to it
                  from the previous team that did not answer.
                </span>

                <span className="mt-2">
                  <FiberManualRecordRoundedIcon /> In this round each team has
                  its own quota of 4 questions and other questions passed to it
                  from the previous team that did not answer.
                </span>
              </div>
            </div>
          </div>
          <div className="tab-content p-2" id="pills-tabContent">
            <div className="d-flex mt-2">
              <h5 className="quiz-instruct mr-2">
                General Round – Each team - quota of 4 questions
              </h5>
            </div>
            <div className="text-justify mt-2">
              <p>There is no negative marking for wrong answer.</p>
            </div>
            <div className="instruction-div mb-2">
              <span className="quiz-instruct">Instructions :</span>
              <div className="instruction-content d-flex flex-column mt-2">
                <span className="mt-2">
                  <FiberManualRecordRoundedIcon /> In this round each team has
                  its own quota of 4 questions and other questions passed to it
                  from the previous team that did not answer.
                </span>
                <span className="mt-2">
                  <FiberManualRecordRoundedIcon /> In this round each team has
                  its own quota of 4 questions and other questions passed to it
                  from the previous team that did not answer.
                </span>
                <span className="mt-2">
                  <FiberManualRecordRoundedIcon /> In this round each team has
                  its own quota of 4 questions and other questions passed to it
                  from the previous team that did not answer.
                </span>
                <span className="mt-2">
                  <FiberManualRecordRoundedIcon /> In this round each team has
                  its own quota of 4 questions and other questions passed to it
                  from the previous team that did not answer.
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-md-7"
          style={{ height: "75vh", overflowY: "scroll" }}
        >
          {authState.contest.quizzes.length === 0 ? (
            <></>
          ) : (
            <div className="quiz-card">
              <p className="text-left ml-5 dash-title-category">QUIZZES</p>
              <div className="d-flex flex-wrap">
                {authState?.contest?.quizzes?.map((quiz) => {
                  return (
                    <ContestCard
                      key={quiz._id}
                      image={QuizImage}
                      question={quiz}
                      routeQuestion={routeQuestion}
                    />
                  );
                })}
              </div>
            </div>
          )}
          {authState.contest.challenges.length === 0 ? (
            <></>
          ) : (
            <div className="challenge-card">
              <p className="text-left ml-5 problem-article">PROBLEMS</p>
              <div className="d-flex flex-wrap">
                {authState?.contest?.challenges?.map((problem) => {
                  return (
                    <ContestCard
                      key={problem._id}
                      image={ProblemImage}
                      question={problem}
                      routeQuestion={routeQuestion}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestDetails;
